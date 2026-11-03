import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import { productsById, type Side, type Slot } from '../data/products'
import type { SizeKey, SizeSystem } from '../data/sizes'
import type { Currency } from '../lib/format'

// What Undo puts back: the change room exactly as it was before the action.
export type Snapshot = { bag: string[]; current: Record<Slot, string | null> }

// added: "Added to change room · Undo · View"; removed: "Removed <piece> · Undo"; emptied: "Change room emptied · Undo";
// undone: "Undone!"; only-one: "That's your only top/bottom · Add more"; checkout-empty: "Add pieces to check out · Add more"
export type ToastKind = 'added' | 'removed' | 'emptied' | 'undone' | 'only-one' | 'checkout-empty'
export type Toast = { kind: ToastKind; productId?: string; slot?: Slot; undo?: Snapshot; key: number }

// A chip in the filter bar. category: 'top' | 'bottom'; event: an event id; query: a typed word such as "tee".
export type Filter = { kind: 'category' | 'event' | 'query'; value: string }

export type Theme = 'light' | 'dark'
export type Gender = 'women' | 'men' | null

export type State = {
  bag: string[] // product ids in the change room, in the order they were added
  current: Record<Slot, string | null> // what the change room is showing right now
  side: Side // front or back, for "Turn around"
  toast: Toast | null
  filters: Filter[]
  recentSearches: string[]
  sizeSystem: SizeSystem
  sizes: Record<Slot, SizeKey>
  gender: Gender
  currency: Currency
  theme: Theme
  notify: string[] // `${productId}:${size}` the shopper wants to hear about
  welcomed: boolean // seen the Welcome screen once
}

export type Action =
  | { type: 'add'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'clearBag' }
  | { type: 'restore'; snapshot: Snapshot }
  | { type: 'rotate' }
  | { type: 'show'; slot: Slot; id: string }
  | { type: 'showOutfit'; top: string; bottom: string }
  | { type: 'toast'; toast: Omit<Toast, 'key'> | null }
  | { type: 'setFilters'; filters: Filter[] }
  | { type: 'addFilter'; filter: Filter }
  | { type: 'removeFilter'; filter: Filter }
  | { type: 'addRecent'; query: string }
  | { type: 'setSizeSystem'; system: SizeSystem }
  | { type: 'setSize'; slot: Slot; size: SizeKey }
  | { type: 'setGender'; gender: Gender }
  | { type: 'setCurrency'; currency: Currency }
  | { type: 'setTheme'; theme: Theme }
  | { type: 'toggleNotify'; key: string }
  | { type: 'setWelcomed' }

const STORAGE_KEY = 'blend:v2'

// First visit: the recent searches the Figma search sheet shows, sizes on M, EU sizes, light.
const initialState: State = {
  bag: [],
  current: { top: null, bottom: null },
  side: 'front',
  toast: null,
  filters: [],
  recentSearches: ['tee', 'bomber', 'shorts', 'beach', 'wedding'],
  sizeSystem: 'EU',
  sizes: { top: 'M', bottom: 'M' },
  gender: null,
  currency: 'EUR',
  theme: 'light',
  notify: [],
  welcomed: false,
}

// Saved between visits (the rest resets on reload).
type Saved = Pick<State, 'bag' | 'current' | 'recentSearches' | 'sizeSystem' | 'sizes' | 'gender' | 'currency' | 'theme' | 'notify' | 'welcomed'>

function load(): State {
  try {
    const saved: Partial<Saved> | null = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (!saved) return initialState
    const bag = (saved.bag ?? []).filter((id) => productsById[id])
    return { ...initialState, ...saved, bag, current: pickCurrent(bag, saved.current ?? {}), toast: null, filters: [] }
  } catch {
    return initialState
  }
}

// Keep `current` pointing at something that is actually in the bag.
function pickCurrent(bag: string[], wanted: Partial<Record<Slot, string | null>>): Record<Slot, string | null> {
  const choose = (slot: Slot) => {
    const inSlot = bag.filter((id) => productsById[id].slot === slot)
    const w = wanted[slot]
    return w && inSlot.includes(w) ? w : (inSlot[0] ?? null)
  }
  return { top: choose('top'), bottom: choose('bottom') }
}

const sameFilter = (a: Filter, b: Filter) => a.kind === b.kind && a.value === b.value

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      if (state.bag.includes(action.id)) return state
      const bag = [...state.bag, action.id]
      // Show what was just added, so the change room reflects the latest pick.
      return { ...state, bag, current: { ...state.current, [productsById[action.id].slot]: action.id } }
    }
    case 'remove': {
      const slot = productsById[action.id].slot
      const sameSlot = state.bag.filter((id) => productsById[id].slot === slot)
      const bag = state.bag.filter((id) => id !== action.id)
      let next = state.current[slot]
      if (next === action.id) {
        // Move to the neighbour, like a carousel closing the gap.
        const i = sameSlot.indexOf(action.id)
        next = sameSlot[i + 1] ?? sameSlot[i - 1] ?? null
      }
      return { ...state, bag, current: { ...state.current, [slot]: next } }
    }
    case 'clearBag':
      return { ...state, bag: [], current: { top: null, bottom: null } }
    case 'restore': {
      const bag = action.snapshot.bag.filter((id) => productsById[id])
      return { ...state, bag, current: pickCurrent(bag, action.snapshot.current) }
    }
    case 'rotate':
      return { ...state, side: state.side === 'front' ? 'back' : 'front' }
    case 'show':
      return state.current[action.slot] === action.id ? state : { ...state, current: { ...state.current, [action.slot]: action.id } }
    case 'showOutfit':
      return { ...state, current: { top: action.top, bottom: action.bottom } }
    case 'toast':
      return { ...state, toast: action.toast && { ...action.toast, key: Date.now() } }
    case 'setFilters':
      return { ...state, filters: action.filters }
    case 'addFilter':
      return state.filters.some((f) => sameFilter(f, action.filter)) ? state : { ...state, filters: [...state.filters, action.filter] }
    case 'removeFilter':
      return { ...state, filters: state.filters.filter((f) => !sameFilter(f, action.filter)) }
    case 'addRecent': {
      const q = action.query.trim().toLowerCase()
      if (!q) return state
      return { ...state, recentSearches: [q, ...state.recentSearches.filter((r) => r !== q)].slice(0, 8) }
    }
    case 'setSizeSystem':
      return { ...state, sizeSystem: action.system }
    case 'setSize':
      return { ...state, sizes: { ...state.sizes, [action.slot]: action.size } }
    case 'setGender':
      return { ...state, gender: action.gender }
    case 'setCurrency':
      return { ...state, currency: action.currency }
    case 'setTheme':
      return { ...state, theme: action.theme }
    case 'toggleNotify':
      return { ...state, notify: state.notify.includes(action.key) ? state.notify.filter((k) => k !== action.key) : [...state.notify, action.key] }
    case 'setWelcomed':
      return state.welcomed ? state : { ...state, welcomed: true }
  }
}

const StoreContext = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    const saved: Saved = {
      bag: state.bag,
      current: state.current,
      recentSearches: state.recentSearches,
      sizeSystem: state.sizeSystem,
      sizes: state.sizes,
      gender: state.gender,
      currency: state.currency,
      theme: state.theme,
      notify: state.notify,
      welcomed: state.welcomed,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    } catch {
      // Storage can be unavailable (private mode); the app still works for this visit.
    }
  }, [state.bag, state.current, state.recentSearches, state.sizeSystem, state.sizes, state.gender, state.currency, state.theme, state.notify, state.welcomed])

  // Light or dark comes from Options › Appearance; the Figma tokens switch on data-theme.
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', state.theme === 'dark' ? '#141211' : '#f4efee')
  }, [state.theme])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

// Counts for the split badge and the Checkout button.
export function useBag() {
  const { state } = useStore()
  return useMemo(() => {
    const items = state.bag.map((id) => productsById[id])
    const tops = items.filter((p) => p.slot === 'top').length
    return { items, tops, bottoms: items.length - tops, total: items.reduce((sum, p) => sum + p.price, 0) }
  }, [state.bag])
}

// The shared add/remove actions, so every + button, ✕ and Undo behaves the same and shows the same toast.
export function useBagActions() {
  const { state, dispatch } = useStore()
  return useMemo(() => {
    const snapshot = (): Snapshot => ({ bag: state.bag, current: state.current })
    return {
      add(id: string) {
        if (state.bag.includes(id)) return
        const undo = snapshot()
        dispatch({ type: 'add', id })
        dispatch({ type: 'toast', toast: { kind: 'added', productId: id, undo } })
      },
      remove(id: string) {
        if (!state.bag.includes(id)) return
        const undo = snapshot()
        dispatch({ type: 'remove', id })
        dispatch({ type: 'toast', toast: { kind: 'removed', productId: id, undo } })
      },
      toggle(id: string) {
        if (state.bag.includes(id)) this.remove(id)
        else this.add(id)
      },
      empty() {
        if (!state.bag.length) return
        const undo = snapshot()
        dispatch({ type: 'clearBag' })
        dispatch({ type: 'toast', toast: { kind: 'emptied', undo } })
      },
      undo(snapshot: Snapshot) {
        dispatch({ type: 'restore', snapshot })
        dispatch({ type: 'toast', toast: { kind: 'undone' } })
      },
    }
  }, [state.bag, state.current, dispatch])
}

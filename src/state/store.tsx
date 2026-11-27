import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import { productsById, type Side, type Slot } from '../data/products'
import { filtersFromAddress } from '../features/search/filterParams'
import type { SizeKey, SizeSystem } from '../data/sizes'
import type { Currency } from '../lib/format'
import type { Build } from '../services/tryOn'

// What Undo puts back: the change room exactly as it was before the action.
export type Snapshot = { bag: string[]; current: Record<Slot, string | null> }

// added: "Added to change room · Undo · View"; removed: "Removed <piece> · Undo"; emptied: "Change room emptied · Undo";
// undone: "Undone!"; only-one: "That's your only top/bottom · Add more"; checkout-empty: "Add pieces to check out · Add more";
// searches-cleared: "Recent searches cleared" (Menu)
export type ToastKind = 'added' | 'removed' | 'emptied' | 'undone' | 'only-one' | 'checkout-empty' | 'searches-cleared'
export type Toast = { kind: ToastKind; productId?: string; slot?: Slot; undo?: Snapshot; key: number }

// A chip in the filter bar. category: 'top' | 'bottom'; event: an event id; query: a typed word such as "tee".
export type Filter = { kind: 'category' | 'event' | 'query'; value: string }

// auto: the phone's own light or dark (Menu › Appearance, the user 27 Nov: "add auto appearance too").
export type Theme = 'light' | 'dark' | 'auto'
export type Gender = 'women' | 'men' | null
// What Menu › Notifications can tell the shopper about (switches; the inbox holds past ones).
export type NoteKind = 'orders' | 'restock' | 'newIn' | 'offers'

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
  build: Build // body type: set in Account, and Try-On's "A model like you" starts from it
  name: string // Account; on this device only, as there are no accounts yet
  photo: string | null // Account's profile photo, a small JPEG data URL; saved under its own key (PHOTO_KEY)
  currency: Currency
  theme: Theme
  reduceMotion: boolean // Options › Reduce motion: no animations at all (main.tsx)
  notify: string[] // `${productId}:${size}` the shopper wants to hear about
  notes: Record<NoteKind, boolean> // Menu › Notifications switches
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
  | { type: 'clearRecent' }
  | { type: 'setSizeSystem'; system: SizeSystem }
  | { type: 'setSize'; slot: Slot; size: SizeKey }
  | { type: 'setGender'; gender: Gender }
  | { type: 'setBuild'; build: Build }
  | { type: 'setName'; name: string }
  | { type: 'setPhoto'; photo: string | null }
  | { type: 'setNote'; kind: NoteKind; on: boolean }
  | { type: 'setCurrency'; currency: Currency }
  | { type: 'setTheme'; theme: Theme }
  | { type: 'setReduceMotion'; on: boolean }
  | { type: 'toggleNotify'; key: string }
  | { type: 'setWelcomed' }

const STORAGE_KEY = 'blend:v2'
// The profile photo is kept apart: tens of KB that needn't be rewritten with every change to the change room.
const PHOTO_KEY = 'blend:photo'
// Where the name lived before it moved into the store (27 Nov); read once as the starting value.
const OLD_NAME_KEY = 'blend:name'

function readKey(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

// First visit: the recent searches the Figma search sheet shows, sizes on M, EU sizes, light, motion on (the device's
// own reduce-motion setting still applies). Notifications: everything but offers.
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
  build: 'even',
  name: '',
  photo: null,
  currency: 'EUR',
  theme: 'light',
  reduceMotion: false,
  notify: [],
  notes: { orders: true, restock: true, newIn: true, offers: false },
  welcomed: false,
}

// Saved between visits (the rest resets on reload). The filters come from the address instead (filterParams.ts), the
// photo from its own key.
type Saved = Pick<
  State,
  'bag' | 'current' | 'recentSearches' | 'sizeSystem' | 'sizes' | 'gender' | 'build' | 'name' | 'currency' | 'theme' | 'reduceMotion' | 'notify' | 'notes' | 'welcomed'
>

function load(): State {
  const filters = filtersFromAddress()
  const photo = readKey(PHOTO_KEY)
  const name = readKey(OLD_NAME_KEY) ?? ''
  try {
    const saved: Partial<Saved> | null = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (!saved) return { ...initialState, name, photo, filters }
    const bag = (saved.bag ?? []).filter((id) => productsById[id])
    const notes = { ...initialState.notes, ...saved.notes }
    return { ...initialState, name, ...saved, notes, photo, bag, current: pickCurrent(bag, saved.current ?? {}), toast: null, filters }
  } catch {
    return { ...initialState, name, photo, filters }
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
      // The newest piece waits in the small spot on the right, with the one added before it large (the user, 4 Nov:
      // people swipe left to the small piece first, see the large one leave to the left, then swipe back, and so learn
      // the carousel). A slot's first piece is shown large. Try it on still dresses the large pieces.
      const slot = productsById[action.id].slot
      const inSlot = bag.filter((id) => productsById[id].slot === slot)
      const show = inSlot.length > 1 ? inSlot[inSlot.length - 2] : action.id
      return { ...state, bag, current: { ...state.current, [slot]: show } }
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
    case 'clearRecent':
      return { ...state, recentSearches: [] }
    case 'setSizeSystem':
      return { ...state, sizeSystem: action.system }
    case 'setSize':
      return { ...state, sizes: { ...state.sizes, [action.slot]: action.size } }
    case 'setGender':
      return { ...state, gender: action.gender }
    case 'setBuild':
      return { ...state, build: action.build }
    case 'setName':
      return { ...state, name: action.name }
    case 'setPhoto':
      return { ...state, photo: action.photo }
    case 'setNote':
      return { ...state, notes: { ...state.notes, [action.kind]: action.on } }
    case 'setCurrency':
      return { ...state, currency: action.currency }
    case 'setTheme':
      return { ...state, theme: action.theme }
    case 'setReduceMotion':
      return { ...state, reduceMotion: action.on }
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
      build: state.build,
      name: state.name,
      currency: state.currency,
      theme: state.theme,
      reduceMotion: state.reduceMotion,
      notify: state.notify,
      notes: state.notes,
      welcomed: state.welcomed,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
      localStorage.removeItem(OLD_NAME_KEY)
    } catch {
      // Storage can be unavailable (private mode); the app still works for this visit.
    }
  }, [
    state.bag,
    state.current,
    state.recentSearches,
    state.sizeSystem,
    state.sizes,
    state.gender,
    state.build,
    state.name,
    state.currency,
    state.theme,
    state.reduceMotion,
    state.notify,
    state.notes,
    state.welcomed,
  ])

  useEffect(() => {
    try {
      if (state.photo) localStorage.setItem(PHOTO_KEY, state.photo)
      else localStorage.removeItem(PHOTO_KEY)
    } catch {
      // Too big for what's left of storage, or no storage: the photo lasts for this visit.
    }
  }, [state.photo])

  // Light, dark or Auto from Menu › Appearance. The Figma tokens switch on data-theme: "auto" matches neither "light"
  // nor "dark", so the tokens' own prefers-color-scheme rule decides (figma-tokens.css, base.css). index.html sets it
  // before the first paint; this keeps it and the browser bar's colour in step, also when the phone itself switches.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = state.theme === 'dark' || (state.theme === 'auto' && media.matches)
      document.documentElement.dataset.theme = state.theme
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#141211' : '#f4efee')
    }
    apply()
    if (state.theme !== 'auto') return
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
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

import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import { productsById, type Product, type Side, type Slot } from '../data/products'

export type Hand = 'right' | 'left'
export type Tab = 'events' | 'changeRoom'
export type SheetName = 'closet' | 'settings' | 'tryOn' | 'checkout' | null
// What Undo puts back: the change room exactly as it was before the action.
export type Snapshot = { bag: string[]; current: Record<Slot, string | null> }
export type Toast = { message: string; undo?: Snapshot; view?: boolean; addMore?: boolean; key: number }

type State = {
  bag: string[] // product ids in the change room, in the order they were added
  side: Side
  hand: Hand
  current: Record<Slot, string | null> // what the change room is showing right now
  tab: Tab
  sheet: SheetName
  toast: Toast | null
}

type Action =
  | { type: 'add'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'clearBag' }
  | { type: 'restore'; snapshot: Snapshot }
  | { type: 'rotate' }
  | { type: 'setHand'; hand: Hand }
  | { type: 'show'; slot: Slot; id: string }
  | { type: 'showOutfit'; top: string; bottom: string }
  | { type: 'setTab'; tab: Tab }
  | { type: 'openSheet'; sheet: SheetName }
  | { type: 'toast'; toast: Omit<Toast, 'key'> | null }

const STORAGE_KEY = 'blend:v1'

const initialState: State = {
  bag: [],
  side: 'front',
  hand: 'right',
  current: { top: null, bottom: null },
  tab: 'events',
  sheet: null,
  toast: null,
}

function load(): State {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (!saved) return initialState
    const bag = (saved.bag ?? []).filter((id: string) => productsById[id])
    return { ...initialState, bag, hand: saved.hand === 'left' ? 'left' : 'right', current: pickCurrent(bag, saved.current ?? {}) }
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

function reducer(state: State, action: Action): State {
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
    case 'setHand':
      return { ...state, hand: action.hand }
    case 'show':
      return state.current[action.slot] === action.id ? state : { ...state, current: { ...state.current, [action.slot]: action.id } }
    case 'showOutfit':
      return { ...state, current: { top: action.top, bottom: action.bottom } }
    case 'setTab':
      return { ...state, tab: action.tab }
    case 'openSheet':
      return { ...state, sheet: action.sheet }
    case 'toast':
      return { ...state, toast: action.toast && { ...action.toast, key: Date.now() } }
  }
}

const StoreContext = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ bag: state.bag, hand: state.hand, current: state.current }))
    } catch {
      // Storage can be unavailable (private mode); the app still works for this visit.
    }
  }, [state.bag, state.hand, state.current])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}

export function useBag() {
  const { state } = useStore()
  return useMemo(() => {
    const items = state.bag.map((id) => productsById[id])
    const tops = items.filter((p) => p.slot === 'top')
    const bottoms = items.filter((p) => p.slot === 'bottom')
    const total = items.reduce((sum, p) => sum + p.price, 0)
    return { items, tops, bottoms, total }
  }, [state.bag])
}

// The change room as it is now, for Undo.
export function useSnapshot(): Snapshot {
  const { state } = useStore()
  return { bag: state.bag, current: state.current }
}

export type { Product }

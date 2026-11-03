import { useMemo } from 'react'
import { events, type EventInfo } from '../../data/events'
import { productsById } from '../../data/products'
import { plural } from '../../lib/format'
import { useStore, type Filter } from '../../state/store'

export type FilteredEvent = { event: EventInfo; productIds: string[] }
export type FilterResult = { events: FilteredEvent[]; pieces: number; isFiltered: boolean }

const words = (s: string) => s.toLowerCase()

// Does a typed word match a piece? Name, brand and material, plus "top"/"bottom" style words.
function queryMatchesPiece(q: string, id: string) {
  const p = productsById[id]
  return words(`${p.brand} ${p.name} ${p.material} ${p.slot}s`).includes(q)
}

function queryMatchesEvent(q: string, e: EventInfo) {
  return words(e.title).includes(q)
}

// Filters of the same kind widen the result (Casual OR Outdoors); different kinds narrow it (Bottoms AND cargo).
// A typed word that matches an event's name returns that whole event ("beach" → Beach day, 6 pieces).
export function applyFilters(filters: Filter[]): FilterResult {
  if (filters.length === 0) return { events: events.map((event) => ({ event, productIds: event.productIds })), pieces: 0, isFiltered: false }

  const byKind = (kind: Filter['kind']) => filters.filter((f) => f.kind === kind).map((f) => words(f.value))
  const categories = byKind('category')
  const eventIds = byKind('event')
  const queries = byKind('query')

  const result: FilteredEvent[] = []
  for (const event of events) {
    if (eventIds.length && !eventIds.includes(event.id)) continue
    const productIds = event.productIds.filter((id) => {
      if (categories.length && !categories.includes(productsById[id].slot)) return false
      if (queries.length && !queries.some((q) => queryMatchesEvent(q, event) || queryMatchesPiece(q, id))) return false
      return true
    })
    if (productIds.length) result.push({ event, productIds })
  }
  const pieces = new Set(result.flatMap((r) => r.productIds)).size // a piece in two events counts once
  return { events: result, pieces, isFiltered: true }
}

// The Events list under the shopper's current filters.
export function useFilteredEvents(): FilterResult {
  const { state } = useStore()
  return useMemo(() => applyFilters(state.filters), [state.filters])
}

// The chip text: "Tops", "Bottoms", an event's title, or the word as typed.
export function filterLabel(f: Filter) {
  if (f.kind === 'category') return f.value === 'top' ? 'Tops' : 'Bottoms'
  if (f.kind === 'event') return events.find((e) => e.id === f.value)?.title ?? f.value
  return f.value
}

// The filter in `filters` that matches `f` (same kind and value; typed words ignore case), if it's on.
export function findFilter(filters: Filter[], f: Filter) {
  return filters.find((x) => x.kind === f.kind && words(x.value) === words(f.value))
}

// The matching pieces, once each, in Events order.
export function piecesOf(r: FilterResult) {
  return [...new Set(r.events.flatMap((e) => e.productIds))]
}

// "5 events · 4 pieces" on screen; pass ", " for the spoken form ("5 events, 4 pieces"). Never "results".
export function countLabel(r: FilterResult, separator = ' · ') {
  return `${plural(r.events.length, 'event')}${separator}${plural(r.pieces, 'piece')}`
}

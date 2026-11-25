import type { Filter } from '../../state/store'

// The search filters in the Events address (/events?category=bottom&q=cargo), in the order the chips were added, so a
// filtered page survives a reload and can be shared. The store reads them when the app opens (store.tsx) and
// useFiltersInUrl writes them back whenever the chips change.
const KEYS: Record<Filter['kind'], string> = { category: 'category', event: 'event', query: 'q' }
const KINDS = Object.fromEntries(Object.entries(KEYS).map(([kind, key]) => [key, kind])) as Record<string, Filter['kind']>

export function filtersToSearch(filters: Filter[]) {
  const params = new URLSearchParams()
  for (const f of filters) params.append(KEYS[f.kind], f.value)
  const s = params.toString()
  return s ? `?${s}` : ''
}

export function searchToFilters(search: string): Filter[] {
  const out: Filter[] = []
  for (const [key, value] of new URLSearchParams(search)) {
    const kind = KINDS[key]
    const v = value.trim()
    if (kind && v && !out.some((f) => f.kind === kind && f.value === v)) out.push({ kind, value: v })
  }
  return out
}

// The chips of the address the app opened on, if it opened on Events.
export function filtersFromAddress(): Filter[] {
  if (typeof window === 'undefined') return []
  const { pathname, search } = window.location
  return pathname.replace(/\/$/, '') === `${import.meta.env.BASE_URL}events` ? searchToFilters(search) : []
}

import { useLayoutEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { EventBanner } from '../components/EventBanner'
import { ProductCard } from '../components/ProductCard'
import { usePane } from '../components/TabScreens'
import { events as allEvents } from '../data/events'
import { productsById } from '../data/products'
import { useFilteredEvents, type FilteredEvent } from '../features/search/filtering'
import { useStore, type Filter } from '../state/store'
import './Events.css'

// The filters the list was last shown with. Module scope, so a change made away from Events (EVENTS clears them,
// "+ Add a top" sets Tops) still counts when it comes back.
let shownFilters = ''

// Figma Events (320:7350): one list, grouped by event. Each banner sticks while its section scrolls; the first one
// runs under the fixed top bar (MainLayout's). Filters from search narrow it in place; the search sheet opens over it
// (<Outlet />). Its place in the list is kept by TabScreens, across tab switches and Back from a piece.
export function Events() {
  const { state } = useStore()
  const { events, isFiltered } = useFilteredEvents()
  const pane = usePane()
  // Sliding out after Back from search, it leaves the sheet behind.
  const active = useLocation().pathname.startsWith('/events')
  const noResults = isFiltered && events.length === 0
  const sections: FilteredEvent[] = noResults ? allEvents.map((event) => ({ event, productIds: event.productIds })) : events

  // New filters show their pieces from the top (before the first frame, also while Events is still sliding in).
  const filters = state.filters.map((f) => `${f.kind}:${f.value}`).join('|')
  useLayoutEffect(() => {
    if (!active || filters === shownFilters) return
    shownFilters = filters
    pane.toTop()
  }, [active, filters, pane])

  return (
    <main className={`screen events${state.filters.length > 0 ? ' events--filtered' : ''}`}>
      <h1 className="visually-hidden">Events</h1>

      {noResults && <NoResults filters={state.filters} />}

      {sections.map(({ event, productIds }, i) => (
        <section key={event.id} className="event-section" aria-labelledby={`event-${event.id}`}>
          <EventBanner event={event} headingId={`event-${event.id}`} eager={i === 0} />
          <div className="event-section__grid">
            {productIds.map((id) => (
              <ProductCard key={id} product={productsById[id]} />
            ))}
          </div>
        </section>
      ))}

      {active && <Outlet />}
    </main>
  )
}

// Nothing matches: say so, point at the events below, and open search again on a tap.
function NoResults({ filters }: { filters: Filter[] }) {
  const word = filters.length === 1 && filters[0].kind === 'query' ? filters[0].value : null
  return (
    <div className="events__message-wrap">
      <Link to="/events/search" className="events__message">
        <span className="events__message-title">{word ? `Nothing for “${word}” yet` : 'Nothing for these filters yet'}</span>
        <span className="events__message-hint">
          {word ? 'Try another word' : 'Remove a filter'}, or start from one of the <strong>events</strong> below.
        </span>
      </Link>
    </div>
  )
}

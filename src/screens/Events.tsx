import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link, Outlet, useNavigationType } from 'react-router'
import { EventBanner } from '../components/EventBanner'
import { ProductCard } from '../components/ProductCard'
import { events as allEvents } from '../data/events'
import { productsById } from '../data/products'
import { useFilteredEvents, type FilteredEvent } from '../features/search/filtering'
import { useStore, type Filter } from '../state/store'
import { TopBar } from '../ui/primitives'
import './Events.css'

// Where the shopper was in the list, so Back from a piece returns to the same spot.
let savedScrollY = 0

// Figma Events (320:7350): one list, grouped by event. Each banner sticks while its section scrolls; the first one
// runs under the fixed top bar. Filters from search narrow it in place; the search sheet opens over it (<Outlet />).
export function Events() {
  const { state } = useStore()
  const { events, isFiltered } = useFilteredEvents()
  const navigationType = useNavigationType()
  const noResults = isFiltered && events.length === 0
  const sections: FilteredEvent[] = noResults ? allEvents.map((event) => ({ event, productIds: event.productIds })) : events

  useLayoutEffect(() => {
    if (navigationType === 'POP') window.scrollTo(0, savedScrollY)
    const onScroll = () => {
      savedScrollY = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
    // Only when Events opens: later filter changes are handled below.
  }, [])

  // New filters show their pieces from the top.
  const shownFilters = useRef(state.filters)
  useEffect(() => {
    if (shownFilters.current === state.filters) return
    shownFilters.current = state.filters
    window.scrollTo(0, 0)
  }, [state.filters])

  return (
    <main className={`screen events${state.filters.length > 0 ? ' events--filtered' : ''}`}>
      <h1 className="visually-hidden">Events</h1>
      {/* Over a photo the logo turns white on a soft shade; a message at the top keeps the plain bar. */}
      <TopBar variant={noResults ? 'plain' : 'overlay'} />

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

      <Outlet />
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

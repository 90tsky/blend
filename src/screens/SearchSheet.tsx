import { motion, type Transition } from 'motion/react'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router'
import { events } from '../data/events'
import { productsById } from '../data/products'
import { applyFilters, countLabel, findFilter, piecesOf } from '../features/search/filtering'
import { Suggestion } from '../features/search/Suggestion'
import { useVisualViewport } from '../features/search/useVisualViewport'
import { useStore, type Filter } from '../state/store'
import { Icon } from '../ui/Icon'
import { Cta } from '../ui/primitives'
import './SearchSheet.css'

// "Popular pieces" in the Figma sheet: Cocoa Oversized Hoodie, Cropped Leather Jacket, Indigo Denim Cargo Trousers.
// They open the piece; they aren't filters.
const POPULAR = ['g08', 'g15', 'g03']
const CATEGORIES: { filter: Filter; label: string }[] = [
  { filter: { kind: 'category', value: 'top' }, label: 'Tops' },
  { filter: { kind: 'category', value: 'bottom' }, label: 'Bottoms' },
]
const RISE: Transition = { duration: 0.3, ease: 'easeOut' }
const DROP: Transition = { duration: 0.25, ease: 'easeIn' }

// Search is a filter on Events (route /events/search, Figma Events · search open 1807:14046): a sheet over the Events
// list with suggestions, and the typing bar on top of the phone's own keyboard. Pills switch filters on and off in the
// sheet; Search puts them on Events, which stayed mounted underneath, so the shopper's place is kept.
export function SearchSheet() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const view = useVisualViewport()
  const inputRef = useRef<HTMLInputElement>(null)
  const [text, setText] = useState('')
  const [leaving, setLeaving] = useState<(() => void) | null>(null)
  const typedText = text.trim()
  const query = typedText.toLowerCase()

  // The filters picked in the sheet wait here until Search (the user, 28 Nov: picking a tag closed the sheet, "what if
  // i want to click more tags + there should be a search button"). Closing without Search leaves Events as it was.
  const [draft, setDraft] = useState<Filter[]>(state.filters)
  const changed = draft !== state.filters

  // What pressing Search would put on: the picked filters and the typed word, and what that shows.
  const picked = useMemo<Filter[]>(() => {
    const word: Filter = { kind: 'query', value: query }
    return query && !findFilter(draft, word) ? [...draft, word] : draft
  }, [query, draft])
  const typed = useMemo(() => (query ? applyFilters(picked) : null), [query, picked])
  const result = useMemo(() => typed ?? applyFilters(draft), [typed, draft])

  // The count is read out once typing or picking pauses ("5 events, 4 pieces").
  const [spokenCount, setSpokenCount] = useState('')
  useEffect(() => {
    const t = window.setTimeout(() => setSpokenCount(query || changed ? countLabel(result, ', ') : ''), 700)
    return () => window.clearTimeout(t)
  }, [result, query, changed])

  // Opened with the change room's search button (BottomBar), not from Events.
  const fromChangeRoom = (useLocation().state as { from?: string } | null)?.from === 'change-room'
  // Closed without picking: back to the screen that opened the sheet, or to Events on a fresh load.
  const back = () => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate('/events', { replace: true }))
  // Picked a filter: the results are on Events, so that's where it lands. Opened from the change room, Back went there
  // instead and the results only flashed past (the user, 27 Nov, with a video: adding or removing a category "moves to
  // the change room"), so the sheet's own entry becomes Events; Back from Events still returns to the change room.
  const toEvents = () => (fromChangeRoom ? navigate('/events', { replace: true }) : back())
  // The sheet slides down and the dim fades, then the route changes.
  const close = (then: () => void = back) => {
    inputRef.current?.blur()
    setLeaving(() => then)
  }

  // While open: Events behind is inert and doesn't scroll, Esc closes, and focus goes to the field (then back after).
  useEffect(() => {
    const root = document.getElementById('root')
    const html = document.documentElement
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = html.style.overflow
    html.style.overflow = 'hidden'
    root?.setAttribute('inert', '')
    inputRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      html.style.overflow = overflow
      root?.removeAttribute('inert')
      window.removeEventListener('keydown', onKey)
      opener?.focus({ preventScroll: true })
    }
  }, [])

  // Categories, events and recent words switch their filter on or off; the sheet stays open for more.
  const toggle = (f: Filter) =>
    setDraft((d) => {
      const on = findFilter(d, f)
      return on ? d.filter((x) => x !== on) : [...d, f]
    })

  // Search (the button, Enter, the keyboard's Search key or the "Search “tee”" row): the picked filters and the typed
  // word go on Events.
  const search = (e?: FormEvent) => {
    e?.preventDefault()
    dispatch({ type: 'setFilters', filters: picked })
    if (query) dispatch({ type: 'addRecent', query })
    close(toEvents)
  }

  // Pieces open their Product page in place of the sheet, so Back from there lands on Events, with the picked filters.
  const openPiece = (id: string) => {
    if (changed) dispatch({ type: 'setFilters', filters: draft })
    if (query) dispatch({ type: 'addRecent', query })
    navigate(`/product/${id}`, { replace: true })
  }

  const filterPill = (f: Filter, label: string) => {
    const on = Boolean(findFilter(draft, f))
    return <Suggestion key={`${f.kind}:${f.value}`} label={label} selected={on} spoken={`${label}, ${on ? 'remove' : 'add'} filter`} onPick={() => toggle(f)} />
  }
  const piecePill = (id: string) => <Suggestion key={id} label={productsById[id].name} onPick={() => openPiece(id)} />

  const style = {
    '--keyboard': `${view.keyboard}px`,
    '--view-height': `${view.height}px`,
    '--safe-bottom': view.keyboard ? '0px' : 'env(safe-area-inset-bottom)',
  } as CSSProperties

  return createPortal(
    <div className="search" role="dialog" aria-modal="true" aria-label="Search" style={style}>
      <motion.button
        type="button"
        className="search__dim"
        aria-label="Close search"
        initial={{ opacity: 0 }}
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        onClick={() => close()}
      />
      <motion.div
        className="search__sheet"
        initial={{ y: '100%' }}
        animate={{ y: leaving ? '100%' : 0 }}
        transition={leaving ? DROP : RISE}
        onAnimationComplete={() => leaving?.()}
      >
        <div className="search__suggestions">
          {typed ? (
            <>
              <button type="button" className="search__go" aria-label={`Search “${typedText}”, ${countLabel(typed, ', ')}`} onClick={() => search()}>
                <span className="search__go-query">Search “{typedText}”</span>
                <span className="search__go-count">{countLabel(typed)}</span>
              </button>
              {typed.pieces > 0 && <Group title="Pieces">{piecesOf(typed).map(piecePill)}</Group>}
              {typed.events.length > 0 && <Group title="Events">{typed.events.map(({ event }) => filterPill({ kind: 'event', value: event.id }, event.title))}</Group>}
            </>
          ) : (
            <>
              {state.recentSearches.length > 0 && <Group title="Recent">{state.recentSearches.map((r) => filterPill({ kind: 'query', value: r }, r))}</Group>}
              <Group title="Categories">{CATEGORIES.map((c) => filterPill(c.filter, c.label))}</Group>
              <Group title="Events">{events.map((e) => filterPill({ kind: 'event', value: e.id }, e.title))}</Group>
              <Group title="Popular pieces">{POPULAR.map(piecePill)}</Group>
            </>
          )}
        </div>

        <form className="search__bar" role="search" onSubmit={search}>
          <div className="search__track">
            <div className="search__field">
              <input
                ref={inputRef}
                className="search__input"
                type="search"
                name="q"
                enterKeyHint="search"
                placeholder="Search pieces or events…"
                aria-label="Search pieces or events"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              {text && (
                <button
                  type="button"
                  className="search__clear"
                  aria-label="Clear text"
                  onClick={() => {
                    setText('')
                    inputRef.current?.focus()
                  }}
                >
                  <Icon name="close" />
                </button>
              )}
            </div>
          </div>
          <Cta type="submit" className="search__submit" aria-label={`Search, ${countLabel(result, ', ')}`}>
            Search
          </Cta>
        </form>
        <p className="visually-hidden" aria-live="polite">
          {spokenCount}
        </p>
      </motion.div>
    </div>,
    document.body,
  )
}

// One suggestion group: its title, then a row of pills that scrolls sideways.
function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="search__group">
      <h2 className="search__label">{title}</h2>
      <ul className="search__row">{children}</ul>
    </section>
  )
}

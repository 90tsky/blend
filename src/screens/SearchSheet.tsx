import { motion, type Transition } from 'motion/react'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router'
import { events } from '../data/events'
import { productsById } from '../data/products'
import { applyFilters, countLabel, findFilter, piecesOf } from '../features/search/filtering'
import { Suggestion } from '../features/search/Suggestion'
import { useVisualViewport } from '../features/search/useVisualViewport'
import { useStore, type Filter } from '../state/store'
import { Icon } from '../ui/Icon'
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
// list with suggestions, and the typing bar on top of the phone's own keyboard. Picking something adds a filter chip
// and goes back to Events, which stayed mounted underneath, so the shopper's place is kept.
export function SearchSheet() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const view = useVisualViewport()
  const inputRef = useRef<HTMLInputElement>(null)
  const [text, setText] = useState('')
  const [leaving, setLeaving] = useState<(() => void) | null>(null)
  const { filters } = state
  const typedText = text.trim()
  const query = typedText.toLowerCase()

  // What pressing Search would show: the typed word on top of the filters already on.
  const typed = useMemo(() => (query ? applyFilters([...filters, { kind: 'query', value: query }]) : null), [query, filters])

  // The count is read out once typing pauses ("5 events, 4 pieces").
  const [spokenCount, setSpokenCount] = useState('')
  useEffect(() => {
    const t = window.setTimeout(() => setSpokenCount(typed ? countLabel(typed, ', ') : ''), 700)
    return () => window.clearTimeout(t)
  }, [typed])

  // Back to the Events entry that opened the sheet, or to Events on a fresh load.
  const back = () => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate('/events', { replace: true }))
  // The sheet slides down and the dim fades, then the route changes.
  const close = () => {
    inputRef.current?.blur()
    setLeaving(() => back)
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

  // Categories, events and recent words switch their filter on or off.
  const toggle = (f: Filter) => {
    const on = findFilter(filters, f)
    dispatch(on ? { type: 'removeFilter', filter: on } : { type: 'addFilter', filter: f })
    close()
  }

  // Enter, the keyboard's Search key or the "Search “tee”" row: the typed word becomes a filter.
  const search = (e?: FormEvent) => {
    e?.preventDefault()
    if (!query) return
    dispatch({ type: 'addFilter', filter: { kind: 'query', value: query } })
    dispatch({ type: 'addRecent', query })
    close()
  }

  // Pieces open their Product page in place of the sheet, so Back from there lands on Events.
  const openPiece = (id: string) => {
    if (query) dispatch({ type: 'addRecent', query })
    navigate(`/product/${id}`, { replace: true })
  }

  const filterPill = (f: Filter, label: string) => {
    const on = Boolean(findFilter(filters, f))
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
        onClick={close}
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
                enterKeyHint="search"
                placeholder="Search pieces or events"
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

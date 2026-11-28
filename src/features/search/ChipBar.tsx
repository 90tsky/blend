import { AnimatePresence, motion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useWheelScrollX } from '../../lib/useWheelScrollX'
import { useStore, type Filter } from '../../state/store'
import { Icon } from '../../ui/Icon'
import { countLabel, filterLabel, useFilteredEvents } from './filtering'
import './ChipBar.css'

const keyOf = (f: Filter) => `${f.kind}:${f.value}`

// Chips pop in and out; the rest of the row slides to close the gap.
const pop = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.85 },
  transition: { duration: 0.15, ease: 'easeOut' },
} as const

// The filter chips in the bottom bar's "filter on" row (Figma chip bar 1806:11153, design "A"): applied chips in a
// pressed-in track and "Clear all" from 2 chips on. Adding one is the search button's job: its dot carries a white +
// while filters are on (the user, 28 Nov; the bar's own raised + at the end went: it looked like the + that adds a piece
// to the change room). It reads the store itself, so it needs no props, and renders nothing while no filter is on.
export function ChipBar() {
  const { state, dispatch } = useStore()
  const result = useFilteredEvents()
  const { filters } = state
  const scrollRef = useRef<HTMLDivElement>(null)
  const shown = useRef(filters.length)
  const [spoken, setSpoken] = useState('')

  // Screen readers hear the new count when the chips change ("5 events, 4 pieces"). It waits until the search sheet
  // has closed, because the page under the sheet is inert (and silent) while it's open.
  useEffect(() => {
    const t = window.setTimeout(() => setSpoken(filters.length ? countLabel(result, ', ') : ''), 500)
    return () => window.clearTimeout(t)
  }, [result, filters.length])

  // A new chip goes on the end: scroll it into view (at once with Reduce motion).
  const reduced = useReducedMotionConfig()
  useEffect(() => {
    const el = scrollRef.current
    if (el && filters.length > shown.current) el.scrollTo({ left: el.scrollWidth, behavior: reduced ? 'auto' : 'smooth' })
    shown.current = filters.length
  }, [filters.length, reduced])
  useWheelScrollX(scrollRef, filters.length > 0)

  if (filters.length === 0) return null

  // The keyboard stays on the chips: the next one, or the one before; with none left, the search button.
  const toSearch = () => document.querySelector<HTMLButtonElement>('.round-btn--search')?.focus()
  const remove = (f: Filter, i: number) => {
    dispatch({ type: 'removeFilter', filter: f })
    const chips = [...(scrollRef.current?.querySelectorAll<HTMLButtonElement>('.chip-bar__chip') ?? [])].filter((_, k) => k !== i)
    const next = chips[i] ?? chips[i - 1]
    if (next) next.focus()
    else toSearch()
  }

  return (
    <div className="chip-bar" role="group" aria-label="Filters">
      <motion.div layoutScroll ref={scrollRef} className={`chip-bar__scroll${filters.length >= 3 ? ' chip-bar__scroll--fade' : ''}`}>
        <ul className="chip-bar__row">
          <AnimatePresence initial={false} mode="popLayout">
            {filters.map((f, i) => (
              <motion.li key={keyOf(f)} layout {...pop}>
                <button type="button" className="chip-bar__chip" aria-label={`${filterLabel(f)}, remove filter`} onClick={() => remove(f, i)}>
                  <span className="chip-bar__pill">
                    <span className="pill-label">{filterLabel(f)}</span>
                    <span className="chip-bar__x">
                      <Icon name="close" />
                    </span>
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>
      {/* "Clear all" stays at the end of the bar, where the chips scroll under it (the user, 28 Nov: "wouldnt it be
          better if clear all is always at the end of the bar?"), not at the end of the chips, scrolled out of sight. */}
      <AnimatePresence initial={false}>
        {filters.length >= 2 && (
          <motion.button
            key="clear-all"
            type="button"
            className="chip-bar__clear"
            aria-label="Clear all filters"
            onClick={() => {
              dispatch({ type: 'setFilters', filters: [] })
              toSearch()
            }}
            {...pop}
          >
            <span className="pill-label">Clear all</span>
          </motion.button>
        )}
      </AnimatePresence>
      <p className="visually-hidden" aria-live="polite">
        {spoken}
      </p>
    </div>
  )
}

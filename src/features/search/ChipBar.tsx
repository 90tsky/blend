import { AnimatePresence, motion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
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
// pressed-in track, "Clear all" from 2 chips on, and a raised "+" that opens search. It reads the store itself, so it
// needs no props, and renders nothing while no filter is on.
export function ChipBar() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const result = useFilteredEvents()
  const { filters } = state
  const scrollRef = useRef<HTMLDivElement>(null)
  const addRef = useRef<HTMLButtonElement>(null)
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

  if (filters.length === 0) return null

  const remove = (f: Filter) => {
    dispatch({ type: 'removeFilter', filter: f })
    addRef.current?.focus()
  }

  return (
    <div className="chip-bar" role="group" aria-label="Filters">
      <motion.div layoutScroll ref={scrollRef} className={`chip-bar__scroll${filters.length >= 3 ? ' chip-bar__scroll--fade' : ''}`}>
        <ul className="chip-bar__row">
          <AnimatePresence initial={false} mode="popLayout">
            {filters.map((f) => (
              <motion.li key={keyOf(f)} layout {...pop}>
                <button type="button" className="chip-bar__chip" aria-label={`${filterLabel(f)}, remove filter`} onClick={() => remove(f)}>
                  <span className="chip-bar__pill">
                    {filterLabel(f)}
                    <span className="chip-bar__x">
                      <Icon name="close" />
                    </span>
                  </span>
                </button>
              </motion.li>
            ))}
            {filters.length >= 2 && (
              <motion.li key="clear-all" layout {...pop}>
                <button type="button" className="chip-bar__clear" aria-label="Clear all filters" onClick={() => dispatch({ type: 'setFilters', filters: [] })}>
                  Clear all
                </button>
              </motion.li>
            )}
          </AnimatePresence>
        </ul>
      </motion.div>
      <button ref={addRef} type="button" className="chip-bar__add" aria-label="Add a filter" onClick={() => navigate('/events/search')}>
        <span className="chip-bar__add-face">
          <Icon name="add" />
        </span>
      </button>
      <p className="visually-hidden" aria-live="polite">
        {spoken}
      </p>
    </div>
  )
}

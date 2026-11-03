import { Link, useLocation } from 'react-router'
import { motion } from 'motion/react'
import { plural } from '../lib/format'
import { useBag, useStore } from '../state/store'
import { SplitBadge } from './SplitBadge'
import './NavSwitch.css'

export type Tab = 'events' | 'change-room'

// EVENTS / CHANGE ROOM switch (Figma nav-switch 731:3705, rebuilt 2 Nov): no track, a raised white knob
// filling the current half (203 × 48 on the 406 switch) slides between the tabs in 0.35s ease-in-out.
// The split badge sits 12 from the knob's edge on the CHANGE ROOM side.
export function NavSwitch({ tab }: { tab: Tab }) {
  const { dispatch } = useStore()
  const { tops, bottoms } = useBag()
  const { pathname } = useLocation()

  // Switching tabs hides any toast. Tapping EVENTS after leaving Events clears the search filters.
  const toEvents = () => {
    dispatch({ type: 'toast', toast: null })
    if (!pathname.startsWith('/events')) dispatch({ type: 'setFilters', filters: [] })
  }
  const toRoom = () => dispatch({ type: 'toast', toast: null })

  const counts = [tops > 0 && plural(tops, 'top'), bottoms > 0 && plural(bottoms, 'bottom')].filter(Boolean)
  const layout = { layout: { duration: 0.18, ease: 'easeOut' as const } }

  return (
    <div className="nav-switch">
      <motion.span
        className="nav-switch__knob"
        aria-hidden="true"
        initial={false}
        animate={{ x: tab === 'change-room' ? '100%' : '0%' }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      />
      <Link to="/events" className="nav-switch__tab" aria-current={tab === 'events' ? 'page' : undefined} onClick={toEvents}>
        <span className="nav-switch__area">
          <span className="nav-switch__label">Events</span>
        </span>
      </Link>
      <Link to="/change-room" className="nav-switch__tab" aria-current={tab === 'change-room' ? 'page' : undefined} onClick={toRoom}>
        <span className="nav-switch__area">
          <motion.span layout="position" transition={layout} className="nav-switch__label">
            Change room
          </motion.span>
        </span>
        <SplitBadge tops={tops} bottoms={bottoms} />
        {counts.length > 0 && <span className="visually-hidden">, {counts.join(', ')}</span>}
      </Link>
    </div>
  )
}

import { useRef, useState, type UIEvent } from 'react'
import { OccasionSection } from '../components/OccasionSection'
import { occasions } from '../data/occasions'
import { useStore } from '../state/store'
import './EventsScreen.css'

export function EventsScreen() {
  const { state, dispatch } = useStore()
  const [openId, setOpenId] = useState<string | null>(occasions[0].id)
  // The floating buttons slide away while scrolling down so they don't cover the add buttons.
  const [floatHidden, setFloatHidden] = useState(false)
  const lastScroll = useRef(0)

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const y = e.currentTarget.scrollTop
    const dy = y - lastScroll.current
    if (Math.abs(dy) > 6) setFloatHidden(dy > 0 && y > 80)
    lastScroll.current = y
  }

  return (
    <div className="events" aria-label="Events">
      <div className="events__scroll" onScroll={onScroll}>
        <div className="events__intro">
          <h1 className="events__heading">Dress for the day</h1>
          <p className="events__lede">Every top in an event goes with every bottom. Add a few, then mix them in the change room.</p>
        </div>
        {occasions.map((o) => (
          <OccasionSection key={o.id} occasion={o} open={openId === o.id} onToggle={() => setOpenId(openId === o.id ? null : o.id)} />
        ))}
        <div className="events__end" />
      </div>

      <div className={`events__float ${floatHidden ? 'is-hidden' : ''}`}>
        <button className="round-btn" onClick={() => dispatch({ type: 'openSheet', sheet: 'closet' })} tabIndex={floatHidden ? -1 : 0}>
          Closet
        </button>
        <button className="round-btn" onClick={() => dispatch({ type: 'rotate' })} aria-pressed={state.side === 'back'} tabIndex={floatHidden ? -1 : 0}>
          Turn around
        </button>
      </div>
    </div>
  )
}

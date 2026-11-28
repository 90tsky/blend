import { useLocation, useNavigate } from 'react-router'
import { ChipBar } from '../features/search/ChipBar'
import { plural } from '../lib/format'
import { useStore } from '../state/store'
import { RoundButton } from '../ui/primitives'
import { CheckoutButton } from './CheckoutButton'
import { NavSwitch } from './NavSwitch'
import './BottomBar.css'

// Bottom bar for Events and the change room (Figma bottom-bar 494:242), fixed at the bottom of the column:
// the EVENTS / CHANGE ROOM switch, then search, Checkout and Turn around. On a filtered Events page
// ("filter on", 192 tall) the chip bar sits above the switch, 12 below the bar's top and 12 above the switch.
// `wide` (the laptop layout, SplitLayout): no switch, since both are open; this bar holds search and the chips under
// Events, and the change room carries Checkout and Turn around in its own bar beside it (ChangeRoom `panel`), so the
// two read as one row along the bottom of the screen.
export function BottomBar({ wide = false }: { wide?: boolean }) {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const tab = pathname.startsWith('/change-room') ? 'change-room' : 'events'
  const filters = state.filters.length
  const filterOn = tab === 'events' && filters > 0

  const search = (
    <RoundButton
      icon="search"
      label={filters ? `Search, ${plural(filters, 'filter')} on` : 'Search'}
      dot={filters > 0}
      onClick={() => navigate('/events/search', { state: { from: tab } })}
    />
  )
  const turnAround = <RoundButton icon="turn-around" label="Turn around" aria-pressed={state.side === 'back'} onClick={() => dispatch({ type: 'rotate' })} />

  if (wide) {
    return (
      <div className="bottom-bar" role="group" aria-label="Search and filters">
        <div className="bottom-bar__row bottom-bar__events">
          {search}
          {filters > 0 && (
            <div className="bottom-bar__chips">
              <ChipBar />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <nav className={`bottom-bar${filterOn ? ' bottom-bar--filter' : ''}`} aria-label="Main">
      {filterOn && (
        <div className="bottom-bar__row bottom-bar__filters">
          <ChipBar />
        </div>
      )}
      <div className="bottom-bar__row">
        <NavSwitch tab={tab} />
      </div>
      <div className="bottom-bar__row">
        {search}
        <CheckoutButton />
        {turnAround}
      </div>
    </nav>
  )
}

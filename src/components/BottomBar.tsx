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
// ("filter on", 184 tall) the chip bar sits above the switch, 12 below the bar's top and 8 above the switch.
export function BottomBar() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const tab = pathname.startsWith('/change-room') ? 'change-room' : 'events'
  const filters = state.filters.length
  const filterOn = tab === 'events' && filters > 0

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
        <RoundButton
          icon="search"
          label={filters ? `Search, ${plural(filters, 'filter')} on` : 'Search'}
          dot={filters > 0}
          onClick={() => navigate('/events/search')}
        />
        <CheckoutButton />
        <RoundButton icon="turn-around" label="Turn around" aria-pressed={state.side === 'back'} onClick={() => dispatch({ type: 'rotate' })} />
      </div>
    </nav>
  )
}

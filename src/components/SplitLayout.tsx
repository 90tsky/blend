import { useLayoutEffect } from 'react'
import { useNavigationType, useOutlet } from 'react-router'
import { useFilteredEvents } from '../features/search/filtering'
import { ChangeRoom } from '../screens/ChangeRoom'
import { TopBar } from '../ui/primitives'
import { BottomBar } from './BottomBar'
import './SplitLayout.css'

// Where Events was scrolled to. Module scope, so it outlives the layout (a trip to a piece, then Back).
let eventsY = 0

// The laptop layout (the user, 20 Nov: "the change room should stay on the right, with a checkout button, and the
// events section on the left: that's a difference between the web and phone versions"). Events is the page and
// scrolls; the change room is always open beside it, so there's no EVENTS / CHANGE ROOM switch and nothing pushes.
// One bar runs along the bottom: search and the filter chips under Events, Checkout and Turn around under the change
// room. The routes stay the phone's (/events, /events/search); App sends /change-room here to /events, and Try it on
// opens /events/try-on, so Events never remounts. useWide() decides which layout shows.
export function SplitLayout() {
  // Events, with the search sheet or Try-On when they're open.
  const outlet = useOutlet()
  const navigationType = useNavigationType()
  const { events, isFiltered } = useFilteredEvents()
  const plain = isFiltered && events.length === 0

  // A fresh visit opens at the top; Back (or Forward) returns to where Events was.
  useLayoutEffect(() => {
    window.scrollTo(0, navigationType === 'POP' ? eventsY : 0)
    const remember = () => {
      eventsY = window.scrollY
    }
    window.addEventListener('scroll', remember, { passive: true })
    return () => window.removeEventListener('scroll', remember)
    // Only when the layout opens.
  }, [])

  // In reading (and Tab) order: the top bar, Events, search and its chips, then the change room with its pieces, Try it
  // on, Checkout and Turn around. SplitLayout.css stacks the top bar over the change room, for ☰.
  return (
    <div className="split">
      <TopBar variant={plain ? 'plain' : 'overlay'} />
      <div className="split__events">{outlet}</div>
      <BottomBar wide />
      <ChangeRoom panel />
    </div>
  )
}

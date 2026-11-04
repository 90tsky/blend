import { Navigate, Outlet, Route, Routes, useLocation, useOutlet } from 'react-router'
import { BottomBar } from './components/BottomBar'
import type { Tab } from './components/NavSwitch'
import { TabScreens } from './components/TabScreens'
import { ToastHost } from './components/Toast'
import { useFilteredEvents } from './features/search/filtering'
import { ChangeRoom } from './screens/ChangeRoom'
import { Checkout } from './screens/Checkout'
import { ComingSoon } from './screens/ComingSoon'
import { Events } from './screens/Events'
import { Options } from './screens/Options'
import { OrderPlaced } from './screens/OrderPlaced'
import { Product } from './screens/Product'
import { SearchSheet } from './screens/SearchSheet'
import { TryOn } from './screens/TryOn'
import { Welcome } from './screens/Welcome'
import { TopBar } from './ui/primitives'

// The phone-width column, with one toast host for every screen.
function AppShell() {
  return (
    <div className="app">
      <Outlet />
      <ToastHost />
    </div>
  )
}

// Events and Change room share the top and bottom bars, so they stay put (and the knob slides) while the screens push
// past under them.
function MainLayout() {
  const outlet = useOutlet()
  const tab: Tab = useLocation().pathname.startsWith('/change-room') ? 'change-room' : 'events'
  return (
    <>
      <MainTopBar tab={tab} />
      <TabScreens tab={tab} screen={outlet} />
      <BottomBar />
    </>
  )
}

// Over the Events photos the bar is a soft shade; the change room, and a no-results message at the top of Events, keep
// the plain bar. It cross-fades as the screens push.
function MainTopBar({ tab }: { tab: Tab }) {
  const { events, isFiltered } = useFilteredEvents()
  const plain = tab === 'change-room' || (isFiltered && events.length === 0)
  return <TopBar variant={plain ? 'plain' : 'overlay'} />
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Welcome />} />
        <Route element={<MainLayout />}>
          <Route path="events" element={<Events />}>
            <Route path="search" element={<SearchSheet />} />
          </Route>
          <Route path="change-room" element={<ChangeRoom />}>
            {/* Try-On rises over the change room, which stays mounted underneath. */}
            <Route path="try-on/*" element={<TryOn />} />
          </Route>
        </Route>
        <Route path="product/:id" element={<Product />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-placed" element={<OrderPlaced />} />
        <Route path="options" element={<Options />} />
        <Route path="coming-soon" element={<ComingSoon />} />
        <Route path="*" element={<Navigate to="/events" replace />} />
      </Route>
    </Routes>
  )
}

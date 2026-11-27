import { Navigate, Outlet, Route, Routes, useLocation, useOutlet } from 'react-router'
import { BottomBar } from './components/BottomBar'
import type { Tab } from './components/NavSwitch'
import { SplitLayout } from './components/SplitLayout'
import { TabScreens } from './components/TabScreens'
import { ToastHost } from './components/Toast'
import { useFilteredEvents } from './features/search/filtering'
import { useFiltersInUrl } from './features/search/useFiltersInUrl'
import { useWide } from './lib/useWide'
import { ChangeRoom } from './screens/ChangeRoom'
import { Checkout } from './screens/Checkout'
import { ComingSoon } from './screens/ComingSoon'
import { Events } from './screens/Events'
import { About } from './screens/menu/About'
import { Account } from './screens/menu/Account'
import { Currency } from './screens/menu/Currency'
import { Help } from './screens/menu/Help'
import { Notifications } from './screens/menu/Notifications'
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
// past under them. On a laptop both are open side by side instead (SplitLayout), where the change room has no address
// of its own: /change-room goes to /events, and /change-room/try-on to /events/try-on.
function MainLayout() {
  const outlet = useOutlet()
  const { pathname, search } = useLocation()
  const wide = useWide()
  useFiltersInUrl()
  const tab: Tab = pathname.startsWith('/change-room') ? 'change-room' : 'events'
  if (wide) return tab === 'change-room' ? <Navigate to={pathname.replace('/change-room', '/events') + search} replace /> : <SplitLayout />
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
            {/* The laptop layout's Try it on: the change room is open beside Events there, so Try-On rises from here. */}
            <Route path="try-on/*" element={<TryOn />} />
          </Route>
          <Route path="change-room" element={<ChangeRoom />}>
            {/* Try-On rises over the change room, which stays mounted underneath. */}
            <Route path="try-on/*" element={<TryOn />} />
          </Route>
        </Route>
        <Route path="product/:id" element={<Product />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-placed" element={<OrderPlaced />} />
        {/* The menu screen (called Options until 20 Nov: the user, "menu sounds more in tack with how the other things
            are named, like events and change room"). Old links still land on it. */}
        <Route path="menu" element={<Options />} />
        {/* The menu's own pages (27 Nov), each opened from a row of the menu. */}
        <Route path="menu/account" element={<Account />} />
        <Route path="menu/notifications" element={<Notifications />} />
        <Route path="menu/currency" element={<Currency />} />
        <Route path="menu/help" element={<Help />} />
        <Route path="menu/about" element={<About />} />
        <Route path="options" element={<Navigate to="/menu" replace />} />
        <Route path="coming-soon" element={<ComingSoon />} />
        <Route path="*" element={<Navigate to="/events" replace />} />
      </Route>
    </Routes>
  )
}

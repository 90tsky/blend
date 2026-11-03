import { Navigate, Outlet, Route, Routes } from 'react-router'
import { BottomBar } from './components/BottomBar'
import { ToastHost } from './components/Toast'
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

// The phone-width column, with one toast host for every screen.
function AppShell() {
  return (
    <div className="app">
      <Outlet />
      <ToastHost />
    </div>
  )
}

// Events and Change room share the bottom bar, so it stays put (and its knob slides) when you switch tabs.
function MainLayout() {
  return (
    <>
      <Outlet />
      <BottomBar />
    </>
  )
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

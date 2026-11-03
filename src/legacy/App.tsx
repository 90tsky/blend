import { BottomBar } from './components/BottomBar'
import { Header } from './components/Header'
import { Toast } from './components/Toast'
import { ChangeRoomScreen } from './screens/ChangeRoomScreen'
import { CheckoutSheet } from './screens/CheckoutSheet'
import { ClosetSheet } from './screens/ClosetSheet'
import { EventsScreen } from './screens/EventsScreen'
import { SettingsSheet } from './screens/SettingsSheet'
import { TryOnSheet } from './screens/TryOnSheet'
import { useStore } from './state/store'
import './styles/app.css'

export default function App() {
  const { state } = useStore()

  return (
    <div className={`app hand-${state.hand}`} data-tab={state.tab}>
      <Header />
      {/* Both screens stay mounted so each keeps its scroll position. On desktop they sit side by side. */}
      <main className="app__main">
        <section className="app__events">
          <EventsScreen />
        </section>
        <section className="app__change-room">
          <ChangeRoomScreen />
        </section>
        <div className="app__bar">
          <BottomBar />
        </div>
      </main>
      <ClosetSheet />
      <SettingsSheet />
      <TryOnSheet />
      <CheckoutSheet />
      {/* While a sheet is open, the toast shows inside it instead (see Sheet). */}
      {state.sheet === null && <Toast />}
    </div>
  )
}

import { useStore } from '../state/store'
import { SettingsIcon } from './icons'
import './Header.css'

export function Header() {
  const { dispatch } = useStore()
  return (
    <header className="header">
      <button className="header__logo" onClick={() => dispatch({ type: 'setTab', tab: 'events' })} aria-label="blend, go to events">
        <img src="/brand/logo.svg" alt="" width={59} height={27} />
      </button>
      <button className="header__icon" onClick={() => dispatch({ type: 'openSheet', sheet: 'settings' })} aria-label="Options">
        <SettingsIcon size={22} />
      </button>
    </header>
  )
}

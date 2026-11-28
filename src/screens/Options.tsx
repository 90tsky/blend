import { useState } from 'react'
import { Link } from 'react-router'
import { SizeGuide } from '../components/SizeGuide'
import { useBagActions, useStore, type Theme } from '../state/store'
import { Icon } from '../ui/Icon'
import { Avatar } from './menu/Avatar'
import { CURRENCY_NAMES } from './menu/Currency'
import { ButtonRow, ControlRow, Group, LinkRow, MenuPage, SwitchRow } from './menu/List'
import { Segmented } from './try-on/Segmented'

const THEMES: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
]

// The menu (/menu; called Options in the code). Arranged like an iPhone's settings (the user, 27 Nov): the profile on
// top, which opens Account (name, photo, gender, body type, sizes), then shopping, display, clearing up, and help.
// Currency sits with shopping, not in Account: it goes with where you shop, not who you are (ASOS keeps it in
// Settings beside the country you shop in; Zara, Zalando and SHEIN tie it to the country's shop).
export function Options() {
  const { state, dispatch } = useStore()
  const actions = useBagActions()
  const [guideOpen, setGuideOpen] = useState(false)
  const name = state.name.trim()
  const searches = state.recentSearches.length

  return (
    <MenuPage title="Menu" up="/events">
      <Link to="/menu/account" className="menu-profile" aria-label={`${name || 'Your profile'}: name, photo, gender, body type and sizes`}>
        <Avatar name={name} photo={state.photo} size={64} />
        <span className="menu-profile__text">
          <span className="menu-profile__name">{name || 'Your profile'}</span>
          <span className="menu-profile__detail">Name, photo, body type and sizes</span>
        </span>
        <Icon name="chevron" size={20} className="menu-row__trail" />
      </Link>

      <Group label="Shopping">
        {/* Orders come with accounts; until then the row says so (ComingSoon). */}
        <LinkRow to="/coming-soon?for=orders" label="My orders" />
        <LinkRow to="/menu/notifications" label="Notifications" />
        <LinkRow to="/menu/currency" label="Currency" value={state.currency} spoken={`Currency: ${CURRENCY_NAMES[state.currency]}`} />
      </Group>

      <Group label="Display">
        <ControlRow
          labelId="menu-appearance"
          label="Appearance"
          hint={
            <>
              <b>Auto</b> follows your phone’s light or dark mode.
            </>
          }
        >
          <Segmented labelledBy="menu-appearance" options={THEMES} value={state.theme} onChange={(theme) => dispatch({ type: 'setTheme', theme })} />
        </ControlRow>
        <SwitchRow
          id="menu-motion"
          label="Reduce motion"
          detail="Turns off sliding and fading."
          on={state.reduceMotion}
          onChange={(on) => dispatch({ type: 'setReduceMotion', on })}
        />
      </Group>

      <Group label="Clear">
        <ButtonRow
          label="Clear recent searches"
          detail={searches ? `The last ${searches === 1 ? 'word' : `${searches} words`} you searched for.` : 'Nothing to clear.'}
          disabled={!searches}
          onClick={() => {
            dispatch({ type: 'clearRecent' })
            dispatch({ type: 'toast', toast: { kind: 'searches-cleared' } })
          }}
        />
        {/* "Change room emptied · Undo" comes up in the shared toast. */}
        <ButtonRow
          label="Empty change room"
          detail={state.bag.length ? 'Takes every piece out. You can undo it.' : 'Your change room is empty.'}
          danger
          disabled={state.bag.length === 0}
          onClick={actions.empty}
        />
      </Group>

      <Group label="Help">
        <ButtonRow label="Size guide" chevron onClick={() => setGuideOpen(true)} />
        <LinkRow to="/menu/help" label="Help & contact" />
        <LinkRow to="/menu/about" label="About blend" />
      </Group>

      <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} />
    </MenuPage>
  )
}

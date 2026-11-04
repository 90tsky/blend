import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import type { Slot } from '../data/products'
import { SIZE_KEYS, SIZE_SYSTEMS, sizeLabel } from '../data/sizes'
import { asset } from '../lib/asset'
import type { Currency } from '../lib/format'
import { useBagActions, useStore, type Theme } from '../state/store'
import { Cta, Header, TopBar } from '../ui/primitives'
import { Segmented } from './try-on/Segmented'
import './Options.css'

const CURRENCIES: Currency[] = ['EUR', 'USD', 'GBP']
const THEMES: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]
// The gender photos have no captions; their spoken names are "Women’s" / "Men’s".
const GENDERS = [
  { value: 'women', label: 'Women’s' },
  { value: 'men', label: 'Men’s' },
] as const
// The wash behind the photos turns to the chosen side (Figma gender-button: ±91°, Smart animate on the Gentle spring).
const WASH_TURN = { women: 91, men: -91 } as const
const GENTLE = { type: 'spring', stiffness: 100, damping: 15, mass: 1 } as const
const NAME_KEY = 'blend:name'

function savedName() {
  try {
    return localStorage.getItem(NAME_KEY) ?? ''
  } catch {
    return ''
  }
}

// Options (Figma Options 498:9264): profile, preferences, account. Everything but the name lives in the store, so it
// changes the whole app at once (sizes, currency, light or dark).
export function Options() {
  const { state, dispatch } = useStore()
  const actions = useBagActions()
  const navigate = useNavigate()
  const [name, setName] = useState(savedName)

  const back = () => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate('/events'))
  const sizes = (slot: Slot) => SIZE_KEYS.map((k) => ({ value: k, label: sizeLabel(slot, k, state.sizeSystem) }))
  const soon = () => navigate('/coming-soon')

  const changeName = (value: string) => {
    setName(value)
    try {
      localStorage.setItem(NAME_KEY, value)
    } catch {
      // Storage can be unavailable (private mode); the name just isn't kept.
    }
  }

  return (
    <main className="screen options">
      {/* The menu button opens Options, so it's hidden here. */}
      <TopBar menu={false} />
      <div className="options__head">
        <Header title="Options" subtitle="Name, gender, sizes, currency, appearance, motion and account." onLead={back} />
      </div>

      <div className="options__body">
        <div className="settings">
          <div className="setting">
            <label className="setting__label" htmlFor="options-name">
              Name
            </label>
            <input id="options-name" className="options__field" value={name} placeholder="Your name" autoComplete="name" onChange={(e) => changeName(e.target.value)} />
          </div>
          <div className="setting">
            <h2 className="setting__label" id="options-gender">
              Gender
            </h2>
            <div className="gender" role="group" aria-labelledby="options-gender">
              <motion.span
                className="gender__wash"
                aria-hidden="true"
                initial={false}
                animate={{ rotate: state.gender ? WASH_TURN[state.gender] : 0 }}
                transition={GENTLE}
              />
              {GENDERS.map((g) => {
                const on = state.gender === g.value
                return (
                  <button
                    key={g.value}
                    type="button"
                    className={`gender__option${on ? ' gender__option--on' : ''}`}
                    aria-label={g.label}
                    aria-pressed={on}
                    onClick={() => dispatch({ type: 'setGender', gender: on ? null : g.value })}
                  >
                    <img src={asset(`gender/${g.value}.webp`)} alt="" width={117} height={216} />
                  </button>
                )
              })}
            </div>
            <p className="setting__hint">
              <b>Optional.</b> We use it to fit the outfits to you.
            </p>
          </div>
        </div>

        <div className="settings">
          <div className="setting">
            <h2 className="setting__label" id="options-size-system">
              Size system
            </h2>
            <Segmented
              labelledBy="options-size-system"
              options={SIZE_SYSTEMS.map((s) => ({ value: s, label: s }))}
              value={state.sizeSystem}
              onChange={(system) => dispatch({ type: 'setSizeSystem', system })}
            />
            <p className="setting__hint">
              How sizes are labelled <b>everywhere</b> in blend.
            </p>
          </div>
          <div className="setting">
            <h2 className="setting__label" id="options-top-size">
              Top size
            </h2>
            <Segmented labelledBy="options-top-size" options={sizes('top')} value={state.sizes.top} onChange={(size) => dispatch({ type: 'setSize', slot: 'top', size })} />
          </div>
          <div className="setting">
            <h2 className="setting__label" id="options-bottom-size">
              Bottom size
            </h2>
            <Segmented labelledBy="options-bottom-size" options={sizes('bottom')} value={state.sizes.bottom} onChange={(size) => dispatch({ type: 'setSize', slot: 'bottom', size })} />
          </div>
          <div className="setting">
            <h2 className="setting__label" id="options-currency">
              Currency
            </h2>
            <Segmented
              labelledBy="options-currency"
              options={CURRENCIES.map((c) => ({ value: c, label: c }))}
              value={state.currency}
              onChange={(currency) => dispatch({ type: 'setCurrency', currency })}
            />
            <p className="setting__hint">Prices are shown in this currency.</p>
          </div>
          <div className="setting">
            <h2 className="setting__label" id="options-appearance">
              Appearance
            </h2>
            <Segmented labelledBy="options-appearance" options={THEMES} value={state.theme} onChange={(theme) => dispatch({ type: 'setTheme', theme })} />
            <p className="setting__hint">
              <b>Light</b> or <b>dark</b>, whichever is easier on your eyes.
            </p>
          </div>
          <div className="setting">
            {/* The label is the switch's name; clicking it flips the switch too. */}
            <div className="setting__row">
              <label className="setting__label" htmlFor="options-motion">
                Reduce motion
              </label>
              <button
                id="options-motion"
                type="button"
                role="switch"
                className="switch"
                aria-checked={state.reduceMotion}
                aria-describedby="options-motion-hint"
                onClick={() => dispatch({ type: 'setReduceMotion', on: !state.reduceMotion })}
              >
                <span className="switch__knob" aria-hidden="true" />
              </button>
            </div>
            <p className="setting__hint" id="options-motion-hint">
              Turns off sliding and fading.
            </p>
          </div>
        </div>

        <div className="options__account">
          {/* "Change room emptied · Undo" comes up in the shared toast. */}
          <Cta variant="secondary" disabled={state.bag.length === 0} onClick={actions.empty}>
            Empty change room
          </Cta>
          <Cta variant="secondary" onClick={soon}>
            Notifications
          </Cta>
          <Cta variant="secondary" onClick={soon}>
            My orders
          </Cta>
          <Cta variant="secondary" onClick={soon}>
            Sign out
          </Cta>
          <Cta variant="secondary" onClick={soon}>
            Delete account
          </Cta>
        </div>
        {/* Which deploy is running, to tell versions apart while testing on a phone. */}
        <p className="options__version">Version {__BUILD__}</p>
      </div>
    </main>
  )
}

import { useRef, useState, type ChangeEvent } from 'react'
import { motion } from 'motion/react'
import { BuildPicker } from '../../components/BuildPicker'
import type { Slot } from '../../data/products'
import { SIZE_KEYS, SIZE_SYSTEMS, sizeLabel } from '../../data/sizes'
import { asset } from '../../lib/asset'
import { useStore } from '../../state/store'
import { Segmented } from '../try-on/Segmented'
import { Avatar, profilePhoto } from './Avatar'
import { Group, LinkRow, MenuPage } from './List'

// The gender photos have no captions; their spoken names are "Women’s" / "Men’s".
const GENDERS = [
  { value: 'women', label: 'Women’s' },
  { value: 'men', label: 'Men’s' },
] as const
// The wash behind the photos turns to the chosen side (Figma gender-button: ±91°, Smart animate on the Gentle spring).
const WASH_TURN = { women: 91, men: -91 } as const
const GENTLE = { type: 'spring', stiffness: 100, damping: 15, mass: 1 } as const

// Menu › Account (/menu/account), opened from the profile at the top of the menu: who you are and what fits you.
// Photo and name, gender, body type (new, 27 Nov: Try-On's "A model like you" starts from it), size system and sizes.
// Everything is kept on this phone; Sign out and Delete account wait for real accounts.
export function Account() {
  const { state, dispatch } = useStore()
  const picker = useRef<HTMLInputElement>(null)
  const [photoError, setPhotoError] = useState(false)
  const sizes = (slot: Slot) => SIZE_KEYS.map((k) => ({ value: k, label: sizeLabel(slot, k, state.sizeSystem) }))

  const pickPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // so the same photo can be picked again
    if (!file) return
    try {
      dispatch({ type: 'setPhoto', photo: await profilePhoto(file) })
      setPhotoError(false)
    } catch {
      setPhotoError(true)
    }
  }

  return (
    <MenuPage title="Account" subtitle="Kept on this phone. We use it to fit the outfits and Try‑On to you.">
      <div className="account-photo">
        <button type="button" className="account-photo__button" onClick={() => picker.current?.click()} aria-label={state.photo ? 'Change photo' : 'Add a photo'}>
          <Avatar name={state.name} photo={state.photo} size={112} />
        </button>
        <div className="account-photo__actions">
          <button type="button" className="text-btn" onClick={() => picker.current?.click()}>
            {state.photo ? 'Change photo' : 'Add a photo'}
          </button>
          {state.photo && (
            <button type="button" className="text-btn text-btn--quiet" onClick={() => dispatch({ type: 'setPhoto', photo: null })}>
              Remove
            </button>
          )}
        </div>
        {photoError && (
          <p className="account-photo__error" role="alert">
            That photo couldn’t be opened. Try another one.
          </p>
        )}
        <input ref={picker} type="file" accept="image/*" hidden onChange={pickPhoto} />
      </div>

      <div className="settings">
        <div className="setting">
          <label className="setting__label" htmlFor="account-name">
            Name
          </label>
          <input
            id="account-name"
            className="options__field"
            name="name"
            value={state.name}
            placeholder="Your name…"
            autoComplete="name"
            spellCheck={false}
            onChange={(e) => dispatch({ type: 'setName', name: e.target.value })}
          />
        </div>
        <div className="setting">
          <h2 className="setting__label" id="account-gender">
            Gender
          </h2>
          <div className="gender" role="group" aria-labelledby="account-gender">
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
        <div className="setting">
          <h2 className="setting__label" id="account-build">
            Body type
          </h2>
          <BuildPicker value={state.build} onChange={(build) => dispatch({ type: 'setBuild', build })} gender={state.gender} labelledBy="account-build" />
          <p className="setting__hint">
            The closest to yours. <b>Try-On</b> dresses a model with it.
          </p>
        </div>
      </div>

      <div className="settings">
        <div className="setting">
          <h2 className="setting__label" id="account-size-system">
            Size system
          </h2>
          <Segmented
            labelledBy="account-size-system"
            options={SIZE_SYSTEMS.map((s) => ({ value: s, label: s }))}
            value={state.sizeSystem}
            onChange={(system) => dispatch({ type: 'setSizeSystem', system })}
          />
          <p className="setting__hint">
            How sizes are labelled <b>everywhere</b> in blend.
          </p>
        </div>
        <div className="setting">
          <h2 className="setting__label" id="account-top-size">
            Top size
          </h2>
          <Segmented labelledBy="account-top-size" options={sizes('top')} value={state.sizes.top} onChange={(size) => dispatch({ type: 'setSize', slot: 'top', size })} />
        </div>
        <div className="setting">
          <h2 className="setting__label" id="account-bottom-size">
            Bottom size
          </h2>
          <Segmented
            labelledBy="account-bottom-size"
            options={sizes('bottom')}
            value={state.sizes.bottom}
            onChange={(size) => dispatch({ type: 'setSize', slot: 'bottom', size })}
          />
          <p className="setting__hint">Every piece opens in these sizes.</p>
        </div>
      </div>

      {/* Accounts come in the next version: both rows say so (ComingSoon). */}
      <Group label="Account">
        <LinkRow to="/coming-soon?for=sign-out" label="Sign out" />
        <LinkRow to="/coming-soon?for=delete-account" label="Delete account" danger />
      </Group>
    </MenuPage>
  )
}

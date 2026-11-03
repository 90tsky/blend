import type { Slot } from '../../data/products'
import { SIZE_KEYS, sizeLabel } from '../../data/sizes'
import { asset } from '../../lib/asset'
import type { Build } from '../../services/tryOn'
import { useStore } from '../../state/store'
import { Icon } from '../../ui/Icon'
import { Cta } from '../../ui/primitives'
import { useTryOn } from './flow'
import { Segmented } from './Segmented'
import { Step } from './Step'

const BUILDS: { value: Build; label: string }[] = [
  { value: 'even', label: 'Even' },
  { value: 'hips', label: 'Wider hips' },
  { value: 'shoulders', label: 'Wider shoulders' },
  { value: 'middle', label: 'Wider middle' },
]

// "A model like you" (Figma Try-On · model like me 1285:10136): build and sizes, no photo needed.
// The sizes are the shopper's saved ones, so changing them here changes them everywhere.
export function Model() {
  const { build, setBuild, setRoute, go } = useTryOn()
  const { state, dispatch } = useStore()
  const sizes = (slot: Slot) => SIZE_KEYS.map((k) => ({ value: k, label: sizeLabel(slot, k, state.sizeSystem) }))

  return (
    <Step
      title="A model like you"
      subtitle="Pick the build closest to yours. We’ll dress the model in your sizes."
      note="No photo needed. We only use the build and sizes you pick."
      actions={
        <>
          <Cta
            onClick={() => {
              setRoute('model')
              go('generating')
            }}
          >
            Use this model
          </Cta>
          <Cta
            variant="secondary"
            onClick={() => {
              setRoute('photo')
              go('')
            }}
          >
            Use my photo instead
          </Cta>
        </>
      }
    >
      <div className="settings">
        <div className="setting">
          <h2 className="setting__label" id="try-on-build">
            Build
          </h2>
          <div className="builds" role="radiogroup" aria-labelledby="try-on-build">
            {BUILDS.map((b) => {
              const on = build === b.value
              return (
                <button key={b.value} type="button" role="radio" aria-checked={on} className={`build${on ? ' build--on' : ''}`} onClick={() => setBuild(b.value)}>
                  <span className="build__figure">
                    <img src={asset(`try-on/build-${b.value}.webp`)} alt="" width={72} height={149} />
                  </span>
                  <span className="build__label">{b.label}</span>
                  {on && (
                    <span className="build__check" aria-hidden="true">
                      <Icon name="check" size={16} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <p className="setting__hint">
            Only shapes the model. You can change it <b>any time</b>.
          </p>
        </div>
        <div className="setting">
          <h2 className="setting__label" id="try-on-top-size">
            Top size
          </h2>
          <Segmented labelledBy="try-on-top-size" options={sizes('top')} value={state.sizes.top} onChange={(size) => dispatch({ type: 'setSize', slot: 'top', size })} />
        </div>
        <div className="setting">
          <h2 className="setting__label" id="try-on-bottom-size">
            Bottom size
          </h2>
          <Segmented labelledBy="try-on-bottom-size" options={sizes('bottom')} value={state.sizes.bottom} onChange={(size) => dispatch({ type: 'setSize', slot: 'bottom', size })} />
          <p className="setting__hint">
            Your <b>saved</b> sizes. Change them if they’re not right.
          </p>
        </div>
      </div>
    </Step>
  )
}

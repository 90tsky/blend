import type { Slot } from '../../data/products'
import { BuildPicker } from '../../components/BuildPicker'
import { SIZE_KEYS, sizeLabel } from '../../data/sizes'
import { useStore } from '../../state/store'
import { Cta } from '../../ui/primitives'
import { useTryOn } from './flow'
import { Segmented } from './Segmented'
import { Step } from './Step'

// "A model like you" (Figma Try-On · model like me 1285:10136): build and sizes, no photo needed.
// Build and sizes are the shopper's saved ones (Menu › Account), so changing them here changes them everywhere; the
// figures are men's when Men's is chosen there.
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
          <BuildPicker value={build} onChange={setBuild} gender={state.gender} labelledBy="try-on-build" />
          <p className="setting__hint">
            Only shapes the model. It’s <b>saved</b> in your Account.
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
          <Segmented
            labelledBy="try-on-bottom-size"
            options={sizes('bottom')}
            value={state.sizes.bottom}
            onChange={(size) => dispatch({ type: 'setSize', slot: 'bottom', size })}
          />
          <p className="setting__hint">
            Your <b>saved</b> sizes. Change them if they’re not right.
          </p>
        </div>
      </div>
    </Step>
  )
}

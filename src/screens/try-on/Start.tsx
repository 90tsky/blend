import { asset } from '../../lib/asset'
import { Icon } from '../../ui/Icon'
import { Cta } from '../../ui/primitives'
import { useTryOn } from './flow'
import { Privacy, Step } from './Step'
import { usePhotoPicker } from './usePhotoPicker'

const TIPS = ['Head to toe in the frame', 'Just you, standing up', 'Good light, plain background', 'Fitted clothes, hands visible']

// "Try it on" (Figma Try-On · photo 499:9246), and the same screen when the camera is blocked (1733:10483).
// A web page can't open the phone's Settings, so OPEN SETTINGS asks for the camera again.
export function Start({ blocked = false }: { blocked?: boolean }) {
  const { setRoute, go } = useTryOn()
  const picker = usePhotoPicker()
  const useModel = () => {
    setRoute('model')
    go('model')
  }

  return (
    <Step
      title={blocked ? 'Camera access is off' : 'Try it on'}
      subtitle={
        blocked ? (
          'Turn it on in Settings to take a photo.'
        ) : (
          <>
            Choose a <b>full-body</b> photo or take one, and we’ll dress you in your outfit.
          </>
        )
      }
      note={<Privacy />}
      actions={
        blocked ? (
          <>
            <Cta onClick={() => go('camera')}>Open Settings</Cta>
            <Cta variant="secondary" onClick={picker.open}>
              Choose a photo
            </Cta>
          </>
        ) : (
          <>
            <Cta onClick={picker.open}>Choose a photo</Cta>
            <Cta variant="secondary" onClick={() => go('camera')}>
              Take a photo
            </Cta>
          </>
        )
      }
    >
      {picker.input}
      <div className="try-card">
        <div className="examples">
          <figure className="example">
            <img src={asset('try-on/example-like.webp')} alt="" width={185} height={322} />
            <figcaption>
              <span className="badge">
                <Icon name="tick" />
                Like this
              </span>
            </figcaption>
          </figure>
          <figure className="example">
            <img src={asset('try-on/example-not-like.webp')} alt="" width={185} height={322} />
            <figcaption>
              <span className="badge">
                <Icon name="cross" className="badge__no" />
                Not like this
              </span>
            </figcaption>
          </figure>
        </div>
        <ul className="tips">
          {TIPS.map((tip) => (
            <li key={tip}>
              <Icon name="tick" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
      <p className="model-link">
        No full-body photo?{' '}
        <button type="button" onClick={useModel}>
          Use a model instead
        </button>
      </p>
    </Step>
  )
}

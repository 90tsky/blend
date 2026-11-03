import { Navigate } from 'react-router'
import { Icon } from '../../ui/Icon'
import { Cta } from '../../ui/primitives'
import { useTryOn } from './flow'
import { Privacy, Step } from './Step'
import { usePhotoPicker } from './usePhotoPicker'

// The reminders under the photo, as in the Figma (they aren't checked yet: the mock can't look at the photo).
const CHECKS = ['Head to toe', 'Just you', 'Good light']

// "Looks good?" (Figma Try-On · preview 499:9289).
export function Preview() {
  const { base, photo, go } = useTryOn()
  const picker = usePhotoPicker()
  if (!photo) return <Navigate to={base} replace />

  return (
    <Step
      title="Looks good?"
      subtitle="Use this photo, or choose another one."
      fit
      note={<Privacy />}
      actions={
        <>
          <Cta onClick={() => go('generating')}>Use this photo</Cta>
          <Cta variant="secondary" onClick={picker.open}>
            Choose another photo
          </Cta>
        </>
      }
    >
      {picker.input}
      <div className="try-card try-card--photo">
        <div className="try-photo-box">
          <img className="try-photo" src={photo.url} alt="Your photo" />
        </div>
        <ul className="checks">
          {CHECKS.map((c) => (
            <li key={c} className="badge">
              <Icon name="tick" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </Step>
  )
}

import { useState } from 'react'
import { Navigate } from 'react-router'
import { productsById } from '../../data/products'
import { useStore } from '../../state/store'
import { Icon } from '../../ui/Icon'
import { Cta } from '../../ui/primitives'
import { useTryOn } from './flow'
import { PopUp } from './PopUp'
import { Step } from './Step'

// "image/jpeg" → "jpg"
const extension = (type: string) => (type.split('/')[1] ?? 'jpg').replace('jpeg', 'jpg')

// "Here’s your outfit" (Figma Try-On · result 499:9383). With the mock (the designer's decision) the photo is shown as
// it is, labelled "Demo preview", with the outfit from the change room listed under it. A real provider's render
// gets the Figma subtitle and the "AI preview" label instead.
export function Result() {
  const { base, result, photo, route, close } = useTryOn()
  const { state } = useStore()
  const [savedAt, setSavedAt] = useState(0)
  if (!result) return <Navigate to={base} replace />

  const outfit = [state.current.top, state.current.bottom].flatMap((id) => (id ? [productsById[id]] : []))
  const own = route === 'photo' && photo

  // SAVE IMAGE: download the picture (it's already on this device).
  const save = () => {
    const a = document.createElement('a')
    a.href = result.imageUrl
    a.download = `blend-outfit.${own && result.isDemo ? extension(photo.blob.type) : result.isDemo ? 'webp' : 'jpg'}`
    document.body.append(a)
    a.click()
    a.remove()
    setSavedAt(Date.now())
  }

  return (
    <Step
      title="Here’s your outfit"
      subtitle={result.isDemo ? undefined : route === 'model' ? 'An AI preview of a model like you in this outfit.' : 'An AI preview of you in this outfit.'}
      fit
      actions={
        <>
          <PopUp trigger={savedAt}>Saved to your photos</PopUp>
          <Cta onClick={save}>Save image</Cta>
          <Cta variant="secondary" onClick={close}>
            Try another outfit
          </Cta>
        </>
      }
    >
      <div className="try-card try-card--photo">
        <div className="try-photo-box">
          <img className="try-photo" src={result.imageUrl} alt={own ? 'Your photo' : ''} />
        </div>
        <p className="result__label">{result.isDemo ? 'Demo preview' : 'AI preview'}</p>
        {outfit.length > 0 && (
          <ul className="result__outfit">
            {outfit.map((p) => (
              <li key={p.id}>
                <Icon name={p.slot === 'top' ? 'glyph-top' : 'glyph-bottom'} size={12} />
                {p.brand} {p.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Step>
  )
}

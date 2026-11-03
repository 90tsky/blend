import { useEffect, useState } from 'react'
import { Garment } from '../components/Garment'
import { CameraIcon, UploadIcon } from '../components/icons'
import { Sheet } from '../components/Sheet'
import { productsById } from '../data/products'
import { preparePhoto, requestTryOn, TryOnUnavailableError } from '../services/tryOn'
import { useStore } from '../state/store'
import './sheets.css'

type Step = { name: 'pick' } | { name: 'preview'; photo: Blob; url: string } | { name: 'working'; url: string } | { name: 'result'; url: string; resultUrl: string } | { name: 'error'; message: string; unavailable?: boolean; url?: string; photo?: Blob }

export function TryOnSheet() {
  const { state, dispatch } = useStore()
  const [step, setStep] = useState<Step>({ name: 'pick' })
  const open = state.sheet === 'tryOn'
  const top = state.current.top ? productsById[state.current.top] : undefined
  const bottom = state.current.bottom ? productsById[state.current.bottom] : undefined

  // Start fresh each time the sheet opens.
  useEffect(() => {
    if (open) setStep({ name: 'pick' })
  }, [open])

  const close = () => dispatch({ type: 'openSheet', sheet: null })

  const onFile = async (file: File | undefined) => {
    if (!file) return
    try {
      const photo = await preparePhoto(file)
      setStep({ name: 'preview', photo, url: URL.createObjectURL(photo) })
    } catch (err) {
      console.error('Try it on: could not read photo', err)
      setStep({ name: 'error', message: 'We couldn’t read that photo. Try a JPG or PNG.' })
    }
  }

  const generate = async (photo: Blob, url: string) => {
    setStep({ name: 'working', url })
    try {
      const resultUrl = await requestTryOn(photo, { top, bottom })
      setStep({ name: 'result', url, resultUrl })
    } catch (err) {
      if (err instanceof TryOnUnavailableError) {
        setStep({ name: 'error', unavailable: true, url, photo, message: 'We’re still setting this up. Check back soon.' })
      } else {
        // Keep the technical detail for developers; shoppers get one friendly line.
        console.error('Try it on failed', err)
        setStep({ name: 'error', url, photo, message: 'We couldn’t dress you this time. Try again in a moment.' })
      }
    }
  }

  const outfit = (
    <div className="tryon-outfit" aria-label="Outfit to try on">
      {top && <Garment product={top} side="front" className="tryon-outfit__item" />}
      {bottom && <Garment product={bottom} side="front" className="tryon-outfit__item" />}
      <p className="tryon-outfit__names">
        {[top, bottom]
          .filter(Boolean)
          .map((p) => p!.name)
          .join(' + ')}
      </p>
    </div>
  )

  return (
    <Sheet open={open} onClose={close} title="Try it on" subtitle="See this outfit on you">
      {step.name === 'pick' && (
        <div className="tryon">
          {outfit}
          <div className="tryon-actions">
            <label className="pill pill--dark pill--block tryon-file">
              <CameraIcon size={20} />
              Take a photo
              <input type="file" accept="image/*" capture="user" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
            <label className="pill pill--outline pill--block tryon-file">
              <UploadIcon size={20} />
              Upload a photo
              <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
          </div>
          <ul className="tryon-tips">
            <li>Full body, standing straight, arms slightly away from your sides</li>
            <li>Plain background and even light work best</li>
            <li>Your photo is only used to create this preview</li>
          </ul>
        </div>
      )}

      {step.name === 'preview' && (
        <div className="tryon">
          <img className="tryon-photo" src={step.url} alt="Your photo" />
          {outfit}
          <div className="tryon-actions">
            <button className="pill pill--dark pill--block" onClick={() => generate(step.photo, step.url)}>
              Use this photo
            </button>
            <button className="pill pill--light pill--block" onClick={() => setStep({ name: 'pick' })}>
              Choose another photo
            </button>
          </div>
        </div>
      )}

      {step.name === 'working' && (
        <div className="tryon">
          <div className="tryon-photo tryon-photo--working">
            <img src={step.url} alt="" />
            <span className="tryon-scan" />
          </div>
          <p className="tryon-status" role="status">
            Dressing you… This can take up to a minute.
          </p>
        </div>
      )}

      {step.name === 'result' && (
        <div className="tryon">
          <img className="tryon-photo" src={step.resultUrl} alt="You wearing the selected outfit" />
          <div className="tryon-actions">
            <a className="pill pill--dark pill--block" href={step.resultUrl} download="blend-try-on.png">
              Save image
            </a>
            <button className="pill pill--light pill--block" onClick={() => setStep({ name: 'pick' })}>
              Try another photo
            </button>
          </div>
        </div>
      )}

      {step.name === 'error' && (
        <div className="tryon">
          {step.url && <img className="tryon-photo tryon-photo--dim" src={step.url} alt="" />}
          <div className="empty-state">
            <p className="empty-state__title">{step.unavailable ? 'Coming soon' : 'That didn’t work'}</p>
            <p className="empty-state__text">{step.message}</p>
            {!step.unavailable && step.photo && step.url && (
              <button className="pill pill--dark" onClick={() => generate(step.photo!, step.url!)}>
                Try again
              </button>
            )}
            <button className="pill pill--light" onClick={() => setStep({ name: 'pick' })}>
              Back
            </button>
          </div>
        </div>
      )}
    </Sheet>
  )
}

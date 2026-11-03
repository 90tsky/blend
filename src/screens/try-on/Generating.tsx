import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { productsById } from '../../data/products'
import { DEMO_PHOTO, MOCK_DELAY_MS, tryOn } from '../../services/tryOn'
import { useStore } from '../../state/store'
import { Cta } from '../../ui/primitives'
import { useTryOn } from './flow'
import { Step } from './Step'

// "Dressing you…" (Figma Try-On · generating 499:9332): asks the provider for the preview, then shows the result.
// If the provider fails: "That didn’t work" (Figma Try-On · generation failed 1229:112).
export function Generating() {
  const { base, photo, route, build, setResult, go } = useTryOn()
  const { state } = useStore()
  const [failed, setFailed] = useState(false)
  const model = route === 'model'
  const missing = !model && !photo

  useEffect(() => {
    if (missing) return
    const ctrl = new AbortController()
    const piece = (id: string | null) => (id ? productsById[id] : undefined)
    tryOn(
      {
        photo: model ? null : photo!.blob,
        photoUrl: model ? null : photo!.url,
        build,
        sizes: state.sizes,
        outfit: { top: piece(state.current.top), bottom: piece(state.current.bottom) },
      },
      ctrl.signal,
    )
      .then((result) => {
        setResult(result)
        go('result')
      })
      .catch(() => !ctrl.signal.aborted && setFailed(true))
    return () => ctrl.abort()
    // Runs once per visit to this step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (missing) return <Navigate to={base} replace />

  const title = failed ? 'That didn’t work' : model ? 'Dressing your model…' : 'Dressing you…'
  return (
    <Step
      title={title}
      subtitle={failed ? 'We couldn’t make your preview this time. Try again in a moment.' : 'This can take up to a minute.'}
      fit
      actions={
        failed ? (
          <Cta onClick={() => go(model ? 'model' : '')}>{model ? 'Change the model' : 'Choose another photo'}</Cta>
        ) : (
          <div className="progress" role="progressbar" aria-label={title}>
            <motion.span className="progress__fill" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: MOCK_DELAY_MS / 1000, ease: 'linear' }} />
          </div>
        )
      }
    >
      <div className="try-card try-card--photo">
        <div className="try-photo-box">
          <img className={`try-photo${failed ? '' : ' try-photo--waiting'}`} src={model ? DEMO_PHOTO : photo!.url} alt="" />
        </div>
      </div>
    </Step>
  )
}

import { AnimatePresence, motion, type Transition } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router'
import type { Build, TryOnResult } from '../services/tryOn'
import { Camera } from './try-on/Camera'
import { FlowContext, type Flow, type Photo, type Route as TryOnRoute } from './try-on/flow'
import { Generating } from './try-on/Generating'
import { Model } from './try-on/Model'
import { Preview } from './try-on/Preview'
import { Result } from './try-on/Result'
import { Start } from './try-on/Start'
import './try-on/try-on.css'

const RISE: Transition = { duration: 0.3, ease: 'easeOut' }
const DROP: Transition = { duration: 0.25, ease: 'easeIn' }
const FADE: Transition = { duration: 0.25, ease: 'easeInOut' }

// Try-On (/change-room/try-on/*) is a sheet: it rises over the change room (300ms ease-out), its steps fade into each
// other (250ms), and ✕ slides it down (250ms ease-in) back to where it was opened. Steps replace each other in the
// history, so the whole flow is one entry and one step back leaves it. The photo stays in memory on this device only.
export function TryOn() {
  const navigate = useNavigate()
  const location = useLocation()
  // Try it on, read before the first step moves focus to its title, so focus can go back to it afterwards.
  const [opener] = useState(() => (document.activeElement instanceof HTMLElement ? document.activeElement : null))
  const [photo, setPhotoState] = useState<Photo | null>(null)
  const [route, setRoute] = useState<TryOnRoute>('photo')
  const [build, setBuild] = useState<Build>('even')
  const [result, setResult] = useState<TryOnResult | null>(null)
  const [closing, setClosing] = useState(false)
  const at = location.pathname.indexOf('/try-on')
  const base = at >= 0 ? location.pathname.slice(0, at + '/try-on'.length) : '/try-on'

  // Free each photo and result once it's replaced or Try-On closes.
  useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo.url)
    },
    [photo],
  )
  useEffect(() => () => result?.revoke?.(), [result])

  // While open, the change room behind is inert (the sheet is portalled outside it).
  useEffect(() => {
    const root = document.getElementById('root')
    root?.setAttribute('inert', '')
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setClosing(true)
    window.addEventListener('keydown', onKey)
    return () => {
      root?.removeAttribute('inert')
      window.removeEventListener('keydown', onKey)
      opener?.focus({ preventScroll: true })
    }
  }, [opener])

  const flow = useMemo<Flow>(
    () => ({
      base,
      photo,
      setPhoto: (blob) => setPhotoState(blob ? { blob, url: URL.createObjectURL(blob) } : null),
      route,
      setRoute,
      build,
      setBuild,
      result,
      setResult,
      go: (step) => navigate(step ? `${base}/${step}` : base, { replace: true }),
      close: () => setClosing(true),
    }),
    [base, photo, route, build, result, navigate],
  )

  const leave = () => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate('/change-room', { replace: true }))

  return createPortal(
    <FlowContext.Provider value={flow}>
      <motion.div
        className="try-on"
        role="dialog"
        aria-modal="true"
        aria-label="Try it on"
        initial={{ y: '100%' }}
        animate={{ y: closing ? '100%' : 0 }}
        transition={closing ? DROP : RISE}
        onAnimationComplete={() => closing && leave()}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={location.pathname} className="try-on__step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={FADE}>
            <Routes location={location}>
              <Route index element={<Start />} />
              <Route path="camera" element={<Camera />} />
              <Route path="camera-off" element={<Start blocked />} />
              <Route path="preview" element={<Preview />} />
              <Route path="model" element={<Model />} />
              <Route path="generating" element={<Generating />} />
              <Route path="result" element={<Result />} />
              <Route path="*" element={<Navigate to={base} replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </FlowContext.Provider>,
    document.body,
  )
}

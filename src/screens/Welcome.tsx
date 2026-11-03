import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { animate, motion, useReducedMotion } from 'motion/react'
import { useStore } from '../state/store'
import { Logo } from '../ui/Logo'
import { Cta } from '../ui/primitives'
import './Welcome.css'

// The big logo holds for a moment, then glides and shrinks into the top bar's logo spot; the words and buttons follow.
const HOLD_MS = 400
const GLIDE = { duration: 0.7, ease: [0.65, 0, 0.35, 1] as [number, number, number, number] }

// Figma Welcome (578:9421). Shown once: a shopper who has been past it goes straight to Events.
export function Welcome() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  // Read on arrival only, so leaving (which sets `welcomed`) doesn't redirect half-way.
  const [arrivedWelcomed] = useState(state.welcomed)
  // With reduced motion the logo simply starts in the top bar.
  const [settled, setSettled] = useState(!!reduceMotion)
  const bigLogo = useRef<HTMLDivElement>(null)
  const barLogo = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (settled) return
    let glide: ReturnType<typeof animate> | undefined
    const timer = window.setTimeout(() => {
      const from = bigLogo.current
      const to = barLogo.current
      if (!from || !to) return setSettled(true)
      const a = from.getBoundingClientRect()
      const b = to.getBoundingClientRect()
      glide = animate(from, { x: b.left - a.left, y: b.top - a.top, scale: b.height / a.height }, GLIDE)
      glide.then(() => setSettled(true))
    }, HOLD_MS)
    return () => {
      window.clearTimeout(timer)
      glide?.stop()
    }
  }, [settled])

  if (arrivedWelcomed) return <Navigate to="/events" replace />

  const leave = (to: string) => {
    dispatch({ type: 'setWelcomed' })
    navigate(to)
  }

  const fadeIn = (delay: number) => ({
    initial: false as const,
    animate: { opacity: settled ? 1 : 0 },
    transition: { duration: 0.3, ease: 'easeOut' as const, delay: settled ? delay : 0 },
  })

  return (
    <main className={`welcome${settled ? '' : ' welcome--intro'}`}>
      {/* The top bar of the account screens: logo only. The big logo lands exactly on this one. */}
      <header className="top-bar top-bar--plain">
        <Logo ref={barLogo} className="top-bar__logo welcome__bar-logo" />
      </header>

      <div className="welcome__middle">
        {!settled && (
          <div ref={bigLogo} className="welcome__logo" aria-hidden="true">
            <Logo />
          </div>
        )}
        <motion.p className="welcome__intro" {...fadeIn(0)}>
          Explore our carefully curated collection of sustainable fashion pieces, designed to elevate your wardrobe while
          minimising your environmental impact.
        </motion.p>
      </div>

      <motion.div className="welcome__actions" {...fadeIn(0.1)}>
        <button type="button" className="welcome__guest" onClick={() => leave('/events')}>
          Continue as guest
        </button>
        <Cta onClick={() => leave('/coming-soon')}>Sign in</Cta>
        <Cta variant="secondary" onClick={() => leave('/coming-soon')}>
          Create account
        </Cta>
      </motion.div>
    </main>
  )
}

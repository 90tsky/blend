import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Cta, TopBar } from '../ui/primitives'
import './OrderPlaced.css'

// Order placed (Figma 579:10250): the shared success check, the order number, then TRACK ORDER / KEEP SHOPPING.
export function OrderPlaced() {
  const navigate = useNavigate()
  const title = useRef<HTMLHeadingElement>(null)
  useEffect(() => title.current?.focus(), [])

  return (
    <main className="screen screen--below-top-bar order-placed">
      <TopBar />
      <div className="order-placed__body">
        <SuccessCheck />
        <h1 ref={title} tabIndex={-1} className="order-placed__title">
          Order placed
        </h1>
        <p className="order-placed__text">Order #BL-20481 is being packed. We’ll let you know when it’s on its way.</p>
      </div>
      <div className="order-placed__actions">
        {/* Track order isn't built yet; it opens the shared "coming soon" screen. */}
        <Cta onClick={() => navigate('/coming-soon')}>Track order</Cta>
        <Cta variant="secondary" onClick={() => navigate('/events')}>
          Keep shopping
        </Cta>
      </div>
    </main>
  )
}

// success-check: a dashed ring with a tick on color/accent-strong, 72 × 72.
function SuccessCheck() {
  return (
    <svg className="success-check" width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r="34" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="7 5" pathLength={216} />
      <path d="M21.5 37.5 32 47.5 52.5 27" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

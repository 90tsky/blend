import { useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAnimate } from 'motion/react'
import { formatAmount } from '../lib/format'
import { useBag, useStore } from '../state/store'
import './CheckoutButton.css'

const GAP = 8 // space/8 between CHECKOUT and the total

// CHECKOUT in the bottom bar (Figma cart-label 810:124 over the cta). Empty: light and inactive, "CHECKOUT".
// With pieces: black, "CHECKOUT 42.00 EUR". Turning on (0.3s ease-out) the label slides left while the total
// fades in beside it and the button goes black; turning off (0.2s ease-in-out) reverses it. The label and total
// move as one row, so they never overlap. At rest neither state needs a measurement, so a new screen never flashes.
export function CheckoutButton() {
  const { state, dispatch } = useStore()
  const { items, total } = useBag()
  const navigate = useNavigate()
  const on = items.length > 0
  const [scope, animate] = useAnimate<HTMLSpanElement>()
  const priceRef = useRef<HTMLSpanElement>(null)
  const [leaving, setLeaving] = useState(false)
  const wasOn = useRef(on)
  const onRef = useRef(on)
  onRef.current = on
  const shown = useRef(total) // the total to fade out with when the last piece leaves
  if (on) shown.current = total

  useLayoutEffect(() => {
    if (wasOn.current === on) return
    wasOn.current = on
    const row = scope.current
    const price = priceRef.current
    if (!row || !price) return
    const shift = (price.offsetWidth + GAP) / 2 // where the label sits when it's alone, centred
    if (on) {
      setLeaving(false)
      row.style.transform = `translateX(${shift}px)`
      price.style.opacity = '0'
      animate(row, { x: [shift, 0] }, { duration: 0.3, ease: 'easeOut' })
      animate(price, { opacity: [0, 1] }, { duration: 0.3, ease: 'easeOut' })
    } else {
      setLeaving(true) // keep the total in the row while it fades
      animate(price, { opacity: [1, 0] }, { duration: 0.2, ease: 'easeInOut' })
      animate(row, { x: [0, shift] }, { duration: 0.2, ease: 'easeInOut' }).then(() => {
        if (!onRef.current) setLeaving(false)
      })
    }
  }, [on, animate, scope])

  // Settled off: the total leaves the row and layout centres the label, so the slide offset goes in the same frame.
  useLayoutEffect(() => {
    if (!on && !leaving && scope.current) scope.current.style.transform = 'none'
  }, [on, leaving, scope])

  return (
    <button
      type="button"
      className={`checkout-btn${on ? ' is-on' : ''}`}
      aria-disabled={!on || undefined}
      onClick={() => {
        // Empty: the toast "Add pieces to check out · Add more".
        if (!on) return dispatch({ type: 'toast', toast: { kind: 'checkout-empty' } })
        dispatch({ type: 'toast', toast: null })
        navigate('/checkout')
      }}
    >
      <span ref={scope} className="checkout-btn__row">
        <span>Checkout</span>
        <span ref={priceRef} className={`checkout-btn__price${on || leaving ? '' : ' is-out'}`} aria-hidden={!on || undefined}>
          <span className="checkout-btn__amount">{formatAmount(shown.current, state.currency)}</span>
          <span className="checkout-btn__currency">{state.currency}</span>
        </span>
      </span>
    </button>
  )
}

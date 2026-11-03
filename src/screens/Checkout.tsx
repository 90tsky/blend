import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { formatAmount } from '../lib/format'
import { useBag, useStore } from '../state/store'
import { Cta, Header, TopBar } from '../ui/primitives'
import './Checkout.css'

const PAYING_MS = 1500 // demo: no real payment

// Checkout (Figma 579:10097): everything in the change room, where it goes and how it's paid.
// PAY turns into "Paying…" (Checkout · paying 1218:767) with ← and the menu locked, then Order placed.
export function Checkout() {
  const { state, dispatch } = useStore()
  const { items, total } = useBag()
  const navigate = useNavigate()
  const [paying, setPaying] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Nothing to buy (opened directly, or the room was emptied elsewhere): back to the change room.
  if (items.length === 0 && !paying) return <Navigate to="/change-room" replace />

  const back = () => {
    if (paying) return
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1)
    else navigate('/change-room')
  }

  const pay = () => {
    if (paying) return
    setPaying(true)
    timer.current = window.setTimeout(() => {
      navigate('/order-placed', { replace: true })
      dispatch({ type: 'clearBag' })
    }, PAYING_MS)
  }

  return (
    <main className={`screen screen--below-top-bar checkout${paying ? ' checkout--paying' : ''}`} aria-busy={paying || undefined}>
      <div className="checkout__top" inert={paying}>
        <TopBar />
      </div>
      <Header title="Checkout" subtitle="Everything in your change room." onLead={back} />

      <div className="checkout__content">
        <ul className="checkout__items" aria-label="Pieces">
          {items.map((p) => (
            <li key={p.id} className="checkout-item">
              <span className="checkout-item__plate">
                <img src={p.images.front.src} width={p.images.front.width} height={p.images.front.height} alt="" loading="lazy" decoding="async" />
              </span>
              <p className="checkout-item__name">
                {p.brand} {p.name}
              </p>
              <p className="checkout-item__price">
                {formatAmount(p.price, state.currency)} {state.currency}
              </p>
            </li>
          ))}
        </ul>

        <section className="checkout-section" aria-labelledby="deliver-to">
          <h2 id="deliver-to" className="checkout-section__label">
            Deliver to
          </h2>
          <div className="checkout-card">
            <p className="checkout-card__text">
              <span className="checkout-card__title">Home</span>
              <span className="checkout-card__line">ul. Shipka 34, 1504 Sofia</span>
              <span className="checkout-card__line">
                <strong>Free</strong> delivery · arrives Thursday
              </span>
            </p>
            {/* Demo: one saved address, so Change does nothing yet (the Delivery address screen isn't built). */}
            <button type="button" className="checkout-card__change" disabled={paying} aria-label="Change delivery address">
              Change
            </button>
          </div>
        </section>

        <section className="checkout-section" aria-labelledby="pay-with">
          <h2 id="pay-with" className="checkout-section__label">
            Pay with
          </h2>
          <div className="checkout-card">
            <p className="checkout-card__text">
              <span className="checkout-card__title">Visa •••• 4242</span>
              <span className="checkout-card__line">Expires 08/28</span>
            </p>
            <button type="button" className="checkout-card__change" disabled={paying} aria-label="Change payment method">
              Change
            </button>
          </div>
        </section>
      </div>

      <div className="checkout__pay">
        {paying && (
          <p className="checkout__note" role="status">
            Keep this screen open while we confirm your payment.
          </p>
        )}
        {paying ? (
          <Cta variant="secondary" className="checkout__paying" aria-disabled="true">
            <svg className="checkout__spinner" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10 3a7 7 0 1 1-6.06 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Paying…
          </Cta>
        ) : (
          <Cta onClick={pay}>
            <span>Pay</span>
            <span className="cta__amount">{formatAmount(total, state.currency)}</span>
            <span>{state.currency}</span>
          </Cta>
        )}
      </div>
    </main>
  )
}

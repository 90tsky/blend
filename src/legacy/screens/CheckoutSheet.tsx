import { useEffect, useState } from 'react'
import { Garment } from '../components/Garment'
import { CloseIcon, LeafIcon } from '../components/icons'
import { Sheet } from '../components/Sheet'
import { formatPrice } from '../data/products'
import { useBag, useSnapshot, useStore } from '../state/store'
import './sheets.css'

export function CheckoutSheet() {
  const { state, dispatch } = useStore()
  const { items, tops, bottoms, total } = useBag()
  const before = useSnapshot()
  const [placed, setPlaced] = useState<{ count: number; total: number } | null>(null)
  const open = state.sheet === 'checkout'
  const outfits = tops.length * bottoms.length

  useEffect(() => {
    if (open) setPlaced(null)
  }, [open])

  const close = () => dispatch({ type: 'openSheet', sheet: null })

  if (placed) {
    return (
      <Sheet open={open} onClose={close} title="Order placed">
        <div className="empty-state">
          <span className="success-mark">
            <LeafIcon size={28} />
          </span>
          <p className="empty-state__title">Thank you</p>
          <p className="empty-state__text">
            {placed.count} {placed.count === 1 ? 'piece' : 'pieces'} for {formatPrice(placed.total)} EUR. This is a demo store, so no payment was taken and nothing will be delivered.
          </p>
          <button className="pill pill--dark" onClick={close}>
            Done
          </button>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet
      open={open}
      onClose={close}
      title="Checkout"
      subtitle={items.length ? `${items.length} ${items.length === 1 ? 'piece' : 'pieces'} from your change room` : undefined}
      footer={
        items.length > 0 && (
          <>
            <dl className="totals">
              <dt>Subtotal</dt>
              <dd>{formatPrice(total)} EUR</dd>
              <dt>Delivery</dt>
              <dd>Free</dd>
              <dt className="totals__grand">Total</dt>
              <dd className="totals__grand">{formatPrice(total)} EUR</dd>
            </dl>
            <button
              className="pill pill--dark pill--block"
              onClick={() => {
                setPlaced({ count: items.length, total })
                dispatch({ type: 'clearBag' })
              }}
            >
              Place order
            </button>
          </>
        )
      }
    >
      {items.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">Your change room is empty</p>
          <p className="empty-state__text">Add pieces from Events to your change room, mix them, then come back here.</p>
        </div>
      ) : (
        <>
          {outfits > 1 && (
            <p className="capsule-note">
              <LeafIcon size={18} /> These {items.length} pieces make <strong>{outfits} outfits</strong>.
            </p>
          )}
          <ul className="cart-list">
            {items.map((p) => (
              <li key={p.id} className="cart-item">
                <span className="cart-item__thumb">
                  <Garment product={p} side="front" />
                </span>
                <span className="cart-item__info">
                  <span className="cart-item__name">
                    <b>{p.brand}</b> {p.name}
                  </span>
                  <span className="cart-item__material">{p.material}</span>
                  <span className="cart-item__price">{formatPrice(p.price)} EUR</span>
                </span>
                <button
                  className="cart-item__remove"
                  onClick={() => {
                    dispatch({ type: 'remove', id: p.id })
                    dispatch({ type: 'toast', toast: { message: `Removed ${p.name}`, undo: before } })
                  }}
                  aria-label={`Remove ${p.name} from change room`}
                >
                  <CloseIcon size={18} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Sheet>
  )
}

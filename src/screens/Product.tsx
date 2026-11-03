import { useCallback, useLayoutEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router'
import { GarmentPhoto } from '../components/ProductCard'
import { SizeGuide } from '../components/SizeGuide'
import { SizePicker } from '../components/SizePicker'
import { eventsFor } from '../data/events'
import { productsById, type Product as Piece } from '../data/products'
import { formatPrice } from '../lib/format'
import { useBagActions, useStore } from '../state/store'
import { Cta, Header, TopBar } from '../ui/primitives'
import './Product.css'

// "Wear it with": up to 3 pieces from the other slot that share an event with this one, in Events order.
function wearItWith(piece: Piece) {
  const seen = new Set<string>()
  return eventsFor(piece.id)
    .flatMap((e) => e.productIds)
    .filter((id) => productsById[id].slot !== piece.slot && !seen.has(id) && !!seen.add(id))
    .slice(0, 3)
    .map((id) => productsById[id])
}

// Figma Product (600:1436, product-page 598:1587): the piece's name as the header, the photo (tap to turn around),
// price and details, the size picker with the Size guide, "Wear it with", and the add / remove button.
export function Product() {
  const { id = '' } = useParams()
  const piece = productsById[id]
  const { state, dispatch } = useStore()
  const actions = useBagActions()
  const navigate = useNavigate()
  const location = useLocation()
  const [guideOpen, setGuideOpen] = useState(false)
  const closeGuide = useCallback(() => setGuideOpen(false), [])

  // A piece always opens at its top (the list behind keeps its own place).
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!piece) return <Navigate to="/events" replace />

  const added = state.bag.includes(piece.id)
  const details = [piece.brand, piece.material, eventsFor(piece.id).map((e) => e.title).join(', ')].join(' · ')
  const back = () => (location.key === 'default' ? navigate('/events', { replace: true }) : navigate(-1))

  return (
    <main className="screen screen--below-top-bar product">
      <TopBar />
      <Header title={piece.name} onLead={back} />

      <div className="product__content">
        <button type="button" className="product__photo" onClick={() => dispatch({ type: 'rotate' })}>
          <GarmentPhoto product={piece} side={state.side} className="product__garment" eager />
          <span className="product__photo-hint">Tap to turn around</span>
        </button>

        <div className="product__info">
          <p className="product__price">{formatPrice(piece.price, state.currency)}</p>
          <p className="product__details">{details}</p>
        </div>

        <section className="product__group" aria-labelledby="product-size">
          <div className="product__size-head">
            <h2 id="product-size" className="product__label">
              Size
            </h2>
            <button type="button" className="product__guide" onClick={() => setGuideOpen(true)}>
              Size guide
            </button>
          </div>
          <SizePicker slot={piece.slot} labelledBy="product-size" />
        </section>

        <section className="product__group" aria-labelledby="product-pairs">
          <h2 id="product-pairs" className="product__label">
            Wear it with
          </h2>
          <div className="product__pairs">
            {wearItWith(piece).map((pair) => (
              <Link
                key={pair.id}
                className="pair-card"
                to={`/product/${pair.id}`}
                replace
                onClick={() => dispatch({ type: 'toast', toast: null })}
              >
                <span className="pair-card__photo">
                  <GarmentPhoto product={pair} side={state.side} className="pair-card__garment" decorative />
                </span>
                <span className="pair-card__name">{pair.name}</span>
                <span className="pair-card__price">{formatPrice(pair.price, state.currency)}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="product__cta">
        <Cta variant={added ? 'secondary' : 'primary'} onClick={() => actions.toggle(piece.id)}>
          {added ? 'Remove from change room' : 'Add to change room'}
        </Cta>
      </div>

      <SizeGuide open={guideOpen} onClose={closeGuide} />
    </main>
  )
}

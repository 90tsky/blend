import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router'
import type { Product, Side } from '../data/products'
import { formatPrice } from '../lib/format'
import { useBagActions, useStore } from '../state/store'
import './ProductCard.css'

// Figma product-card (1132:61): the garment on its photo plate, brand + name (2 lines at most), the price and the
// +/✓ add toggle. Tapping the card opens the piece; the toggle sits above the card's link so it only adds or removes.
export function ProductCard({ product }: { product: Product }) {
  const { state } = useStore()
  const actions = useBagActions()
  const added = state.bag.includes(product.id)

  return (
    <article className="product-card">
      <div className="product-card__plate">
        <GarmentPhoto product={product} side={state.side} className="product-card__garment" decorative />
      </div>
      <div className="product-card__info">
        <h3 className="product-card__name">
          <Link className="product-card__link" to={`/product/${product.id}`}>
            {product.brand} {product.name}
          </Link>
        </h3>
        <div className="product-card__price-row">
          <p className="product-card__price">{formatPrice(product.price, state.currency)}</p>
          <AddToggle added={added} name={product.name} onToggle={() => actions.toggle(product.id)} />
        </div>
      </div>
    </article>
  )
}

// The two lines of the + slide into the two strokes of the ✓ (24 box, round ends).
const PLUS = ['M6 12L18 12', 'M12 18L12 6']
const CHECK = ['M6 11.7L9.6 15.3', 'M9.6 15.3L18 8.7']

type AddToggleProps = { added: boolean; name: string; onToggle: () => void }

// Figma add-toggle (325:7407): a black + circle that morphs into a light ✓ with an outline (0.2s ease-out), and back.
// It follows the change room, so Undo and removals elsewhere animate it too. A 48 tap area round the 24 circle.
export function AddToggle({ added, name, onToggle }: AddToggleProps) {
  const reduceMotion = useReducedMotion()
  const lines = added ? CHECK : PLUS
  return (
    <button
      type="button"
      className={`add-toggle${added ? ' is-added' : ''}`}
      aria-pressed={added}
      aria-label={added ? `Remove ${name} from change room` : `Add ${name} to change room`}
      onClick={onToggle}
    >
      <svg className="add-toggle__icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="add-toggle__circle" cx="12" cy="12" r="11" />
        {lines.map((d, i) => (
          <motion.path
            key={i}
            className="add-toggle__line"
            initial={false}
            animate={{ d }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
          />
        ))}
      </svg>
    </button>
  )
}

type GarmentPhotoProps = { product: Product; side: Side; className?: string; eager?: boolean; decorative?: boolean }

// A garment photo, fitted inside its box. Turn around flips it: the old side turns away and the new one turns in.
export function GarmentPhoto({ product, side, className = '', eager = false, decorative = false }: GarmentPhotoProps) {
  const img = product.images[side]
  return (
    <span className={`garment-photo ${className}`}>
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={side}
          className="garment-photo__img"
          src={img.src}
          width={img.width}
          height={img.height}
          alt={decorative ? '' : `${product.name}, ${side} view`}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          style={{ transformPerspective: 800 }}
          initial={{ rotateY: -90 }}
          animate={{ rotateY: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
          exit={{ rotateY: 90, transition: { duration: 0.2, ease: 'easeIn' } }}
        />
      </AnimatePresence>
    </span>
  )
}

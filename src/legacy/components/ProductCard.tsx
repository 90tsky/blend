import { formatPrice, type Product } from '../data/products'
import { useSnapshot, useStore } from '../state/store'
import { Garment } from './Garment'
import { CheckIcon, PlusIcon } from './icons'
import './ProductCard.css'

export function ProductCard({ product }: { product: Product }) {
  const { state, dispatch } = useStore()
  const before = useSnapshot()
  const inBag = state.bag.includes(product.id)

  const toggle = () => {
    if (inBag) {
      dispatch({ type: 'remove', id: product.id })
      dispatch({ type: 'toast', toast: { message: `Removed ${product.name}`, undo: before } })
    } else {
      dispatch({ type: 'add', id: product.id })
      dispatch({ type: 'toast', toast: { message: 'Added to change room', view: true, undo: before } })
    }
  }

  return (
    <article className="product-card">
      <div className="product-card__media">
        <Garment product={product} side={state.side} />
      </div>
      <div className="product-card__info">
        <h3 className="product-card__name">
          <span className="product-card__brand">{product.brand}</span> {product.name}
        </h3>
        <div className="product-card__row">
          <p className="product-card__price">{formatPrice(product.price)} EUR</p>
          <button
            className={`add-btn ${inBag ? 'is-added' : ''}`}
            onClick={toggle}
            aria-pressed={inBag}
            aria-label={inBag ? `Remove ${product.name} from change room` : `Add ${product.name} to change room`}
          >
            {inBag ? <CheckIcon size={18} strokeWidth={2} /> : <PlusIcon size={20} strokeWidth={1.8} />}
          </button>
        </div>
      </div>
    </article>
  )
}

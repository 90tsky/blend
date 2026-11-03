import type { Product } from '../../data/products'
import { formatAmount, type Currency } from '../../lib/format'
import { Icon } from '../../ui/Icon'

// The slot chip (Figma 963:5087): the current piece's price and ✕, at the bottom right of its carousel.
export function PriceChip({ product, currency, onRemove }: { product: Product; currency: Currency; onRemove: () => void }) {
  return (
    <div className="cr-chip">
      <p className="cr-chip__price">
        <span className="cr-chip__amount">{formatAmount(product.price, currency)}</span>
        <span className="cr-chip__currency">{currency}</span>
      </p>
      <button type="button" className="cr-chip__remove" aria-label={`Remove ${product.name} from change room`} onClick={onRemove}>
        <Icon name="close" />
      </button>
    </div>
  )
}

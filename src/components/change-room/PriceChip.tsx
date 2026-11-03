import { motion } from 'motion/react'
import type { Product } from '../../data/products'
import { formatAmount, type Currency } from '../../lib/format'
import { Icon } from '../../ui/Icon'
import { SLIDE } from './motion'

const OUT = 136 // past the screen edge: 112 wide, 12 in, and its shadow

type Props = { product: Product; currency: Currency; onRemove: () => void; enter?: boolean }

// The slot chip (Figma 963:5087): the current piece's price and ✕, at the bottom right of its carousel.
// It slides in from the side when a slot gets its first piece, and out (its exit) when the last one goes.
export function PriceChip({ product, currency, onRemove, enter = false }: Props) {
  return (
    <motion.div className="cr-chip" initial={enter ? { x: OUT } : false} animate={{ x: 0 }} exit={{ x: OUT }} transition={SLIDE}>
      <p className="cr-chip__price">
        <span className="cr-chip__amount">{formatAmount(product.price, currency)}</span>
        <span className="cr-chip__currency">{currency}</span>
      </p>
      <button type="button" className="cr-chip__remove" aria-label={`Remove ${product.name} from change room`} onClick={onRemove}>
        <Icon name="close" />
      </button>
    </motion.div>
  )
}

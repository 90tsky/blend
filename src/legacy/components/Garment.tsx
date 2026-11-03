import type { CSSProperties } from 'react'
import type { Product, Side } from '../data/products'
import './Garment.css'

type Props = {
  product: Product
  side: Side
  className?: string
  eager?: boolean
  style?: CSSProperties
}

// A garment photo that flips when the side changes (Rotate button).
export function Garment({ product, side, className = '', eager = false, style }: Props) {
  const img = product.images[side]
  return (
    <img
      key={side} // remount on rotate so the flip animation replays
      className={`garment ${className}`}
      style={style}
      src={img.src}
      width={img.width}
      height={img.height}
      alt={`${product.name}, ${side} view`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  )
}

import { useEffect, useRef, type CSSProperties } from 'react'
import type { Occasion } from '../data/occasions'
import { productsById } from '../data/products'
import { useStore } from '../state/store'
import { ChevronDownIcon } from './icons'
import { ProductCard } from './ProductCard'
import './OccasionSection.css'

type Props = {
  occasion: Occasion
  open: boolean
  onToggle: () => void
}

export function OccasionSection({ occasion, open, onToggle }: Props) {
  const { state } = useStore()
  const sectionRef = useRef<HTMLElement>(null)
  const wasOpen = useRef(open)

  // When a section opens (not on first load), bring its banner to the top of the list.
  useEffect(() => {
    if (open && !wasOpen.current) sectionRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    wasOpen.current = open
  }, [open])

  const items = occasion.productIds.map((id) => productsById[id])
  const picked = items.filter((p) => state.bag.includes(p.id))
  const pickedTops = picked.filter((p) => p.slot === 'top').length
  const pickedBottoms = picked.length - pickedTops
  const gridId = `occasion-${occasion.id}`

  const titleStyle = {
    fontFamily: occasion.font.family,
    fontWeight: occasion.font.weight,
    '--title-size': `${occasion.font.size}px`,
  } as CSSProperties

  return (
    <section ref={sectionRef} className={`occasion ${open ? 'is-open' : ''}`}>
      <button className="occasion__banner" onClick={onToggle} aria-expanded={open} aria-controls={gridId}>
        {occasion.banner && <img className="occasion__photo" src={occasion.banner} alt="" loading="lazy" />}
        <span className="occasion__shade" />
        <span className="occasion__title" style={titleStyle}>
          {occasion.title}
        </span>
        <span className="occasion__meta">
          {picked.length > 0 && (
            <span className="occasion__picked">
              {pickedTops > 0 && `${pickedTops} ${pickedTops === 1 ? 'top' : 'tops'}`}
              {pickedTops > 0 && pickedBottoms > 0 && ' · '}
              {pickedBottoms > 0 && `${pickedBottoms} ${pickedBottoms === 1 ? 'bottom' : 'bottoms'}`}
            </span>
          )}
          <span className="occasion__chevron">
            <ChevronDownIcon size={18} strokeWidth={2} />
          </span>
        </span>
      </button>

      {open && (
        <div id={gridId} className="occasion__grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}

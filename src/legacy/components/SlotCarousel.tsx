import { useEffect, useLayoutEffect, useRef, type CSSProperties, type PointerEvent } from 'react'
import type { Product, Side, Slot } from '../data/products'
import { useStore } from '../state/store'
import { Garment } from './Garment'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from './icons'
import './SlotCarousel.css'

type Props = {
  slot: Slot
  items: Product[]
  currentId: string | null
  side: Side
}

const LABEL: Record<Slot, string> = { top: 'tops', bottom: 'bottoms' }

// One row of the change room: swipe sideways through the tops (or bottoms) in the bag.
export function SlotCarousel({ slot, items, currentId, side }: Props) {
  const { dispatch } = useStore()
  const ref = useRef<HTMLDivElement>(null)
  const settleTimer = useRef<number>(0)
  const hasPositioned = useRef(false)
  const index = Math.max(0, items.findIndex((p) => p.id === currentId))

  // Keep the scroll position in sync when `current` changes elsewhere (Closet, dots, removing an item).
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || items.length === 0) return
    const target = index * el.clientWidth
    if (Math.abs(el.scrollLeft - target) > 2) {
      el.scrollTo({ left: target, behavior: hasPositioned.current ? 'smooth' : 'instant' })
    }
    hasPositioned.current = true
  }, [index, items.length])

  // Re-align after the viewport changes size (rotation, desktop resize).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      el.scrollTo({ left: index * el.clientWidth, behavior: 'instant' })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [index])

  const onScroll = () => {
    window.clearTimeout(settleTimer.current)
    settleTimer.current = window.setTimeout(() => {
      const el = ref.current
      if (!el) return
      const i = Math.round(el.scrollLeft / el.clientWidth)
      const p = items[i]
      if (p && p.id !== currentId) dispatch({ type: 'show', slot, id: p.id })
    }, 90)
  }

  const step = (dir: -1 | 1) => {
    if (items.length === 1) return sayOnlyOne()
    const p = items[index + dir]
    if (p) dispatch({ type: 'show', slot, id: p.id })
  }

  // With a single piece there's nothing to swipe to, so a sideways swipe says so instead of doing nothing.
  const onlyOne = items.length === 1
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const sayOnlyOne = () => dispatch({ type: 'toast', toast: { message: `That’s your only ${slot}`, addMore: true } })
  const onSwipeStart = (e: PointerEvent<HTMLDivElement>) => {
    swipe.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onSwipeEnd = (e: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current
    swipe.current = null
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) sayOnlyOne()
  }

  if (items.length === 0) {
    return (
      <div className={`slot slot--${slot} slot--empty`}>
        <button className="slot__empty" onClick={() => dispatch({ type: 'setTab', tab: 'events' })}>
          <span className="slot__empty-icon">
            <PlusIcon size={22} />
          </span>
          <span>No {LABEL[slot]} yet</span>
          <span className="slot__empty-hint">Add some from Events</span>
        </button>
      </div>
    )
  }

  return (
    <div className={`slot slot--${slot}`}>
      <div
        ref={ref}
        className="slot__track"
        onScroll={onScroll}
        onPointerDown={onlyOne ? onSwipeStart : undefined}
        onPointerUp={onlyOne ? onSwipeEnd : undefined}
        onPointerCancel={() => {
          swipe.current = null
        }}
        style={onlyOne ? { touchAction: 'pan-y' } : undefined}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${LABEL[slot]} in your change room`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') step(-1)
          if (e.key === 'ArrowRight') step(1)
        }}
      >
        {items.map((p, i) => (
          <div className="slot__slide" key={p.id} aria-hidden={i !== index} aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}: ${p.name}`}>
            <Garment product={p} side={side} eager={Math.abs(i - index) <= 1} style={{ '--fit': p.fit ?? 1 } as CSSProperties} />
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button className="slot__arrow slot__arrow--prev" onClick={() => step(-1)} disabled={index === 0} aria-label={`Previous ${slot}`}>
            <ChevronLeftIcon size={20} />
          </button>
          <button className="slot__arrow slot__arrow--next" onClick={() => step(1)} disabled={index === items.length - 1} aria-label={`Next ${slot}`}>
            <ChevronRightIcon size={20} />
          </button>
        </>
      )}
    </div>
  )
}

import { useRef, type PointerEvent } from 'react'
import { formatPrice, type Product, type Slot } from '../data/products'
import { useSnapshot, useStore } from '../state/store'
import { CloseIcon } from './icons'
import './SlotControl.css'

type Props = {
  slot: Slot
  items: Product[]
  currentId: string | null
}

const STEP_PX = 26 // how far the thumb travels on the dots to move one item
const WINDOW = 7 // dots shown at once

// The pill on the thumb side of the change room: remove, price, and a dot scrubber.
export function SlotControl({ slot, items, currentId }: Props) {
  const { dispatch } = useStore()
  const before = useSnapshot()
  const index = items.findIndex((p) => p.id === currentId)
  const current = items[index]
  // Drag the dots with your thumb to scrub through items; a plain tap on a dot jumps to it.
  const drag = useRef<{ y: number; startIndex: number; tappedIndex: number | null; moved: boolean } | null>(null)

  const showIndex = (i: number) => {
    const p = items[Math.min(items.length - 1, Math.max(0, i))]
    if (p) dispatch({ type: 'show', slot, id: p.id })
  }

  const onPointerDown = (e: PointerEvent) => {
    const dot = (e.target as HTMLElement).closest<HTMLElement>('[data-index]')
    drag.current = { y: e.clientY, startIndex: index, tappedIndex: dot ? Number(dot.dataset.index) : null, moved: false }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: PointerEvent) => {
    if (!drag.current) return
    const dy = e.clientY - drag.current.y
    if (Math.abs(dy) > 6) drag.current.moved = true
    if (drag.current.moved) showIndex(drag.current.startIndex + Math.round(dy / STEP_PX))
  }
  const onPointerUp = () => {
    if (drag.current && !drag.current.moved && drag.current.tappedIndex !== null) showIndex(drag.current.tappedIndex)
    drag.current = null
  }

  // Which dots are visible: a sliding window, with the edge dots shrinking when there's more beyond.
  const start = Math.min(Math.max(0, index - Math.floor(WINDOW / 2)), Math.max(0, items.length - WINDOW))
  const end = Math.min(items.length, start + WINDOW)
  const dots = []
  for (let i = start; i < end; i++) {
    const fromTop = i - start
    const fromBottom = end - 1 - i
    let size = 8
    if ((start > 0 && fromTop === 0) || (end < items.length && fromBottom === 0)) size = 4
    else if ((start > 0 && fromTop === 1) || (end < items.length && fromBottom === 1)) size = 6
    dots.push(
      <span
        key={items[i].id}
        data-index={i}
        className={`dots__dot ${i === index ? 'is-active' : ''}`}
        style={{ width: size, height: size }}
        title={items[i].name}
      />,
    )
  }

  return (
    <div className={`slot-control ${current ? '' : 'is-empty'}`}>
      <button
        className="slot-control__remove"
        onClick={() => {
          if (!current) return
          dispatch({ type: 'remove', id: current.id })
          dispatch({ type: 'toast', toast: { message: `Removed ${current.name}`, undo: before } })
        }}
        disabled={!current}
        aria-label={current ? `Remove ${current.name} from change room` : 'Nothing to remove'}
      >
        <CloseIcon size={16} strokeWidth={1.8} />
      </button>

      <p className="slot-control__price" aria-live="polite">
        {current ? (
          <>
            <strong>{formatPrice(current.price)}</strong>
            <span>EUR</span>
          </>
        ) : (
          <span>–</span>
        )}
      </p>

      <div
        className="dots"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="slider"
        tabIndex={items.length > 1 ? 0 : -1}
        aria-orientation="vertical"
        aria-label={slot === 'top' ? 'Scroll through tops' : 'Scroll through bottoms'}
        aria-valuemin={1}
        aria-valuemax={Math.max(1, items.length)}
        aria-valuenow={index + 1}
        aria-valuetext={current?.name}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') showIndex(index - 1)
          if (e.key === 'ArrowDown') showIndex(index + 1)
        }}
      >
        {dots}
      </div>
    </div>
  )
}

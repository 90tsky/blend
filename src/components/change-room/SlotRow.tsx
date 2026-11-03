import { useEffect, useRef, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { AnimatePresence, animate, motion, useMotionValue, type PanInfo } from 'motion/react'
import type { Product, Side, Slot } from '../../data/products'
import { useBagActions, useStore } from '../../state/store'
import { Box, PlusMark } from './Box'
import { EmptySlot } from './EmptySlot'
import { PriceChip } from './PriceChip'
import { useSize } from './useSize'

type Rect = { x: number; y: number; w: number; h: number }

// Figma carousel · top / bottom: a step slides in 450ms on cubic-bezier(0.25, 0.5, 0.25, 1).
const SLIDE = { duration: 0.45, ease: [0.25, 0.5, 0.25, 1] as [number, number, number, number] }
// Bottoms share one waist width: the width a pair of trousers takes when it fills the height (× the piece's `fit`).
const WAIST = 0.36

// Where the current piece and the next-piece peek sit: the Figma rows (430 × 290 and 430 × 444), scaled to the row's height.
// On short screens the peek stops 12 above the "3 of 7" line (which sits 12 above the chip).
function boxes(slot: Slot, W: number, H: number): { current: Rect; peek: Rect } {
  if (slot === 'top') {
    const k = H / 290
    const y = 57 * k
    return { current: { x: 12, y: 23 * k, w: W - 148, h: H - 23 * k }, peek: { x: W - 129.5, y, w: 123, h: Math.min(116 * k, H - 100 - y) } }
  }
  const k = H / 444
  const y = 61 * k
  return { current: { x: 0, y: 8 * k, w: W - 124, h: H - 15 * k }, peek: { x: W - 144.5, y, w: 153, h: Math.min(215 * k, H - 148 - y) } }
}

// The picture's rect inside a box: tops hang down to the bottom edge (so they meet the bottoms), bottoms hang from the waist.
function place(p: Product, side: Side, box: Rect, peek: boolean): Rect {
  const img = p.images[side]
  const a = img.width / img.height
  let w: number
  let h: number
  if (p.slot === 'top') {
    w = Math.min(box.w, box.h * a)
    h = w / a
  } else {
    w = Math.min(box.w, box.h * WAIST) * (p.fit ?? 1)
    h = w / a
    if (h > box.h) [h, w] = [box.h, box.h * a]
    if (w > box.w) [w, h] = [box.w, box.w / a]
  }
  const y = p.slot === 'bottom' ? box.y : peek ? box.y + (box.h - h) / 2 : box.y + box.h - h
  return { x: box.x + (box.w - w) / 2, y, w, h }
}

type Props = { slot: Slot; items: Product[]; currentId: string | null; side: Side; notch?: boolean; onAdd: () => void }

// One row of the change room (Figma carousel · top 516:9378 / · bottom 516:9629): the current piece large,
// the next one peeking at the right (or the "Add a top / bottom" card after the last), the "3 of 7" position,
// and the price chip with ✕. Swipe or drag sideways to step; the peek is a button too.
export function SlotRow({ slot, items, currentId, side, notch = false, onAdd }: Props) {
  const { state, dispatch } = useStore()
  const { remove } = useBagActions()
  const navigate = useNavigate()
  const rowRef = useRef<HTMLDivElement>(null)
  const { width: W, height: H } = useSize(rowRef)
  const dragX = useMotionValue(0)
  const panned = useRef(false)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
  }, [])

  const n = items.length
  const index = Math.max(0, items.findIndex((p) => p.id === currentId))
  const current = items[index]
  const group = slot === 'top' ? 'Tops' : 'Bottoms'

  const go = (dir: 1 | -1) => {
    const next = items[index + dir]
    if (!next) return false
    dispatch({ type: 'show', slot, id: next.id })
    return true
  }
  // Nothing that way: a small wiggle (220ms, then 160 and 140); a single piece also says "That’s your only top · Add more".
  const wiggle = (dir: 1 | -1) => {
    animate(dragX, [dragX.get(), -14 * dir, 6 * dir, 0], { duration: 0.52, times: [0, 0.42, 0.73, 1], ease: ['easeOut', 'easeInOut', 'easeInOut'] })
    if (n === 1) dispatch({ type: 'toast', toast: { kind: 'only-one', slot } })
  }
  const step = (dir: 1 | -1) => {
    if (go(dir)) animate(dragX, 0, SLIDE)
    else wiggle(dir)
  }

  const onPan = (_: PointerEvent, info: PanInfo) => {
    panned.current = true
    const dir = info.offset.x < 0 ? 1 : -1
    dragX.set(items[index + dir] ? info.offset.x : info.offset.x * 0.25) // rubber band at the ends
  }
  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    const dx = info.offset.x
    const vx = info.velocity.x
    const dir = dx < -48 || vx < -500 ? 1 : dx > 48 || vx > 500 ? -1 : 0
    if (dir === 0) animate(dragX, 0, { duration: 0.25, ease: 'easeOut' })
    else step(dir)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1)
    else if (e.key === 'ArrowLeft') step(-1)
    else return
    e.preventDefault()
  }

  const b = W > 0 && H > 0 ? boxes(slot, W, H) : null
  const atEnd = index === n - 1

  return (
    <div ref={rowRef} className={`cr-row cr-row--${slot}${n > 1 ? ' has-count' : ''}`} role="group" aria-label={`${group} in your change room`}>
      {n === 0 || !current ? (
        <EmptySlot kind={slot} notch={notch} appear={mounted.current} onClick={onAdd} />
      ) : (
        <>
          <Box variant="plate" notch={notch} className="cr-plate" />
          <motion.div className="cr-track" style={{ x: dragX }} onPan={onPan} onPanEnd={onPanEnd} onPointerDownCapture={() => (panned.current = false)}>
            {b && (
              <AnimatePresence initial={false}>
                {items.map((p, i) => {
                  const rel = i - index
                  const cur = place(p, side, b.current, false)
                  const pk = place(p, side, b.peek, true)
                  const s = pk.w / cur.w
                  const target =
                    rel === 0
                      ? { x: 0, y: 0, scale: 1, opacity: 1 }
                      : rel === 1
                        ? { x: pk.x - cur.x, y: pk.y - cur.y, scale: s, opacity: 1 }
                        : { x: (rel < 0 ? -pk.w - 24 : W + 24) - cur.x, y: pk.y - cur.y, scale: s, opacity: 0 }
                  // Appearing (Undo) and leaving (✕): shrink to near zero round the centre while fading.
                  const gone = { x: target.x + cur.w * target.scale * 0.4, y: target.y + cur.h * target.scale * 0.4, scale: target.scale * 0.2, opacity: 0 }
                  const parked = rel < 0 || rel > 1
                  return (
                    <motion.button
                      key={p.id}
                      type="button"
                      className="cr-piece"
                      style={{ left: cur.x, top: cur.y, width: cur.w, height: cur.h, zIndex: rel === 0 ? 2 : 1 }}
                      initial={gone}
                      animate={target}
                      exit={{ ...gone, transition: { duration: 0.3, ease: 'easeIn' } }}
                      transition={SLIDE}
                      inert={parked}
                      aria-hidden={parked || undefined}
                      aria-label={rel === 0 ? `${p.brand} ${p.name}` : `Next ${slot}`}
                      onKeyDown={rel === 0 ? onKey : undefined}
                      onClick={() => {
                        if (panned.current) return
                        if (rel === 0) navigate(`/product/${p.id}`)
                        else if (rel === 1) step(1)
                      }}
                    >
                      <img src={p.images[side].src} alt="" draggable={false} />
                    </motion.button>
                  )
                })}
              </AnimatePresence>
            )}
            <motion.button
              type="button"
              className="cr-add"
              initial={false}
              animate={atEnd ? { x: 0, opacity: 1 } : { x: 140, opacity: 0 }}
              transition={SLIDE}
              inert={!atEnd}
              aria-hidden={!atEnd || undefined}
              onClick={() => {
                if (!panned.current) onAdd()
              }}
            >
              <Box variant="dashed" />
              <span className="cr-add__circle" aria-hidden="true">
                <PlusMark size={16} weight={1.5} />
              </span>
              <span className="cr-add__label">{slot === 'top' ? 'Add a top' : 'Add a bottom'}</span>
            </motion.button>
          </motion.div>
          {n > 1 && (
            <p className="cr-count" aria-live="polite">
              <span className="visually-hidden">{group}, </span>
              {index + 1} of {n}
              <span className="visually-hidden">: {current.name}</span>
            </p>
          )}
          <PriceChip product={current} currency={state.currency} onRemove={() => remove(current.id)} />
        </>
      )}
    </div>
  )
}

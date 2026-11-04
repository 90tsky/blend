import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { AnimatePresence, animate, motion, useMotionValue, usePresence, useReducedMotionConfig, type PanInfo } from 'motion/react'
import type { Product, Side, Slot } from '../../data/products'
import { useBagActions, useStore } from '../../state/store'
import { Box, PlusMark } from './Box'
import { SLIDE } from './motion'
import { PriceChip } from './PriceChip'
import { useSize } from './useSize'

type Rect = { x: number; y: number; w: number; h: number }

// Bottoms share one waist width: the width a pair of trousers takes when it fills the height (× the piece's `fit`).
const WAIST = 0.36

// Where the current piece and the next-piece peek sit: the Figma rows (430 × 290 and 430 × 444), scaled to the row's
// height, inside the frame (12 in from the screen, everything else 12 in from the frame). Tops and bottoms share one
// centre line (x 153 on a 430 screen). On short screens the peek stops 12 above the "3 of 7" line (12 above the chip).
function boxes(slot: Slot, W: number, H: number): { current: Rect; peek: Rect } {
  if (slot === 'top') {
    const k = H / 290
    const y = 57 * k
    return { current: { x: 24, y: 23 * k, w: W - 172, h: H - 23 * k }, peek: { x: W - 141.5, y, w: 123, h: Math.min(116 * k, H - 100 - y) } }
  }
  const k = H / 444
  const y = 61 * k
  // The bottom row's side column stands on the notch round Try it on: the peek stops 160 above the row's bottom.
  return { current: { x: 12, y: 8 * k, w: W - 148, h: H - 8 * k - 12 }, peek: { x: W - 156.5, y, w: 153, h: Math.min(215 * k, H - 160 - y) } }
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

type Props = { slot: Slot; items: Product[]; currentId: string | null; side: Side; onAdd: () => void }

// One row of the change room (Figma carousel · top 516:9378 / · bottom 516:9629). The row keeps its place in the
// stage when it's empty (the empty boxes are drawn over the stage by EmptyBoxes); its pieces come and go with it.
export function SlotRow(props: Props) {
  const rowRef = useRef<HTMLDivElement>(null)
  const { width: W, height: H } = useSize(rowRef)
  const n = props.items.length
  // Content that arrives after the screen opened (Undo, or adding back) plays the removal backwards.
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
  }, [])

  return (
    <div
      ref={rowRef}
      className={`cr-row cr-row--${props.slot}${n > 1 ? ' has-count' : ''}`}
      role={n > 0 ? 'group' : undefined}
      aria-label={n > 0 ? `${props.slot === 'top' ? 'Tops' : 'Bottoms'} in your change room` : undefined}
    >
      <AnimatePresence initial={false}>{n > 0 && <SlotContent key="content" {...props} W={W} H={H} enter={mounted.current} />}</AnimatePresence>
    </div>
  )
}

// The current piece large, the next one peeking at the right (or the "Add a top / bottom" card after the last), the
// "3 of 7" position, and the price chip with ✕. Swipe or drag sideways to step; the peek is a button too.
// When the slot's last piece goes (motion Aplus2), the piece slides out to the left like a swipe, the chip slides
// out to the right, and the add card hands over to the empty box that stretches out of it; Undo plays it backwards.
function SlotContent({ slot, items, currentId, side, onAdd, W, H, enter }: Props & { W: number; H: number; enter: boolean }) {
  const { state, dispatch } = useStore()
  const { remove } = useBagActions()
  const navigate = useNavigate()
  const reduced = useReducedMotionConfig()
  const dragX = useMotionValue(0)
  const panned = useRef(false)
  const [isPresent, safeToRemove] = usePresence()
  const leaving = !isPresent
  const [entered] = useState(enter)
  const firstRender = useRef(true)
  useEffect(() => {
    firstRender.current = false
  }, [])
  // While the empty box shrinks into it, the add card stays hidden; then it takes over. That's also the case when
  // Undo comes so fast that this content was still on its way out and simply stays.
  const [arriving, setArriving] = useState(entered)
  const wasLeaving = useRef(false)
  useEffect(() => {
    if (isPresent && wasLeaving.current) setArriving(true)
    wasLeaving.current = !isPresent
  }, [isPresent])
  useEffect(() => {
    if (!arriving) return
    const t = setTimeout(() => setArriving(false), reduced ? 0 : SLIDE.duration * 1000)
    return () => clearTimeout(t)
  }, [arriving, reduced])
  // safeToRemove changes with every store update; the timer shouldn't restart for that.
  const remove_ = useRef(safeToRemove)
  remove_.current = safeToRemove
  useEffect(() => {
    if (isPresent) return
    const t = setTimeout(() => remove_.current?.(), reduced ? 0 : SLIDE.duration * 1000 + 20)
    return () => clearTimeout(t)
  }, [isPresent, reduced])

  const n = items.length
  const index = Math.max(0, items.findIndex((p) => p.id === currentId))
  const current = items[index]
  const group = slot === 'top' ? 'Tops' : 'Bottoms'

  // A removed piece leaves like a swipe: out to the left when the next piece takes its place from the right, out to
  // the right when it was the end one and the previous piece comes back from the left (Undo brings it back the same way).
  const last = useRef({ ids: items.map((p) => p.id), current: currentId })
  let out: 1 | -1 = 1
  if (last.current.current && !items.some((p) => p.id === last.current.current)) {
    out = last.current.ids.indexOf(currentId ?? '') > last.current.ids.indexOf(last.current.current) ? 1 : -1
  }
  useEffect(() => {
    last.current = { ids: items.map((p) => p.id), current: currentId }
  })

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
    // No backdrop frame behind the pieces, in either mode (the user, 4 Nov: option A).
    <div className="cr-slot" inert={leaving || undefined}>
      <motion.div className="cr-track" style={{ x: dragX }} onPan={onPan} onPanEnd={onPanEnd} onPointerDownCapture={() => (panned.current = false)}>
        {/* custom: which way a removed piece goes (an exiting piece keeps its last props, so its exit reads this).
            When the whole slot leaves, its last piece slides out through `animate`, not an exit: these pieces stay
            mounted with the slot until it is removed. */}
        {b && (
          <AnimatePresence initial={entered} custom={out}>
            {items.map((p, i) => {
              const rel = i - index
              const cur = place(p, side, b.current, false)
              const pk = place(p, side, b.peek, true)
              const s = pk.w / cur.w
              // Past the screen edge, solid, like a swipe: where a removed piece goes and where Undo brings it from.
              const offLeft = { x: -(cur.x + cur.w) - 24, y: 0, scale: 1, opacity: 1 }
              const offRight = { x: W + 24 - cur.x, y: 0, scale: 1, opacity: 1 }
              const target =
                rel === 0
                  ? { x: 0, y: 0, scale: 1, opacity: 1 }
                  : rel === 1
                    ? { x: pk.x - cur.x, y: pk.y - cur.y, scale: s, opacity: 1 }
                    : { x: (rel < 0 ? -pk.w - 24 : W + 24) - cur.x, y: pk.y - cur.y, scale: s, opacity: 0 }
              // A piece that isn't the current one comes and goes by shrinking round its centre while fading.
              const gone = { x: target.x + cur.w * target.scale * 0.4, y: target.y + cur.h * target.scale * 0.4, scale: target.scale * 0.2, opacity: 0 }
              // Undo puts a removed piece back as the current one: from the left if it has a next piece, else the right.
              const back = rel !== 0 ? gone : entered && firstRender.current ? offLeft : index < n - 1 ? offLeft : offRight
              const parked = rel < 0 || rel > 1
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  className="cr-piece"
                  style={{ left: cur.x, top: cur.y, width: cur.w, height: cur.h, zIndex: rel === 0 ? 2 : 1 }}
                  initial={back}
                  animate={leaving && rel === 0 ? offLeft : target}
                  variants={{
                    out: (dir: 1 | -1) =>
                      rel !== 0
                        ? { ...gone, transition: { duration: 0.3, ease: 'easeIn' } }
                        : { ...(dir === 1 ? offLeft : offRight), transition: SLIDE },
                  }}
                  exit="out"
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
          className={`cr-add${leaving || arriving ? ' is-morphing' : ''}`}
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
      <PriceChip product={current} currency={state.currency} onRemove={() => remove(current.id)} enter={entered} />
    </div>
  )
}

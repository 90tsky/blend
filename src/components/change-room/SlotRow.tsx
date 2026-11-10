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
// centre line (x 153 on a 430 screen). The peeks are centred over the chip column (80 from the right edge).
function boxes(slot: Slot, W: number, H: number): { current: Rect; peek: Rect } {
  const peek = (w: number, y: number, h: number) => ({ x: W - 80 - w / 2, y, w, h })
  if (slot === 'top') {
    const k = H / 290
    const s = peekScale((H * 444) / 290) // the rows share the stage 290 : 444
    // Figma's peek, grown by the bottoms' scale round its middle, kept 12 inside the frame and 12 above "3 of 7".
    const y0 = 57 * k
    const h0 = Math.min(116 * k, H - 94 - y0)
    const h = Math.min(h0 * s, H - 94 - 12)
    const y = Math.min(Math.max(y0 + (h0 - h) / 2, 12), H - 94 - h)
    return { current: { x: 24, y: 23 * k, w: W - 172, h: H - 23 * k }, peek: peek(123 * s, y, h) }
  }
  const k = H / 444
  const s = peekScale(H)
  return { current: { x: 12, y: 8 * k, w: W - 148, h: H - 8 * k - 12 }, peek: peek(153 * s, PEEK_TOP, bottomPeek(H) * s) }
}

// The bottom row's side column stands on the notch round Try it on, so its peek ends 160 above the row's bottom (12
// above "3 of 7"). Figma's peek starts 61 down a 444 row; it now starts 24 under the top row's price chip (which ends
// 6 above the row line), not 12, so the chip doesn't read as the price of the trousers under it.
const PEEK_TOP = 18
const bottomPeek = (H: number) => Math.min(215 * (H / 444), H - 160 - 61 * (H / 444))
// The next pieces are larger than in Figma (the user, 4 Nov): the bottoms' peek grows to fill its column, about 1.2× on
// a phone, and the tops' peek takes the same scale. Kept between 1 and 1.3 on very short or tall windows.
function peekScale(Hb: number) {
  return Math.min(Math.max((Hb - 160 - PEEK_TOP) / bottomPeek(Hb), 1), 1.3)
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

// A removed current piece turns away (turnAway below) in 0.7s; the rest of the ring starts moving 0.2s in. Pieces past
// the edges are turned 30° away, round their middle, seen from 800px.
const TURN_TIME = 0.7
const TURN_DELAY = 0.2
const TILT = 30

// A piece's transform to show it in `box` instead of `from` (its own box). Pieces scale and turn round their centre.
function to(from: Rect, box: Rect, rotateY = 0) {
  return {
    x: box.x + box.w / 2 - (from.x + from.w / 2),
    y: box.y + box.h / 2 - (from.y + from.h / 2),
    scale: box.w / from.w,
    rotateY,
    opacity: 1,
  }
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
// When the slot's last piece goes (motion Aplus2), the piece turns away to the left like any removed piece (the user,
// 10 Nov: "do the same for the last piece"), the chip slides out to the right, and the add card hands over to the empty
// box that stretches out of it; Undo plays it backwards.
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
  // safeToRemove changes with every store update; the timer shouldn't restart for that. It waits for the last piece
  // to finish turning away (the rest of the slot is out by SLIDE's end).
  const remove_ = useRef(safeToRemove)
  remove_.current = safeToRemove
  useEffect(() => {
    if (isPresent) return
    const t = setTimeout(() => remove_.current?.(), reduced ? 0 : TURN_TIME * 1000 + 20)
    return () => clearTimeout(t)
  }, [isPresent, reduced])

  const n = items.length
  const index = Math.max(0, items.findIndex((p) => p.id === currentId))
  const current = items[index]
  const group = slot === 'top' ? 'Tops' : 'Bottoms'

  // The current piece was just removed: it turns away first (its exit below), and the rest of the ring moves a moment
  // later, so the piece taking its place comes in as the removed one leaves.
  const last = useRef(currentId)
  const removed = !!last.current && !items.some((p) => p.id === last.current)
  useEffect(() => {
    last.current = currentId
  })
  const move = removed ? { ...SLIDE, delay: TURN_DELAY } : SLIDE

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
        {/* An exiting piece keeps its last props, so a removed current piece still has rel 0 in its exit.
            When the whole slot leaves, its last piece turns away through `animate`, not an exit: these pieces stay
            mounted with the slot until it is removed. */}
        {b && (
          <AnimatePresence initial={entered}>
            {items.map((p, i) => {
              const rel = i - index
              const cur = place(p, side, b.current, false)
              const pk = place(p, side, b.peek, true)
              // The row turns like a ring (the user, 10 Nov: "i want the items to feel like they are in a rotating
              // sequence"). The piece before the current one waits just past the left edge, the one after the peek just
              // past the right edge, peek-sized, solid and turned away, so a drag or a step brings them in from outside
              // the frame and turns them to face you, no longer fading in. Pieces further round wait there hidden.
              // On the left, tops sit low and bottoms high, so pieces leave (and come back) towards the line between the
              // rows (the user, 10 Nov): a top by its row's bottom left corner, a bottom by its row's top left corner, at
              // the peek's height. A top is lifted by 8% of its height: turned, its near corner grows about that much,
              // and the row would clip it flat.
              const behindLeft = to(cur, { ...pk, x: -pk.w - 24, y: slot === 'top' ? b.current.y + b.current.h - pk.h * 1.08 : pk.y }, -TILT)
              const behindRight = to(cur, { ...pk, x: W + 24 }, TILT)
              const target =
                rel === 0
                  ? to(cur, cur)
                  : rel === 1
                    ? to(cur, pk)
                    : rel < 0
                      ? { ...behindLeft, opacity: rel === -1 ? 1 : 0 }
                      : { ...behindRight, opacity: rel === 2 ? 1 : 0 }
              // A piece that isn't the current one comes and goes by shrinking round its centre while fading.
              const gone = { ...target, scale: target.scale * 0.2, opacity: 0 }
              // A removed current piece turns away behind the piece taking its place: out past the left edge, getting
              // smaller and turning as it goes, all in one move (the user, 10 Nov: "smoothing the motion out to go
              // smaller while going out"; the first try shrank, then moved, and felt mechanical). It shrinks a little
              // ahead of the move. It used to slide out flat like a swipe, to the right when it was the end one.
              const turnAway = {
                ...behindLeft,
                zIndex: 0,
                transition: {
                  duration: TURN_TIME,
                  ease: [0.45, 0, 0.25, 1] as const,
                  scale: { duration: TURN_TIME, ease: [0.2, 0.6, 0.3, 1] as const },
                  zIndex: { duration: 0 },
                },
              }
              // Undo turns it back from where it went.
              const back = rel !== 0 ? gone : behindLeft
              const parked = rel < 0 || rel > 1
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  className="cr-piece"
                  style={{ left: cur.x, top: cur.y, width: cur.w, height: cur.h, zIndex: rel === 0 ? 2 : 1, transformPerspective: 800 }}
                  initial={back}
                  animate={leaving && rel === 0 ? turnAway : target}
                  exit={rel !== 0 ? { ...gone, transition: { duration: 0.3, ease: 'easeIn' } } : turnAway}
                  transition={move}
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
          // In the ring too: just past the right edge, solid, when the last piece is the peek; hidden further round.
          animate={atEnd ? { x: 0, opacity: 1 } : { x: 160, opacity: n - index === 2 ? 1 : 0 }}
          transition={move}
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

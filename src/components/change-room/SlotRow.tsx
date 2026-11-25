import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router'
import {
  AnimatePresence,
  animate,
  motion,
  useIsPresent,
  useMotionValue,
  useMotionValueEvent,
  usePresence,
  useReducedMotionConfig,
  type MotionValue,
  type PanInfo,
  type Transition,
} from 'motion/react'
import type { Product, Side, Slot } from '../../data/products'
import { useBagActions, useStore } from '../../state/store'
import { Box, PlusMark } from './Box'
import { SLIDE } from './motion'
import { PriceChip } from './PriceChip'
import { useSize } from './useSize'

type Rect = { x: number; y: number; w: number; h: number }

// Bottoms share one waist width: the width a pair of trousers takes when it fills the height (× the piece's `fit`).
const WAIST = 0.36

// The side column: the add card, the price chip, "3 of 7" and the next-piece peek. It gives way to the clothes (the
// user, 25 Nov: "the clothes and pants keep theirs and the other rearrange around them ... this should compensate for
// the changes in the clothes ratio not the other way around"). The current pieces' boxes keep their Figma proportions
// (bottoms 282 × 424 in a 444 row, tops 258 wide per 290 of row), and the column takes the width that's left: 112 on
// the design screen (430 × 932) and on wide or short ones, down to 72 on tall, narrow ones. Under 104 the price chip
// stacks (price over ✕) and is 88 tall instead of 48, and what stands on it moves up with it.
const COL_MAX = 112
const COL_MIN = 72
const COL_STACK = 104
export type Column = { w: number; chip: number }
export function column(W: number, Hb: number): Column {
  const k = Hb / 444
  const forBottoms = W - 36 - (282 / 424) * (436 * k - 12)
  const forTops = W - 60 - 258 * k
  const w = Math.round(Math.min(Math.max(Math.min(forBottoms, forTops), COL_MIN), COL_MAX))
  return { w, chip: w < COL_STACK ? 88 : 48 }
}

// Where the current piece and the next-piece peek sit: the Figma rows (430 × 290 and 430 × 444), scaled to the row's
// height, inside the frame (12 in from the screen, everything else 12 in from the frame). Tops and bottoms share one
// centre line (x 153 on a 430 screen), left of the side column. The peeks are centred over the column (80 from the
// right edge on the design screen). Since the frame clips (20 Nov), a peek is never more than 16 wider than the column
// (128), so a wide top grown on a tall screen (the overshirt's sleeves) stays clear of the frame's edge.
function boxes(slot: Slot, W: number, H: number, col: Column): { current: Rect; peek: Rect } {
  const peek = (w: number, y: number, h: number) => {
    const pw = Math.min(w, col.w + 16)
    return { x: W - 24 - col.w / 2 - pw / 2, y, w: pw, h }
  }
  // What stands on the chip ends this far above the row's bottom: the chip (6 up in the top row), 12, "3 of 7" and 12.
  const above = col.chip + 46
  if (slot === 'top') {
    const k = H / 290
    const s = peekScale((H * 444) / 290, col) // the rows share the stage 290 : 444
    // Figma's peek, grown by the bottoms' scale round its middle, kept 12 inside the frame and 12 above "3 of 7".
    const y0 = 57 * k
    const h0 = Math.min(116 * k, H - above - y0)
    const h = Math.min(h0 * s, H - above - 12)
    const y = Math.min(Math.max(y0 + (h0 - h) / 2, 12), H - above - h)
    return { current: { x: 24, y: 23 * k, w: W - 60 - col.w, h: H - 23 * k }, peek: peek(123 * s, y, h) }
  }
  const k = H / 444
  const s = peekScale(H, col)
  return { current: { x: 12, y: 8 * k, w: W - 36 - col.w, h: H - 8 * k - 12 }, peek: peek(153 * s, PEEK_TOP, bottomPeek(H, col) * s) }
}

// The bottom row's side column stands on the notch round Try it on, so its peek ends 160 above the row's bottom (12
// above "3 of 7"; more with a stacked chip). Figma's peek starts 61 down a 444 row; it now starts 24 under the top
// row's price chip (which ends 6 above the row line), not 12, so the chip doesn't read as the price of the trousers.
const PEEK_TOP = 18
const bottomPeek = (H: number, col: Column) => Math.min(215 * (H / 444), H - (col.chip + 112) - 61 * (H / 444))
// The next pieces are larger than in Figma (the user, 4 Nov): the bottoms' peek grows to fill its column, about 1.2× on
// a phone, and the tops' peek takes the same scale. Kept between 1 and 1.3 on very short or tall windows.
function peekScale(Hb: number, col: Column) {
  return Math.min(Math.max((Hb - (col.chip + 112) - PEEK_TOP) / bottomPeek(Hb, col), 1), 1.3)
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
// Back to rest when nothing steps: a drag let go short of a step, or a finger lifted after holding the row still.
const BACK: Transition = { duration: 0.25, ease: 'easeOut' }

// A piece's place in the row as one number, its ring position (the user, 25 Nov, about dragging the row: the piece
// coming in "shouldnt be in perspective" and the one being dragged "should become smaller while scrolling"). 0 is the
// current piece's box, 1 the peek, -1 just past the left edge and 2 just past the right, both peek-sized and flat;
// further round they fade out where they wait. A drag moves every piece along this path (it used to slide the whole
// row, so the current piece crossed the side column at full size), and a step or a removal glides each piece to its
// new place along the same path. On the way out of the middle a piece's size changes early (by three quarters at
// halfway), so it is already small by the side column, and on the way in it grows late, as it nears the middle.
type Pose = { x: number; y: number; scale: number }
type Ring = { L: Pose; C: Pose; P: Pose; R: Pose }
function ringAt(u: number, r: Ring) {
  const fromMiddle = (to: Pose, t: number) => {
    const s = 1 - (1 - t) * (1 - t)
    return { x: r.C.x + (to.x - r.C.x) * t, y: r.C.y + (to.y - r.C.y) * t, scale: r.C.scale + (to.scale - r.C.scale) * s }
  }
  if (u <= -1) return { ...r.L, opacity: Math.max(0, 2 + u) }
  if (u < 0) return { ...fromMiddle(r.L, -u), opacity: 1 }
  if (u < 1) return { ...fromMiddle(r.P, u), opacity: 1 }
  if (u < 2) return { ...r.P, x: r.P.x + (r.R.x - r.P.x) * (u - 1), opacity: 1 }
  return { ...r.R, opacity: Math.max(0, 3 - u) }
}

// The add card's place in the same ring: in the peek's column at 1, past the right edge at 2 (solid), gone further
// round. Short of 1 (a drag at the last piece, rubber-banded) it follows the finger.
function cardAt(u: number, stepPx: number) {
  if (u <= 1) return { x: (u - 1) * stepPx, opacity: 1 }
  if (u <= 2) return { x: (u - 1) * 160, opacity: 1 }
  return { x: 160, opacity: Math.max(0, 3 - u) }
}

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

  // Both rows work out the same column from the stage (the rows share it 290 : 444); the CSS sizes the add card, the
  // chip and "3 of 7" from it (--col-w, --chip-h).
  const col = column(W, props.slot === 'top' ? (H * 444) / 290 : H)
  // "2 of 2" comes or goes (the row crosses one piece): the add card's bottom eases into place for a moment (CSS
  // .is-count-moving). Only then, so it doesn't glide when the column is first measured or the window is resized.
  const [countMoving, setCountMoving] = useState(false)
  const lastN = useRef(n)
  const countTimer = useRef(0)
  useLayoutEffect(() => {
    const crossed = lastN.current > 1 !== n > 1
    lastN.current = n
    if (!crossed) return
    setCountMoving(true)
    window.clearTimeout(countTimer.current)
    countTimer.current = window.setTimeout(() => setCountMoving(false), 420)
  }, [n])
  useEffect(() => () => window.clearTimeout(countTimer.current), [])
  const style = { '--col-w': `${col.w}px`, '--chip-h': `${col.chip}px` } as CSSProperties

  return (
    <div
      ref={rowRef}
      className={`cr-row cr-row--${props.slot}${n > 1 ? ' has-count' : ''}${col.chip > 48 ? ' is-stacked' : ''}${countMoving ? ' is-count-moving' : ''}`}
      style={W > 0 ? style : undefined}
      role={n > 0 ? 'group' : undefined}
      aria-label={n > 0 ? `${props.slot === 'top' ? 'Tops' : 'Bottoms'} in your change room` : undefined}
    >
      <AnimatePresence initial={false}>{n > 0 && <SlotContent key="content" {...props} W={W} H={H} col={col} enter={mounted.current} />}</AnimatePresence>
    </div>
  )
}

// The current piece large, the next one peeking at the right (or the "Add a top / bottom" card after the last), the
// "3 of 7" position, and the price chip with ✕. Swipe or drag sideways to step; the peek is a button too.
// When the slot's last piece goes (motion Aplus2), the piece turns away to the left like any removed piece (the user,
// 10 Nov: "do the same for the last piece"), the chip slides out to the right, and the add card hands over to the empty
// box that stretches out of it; Undo plays it backwards.
function SlotContent({ slot, items, currentId, side, onAdd, W, H, col, enter }: Props & { W: number; H: number; col: Column; enter: boolean }) {
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

  // The step glide, shared by the whole ring, in steps. A step moves every piece one place at once (each u jumps to
  // its new rel while `stepping`), and this carries them there, from ±1 back to 0, in the same frame as the drag
  // springs back (the dispatch renders at once), so the two add up to one move. Being one value, a new drag can stop
  // all of it at once (onPanStart). Removals don't use it: there the pieces glide on their own (RingPiece).
  const glide = useMotionValue(0)
  const stepping = useRef(false)
  const go = (dir: 1 | -1) => {
    const next = items[index + dir]
    if (!next) return false
    glide.stop()
    glide.set(glide.get() + dir)
    stepping.current = true
    flushSync(() => dispatch({ type: 'show', slot, id: next.id }))
    stepping.current = false
    if (reduced) glide.set(0)
    else animate(glide, 0, SLIDE)
    return true
  }
  // The drag back to rest: at once with reduce motion on (motion values don't follow MotionConfig on their own).
  const settle = (t: Transition) => {
    if (reduced) dragX.set(0)
    else animate(dragX, 0, t)
  }
  // Nothing that way: a small wiggle (220ms, then 160 and 140); a single piece also says "That’s your only top · Add more".
  // With reduce motion on (device or Options) there's no wiggle.
  const wiggle = (dir: 1 | -1) => {
    if (reduced) dragX.set(0)
    else animate(dragX, [dragX.get(), -14 * dir, 6 * dir, 0], { duration: 0.52, times: [0, 0.42, 0.73, 1], ease: ['easeOut', 'easeInOut', 'easeInOut'] })
    if (n === 1) dispatch({ type: 'toast', toast: { kind: 'only-one', slot } })
  }
  const step = (dir: 1 | -1) => {
    if (go(dir)) settle(SLIDE)
    else wiggle(dir)
  }

  // A drag moves freely for one step towards a piece that's there, and is rubber-banded past that and at the ends
  // (x0.25), so it never sweeps further pieces into the middle that the release wouldn't step to. band() turns the
  // finger's offset into the row's; unband() turns it back.
  const room = (v: number) => (items[index + (v < 0 ? 1 : -1)] ? stepPx : 0)
  const band = (off: number) => {
    const r = room(off)
    const a = Math.abs(off)
    return Math.sign(off) * (a <= r ? a : r + (a - r) * 0.25)
  }
  const unband = (v: number) => {
    const r = room(v)
    const a = Math.abs(v)
    return Math.sign(v) * (a <= r ? a : r + (a - r) / 0.25)
  }
  // Every present piece's own ring position, and the add card's (RingPiece and below register them): a removal or Undo
  // moves these on their own, so a finger has to hold them too (the review, 25 Nov).
  const owns = useRef(new Set<Own>())
  const resume = (t: Transition) =>
    owns.current.forEach((o) => {
      const r = o.rel()
      if (o.u.isAnimating() || o.u.get() === r) return
      if (reduced) o.u.jump(r)
      else animate(o.u, r, t)
    })
  // A finger on the row holds whatever is still moving (the step glide, the spring-back, a removal's or Undo's
  // close-up) where it is, the way a list stops under a finger. It used to run on under the finger until the drag began,
  // about 3px later, or for as long as the finger stayed still (the re-test, 25 Nov). A drag takes it over from there
  // (onPanStart); a finger lifted without one lets it finish. The glide stays the glide while it's held, so a tap still
  // knows a piece is on its way (onPress).
  const held = useRef(false)
  const ends = useRef<AbortController | null>(null)
  const unlisten = () => {
    ends.current?.abort()
    ends.current = null
  }
  useEffect(() => unlisten, [])
  const letGo = () => {
    unlisten()
    if (!held.current) return
    held.current = false
    if (glide.get() !== 0) animate(glide, 0, BACK)
    if (dragX.get() !== 0) settle(BACK)
    resume(BACK)
  }
  const hold = (e: ReactPointerEvent) => {
    panned.current = false
    // Only the first pointer's main button: a right click (or a Mac's Ctrl-click) opens a menu, and its release may never
    // reach the page, which left the row frozen mid-step (the review, 25 Nov).
    if (!e.isPrimary || e.button !== 0 || e.ctrlKey) return
    const moving = [...owns.current].filter((o) => o.u.isAnimating())
    if (!glide.isAnimating() && !dragX.isAnimating() && !moving.length) return
    glide.stop()
    dragX.stop()
    moving.forEach((o) => o.u.stop())
    held.current = true
    unlisten()
    const ac = new AbortController()
    ends.current = ac
    const id = e.pointerId
    const up = (ev: PointerEvent) => {
      if (ev.pointerId === id) letGo()
    }
    window.addEventListener('pointerup', up, { signal: ac.signal })
    window.addEventListener('pointercancel', up, { signal: ac.signal })
    window.addEventListener('contextmenu', letGo, { signal: ac.signal })
    window.addEventListener('blur', letGo, { signal: ac.signal })
  }
  // A new drag takes over whatever is still moving from where the pieces are on screen, so they follow the new finger
  // at once instead of finishing the old move under it. A close-up stays held under the drag and goes on to its
  // places when the finger lifts (onPanEnd).
  const dragFrom = useRef(0)
  const onPanStart = () => {
    unlisten()
    held.current = false
    owns.current.forEach((o) => o.u.stop())
    dragX.stop()
    glide.stop()
    const now = dragX.get() + glide.get() * stepPx
    glide.set(0)
    dragFrom.current = unband(now)
    dragX.set(now)
  }
  const onPan = (_: PointerEvent, info: PanInfo) => {
    panned.current = true
    dragX.set(band(dragFrom.current + info.offset.x))
  }
  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    const dx = info.offset.x
    const vx = info.velocity.x
    const dir = dx < -48 || vx < -500 ? 1 : dx > 48 || vx > 500 ? -1 : 0
    if (dir === 0) settle(BACK)
    else step(dir)
    resume(BACK) // a held close-up: a step carries it on itself (RingPiece), a spring-back or a wiggle doesn't
  }
  // Arrow keys: the focus moves to the piece that becomes current (the one that had it is parked, so it can't keep it).
  const keyStep = useRef(false)
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    keyStep.current = true
    step(e.key === 'ArrowRight' ? 1 : -1)
    keyStep.current = false
  }

  const b = W > 0 && H > 0 ? boxes(slot, W, H, col) : null
  const atEnd = index === n - 1
  // When a tap on the peek last stepped. Only then is a quick second tap on the piece still gliding in from the peek
  // (already current) a second "next"; any other tap on the current piece opens it, even while it's still sliding in
  // after a swipe, a removal or a step back (the review, 25 Nov: those skipped it, or wiggled and took Undo's place).
  const peekTap = useRef(-Infinity)
  const recentPeekTap = () => performance.now() - peekTap.current < 600
  const stepFromPeek = () => {
    peekTap.current = performance.now()
    step(1)
  }
  // A tap where the peek is steps, even when it lands between pieces: the second tap of a quick double tap does,
  // while the next peek is still on its way in from the right edge (the re-test, 25 Nov: under ~150ms apart, it was lost).
  const onTrackClick = (e: MouseEvent<HTMLDivElement>) => {
    if (panned.current || !b || !items[index + 1] || (e.target as Element).closest('button')) return
    const r = e.currentTarget.getBoundingClientRect()
    const k = r.width / (e.currentTarget.offsetWidth || 1)
    const x = (e.clientX - r.left) / k
    const y = (e.clientY - r.top) / k
    if (x >= b.peek.x && x <= b.peek.x + b.peek.w && y >= b.peek.y && y <= b.peek.y + b.peek.h) stepFromPeek()
  }

  // One step along the ring in pixels: from the current piece's centre to the peek's (W / 2 - 18 in both rows), so a
  // drag that long brings the next piece into the middle.
  const stepPx = Math.max(1, W / 2 - 18)
  // The add card's ring position (cardAt): it follows a drag and glides to its new place on a step or a removal.
  const cardRel = n - index
  const cardU = useMotionValue(cardRel)
  const cardX = useMotionValue(cardAt(cardRel, stepPx).x)
  const cardOpacity = useMotionValue(cardAt(cardRel, stepPx).opacity)
  const cardLatest = useRef({ stepPx, move, reduced })
  cardLatest.current = { stepPx, move, reduced }
  const placeCard = () => {
    const c = cardAt(cardU.get() + glide.get() + dragX.get() / cardLatest.current.stepPx, cardLatest.current.stepPx)
    cardX.set(c.x)
    cardOpacity.set(c.opacity)
  }
  useMotionValueEvent(cardU, 'change', placeCard)
  useMotionValueEvent(glide, 'change', placeCard)
  useMotionValueEvent(dragX, 'change', placeCard)
  useLayoutEffect(placeCard)
  const lastCardRel = useRef(cardRel)
  useLayoutEffect(() => {
    const prev = lastCardRel.current
    if (prev === cardRel) return
    lastCardRel.current = cardRel
    if (cardLatest.current.reduced) cardU.jump(cardRel)
    else if (stepping.current) {
      // A step: the shared glide carries it. A glide of its own still running (after a removal or Undo) goes on from
      // where it is; set() alone wouldn't stop it, and it would pull the card back to its old place (the review, 25 Nov).
      cardU.stop()
      const off = cardU.get() - prev
      cardU.jump(cardRel + off)
      if (off !== 0) animate(cardU, cardRel, SLIDE)
    } else animate(cardU, cardRel, cardLatest.current.move)
  }, [cardRel, cardU])
  useEffect(() => {
    const me: Own = { u: cardU, rel: () => lastCardRel.current }
    const set = owns.current
    set.add(me)
    return () => {
      set.delete(me)
    }
  }, [cardU])

  return (
    // No backdrop frame behind the pieces, in either mode (the user, 4 Nov: option A).
    <div className="cr-slot" inert={leaving || undefined}>
      {/* The clip stays put while the track moves (the user, 25 Nov: "the clothes come from the middle of the frame they
          should come from outside the frame"). The track used to clip itself, so during a drag its edge moved into the
          frame with it and a piece coming in from the left seemed to grow out of a line there. */}
      <div className="cr-clip">
      {/* The track takes the drags; it no longer moves itself: every piece moves along the ring (ringAt). */}
      <motion.div className="cr-track" onPanStart={onPanStart} onPan={onPan} onPanEnd={onPanEnd} onPointerDownCapture={hold} onClick={onTrackClick}>
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
              // past the right edge, peek-sized and solid, so a drag or a step brings them in from outside the frame.
              // Pieces further round wait there hidden. On the left, tops sit low and bottoms high, so pieces leave (and
              // come back) towards the line between the rows (the user, 10 Nov): a top by its row's bottom left corner,
              // a bottom by its row's top left corner, at the peek's height. They're flat now (the user, 25 Nov: "1.
              // shouldnt be in perspective"); they used to be turned 30° away and turn to face you as they came in.
              const ring: Ring = {
                L: to(cur, { ...pk, x: -pk.w - 24, y: slot === 'top' ? b.current.y + b.current.h - pk.h : pk.y }),
                C: to(cur, cur),
                P: to(cur, pk),
                R: to(cur, { ...pk, x: W + 24 }),
              }
              // A removed current piece still turns away behind the piece taking its place (the user, 10 Nov:
              // "smoothing the motion out to go smaller while going out"): out past the left edge, getting smaller and
              // turning as it goes, all in one move. A top is lifted by 8% of its height: turned, its near corner grows
              // about that much, and the row would clip it flat. Undo turns it back from there.
              const turned = to(cur, { ...pk, x: -pk.w - 24, y: slot === 'top' ? b.current.y + b.current.h - pk.h * 1.08 : pk.y }, -TILT)
              return (
                <RingPiece
                  key={p.id}
                  p={p}
                  side={side}
                  slot={slot}
                  rel={rel}
                  cur={cur}
                  ring={ring}
                  turned={turned}
                  drag={dragX}
                  glide={glide}
                  stepping={stepping}
                  stepPx={stepPx}
                  move={move}
                  reduced={!!reduced}
                  leaving={leaving}
                  onKey={rel === 0 ? onKey : undefined}
                  keyStep={keyStep}
                  owns={owns}
                  // A second quick tap on the peek lands on the piece still gliding in from it (already current), and
                  // steps again instead of opening the product (nothing, if it's the last). Anything else opens it.
                  // Keys (Enter, Space) always act, even right after a mouse drag (the review, 25 Nov).
                  onPress={(at, key) => {
                    if (panned.current && !key) return
                    if (rel === 0) {
                      if (!key && at > 0.15 && recentPeekTap()) {
                        if (items[index + 1]) stepFromPeek()
                      } else navigate(`/product/${p.id}`)
                    } else if (rel === 1) stepFromPeek()
                  }}
                />
              )
            })}
          </AnimatePresence>
        )}
        <motion.button
          type="button"
          className={`cr-add${leaving || arriving ? ' is-morphing' : ''}`}
          // In the ring too (cardAt): in the peek's column after the last piece, just past the right edge, solid, when
          // the last piece is the peek, hidden further round.
          style={{ x: cardX, opacity: cardOpacity }}
          inert={!atEnd}
          aria-hidden={!atEnd || undefined}
          // Keys always open it. A tap right after a tap on the peek doesn't: that's the second tap of a quick double tap
          // on the last peek, landing on the card as it slides into the peek's place, not "add" (the review, 25 Nov: it
          // jumped to Events, even when the card was only 10px from its place).
          onClick={(e) => {
            if (e.detail !== 0 && (panned.current || recentPeekTap())) return
            onAdd()
          }}
        >
          <Box variant="dashed" />
          <span className="cr-add__circle" aria-hidden="true">
            <PlusMark size={16} weight={1.5} />
          </span>
          <span className="cr-add__label">{slot === 'top' ? 'Add a top' : 'Add a bottom'}</span>
        </motion.button>
      </motion.div>
      </div>
      {/* "2 of 2" fades away, getting smaller towards the bottom, while the add card grows into its place (CSS); when it
          comes back (Undo) the card makes room first and the words grow back up into it (the user, 25 Nov). */}
      <AnimatePresence initial={false}>
        {n > 1 && (
          <motion.p
            key="count"
            className="cr-count"
            aria-live="polite"
            style={{ originY: 1 }}
            initial={{ opacity: 0, scale: 0.6, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: reduced ? { duration: 0 } : { duration: 0.24, delay: 0.16, ease: 'easeOut' } }}
            exit={{ opacity: 0, scale: 0.6, y: 6, transition: reduced ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' } }}
          >
            <span className="visually-hidden">{group}, </span>
            {index + 1} of {n}
            <span className="visually-hidden">: {current.name}</span>
          </motion.p>
        )}
      </AnimatePresence>
      <PriceChip product={current} currency={state.currency} onRemove={() => remove(current.id)} enter={entered} />
    </div>
  )
}

type PieceProps = {
  p: Product
  side: Side
  slot: Slot
  rel: number
  cur: Rect
  ring: Ring
  turned: ReturnType<typeof to>
  drag: MotionValue<number>
  glide: MotionValue<number>
  stepping: RefObject<boolean>
  stepPx: number
  move: Transition
  reduced: boolean
  leaving: boolean
  onKey?: (e: KeyboardEvent) => void
  keyStep: RefObject<boolean>
  owns: RefObject<Set<Own>>
  onPress: (at: number, key: boolean) => void
}
// A ring position that moves on its own (a piece's u, the add card's), and where it belongs now.
type Own = { u: MotionValue<number>; rel: () => number }

// One piece in the row. Its wrapper sits at the current-piece box and is moved and scaled to its ring position
// (ringAt: its place in the row, `rel`, plus the drag), so a drag and a step follow one path. The button inside plays
// what happens to the piece itself: shrinking in and out round its centre when it's added or taken away, and the
// current piece turning away when it's removed (and back on Undo).
function RingPiece({ p, side, slot, rel, cur, ring, turned, drag, glide, stepping, stepPx, move, reduced, leaving, onKey, keyStep, owns, onPress }: PieceProps) {
  const present = useIsPresent()
  const btn = useRef<HTMLButtonElement>(null)
  const start = ringAt(rel, ring)
  const u = useMotionValue(rel)
  const x = useMotionValue(start.x)
  const y = useMotionValue(start.y)
  const scale = useMotionValue(start.scale)
  const opacity = useMotionValue(start.opacity)
  const latest = useRef({ ring, stepPx, move, reduced, present })
  latest.current = { ring, stepPx, move, reduced, present }
  // Where it is in the ring right now: its own place, the shared step glide and the drag. A removed piece turning away
  // follows neither.
  const at = () => u.get() + (latest.current.present ? glide.get() + drag.get() / latest.current.stepPx : 0)
  // How far it still has to glide to its place, leaving the drag out: a tap on a piece still coming in from the peek
  // steps again instead of opening it.
  const gliding = () => u.get() - rel + (latest.current.present ? glide.get() : 0)
  const placeIt = () => {
    const r = ringAt(at(), latest.current.ring)
    x.set(r.x)
    y.set(r.y)
    scale.set(r.scale)
    opacity.set(r.opacity)
  }
  useMotionValueEvent(u, 'change', placeIt)
  useMotionValueEvent(glide, 'change', placeIt)
  useMotionValueEvent(drag, 'change', placeIt)
  // Removed (or back with Undo) while the step glide or a drag still has it on its way: at() stops (or starts) counting
  // those, so the difference goes into u and it stays where it is on screen, then goes to its place as it turns away.
  // Before, it jumped there in one frame, up to half a step (the review, 25 Nov). Runs before placeIt below.
  const wasPresent = useRef(present)
  useLayoutEffect(() => {
    if (wasPresent.current === present) return
    wasPresent.current = present
    const off = glide.get() + drag.get() / latest.current.stepPx
    if (Math.abs(off) < 1e-4) return
    u.stop()
    u.jump(u.get() + (present ? -off : off))
    if (latest.current.reduced) u.jump(rel)
    else animate(u, rel, { duration: TURN_TIME, ease: [0.45, 0, 0.25, 1] })
  }, [present, glide, drag, u, rel])
  // After every render: the ring's geometry changes with the window.
  useLayoutEffect(placeIt)
  // A new place in the row (a step, or the ring closing up after a removal): it glides there along the ring, in the
  // same frame as the drag springs back, so the two add up to one smooth move.
  const lastRel = useRef(rel)
  useLayoutEffect(() => {
    const prev = lastRel.current
    if (prev === rel) return
    lastRel.current = rel
    // A step: the shared glide carries it, and a glide of its own still running (the ring closing up after a removal,
    // or Undo) goes on from where it is: set() alone wouldn't stop it, and it would pull the piece back to its old place
    // while the count said otherwise (the review, 25 Nov). Anything else (a removal, Undo): it glides there on its own.
    if (latest.current.reduced) u.jump(rel)
    else if (stepping.current) {
      u.stop()
      const off = u.get() - prev
      u.jump(rel + off)
      if (off !== 0) animate(u, rel, SLIDE)
    } else animate(u, rel, latest.current.move)
    // An arrow-key step: the focus comes along to the new current piece.
    if (rel === 0 && keyStep.current) btn.current?.focus({ preventScroll: true })
  }, [rel, u, keyStep, stepping])
  // While it's in the row, a finger on the row can hold its own glide too (SlotContent's hold). A removed piece turning
  // away isn't held.
  useEffect(() => {
    if (!present) return
    const me: Own = { u, rel: () => lastRel.current }
    const set = owns.current
    set.add(me)
    return () => {
      set.delete(me)
    }
  }, [present, owns, u])

  const parked = rel < 0 || rel > 1
  const rest = { x: 0, y: 0, scale: 1, rotateY: 0, opacity: 1 }
  // A piece that isn't the current one comes and goes by shrinking round its centre while fading.
  const gone = { x: 0, y: 0, scale: 0.2, rotateY: 0, opacity: 0 }
  const turnAway = {
    ...turned,
    transition: {
      duration: TURN_TIME,
      ease: [0.45, 0, 0.25, 1] as const,
      scale: { duration: TURN_TIME, ease: [0.2, 0.6, 0.3, 1] as const },
    },
  }
  // The current piece is on top, except while it turns away behind the one taking its place.
  const z = rel === 0 ? (present && !leaving ? 2 : 0) : 1

  return (
    <motion.div
      className="cr-ring"
      // A removed piece turning away can't be tapped (it would open the product just removed).
      style={{ left: cur.x, top: cur.y, width: cur.w, height: cur.h, x, y, scale, opacity, zIndex: z, pointerEvents: present ? undefined : 'none' }}
    >
      <motion.button
        ref={btn}
        type="button"
        className="cr-piece"
        style={{ transformPerspective: 800 }}
        initial={rel !== 0 ? gone : turned}
        animate={leaving && rel === 0 ? turnAway : rest}
        exit={rel !== 0 ? { ...gone, transition: { duration: 0.3, ease: 'easeIn' } } : turnAway}
        transition={move}
        inert={parked || !present}
        aria-hidden={parked || undefined}
        aria-label={rel === 0 ? `${p.brand} ${p.name}` : `Next ${slot}`}
        onKeyDown={onKey}
        // Enter or Space (detail 0) always acts on the piece as it is: the keyboard has no "still gliding".
        onClick={(e) => onPress(e.detail === 0 ? 0 : gliding(), e.detail === 0)}
      >
        <img src={p.images[side].src} alt="" draggable={false} />
      </motion.button>
    </motion.div>
  )
}

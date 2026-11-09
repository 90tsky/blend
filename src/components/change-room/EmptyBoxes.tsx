import { useLayoutEffect, useRef, useState } from 'react'
import { animate, cancelFrame, frame, motion, useMotionValue, useReducedMotionConfig, useTransform, type MotionValue } from 'motion/react'
import type { Slot } from '../../data/products'
import { INNER_R, padPath, PlusMark } from './Box'
import { SLIDE, TRY_ON_OUT } from './motion'
import { unionPath, type OutlineBox } from './union'
import { useSize } from './useSize'

type Kind = Slot | 'all'
type Rect = { x: number; y: number; w: number; h: number }
// A dashed outline with its + circle (centre and diameter), in stage coordinates. It's either an empty box (big
// circle, words below) or a slot's "Add a top / bottom" card (small circle, `label` below). `notch` is 1 while Try it
// on is there: any box that reaches its pad wraps round it (padPath); 0 for the whole-room box, which Try it on leaves,
// taking its pad with it (TRY_ON_OUT).
type Shape = { box: Rect; cx: number; cy: number; d: number; notch: 0 | 1; label?: string }
type Point = { x: number; y: number }

const COPY: Record<Kind, { title: string; noun: string; tail: string }> = {
  top: { title: 'No tops yet', noun: 'tops', tail: ' from an event.' },
  bottom: { title: 'No bottoms yet', noun: 'bottoms', tail: ' from an event.' },
  all: { title: 'Your change room is empty', noun: 'pieces', tail: ' from an event, then mix them here.' },
}
const KINDS: Kind[] = ['top', 'bottom', 'all']

const MARGIN = 12 // --layout-margin
const CIRCLE = 76
const LABEL_W = 112 // the add card's width, for its label
// The + circle's top sits this far above the box's middle (further in the bottom box, which is notched round Try it on).
const lift = (kind: Kind) => (kind === 'bottom' ? 72 : 52)

// A box that has shrunk into an add card goes a moment after the card shows (same drawing, so the overlap can't be
// seen), never before it: two separate clocks could otherwise leave a frame with neither.
const later = (fn: () => void) => window.setTimeout(fn, 80)

// Words leaving a box: the empty box's words and, when an add card merges into the whole-room box, the card's label
// ("Add a top"), together and softly (the user, 9 Nov: both texts should go at the same time, a bit more smoothly).
const WORDS_OUT = { duration: 0.22, ease: 'easeInOut' as const }

const modeOf = (tops: number, bottoms: number): Kind | null => (tops === 0 && bottoms === 0 ? 'all' : tops === 0 ? 'top' : bottoms === 0 ? 'bottom' : null)

// The boxes sit inside the frame, 12 in from it (x 24 on a 430 screen) and 12 apart: "No tops yet" fills the top row,
// "No bottoms yet" the bottom row (notched round Try it on, the frame's notch offset 12 in), "Your change room is
// empty" the whole frame. The rows split the stage 290 : 444, as in Figma.
function homeShape(kind: Kind, W: number, H: number): Shape {
  const topH = (H * 290) / 734
  const x = 2 * MARGIN
  const w = W - 4 * MARGIN
  const box =
    kind === 'top'
      ? { x, y: MARGIN, w, h: topH - 1.5 * MARGIN }
      : kind === 'bottom'
        ? { x, y: topH + MARGIN / 2, w, h: H - topH - 1.5 * MARGIN }
        : { x, y: MARGIN, w, h: H - 2 * MARGIN }
  return { box, cx: box.x + box.w / 2, cy: box.y + box.h / 2 - lift(kind) + CIRCLE / 2, d: CIRCLE, notch: kind === 'all' ? 0 : 1 }
}

// Try it on's pad, in the outline's stage coordinates: the centre of the "No bottoms yet" notch's inside curve (the
// button's corner centre, offset 12 in, as boxPath draws it). It stays put while boxes grow into it.
function padCentre(W: number, H: number): Point {
  const { box } = homeShape('bottom', W, H)
  return { x: box.x + box.w - 1 - (48 - MARGIN), y: box.y + box.h - 1 - (24 - MARGIN) }
}

// The slot's add card as it is on screen (leaving or just arriving, it's hidden but laid out).
function measureCard(layer: HTMLElement, slot: Slot): Shape | null {
  const card = layer.parentElement?.querySelector<HTMLElement>(`.cr-row--${slot} .cr-add`)
  const circle = card?.querySelector<HTMLElement>('.cr-add__circle')
  if (!card || !circle) return null
  const o = layer.getBoundingClientRect()
  const r = card.getBoundingClientRect()
  const c = circle.getBoundingClientRect()
  return {
    box: { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height },
    cx: c.left - o.left + c.width / 2,
    cy: c.top - o.top + c.height / 2,
    d: c.width,
    notch: 1,
    label: slot === 'top' ? 'Add a top' : 'Add a bottom',
  }
}

type Main = { key: number; kind: Kind; from: Shape | null; to: Shape | null; version: number }
type Ghost = { key: number; from: Shape; to: Shape; version: number }
// A box's moving outline, for the shared outline drawn while boxes merge or split (UnionOutline).
type Live = { x: MotionValue<number>; y: MotionValue<number>; w: MotionValue<number>; h: MotionValue<number>; shift: MotionValue<number> }

// The empty state as ONE dashed box that changes shape (motion Aplus2, as the user put it: the "Add a bottom" card
// becomes "No bottoms yet", and that box and the other slot's add card both become "Your change room is empty"):
// - a slot's last piece goes: its add card grows into the slot's empty box;
// - the other slot empties too: the box grows over the whole stage while that slot's add card grows into the same
//   place, and they meet as one;
// - Undo plays each step backwards (the whole-stage box splits back into the slot box and the add card).
// Only the words change, crossing over in place: the old ones fade early, the new ones late.
export function EmptyBoxes({ tops, bottoms, onOpen }: { tops: number; bottoms: number; onOpen: (slot?: Slot) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { width: W, height: H } = useSize(ref)
  const mode = modeOf(tops, bottoms)
  const keys = useRef(1)
  const [main, setMain] = useState<Main | null>(() => (mode ? { key: 0, kind: mode, from: null, to: null, version: 0 } : null))
  const [ghosts, setGhosts] = useState<Ghost[]>([])
  const was = useRef({ tops, bottoms })
  const live = useRef(new Map<number, Live>()).current
  // A copy merging in or splitting off: one outline round all the boxes (UnionOutline) instead of one each.
  const merging = ghosts.length > 0

  useLayoutEffect(() => {
    const prev = was.current
    was.current = { tops, bottoms }
    const before = modeOf(prev.tops, prev.bottoms)
    if (before === mode || !ref.current || W === 0) return
    // The slot that just emptied or got a piece back: its add card is what the box grows from or shrinks into.
    const crossed = (a: number, b: number) => (a === 0) !== (b === 0)
    const topX = crossed(prev.tops, tops)
    const bottomX = crossed(prev.bottoms, bottoms)
    const slot: Slot | null = topX && !bottomX ? 'top' : bottomX && !topX ? 'bottom' : null
    const card = slot ? measureCard(ref.current, slot) : null
    const version = keys.current++
    // A copy still on its way (Undo straight after, or the other way round) turns round from where it is; otherwise
    // a new copy starts out.
    const copy = (from: Shape, to: Shape) =>
      setGhosts((list) => (list.length ? list.map((g, i) => (i === list.length - 1 ? { ...g, to, version } : g)) : [{ key: keys.current++, from, to, version }]))
    if (before === null && mode) {
      setMain({ key: keys.current++, kind: mode, from: card, to: null, version })
    } else if (before && mode === null) {
      if (card) {
        setMain((m) => m && { ...m, to: card, version })
      } else {
        // Both slots back at once (Undo after Options › Empty change room): the box splits into both add cards.
        const top = measureCard(ref.current, 'top')
        const bottom = measureCard(ref.current, 'bottom')
        if (top && bottom) {
          setMain((m) => m && { ...m, to: top, version })
          copy(homeShape(before, W, H), bottom)
        } else {
          setMain(null)
        }
      }
    } else if (mode === 'all' && before !== 'all') {
      setMain((m) => m && { ...m, kind: 'all', to: null, version })
      if (card) copy(card, homeShape('all', W, H))
    } else if (before === 'all' && mode) {
      setMain((m) => m && { ...m, kind: mode, to: null, version })
      if (card) copy(homeShape('all', W, H), card)
    } else if (mode) {
      setMain({ key: keys.current++, kind: mode, from: null, to: null, version })
    }
  }, [tops, bottoms, mode, W, H])

  const pad = padCentre(W, H)
  return (
    <div ref={ref} className="cr-empties">
      {W > 0 && main && (
        <MorphBox
          key={main.key}
          id={main.key}
          live={live}
          bare={merging}
          kind={main.to ? undefined : main.kind}
          shape={main.to ?? homeShape(main.kind, W, H)}
          from={main.from}
          version={main.version}
          wordsW={W - 4 * MARGIN}
          pad={pad}
          onOpen={() => onOpen(main.kind === 'all' ? undefined : main.kind)}
          onArrive={main.to ? () => later(() => setMain((m) => (m?.key === main.key && m.version === main.version ? null : m))) : undefined}
        />
      )}
      {W > 0 &&
        ghosts.map((g) => (
          <MorphBox
            key={g.key}
            id={g.key}
            live={live}
            bare
            shape={g.to}
            from={g.from}
            version={g.version}
            wordsW={W - 4 * MARGIN}
            pad={pad}
            onArrive={() => later(() => setGhosts((list) => list.filter((x) => !(x.key === g.key && x.version === g.version))))}
          />
        ))}
      {/* After the boxes, so they have registered their outlines by the time it first draws. */}
      {W > 0 && merging && <UnionOutline live={live} ids={[...(main ? [main.key] : []), ...ghosts.map((g) => g.key)]} pad={pad} />}
    </div>
  )
}

// One dashed line round every box while they merge or split (union.ts): where they overlap there's a single line and
// the inside corner is rounded, so they melt together, no longer two outlines sliding over each other (the user, 10 Nov).
// Redrawn every frame from the boxes' motion values; it starts and ends exactly on the boxes' own outlines, which hand
// over to it and take back.
function UnionOutline({ live, ids, pad }: { live: Map<number, Live>; ids: number[]; pad: Point }) {
  const path = useRef<SVGPathElement>(null)
  const padNow = useRef(pad)
  padNow.current = pad
  const key = ids.join(' ')
  useLayoutEffect(() => {
    const draw = () => {
      const boxes: OutlineBox[] = []
      for (const id of ids) {
        const v = live.get(id)
        if (!v) continue
        const x = v.x.get()
        const y = v.y.get()
        boxes.push({ x, y, w: Math.max(v.w.get() - 1, 0), h: Math.max(v.h.get() - 1, 0), pad: { x: padNow.current.x + v.shift.get(), y: padNow.current.y } })
      }
      path.current?.setAttribute('d', unionPath(boxes, INNER_R, 36 + MARGIN))
    }
    draw()
    frame.preRender(draw, true)
    return () => cancelFrame(draw)
    // The boxes are read from `live` on every frame; only a new set of boxes starts over.
  }, [key])
  return (
    <svg className="cr-empty__outline" aria-hidden="true">
      <path ref={path} transform="translate(0.5 0.5)" />
    </svg>
  )
}

type MorphProps = {
  id: number
  live: Map<number, Live> // where it registers its moving outline for UnionOutline
  bare?: boolean // UnionOutline draws the outline
  kind?: Kind // the words to show; none on a copy that is merging in or splitting off, or a box shrinking into its card
  shape: Shape
  from?: Shape | null
  version: number // a new transition: animate to `shape`; otherwise (a resize) snap to it
  wordsW: number // the empty boxes' width: the words keep it, so they never re-wrap while the box changes size
  pad: Point // Try it on's pad (padCentre), which the outline wraps round wherever the box reaches it
  onOpen?: () => void
  onArrive?: () => void
}

// One outline + circle (+ words) that moves between shapes. Everything is drawn from motion values every frame, so the
// dashes, corners and circle keep their size while it stretches.
function MorphBox({ id, live, bare, kind, shape, from, version, wordsW, pad, onOpen, onArrive }: MorphProps) {
  const reduced = useReducedMotionConfig()
  const start = from ?? shape
  const x = useMotionValue(start.box.x)
  const y = useMotionValue(start.box.y)
  const w = useMotionValue(start.box.w)
  const h = useMotionValue(start.box.h)
  const cx = useMotionValue(start.cx)
  const cy = useMotionValue(start.cy)
  const d = useMotionValue(start.d)
  // How far Try it on's pad has slid out with the button (0 while it's there).
  const shift = useMotionValue(start.notch ? 0 : TRY_ON_OUT)
  const op = useMotionValue(1)
  const wordsOp = { top: useMotionValue(0), bottom: useMotionValue(0), all: useMotionValue(0) }
  // The add card end: its smaller + and its label cross-fade with the box's + as the circle grows or shrinks.
  const card = from?.label ? from : shape.label ? shape : null
  const cardD = card?.d ?? CIRCLE
  const big = useTransform(d, (v) => (cardD >= CIRCLE ? 1 : Math.min(1, Math.max(0, (v - cardD) / (CIRCLE - cardD)))))
  const small = useTransform(big, (b) => 1 - b)
  // A card merging into the whole-room box drops its label on the words' clock, not as its circle grows.
  const labelOp = useMotionValue(1)
  const labelShown = useTransform(() => small.get() * labelOp.get())

  // One line round the box and Try it on's pad: as the box grows down into the pad, or the pad slides in and out with
  // the button, the notch opens and closes as part of the same line.
  const padNow = useRef(pad)
  padNow.current = pad
  const outline = useTransform(() =>
    padPath(
      Math.max(w.get() - 1, 0),
      Math.max(h.get() - 1, 0),
      INNER_R,
      padNow.current.x + shift.get() - x.get(),
      padNow.current.y - y.get(),
      36 + MARGIN,
    ),
  )
  useLayoutEffect(() => {
    live.set(id, { x, y, w, h, shift })
    return () => {
      live.delete(id)
    }
  }, [live, id, x, y, w, h, shift])
  // Children are placed inside the moving box, so their positions are relative to it.
  const circleX = useTransform(() => cx.get() - x.get() - CIRCLE / 2)
  const circleY = useTransform(() => cy.get() - y.get() - CIRCLE / 2)
  const circleS = useTransform(d, (v) => v / CIRCLE)
  const wordsX = useTransform(() => cx.get() - x.get() - wordsW / 2)
  const wordsY = useTransform(() => cy.get() - y.get() + d.get() / 2)
  const labelX = useTransform(() => cx.get() - x.get() - LABEL_W / 2)
  const labelY = useTransform(() => cy.get() - y.get() + d.get() / 2 + 8)

  const btn = useRef<HTMLButtonElement>(null)
  const shown = useRef<Kind | undefined>(undefined)
  const ran = useRef<number | null>(null)
  // The shape as it is now: a resize during a transition is caught up with on arrival.
  const latest = useRef(shape)
  latest.current = shape
  const snap = (s: Shape) => {
    for (const [v, end] of [[x, s.box.x], [y, s.box.y], [w, s.box.w], [h, s.box.h], [cx, s.cx], [cy, s.cy], [d, s.d]] as const) v.set(end)
  }

  useLayoutEffect(() => {
    const first = ran.current === null
    const isNew = ran.current !== version
    ran.current = version
    const t = reduced ? { duration: 0 } : SLIDE
    const values = [[x, shape.box.x], [y, shape.box.y], [w, shape.box.w], [h, shape.box.h], [cx, shape.cx], [cy, shape.cy], [d, shape.d]] as const
    // A resize, not a transition: follow the stage (unless a transition is still running).
    if (!isNew || (first && !from)) {
      if (!x.isAnimating()) snap(shape)
      if (!shift.isAnimating()) shift.set(shape.notch ? 0 : TRY_ON_OUT)
      if (first) {
        for (const k of KINDS) wordsOp[k].set(k === kind ? 1 : 0)
        shown.current = kind
        // No card to grow from (several pieces changed at once): fade in.
        if (version > 0 && !reduced) {
          op.set(0)
          animate(op, 1, { duration: 0.2, delay: 0.25 })
        }
      }
      return
    }
    const runs = values.map(([v, end]) => animate(v, end, t))
    // The pad moves with Try it on, on the same slide.
    animate(shift, shape.notch ? 0 : TRY_ON_OUT, t)
    // Words: the old ones go early, the new ones arrive late.
    if (shown.current !== kind) {
      if (shown.current) animate(wordsOp[shown.current], 0, reduced ? { duration: 0 } : WORDS_OUT)
      if (kind) animate(wordsOp[kind], 1, reduced ? { duration: 0 } : { duration: 0.17, delay: 0.28 })
      shown.current = kind
    }
    // A copy of an add card merging into the whole-room box: its label goes with the other box's words.
    // Undo turning it back into the card brings the label back, late, like the words.
    if (!kind && !onOpen && from?.label && !shape.label) animate(labelOp, 0, reduced ? { duration: 0 } : WORDS_OUT)
    else if (shape.label && labelOp.get() < 1) animate(labelOp, 1, reduced ? { duration: 0 } : { duration: 0.17, delay: 0.28 })
    // On arrival, not on a timer: effects can be re-run, animations aren't. (An animation stopped by a newer
    // transition never resolves, so only the latest transition arrives.)
    Promise.all(runs).then(() => {
      snap(latest.current)
      onArrive?.()
      // The ✕ that started it has gone: keep the keyboard focus on the box that replaced it.
      if (kind) {
        const active = document.activeElement
        if (!active || active === document.body || active.closest('.cr-row')) btn.current?.focus({ preventScroll: true })
      }
    })
    // A transition runs once per version; shape and from are read at that moment.
  }, [version, shape.box.x, shape.box.y, shape.box.w, shape.box.h, shape.cx, shape.cy, shape.d, shape.notch])

  const content = (
    <>
      {!bare && (
        <svg className="cr-empty__outline" aria-hidden="true">
          <motion.path d={outline} transform="translate(0.5 0.5)" />
        </svg>
      )}
      <motion.span className="cr-empty__circle" aria-hidden="true" style={{ x: circleX, y: circleY, scale: circleS }}>
        <motion.span className="cr-empty__plus" style={{ opacity: big }}>
          <PlusMark size={32} weight={2} />
        </motion.span>
        {card && (
          <motion.span className="cr-empty__plus" style={{ opacity: small }}>
            <PlusMark size={(16 * CIRCLE) / cardD} weight={(1.5 * CIRCLE) / cardD} />
          </motion.span>
        )}
      </motion.span>
      {card && (
        <motion.span className="cr-empty__label" aria-hidden="true" style={{ x: labelX, y: labelY, opacity: labelShown, width: LABEL_W }}>
          {card.label}
        </motion.span>
      )}
      {KINDS.map((k) => (
        <motion.span key={k} className="cr-empty__words" aria-hidden={k !== kind || undefined} style={{ x: wordsX, y: wordsY, opacity: wordsOp[k], width: wordsW }}>
          <span className="cr-empty__title">{COPY[k].title}</span>
          <span className="cr-empty__hint">
            Tap + to add <strong>{COPY[k].noun}</strong>
            {COPY[k].tail}
          </span>
        </motion.span>
      ))}
    </>
  )

  // A copy that merges in or splits off is only a drawing; the box itself is the button.
  if (!onOpen) {
    return (
      <motion.div className="cr-empty cr-empty--copy" aria-hidden="true" style={{ x, y, width: w, height: h, opacity: op }}>
        {content}
      </motion.div>
    )
  }
  return (
    <motion.button
      ref={btn}
      type="button"
      className="cr-empty"
      style={{ x, y, width: w, height: h, opacity: op }}
      inert={!kind || undefined}
      onClick={onOpen}
    >
      {content}
    </motion.button>
  )
}

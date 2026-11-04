import { useLayoutEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useReducedMotionConfig, useTransform } from 'motion/react'
import { boxPath } from './Box'
import { SLIDE } from './motion'
import { useSize } from './useSize'

const MARGIN = 12 // --layout-margin

type Shape = { y: number; h: number; notch: 0 | 1 }

// The change room's backdrop (the user's painted layout, 4 Nov): ONE frame behind both carousels, 12 from the screen
// edges, notched round Try it on at the bottom right (color/garment backdrop). When a slot empties it shrinks to the
// row that still has pieces, in step with the empty box (rows split 290 : 444, 4 apart, as the empty boxes do); the
// notch goes early when the frame leaves the bottom and forms late when it comes back. With the room empty it fades.
export function Frame({ top, bottom }: { top: boolean; bottom: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { width: W, height: H } = useSize(ref)
  const reduced = useReducedMotionConfig()
  const topH = (H * 290) / 734
  const shape: Shape | null =
    top && bottom ? { y: 0, h: H, notch: 1 } : top ? { y: 0, h: topH - 4, notch: 0 } : bottom ? { y: topH + 4, h: H - topH - 4, notch: 1 } : null

  const y = useMotionValue(shape?.y ?? 0)
  const h = useMotionValue(shape?.h ?? 0)
  const notchK = useMotionValue<number>(shape?.notch ?? 0)
  const op = useMotionValue(shape ? 1 : 0)
  const w = W - 2 * MARGIN
  const plain = useTransform(() => boxPath(Math.max(w, 0), Math.max(h.get(), 0), false))
  const notched = useTransform(() => boxPath(Math.max(w, 0), Math.max(h.get(), 0), true))
  const plainOp = useTransform(notchK, (k) => 1 - k)

  // What the frame showed last: a change of rows animates, a resize (same rows) follows the stage at once.
  const last = useRef<string | null>(null)
  const key = shape ? `${top}-${bottom}` : 'none'
  useLayoutEffect(() => {
    if (H === 0) return
    const before = last.current
    last.current = key
    const t = reduced ? { duration: 0 } : SLIDE
    if (!shape) {
      animate(op, 0, reduced ? { duration: 0 } : { duration: 0.2 })
      return
    }
    if (before === null || before === 'none' || before === key) {
      // First paint, back from an empty room (appear in place, fading), or a resize.
      if (!y.isAnimating()) {
        y.set(shape.y)
        h.set(shape.h)
        notchK.set(shape.notch)
      }
      if (before === 'none') {
        op.set(0)
        animate(op, 1, t)
      } else op.set(1)
      return
    }
    animate(y, shape.y, t)
    animate(h, shape.h, t)
    animate(notchK, shape.notch, shape.notch ? { duration: reduced ? 0 : 0.18, delay: reduced ? 0 : 0.27 } : { duration: reduced ? 0 : 0.15 })
    animate(op, 1, t)
    // The rows decide the shape; the rest is read at this moment.
  }, [key, H, W])

  return (
    <div ref={ref} className="cr-frame-layer" aria-hidden="true">
      {W > 0 && H > 0 && (
        <motion.svg className="cr-frame" width={W} height={H} style={{ opacity: op }}>
          <motion.g style={{ x: MARGIN, y }}>
            <motion.path d={plain} style={{ opacity: plainOp }} />
            <motion.path d={notched} style={{ opacity: notchK }} />
          </motion.g>
        </motion.svg>
      )}
    </div>
  )
}

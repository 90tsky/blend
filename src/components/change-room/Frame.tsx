import { useLayoutEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useReducedMotionConfig, useTransform } from 'motion/react'
import { boxPath } from './Box'
import { useSize } from './useSize'

const MARGIN = 12 // --layout-margin

// The change room's frame (the user, 4 Nov: "let the lighter frame stay always, let it uniform and define the change
// room"): always the whole stage, 12 from the screen edges, in color/garment backdrop. Everything else (pieces, add
// cards, chips, empty boxes, the toast) sits 12 inside it. It's notched round Try it on; the notch goes when Try it on
// leaves an empty room and comes back with it.
export function Frame({ notch }: { notch: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { width: W, height: H } = useSize(ref)
  const reduced = useReducedMotionConfig()
  const notchK = useMotionValue(notch ? 1 : 0)
  const plainOp = useTransform(notchK, (k) => 1 - k)
  const first = useRef(true)
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    // Leaving: early, while Try it on slides out. Coming back: late, as it arrives.
    animate(notchK, notch ? 1 : 0, reduced ? { duration: 0 } : notch ? { duration: 0.18, delay: 0.27 } : { duration: 0.15 })
  }, [notch, notchK, reduced])

  const w = W - 2 * MARGIN
  return (
    <div ref={ref} className="cr-frame-layer" aria-hidden="true">
      {w > 0 && H > 0 && (
        <svg className="cr-frame" width={W} height={H}>
          <g transform={`translate(${MARGIN} 0)`}>
            <motion.path d={boxPath(w, H, false)} style={{ opacity: plainOp }} />
            <motion.path d={boxPath(w, H, true)} style={{ opacity: notchK }} />
          </g>
        </svg>
      )}
    </div>
  )
}

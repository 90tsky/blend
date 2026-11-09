import { useLayoutEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useReducedMotionConfig, useTransform } from 'motion/react'
import { FRAME_R, padPath } from './Box'
import { SLIDE, TRY_ON_OUT } from './motion'
import { useSize } from './useSize'

const MARGIN = 12 // --layout-margin

// The change room's frame (the user, 4 Nov: "let the lighter frame stay always, let it uniform and define the change
// room"): always the whole stage, 12 from the screen edges, in color/garment backdrop. Everything else (pieces, add
// cards, chips, empty boxes, the toast) sits 12 inside it. It's notched round Try it on. When Try it on slides out of an
// empty room, the notch's pad slides with it, so the frame closes round the button as it leaves and opens round it as it
// comes back (the user, 9 Nov), one outline throughout instead of a plain and a notched frame crossfading.
export function Frame({ notch }: { notch: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { width: W, height: H } = useSize(ref)
  const reduced = useReducedMotionConfig()
  // How far Try it on has slid out (0 when it's there).
  const shift = useMotionValue(notch ? 0 : TRY_ON_OUT)
  const first = useRef(true)
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    animate(shift, notch ? 0 : TRY_ON_OUT, reduced ? { duration: 0 } : SLIDE)
  }, [notch, shift, reduced])

  const w = W - 2 * MARGIN
  // The pad is boxPath's notch: round the centre of Try it on's left end, 48 in from the frame's right and 24 up, 36 round.
  const d = useTransform(() => padPath(w, H, FRAME_R, w - 48 + shift.get(), H - 24, 36))
  return (
    <div ref={ref} className="cr-frame-layer" aria-hidden="true">
      {w > 0 && H > 0 && (
        <svg className="cr-frame" width={W} height={H}>
          <g transform={`translate(${MARGIN} 0)`}>
            <motion.path d={d} />
          </g>
        </svg>
      )}
    </div>
  )
}

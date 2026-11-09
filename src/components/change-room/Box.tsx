import { useRef } from 'react'
import { boxPath, INNER_R } from './paths'
import { useSize } from './useSize'

// The outline maths lives in paths.ts; re-exported for the frame and the empty boxes.
export { boxPath, FRAME_R, INNER_R, padPath } from './paths'

type Props = { variant: 'dashed'; className?: string }

// Fills its positioned parent: the dashed outline of the "Add a top / bottom" card, inside the frame (20 corners).
export function Box({ variant, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { width, height } = useSize(ref)
  return (
    <div ref={ref} className={`cr-box cr-box--${variant} ${className}`} aria-hidden="true">
      {width > 0 && height > 0 && (
        <svg width={width} height={height}>
          <path d={boxPath(width - 1, height - 1, false, INNER_R)} transform="translate(0.5 0.5)" />
        </svg>
      )}
    </div>
  )
}

// The + inside the black circles: two round-ended lines.
export function PlusMark({ size, weight }: { size: number; weight: number }) {
  const a = weight / 2
  const b = size - weight / 2
  const m = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <path d={`M${m} ${a}V${b}M${a} ${m}H${b}`} stroke="currentColor" strokeWidth={weight} strokeLinecap="round" fill="none" />
    </svg>
  )
}

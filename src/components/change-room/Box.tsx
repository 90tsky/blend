import { useRef } from 'react'
import { useSize } from './useSize'

// The change room's frame has 32 corners; everything inside it sits 12 in, so its corners are 20 (concentric).
export const FRAME_R = 32
export const INNER_R = 20

// A rounded box path, optionally with the notch round the Try it on button at the bottom-right corner
// (house rules › Corners). For the frame (inset 0) the button is 72 × 48 flush with the corner with 12 round it, so
// the inside curve shares the button's centre (24 + 12 = 36) and the outer turns are 24. A box `inset` inside the
// frame gets the same notch offset by that much: the inside curve grows (36 + inset), the outer turns shrink.
export function boxPath(w: number, h: number, notch: boolean, r = FRAME_R, inset = 0) {
  const top = `M0 ${r} A${r} ${r} 0 0 1 ${r} 0 H${w - r} A${r} ${r} 0 0 1 ${w} ${r}`
  const left = `H${r} A${r} ${r} 0 0 1 0 ${h - r} Z`
  if (!notch) return `${top} V${h - r} A${r} ${r} 0 0 1 ${w - r} ${h} ${left}`
  const t = 24 - inset // outer turns
  const c = 36 + inset // inside curve
  return `${top} V${h - 84 + inset} A${t} ${t} 0 0 1 ${w - 24 + inset} ${h - 60} H${w - 48 + inset} A${c} ${c} 0 0 0 ${w - 84} ${h - 24 + inset} A${t} ${t} 0 0 1 ${w - 108 + inset} ${h} ${left}`
}

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

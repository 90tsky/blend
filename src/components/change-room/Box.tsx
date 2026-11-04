import { useRef } from 'react'
import { useSize } from './useSize'

const R = 32 // radius/2xl, the box corners

// A rounded box path, optionally with the notch round the Try it on button at the bottom-right corner
// (house rules › Corners): the button is 72 × 48 flush with the corner, 12 gap round it, so the inside
// curve shares the button's centre (24 + 12 = 36) and the two outer turns are 24.
export function boxPath(w: number, h: number, notch: boolean) {
  const top = `M0 ${R} A${R} ${R} 0 0 1 ${R} 0 H${w - R} A${R} ${R} 0 0 1 ${w} ${R}`
  const left = `H${R} A${R} ${R} 0 0 1 0 ${h - R} Z`
  if (!notch) return `${top} V${h - R} A${R} ${R} 0 0 1 ${w - R} ${h} ${left}`
  return `${top} V${h - 84} A24 24 0 0 1 ${w - 24} ${h - 60} H${w - 48} A36 36 0 0 0 ${w - 84} ${h - 24} A24 24 0 0 1 ${w - 108} ${h} ${left}`
}

type Props = { variant: 'dashed'; className?: string }

// Fills its positioned parent: the dashed outline of the "Add a top / bottom" card. (The garment backdrop "plate" is
// gone: no frames behind the pieces, 4 Nov.)
export function Box({ variant, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { width, height } = useSize(ref)
  return (
    <div ref={ref} className={`cr-box cr-box--${variant} ${className}`} aria-hidden="true">
      {width > 0 && height > 0 && (
        <svg width={width} height={height}>
          <path d={boxPath(width - 1, height - 1, false)} transform="translate(0.5 0.5)" />
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

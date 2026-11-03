import { useRef, type CSSProperties, type KeyboardEvent } from 'react'
import type { Slot } from '../data/products'
import { SIZE_KEYS, sizeLabel, type SizeKey } from '../data/sizes'
import { useStore } from '../state/store'
import './SizePicker.css'

export type SegmentOption<T extends string> = { value: T; label: string }

type SegmentedProps<T extends string> = {
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  label?: string // spoken name, when no visible label is linked with labelledBy
  labelledBy?: string
}

// The Figma picker (size-picker, size-system-picker): a pressed-in track with a raised white knob that slides to
// the chosen option. A radio group: arrow keys move the choice, Tab leaves the group.
export function Segmented<T extends string>({ options, value, onChange, label, labelledBy }: SegmentedProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const index = Math.max(0, options.findIndex((o) => o.value === value))

  const pick = (i: number) => {
    const next = (i + options.length) % options.length
    onChange(options[next].value)
    refs.current[next]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') pick(index + 1)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') pick(index - 1)
    else if (e.key === 'Home') pick(0)
    else if (e.key === 'End') pick(options.length - 1)
    else return
    e.preventDefault()
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-labelledby={labelledBy}
      className="segmented"
      style={{ '--count': options.length, '--index': index } as CSSProperties}
      onKeyDown={onKeyDown}
    >
      <span className="segmented__knob" aria-hidden="true" />
      {options.map((o, i) => (
        <button
          key={o.value}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="button"
          role="radio"
          aria-checked={i === index}
          tabIndex={i === index ? 0 : -1}
          className="segmented__option"
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// Size for a top or a bottom, labelled in the shopper's size system. It shows (and saves) the shopper's size for that slot.
export function SizePicker({ slot, labelledBy }: { slot: Slot; labelledBy?: string }) {
  const { state, dispatch } = useStore()
  const options = SIZE_KEYS.map((key) => ({ value: key, label: sizeLabel(slot, key, state.sizeSystem) }))
  return (
    <Segmented
      options={options}
      value={state.sizes[slot]}
      onChange={(size: SizeKey) => dispatch({ type: 'setSize', slot, size })}
      label={labelledBy ? undefined : 'Size'}
      labelledBy={labelledBy}
    />
  )
}

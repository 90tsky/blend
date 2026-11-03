import { useRef, type CSSProperties, type KeyboardEvent } from 'react'
import './Segmented.css'

type Option<T extends string> = { value: T; label: string }
type Props<T extends string> = { options: Option<T>[]; value: T; onChange: (value: T) => void; labelledBy: string }

// A segmented picker in the house look (Options' size system, sizes, currency, appearance; Try-On sizes): a sunken
// track with a raised white knob that slides to the choice. One radio group: arrow keys move the choice.
export function Segmented<T extends string>({ options, value, onChange, labelledBy }: Props<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const index = Math.max(0, options.findIndex((o) => o.value === value))

  const onKeyDown = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (index + step + options.length) % options.length
    onChange(options[next].value)
    refs.current[next]?.focus()
  }

  return (
    <div className="seg" role="radiogroup" aria-labelledby={labelledBy} onKeyDown={onKeyDown} style={{ '--count': options.length, '--index': index } as CSSProperties}>
      <span className="seg__knob" aria-hidden="true" />
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
          className="seg__option"
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

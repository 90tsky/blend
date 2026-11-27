import { useRef, type KeyboardEvent } from 'react'
import { asset } from '../lib/asset'
import type { Build } from '../services/tryOn'
import type { Gender } from '../state/store'
import { Icon } from '../ui/Icon'
import './BuildPicker.css'

export const BUILDS: { value: Build; label: string }[] = [
  { value: 'even', label: 'Even' },
  { value: 'hips', label: 'Wider hips' },
  { value: 'shoulders', label: 'Wider shoulders' },
  { value: 'middle', label: 'Wider middle' },
]

// The figure for a build: the men's set when Men's is chosen (Figma try-on figure, gender=male), otherwise the
// women's, which is also the one shown with no gender chosen (gender=none).
export const buildImage = (build: Build, gender: Gender) => asset(`try-on/build-${gender === 'men' ? 'men-' : ''}${build}.webp`)

type Props = { value: Build; onChange: (build: Build) => void; gender: Gender; labelledBy: string }

// Body type: four tiles in one radio group. Tab reaches the chosen tile, arrow keys move the choice.
export function BuildPicker({ value, onChange, gender, labelledBy }: Props) {
  const tiles = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (BUILDS.findIndex((b) => b.value === value) + step + BUILDS.length) % BUILDS.length
    onChange(BUILDS[next].value)
    tiles.current[next]?.focus()
  }

  return (
    <div className="builds" role="radiogroup" aria-labelledby={labelledBy} onKeyDown={onKey}>
      {BUILDS.map((b, i) => {
        const on = value === b.value
        return (
          <button
            key={b.value}
            ref={(el) => {
              tiles.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            className={`build${on ? ' build--on' : ''}`}
            onClick={() => onChange(b.value)}
          >
            <span className="build__figure">
              <img src={buildImage(b.value, gender)} alt="" width={72} height={149} />
            </span>
            <span className="build__label">{b.label}</span>
            {on && (
              <span className="build__check" aria-hidden="true">
                <Icon name="check" size={16} />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

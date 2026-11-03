import { Icon } from '../../ui/Icon'

type Props = { label: string; selected?: boolean; spoken?: string; onPick: () => void }

// A suggestion pill in the search sheet (Figma filter chip "suggestion" / "selected"): 40 tall in a 48 tap area.
// A filter that's already on shows as a grey selected pill with a ✓ (designer decision).
export function Suggestion({ label, selected = false, spoken, onPick }: Props) {
  return (
    <li className="suggestion-item">
      <button type="button" className={`suggestion${selected ? ' suggestion--on' : ''}`} aria-label={spoken} onClick={onPick}>
        <span className="suggestion__pill">
          {selected && <Icon name="check" />}
          {label}
        </span>
      </button>
    </li>
  )
}

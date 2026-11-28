import { Icon } from '../../ui/Icon'

type Props = { label: string; selected?: boolean; spoken?: string; onPick: () => void }

// A suggestion pill in the search sheet (Figma filter chip "suggestion" / "selected"): 40 tall in a 48 tap area.
// A filter that's on shows in inverted colours with a ✓, and the pill grows to make room for it (the user, 28 Nov:
// "maybe the ✓ wasnt that bad", with the grow it had). The ✓ is always there, folded away until the pill is picked, so
// the pill grows smoothly instead of jumping. Its spoken name says it ("Tops, remove filter").
export function Suggestion({ label, selected = false, spoken, onPick }: Props) {
  return (
    <li className="suggestion-item">
      <button type="button" className={`suggestion${selected ? ' suggestion--on' : ''}`} aria-label={spoken} onClick={onPick}>
        <span className="suggestion__pill">
          <span className="suggestion__check" aria-hidden="true">
            <Icon name="check" />
          </span>
          <span className="pill-label">{label}</span>
        </span>
      </button>
    </li>
  )
}

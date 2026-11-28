type Props = { label: string; selected?: boolean; spoken?: string; onPick: () => void }

// A suggestion pill in the search sheet (Figma filter chip "suggestion" / "selected"): 40 tall in a 48 tap area.
// A filter that's on shows in inverted colours, nothing more (the user, 28 Nov: the inverted colour is enough; the ✓
// went). Its spoken name says it ("Tops, remove filter").
export function Suggestion({ label, selected = false, spoken, onPick }: Props) {
  return (
    <li className="suggestion-item">
      <button type="button" className={`suggestion${selected ? ' suggestion--on' : ''}`} aria-label={spoken} onClick={onPick}>
        <span className="suggestion__pill">
          <span className="pill-label">{label}</span>
        </span>
      </button>
    </li>
  )
}

import { Link } from 'react-router'
import { NOTES, type Note } from '../../data/notifications'
import { useStore, type NoteKind } from '../../state/store'
import { Icon } from '../../ui/Icon'
import { Group, MenuPage, SwitchRow } from './List'

const KINDS: { kind: NoteKind; label: string; detail: string }[] = [
  { kind: 'orders', label: 'Orders', detail: 'When an order ships and arrives.' },
  { kind: 'restock', label: 'Back in stock', detail: 'When a piece you wanted is back in your size.' },
  { kind: 'newIn', label: 'New in your events', detail: 'New pieces in the events you shop.' },
  { kind: 'offers', label: 'Offers', detail: 'Sales and free delivery, now and then.' },
]

// Menu › Notifications (the user, 27 Nov: a mix of switches and an inbox; it used to lead to "Accounts are coming
// soon"). The inbox first, New and Earlier, each note opening what it's about; then what to be told about. Past notes
// stay whatever the switches say.
export function Notifications() {
  const { state, dispatch } = useStore()
  const fresh = NOTES.filter((n) => n.isNew)
  const earlier = NOTES.filter((n) => !n.isNew)

  return (
    <MenuPage title="Notifications" subtitle="What blend has told you, and what you’d like to hear about.">
      <div className="inbox">
        <Group title="New">
          {fresh.map((n) => (
            <NoteRow key={n.id} note={n} />
          ))}
        </Group>
        <Group title="Earlier">
          {earlier.map((n) => (
            <NoteRow key={n.id} note={n} />
          ))}
        </Group>
      </div>

      <Group title="Tell me about" note="Kept on this phone. blend is a design project, so it can’t send notifications yet.">
        {KINDS.map((k) => (
          <SwitchRow
            key={k.kind}
            id={`notes-${k.kind}`}
            label={k.label}
            detail={k.detail}
            on={state.notes[k.kind]}
            onChange={(on) => dispatch({ type: 'setNote', kind: k.kind, on })}
          />
        ))}
      </Group>
    </MenuPage>
  )
}

function NoteRow({ note }: { note: Note }) {
  const { dispatch } = useStore()
  return (
    <li>
      <Link to={note.to} className="menu-row note" onClick={() => note.filter && dispatch({ type: 'setFilters', filters: [note.filter] })}>
        <img className={`note__image${note.filter ? '' : ' note__image--piece'}`} src={note.image} alt="" width={48} height={48} loading="lazy" />
        <span className="menu-row__text">
          <span className="note__top">
            <span className="menu-row__label">{note.title}</span>
            <span className="note__when">{note.when}</span>
          </span>
          <span className="menu-row__detail">{note.body}</span>
        </span>
        <Icon name="chevron" size={20} className="menu-row__trail" />
      </Link>
    </li>
  )
}

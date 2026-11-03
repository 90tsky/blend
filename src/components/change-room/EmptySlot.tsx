import type { Slot } from '../../data/products'
import { Box, PlusMark } from './Box'

// appear: fade in, when the box replaces the last piece (not when the screen opens).
type Props = { kind: Slot | 'all'; notch?: boolean; appear?: boolean; onClick: () => void }

const COPY: Record<Props['kind'], { title: string; noun: string; tail: string }> = {
  top: { title: 'No tops yet', noun: 'tops', tail: ' from an event.' },
  bottom: { title: 'No bottoms yet', noun: 'bottoms', tail: ' from an event.' },
  all: { title: 'Your change room is empty', noun: 'pieces', tail: ' from an event, then mix them here.' },
}

// The dashed empty box: "No tops yet" / "No bottoms yet" (opens Events with that filter on),
// or "Your change room is empty" across the whole stage (opens Events).
export function EmptySlot({ kind, notch = false, appear = false, onClick }: Props) {
  const copy = COPY[kind]
  return (
    <button type="button" className={`cr-empty cr-empty--${kind}${notch ? ' cr-empty--notch' : ''}${appear ? ' cr-empty--appear' : ''}`} onClick={onClick}>
      <Box variant="dashed" notch={notch} />
      <span className="cr-empty__stack">
        <span className="cr-empty__circle" aria-hidden="true">
          <PlusMark size={32} weight={2} />
        </span>
        <span className="cr-empty__title">{copy.title}</span>
        <span className="cr-empty__hint">
          Tap + to add <strong>{copy.noun}</strong>
          {copy.tail}
        </span>
      </span>
    </button>
  )
}

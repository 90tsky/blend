import { Sheet } from '../components/Sheet'
import { useBag, useSnapshot, useStore, type Hand } from '../state/store'
import './sheets.css'

const HANDS: { value: Hand; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
]

export function SettingsSheet() {
  const { state, dispatch } = useStore()
  const { items } = useBag()
  const before = useSnapshot()
  const close = () => dispatch({ type: 'openSheet', sheet: null })

  return (
    <Sheet open={state.sheet === 'settings'} onClose={close} title="Options">
      <section className="settings-group">
        <h3 className="settings-group__title" id="hand-label">
          Controls on
        </h3>
        <p className="settings-group__hint">Moves the change room buttons to your thumb.</p>
        <div className="hand-picker" role="radiogroup" aria-labelledby="hand-label">
          {HANDS.map((h) => (
            <button
              key={h.value}
              role="radio"
              aria-checked={state.hand === h.value}
              className={`hand-option ${state.hand === h.value ? 'is-selected' : ''}`}
              onClick={() => dispatch({ type: 'setHand', hand: h.value })}
            >
              <span className={`hand-option__phone hand-option__phone--${h.value}`} aria-hidden="true">
                <span className="hand-option__clothes" />
                <span className="hand-option__rail">
                  <i />
                  <i />
                  <i />
                </span>
              </span>
              <span className="hand-option__label">{h.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="settings-group">
        <h3 className="settings-group__title">Change room</h3>
        <p className="settings-group__hint" id="empty-room-hint">
          {items.length === 0 ? 'Nothing in your change room yet.' : `${items.length} ${items.length === 1 ? 'piece' : 'pieces'} saved on this device.`}
        </p>
        <button
          className="pill pill--outline pill--block settings-danger"
          disabled={items.length === 0}
          aria-describedby="empty-room-hint"
          onClick={() => {
            dispatch({ type: 'clearBag' })
            dispatch({ type: 'toast', toast: { message: 'Change room emptied', undo: before } })
          }}
        >
          Empty change room
        </button>
      </section>
    </Sheet>
  )
}

import { SlotCarousel } from '../components/SlotCarousel'
import { SlotControl } from '../components/SlotControl'
import { useBag, useStore } from '../state/store'
import './ChangeRoomScreen.css'

export function ChangeRoomScreen() {
  const { state, dispatch } = useStore()
  const { tops, bottoms } = useBag()
  const canTryOn = Boolean(state.current.top || state.current.bottom)

  return (
    <div className="change-room" aria-label="Change room">
      <div className="change-room__stage">
        <SlotCarousel slot="top" items={tops} currentId={state.current.top} side={state.side} />
        <SlotCarousel slot="bottom" items={bottoms} currentId={state.current.bottom} side={state.side} />
      </div>

      <aside className="change-room__rail" aria-label="Change room controls">
        <SlotControl slot="top" items={tops} currentId={state.current.top} />
        <SlotControl slot="bottom" items={bottoms} currentId={state.current.bottom} />
        <div className="change-room__actions">
          <button
            className="round-btn"
            onClick={() => dispatch({ type: 'openSheet', sheet: 'tryOn' })}
            disabled={!canTryOn}
            aria-describedby={canTryOn ? undefined : 'try-on-hint'}
          >
            Try it on
          </button>
          <span id="try-on-hint" className="visually-hidden">
            Add a top or a bottom to try it on.
          </span>
          <button className="round-btn" onClick={() => dispatch({ type: 'openSheet', sheet: 'closet' })}>
            Closet
          </button>
          <button className="round-btn" onClick={() => dispatch({ type: 'rotate' })} aria-pressed={state.side === 'back'}>
            Turn around
          </button>
        </div>
      </aside>
    </div>
  )
}

import { useMemo, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { EmptyBoxes } from '../components/change-room/EmptyBoxes'
import { Frame } from '../components/change-room/Frame'
import { SLIDE, TRY_ON_OUT } from '../components/change-room/motion'
import { SlotRow } from '../components/change-room/SlotRow'
import { CheckoutButton } from '../components/CheckoutButton'
import { SplitBadge } from '../components/SplitBadge'
import type { Slot } from '../data/products'
import { plural } from '../lib/format'
import { useBag, useStore } from '../state/store'
import { RoundButton } from '../ui/primitives'
import '../components/change-room/change-room.css'

// Change room (Figma 479:9125, change-room-stage 495:276): the tops above the bottoms, to mix outfits.
// The bottom bar comes from the layout; the stage stops at its top edge.
// On a phone it's a tab (/change-room). On a laptop it's a `panel` that stays open beside Events (SplitLayout): a
// section with its own visible heading and count, in place of the CHANGE ROOM tab, and Try-On opens from Events'
// address (/events/try-on), so the page under it never changes.
export function ChangeRoom({ panel = false }: { panel?: boolean }) {
  const { state, dispatch } = useStore()
  const { items } = useBag()
  const navigate = useNavigate()
  const tops = useMemo(() => items.filter((p) => p.slot === 'top'), [items])
  const bottoms = useMemo(() => items.filter((p) => p.slot === 'bottom'), [items])
  // Try it on keeps its old click handler while it slides out of an emptied room; it reads the count from here.
  const count = useRef(items.length)
  count.current = items.length

  // "+ Add a top" and "No tops yet" open Events with the Tops chip on; the empty room opens plain Events.
  const openEvents = (slot?: Slot) => {
    dispatch({ type: 'setFilters', filters: slot ? [{ kind: 'category', value: slot }] : [] })
    navigate('/events')
  }

  const counts = [tops.length > 0 && plural(tops.length, 'top'), bottoms.length > 0 && plural(bottoms.length, 'bottom')].filter(Boolean)
  const Root = panel ? 'section' : 'main'

  return (
    <Root className={`screen change-room${panel ? ' change-room--panel' : ''}`} aria-labelledby={panel ? 'change-room-title' : undefined}>
      {panel ? (
        <div className="change-room__head">
          <h2 id="change-room-title" className="change-room__title">
            Change room
            {counts.length > 0 && <span className="visually-hidden">, {counts.join(', ')}</span>}
          </h2>
          <SplitBadge tops={tops.length} bottoms={bottoms.length} />
        </div>
      ) : (
        <h1 className="visually-hidden">Change room</h1>
      )}
      <div className="cr-stage">
        {/* The framed area: both carousels (or their empty boxes); Try it on sits in the frame's notch. */}
        <div className="cr-area">
          <Frame notch={items.length > 0} />
          <SlotRow slot="top" items={tops} currentId={state.current.top} side={state.side} onAdd={() => openEvents('top')} />
          <SlotRow slot="bottom" items={bottoms} currentId={state.current.bottom} side={state.side} onAdd={() => openEvents('bottom')} />
          <EmptyBoxes tops={tops.length} bottoms={bottoms.length} onOpen={openEvents} />
        </div>
        {/* Nothing to try on in an empty room: Try it on slides out to the side, and back with the first piece. */}
        <AnimatePresence initial={false}>
          {items.length > 0 && (
            <motion.div key="try-on" className="cr-try-on" initial={{ x: TRY_ON_OUT }} animate={{ x: 0 }} exit={{ x: TRY_ON_OUT }} transition={SLIDE}>
              <RoundButton
                icon="ai-sparkle"
                label="Try it on"
                onClick={() => {
                  if (!count.current) return
                  dispatch({ type: 'toast', toast: null })
                  navigate(panel ? '/events/try-on' : '/change-room/try-on')
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* The panel's own bar, under the frame: Checkout and Turn around (on a phone they're in the shared bottom bar).
          After the stage, so tabbing reaches them after the pieces and Try it on. */}
      {panel && (
        <div className="change-room__bar">
          <CheckoutButton />
          <RoundButton icon="turn-around" label="Turn around" aria-pressed={state.side === 'back'} onClick={() => dispatch({ type: 'rotate' })} />
        </div>
      )}
      {/* On a phone, Try-On rises over the change room from its own route. The panel has no route of its own. */}
      {!panel && <Outlet />}
    </Root>
  )
}

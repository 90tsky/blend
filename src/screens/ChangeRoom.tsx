import { useMemo, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { EmptyBoxes } from '../components/change-room/EmptyBoxes'
import { Frame } from '../components/change-room/Frame'
import { SLIDE } from '../components/change-room/motion'
import { SlotRow } from '../components/change-room/SlotRow'
import type { Slot } from '../data/products'
import { useBag, useStore } from '../state/store'
import { RoundButton } from '../ui/primitives'
import '../components/change-room/change-room.css'

// Change room (Figma 479:9125, change-room-stage 495:276): the tops above the bottoms, to mix outfits.
// The bottom bar comes from the layout; the stage stops at its top edge.
export function ChangeRoom() {
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

  return (
    <main className="screen change-room">
      <h1 className="visually-hidden">Change room</h1>
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
            <motion.div key="try-on" className="cr-try-on" initial={{ x: 96 }} animate={{ x: 0 }} exit={{ x: 96 }} transition={SLIDE}>
              <RoundButton
                icon="ai-sparkle"
                label="Try it on"
                onClick={() => {
                  if (!count.current) return
                  dispatch({ type: 'toast', toast: null })
                  navigate('/change-room/try-on')
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Outlet />
    </main>
  )
}

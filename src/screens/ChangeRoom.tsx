import { useEffect, useMemo, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { EmptySlot } from '../components/change-room/EmptySlot'
import { SlotRow } from '../components/change-room/SlotRow'
import type { Slot } from '../data/products'
import { useBag, useStore } from '../state/store'
import { RoundButton, TopBar } from '../ui/primitives'
import '../components/change-room/change-room.css'

// Change room (Figma 479:9125, change-room-stage 495:276): the tops above the bottoms, to mix outfits.
// The bottom bar comes from the layout; the stage stops at its top edge.
export function ChangeRoom() {
  const { state, dispatch } = useStore()
  const { items } = useBag()
  const navigate = useNavigate()
  const tops = useMemo(() => items.filter((p) => p.slot === 'top'), [items])
  const bottoms = useMemo(() => items.filter((p) => p.slot === 'bottom'), [items])
  const mounted = useRef(false) // the empty box fades in when the last piece leaves, not when the screen opens
  useEffect(() => {
    mounted.current = true
  }, [])

  // "+ Add a top" and "No tops yet" open Events with the Tops chip on; the empty room opens plain Events.
  const openEvents = (slot?: Slot) => {
    dispatch({ type: 'setFilters', filters: slot ? [{ kind: 'category', value: slot }] : [] })
    navigate('/events')
  }

  return (
    <main className="screen change-room">
      <TopBar />
      <h1 className="visually-hidden">Change room</h1>
      <div className="cr-stage">
        {items.length === 0 ? (
          <EmptySlot kind="all" appear={mounted.current} onClick={() => openEvents()} />
        ) : (
          <>
            <SlotRow slot="top" items={tops} currentId={state.current.top} side={state.side} onAdd={() => openEvents('top')} />
            <SlotRow slot="bottom" items={bottoms} currentId={state.current.bottom} side={state.side} notch onAdd={() => openEvents('bottom')} />
            <RoundButton
              icon="ai-sparkle"
              label="Try it on"
              className="cr-try-on"
              onClick={() => {
                dispatch({ type: 'toast', toast: null })
                navigate('/change-room/try-on')
              }}
            />
          </>
        )}
      </div>
      <Outlet />
    </main>
  )
}

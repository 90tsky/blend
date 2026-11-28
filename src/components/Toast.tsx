import { useEffect, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocation, useNavigate } from 'react-router'
import { productsById } from '../data/products'
import { useWide } from '../lib/useWide'
import { useBagActions, useStore, type Toast, type ToastKind } from '../state/store'
import './Toast.css'

// How long each message stays (Figma toast 745:3668). Undo stays available the whole time.
const DURATION: Record<ToastKind, number> = { added: 4500, removed: 6000, emptied: 6000, 'only-one': 4500, 'checkout-empty': 4500, undone: 3300, 'searches-cleared': 3300 }

// The one toast for every screen: "Added to change room · Undo · View", "Removed <piece> · Undo", "Change room emptied ·
// Undo", "Undone!", "That’s your only top/bottom · Add more", "Add pieces to check out · Add more". It rises 20px while
// fading in (250ms) and leaves in 200ms.
export function ToastHost() {
  const { state, dispatch } = useStore()
  const actions = useBagActions()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const toast = state.toast
  const [paused, setPaused] = useState(false)

  // A new message starts its own timer; it waits while the pointer or focus is on the toast.
  useEffect(() => setPaused(false), [toast?.key])
  useEffect(() => {
    if (!toast || paused) return
    const timer = window.setTimeout(() => dispatch({ type: 'toast', toast: null }), DURATION[toast.kind])
    return () => window.clearTimeout(timer)
  }, [toast, paused, dispatch])

  // Where the toast rests: one place on every screen (the user, 5 Nov), 24 inside the frame or content edge, whether
  // or not a dashed empty box is behind it: 36 from the screen sides (Toast.css), 24 above the bottom bar (132, or 192
  // with filter chips) on Events and in the change room, 24 short of the notch round Try it on, 24 above a bottom
  // button elsewhere (12 + 48), and 36 from the bottom on Options, like the sides. Try-On covers it.
  // On a laptop (SplitLayout) Events and the change room are open together, and the toast rests in the change room,
  // 24 above the one-row bar (72), beside Try it on; View is left out, since the change room is already in view.
  const at = (path: string) => pathname === path || pathname.startsWith(`${path}/`)
  const wide = useWide()
  const onEvents = at('/events')
  const split = wide && onEvents
  const onChangeRoom = at('/change-room') || split
  const besideTryOn = onChangeRoom && state.bag.length > 0
  const bottom = split ? 96 : onEvents ? (state.filters.length > 0 ? 216 : 156) : onChangeRoom ? 156 : at('/menu') ? 36 : 84
  const covered = pathname.includes('/try-on')

  const hide = () => dispatch({ type: 'toast', toast: null })

  return (
    <div
      className="toast-region"
      data-beside={besideTryOn || undefined}
      role="status"
      aria-live="polite"
      style={
        {
          '--toast-bottom': `${bottom}px`,
          // Beside Try it on: 24 short of the frame's notch (at 96 from the right).
          '--toast-right': besideTryOn ? '120px' : undefined,
        } as CSSProperties
      }
    >
      <AnimatePresence>
        {toast && !covered && (
          <ToastPill
            key={toast.key}
            toast={toast}
            showView={!onChangeRoom}
            onUndo={() => toast.undo && actions.undo(toast.undo)}
            onView={() => {
              hide()
              navigate('/change-room')
            }}
            onAddMore={() => {
              hide()
              if (!onEvents) navigate('/events')
            }}
            onPause={setPaused}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

type PillProps = {
  toast: Toast
  showView: boolean
  onUndo: () => void
  onView: () => void
  onAddMore: () => void
  onPause: (paused: boolean) => void
}

function messageOf(toast: Toast) {
  switch (toast.kind) {
    case 'added':
      return 'Added to change room'
    case 'removed':
      return `Removed ${(toast.productId && productsById[toast.productId]?.name) || 'piece'}`
    case 'emptied':
      return 'Change room emptied'
    case 'undone':
      return 'Undone!'
    case 'only-one':
      return `That’s your only ${toast.slot ?? 'piece'}`
    case 'checkout-empty':
      return 'Add pieces to check out'
    case 'searches-cleared':
      return 'Recent searches cleared'
  }
}

function ToastPill({ toast, showView, onUndo, onView, onAddMore, onPause }: PillProps) {
  const message = messageOf(toast)
  const canUndo = (toast.kind === 'added' || toast.kind === 'removed' || toast.kind === 'emptied') && !!toast.undo
  const addMore = toast.kind === 'only-one' || toast.kind === 'checkout-empty'

  return (
    <motion.div
      className={`toast toast--${toast.kind}`}
      // "Undone!" replaces the message in place; the others rise in.
      initial={{ opacity: 0, y: toast.kind === 'undone' ? 0 : 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.2, ease: 'easeIn' } }}
      onPointerEnter={() => onPause(true)}
      onPointerLeave={() => onPause(false)}
      onFocus={() => onPause(true)}
      onBlur={() => onPause(false)}
    >
      <p className="toast__message">{message}</p>
      {canUndo && (
        <button type="button" className={`toast__action${toast.kind === 'added' && showView ? ' toast__action--first' : ''}`} onClick={onUndo}>
          <span className="toast__chip">
            <span className="pill-label">Undo</span>
          </span>
        </button>
      )}
      {toast.kind === 'added' && showView && (
        <button type="button" className="toast__action" onClick={onView}>
          <span className="toast__chip">
            <span className="pill-label">View</span>
          </span>
        </button>
      )}
      {addMore && (
        <button type="button" className="toast__action" onClick={onAddMore}>
          <span className="toast__chip">
            <span className="pill-label">Add more</span>
          </span>
        </button>
      )}
    </motion.div>
  )
}

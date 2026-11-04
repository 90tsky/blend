import { useEffect, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocation, useNavigate } from 'react-router'
import { productsById } from '../data/products'
import { useBagActions, useStore, type Toast, type ToastKind } from '../state/store'
import './Toast.css'

// How long each message stays (Figma toast 745:3668). Undo stays available the whole time.
const DURATION: Record<ToastKind, number> = { added: 4500, removed: 6000, emptied: 6000, 'only-one': 4500, 'checkout-empty': 4500, undone: 3300 }

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

  // Where the pill rests: 12 inside whatever holds it. On Events 12 above the bottom bar (128, or 184 with filter
  // chips) and 12 from the screen edges; in the change room inside the frame or the empty box (the user, 4 Nov): 12 in
  // from its left edge and bottom, and 12 short of the notch round Try it on (x 24 to 322), or of the box's right edge
  // when the room is empty; 12 above a bottom button elsewhere (12 + 48), or the screen edge on Options. Try-On covers it.
  const at = (path: string) => pathname === path || pathname.startsWith(`${path}/`)
  const onEvents = at('/events')
  const onChangeRoom = at('/change-room')
  const besideTryOn = onChangeRoom && state.bag.length > 0
  // With no bottoms, the dashed empty box fills the bottom of the frame (12 inside it): the toast goes 12 inside that.
  const inBox = onChangeRoom && !state.bag.some((id) => productsById[id]?.slot === 'bottom')
  const inset = inBox ? 36 : 24
  const bottom = onEvents ? (state.filters.length > 0 ? 196 : 140) : onChangeRoom ? (inBox ? 152 : 140) : at('/options') ? 12 : 72
  const covered = pathname.includes('/try-on')

  const hide = () => dispatch({ type: 'toast', toast: null })

  return (
    <div
      className="toast-region"
      role="status"
      aria-live="polite"
      style={
        {
          '--toast-bottom': `${bottom}px`,
          '--toast-left': onChangeRoom ? `${inset}px` : undefined,
          // Beside Try it on: 12 short of the notch (the frame's at 96 from the right, the box's at 108).
          '--toast-right': onChangeRoom ? (besideTryOn ? `${inset + 84}px` : `${inset}px`) : undefined,
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
          <span className="toast__chip">Undo</span>
        </button>
      )}
      {toast.kind === 'added' && showView && (
        <button type="button" className="toast__action" onClick={onView}>
          <span className="toast__chip">View</span>
        </button>
      )}
      {addMore && (
        <button type="button" className="toast__action" onClick={onAddMore}>
          <span className="toast__chip">Add more</span>
        </button>
      )}
    </motion.div>
  )
}

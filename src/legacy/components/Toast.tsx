import { useEffect } from 'react'
import { useStore } from '../state/store'
import './Toast.css'

export function Toast() {
  const { state, dispatch } = useStore()
  const toast = state.toast

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => dispatch({ type: 'toast', toast: null }), 3200)
    return () => window.clearTimeout(t)
  }, [toast, dispatch])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.key}>
          <span>{toast.message}</span>
          {toast.view && state.tab !== 'changeRoom' && (
            <button
              onClick={() => {
                dispatch({ type: 'setTab', tab: 'changeRoom' })
                dispatch({ type: 'toast', toast: null })
              }}
            >
              View
            </button>
          )}
          {toast.addMore && (
            <button
              onClick={() => {
                dispatch({ type: 'setTab', tab: 'events' })
                dispatch({ type: 'toast', toast: null })
              }}
            >
              Add more
            </button>
          )}
          {toast.undo && (
            <button
              onClick={() => {
                dispatch({ type: 'restore', snapshot: toast.undo! })
                dispatch({ type: 'toast', toast: { message: 'Undone!' } })
              }}
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  )
}

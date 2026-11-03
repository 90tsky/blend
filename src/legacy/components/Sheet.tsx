import { useEffect, useId, useRef, type ReactNode, type PointerEvent } from 'react'
import { CloseIcon } from './icons'
import { Toast } from './Toast'
import './Sheet.css'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

// Bottom sheet built on <dialog>: Esc closes it, focus stays inside, and it can be dragged down to dismiss.
export function Sheet({ open, onClose, title, subtitle, children, footer }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const drag = useRef<{ startY: number; dy: number } | null>(null)
  const titleId = useId() // each sheet gets its own title, so screen readers announce the right one

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const onPointerDown = (e: PointerEvent) => {
    drag.current = { startY: e.clientY, dy: 0 }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: PointerEvent) => {
    if (!drag.current || !ref.current) return
    drag.current.dy = Math.max(0, e.clientY - drag.current.startY)
    ref.current.style.transform = `translateY(${drag.current.dy}px)`
  }
  const onPointerUp = () => {
    if (!drag.current || !ref.current) return
    const { dy } = drag.current
    drag.current = null
    ref.current.style.transform = ''
    if (dy > 90) onClose()
  }

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose() // tap on the backdrop
      }}
    >
      <div className="sheet__grab" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <span className="sheet__handle" />
        <div className="sheet__head">
          <div>
            <h2 id={titleId} className="sheet__title">
              {title}
            </h2>
            {subtitle && <p className="sheet__subtitle">{subtitle}</p>}
          </div>
          <button className="sheet__close" onClick={onClose} onPointerDown={(e) => e.stopPropagation()} aria-label="Close">
            <CloseIcon size={22} />
          </button>
        </div>
      </div>
      <div className="sheet__body">{children}</div>
      {footer && <div className="sheet__footer">{footer}</div>}
      {/* A modal sheet hides everything behind it, so its toasts (Undo, Undone!) live inside it. */}
      {open && <Toast />}
    </dialog>
  )
}

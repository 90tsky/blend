import { useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { MEASUREMENTS, SIZE_KEYS, SIZE_SYSTEMS, sizeLabel, type SizeSystem } from '../data/sizes'
import { useStore } from '../state/store'
import { Icon } from '../ui/Icon'
import { Segmented } from './SizePicker'
import './SizeGuide.css'

// Figma Size guide (615:2240): a sheet that moves up over a 40% dim. The dim and ✕ close it, and so does Escape.
export function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <AnimatePresence>{open && <SizeGuideSheet onClose={onClose} />}</AnimatePresence>
}

function SizeGuideSheet({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore()
  const sheet = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const close = useRef(onClose)
  useLayoutEffect(() => {
    close.current = onClose
  })

  // Focus moves into the sheet and stays there; it goes back to "Size guide" when the sheet closes.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeButton.current?.focus()
    const root = document.documentElement
    const overflow = root.style.overflow
    root.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close.current()
        return
      }
      if (e.key !== 'Tab' || !sheet.current) return
      const items = Array.from(sheet.current.querySelectorAll<HTMLElement>('button:not([tabindex="-1"])'))
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      const inside = sheet.current.contains(document.activeElement)
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      root.style.overflow = overflow
      opener?.focus()
    }
  }, [])

  const system = state.sizeSystem

  return createPortal(
    <div className="size-guide">
      <motion.div
        className="size-guide__dim"
        onClick={() => close.current()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
      />
      <motion.div
        ref={sheet}
        className="size-guide__sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        initial={{ y: '100%' }}
        animate={{ y: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
        exit={{ y: '100%', transition: { duration: 0.2, ease: 'easeIn' } }}
      >
        <div className="size-guide__header">
          <h2 id="size-guide-title" className="size-guide__title">
            Size guide
          </h2>
          <button ref={closeButton} type="button" className="size-guide__close" aria-label="Close" onClick={() => close.current()}>
            <Icon name="close" />
          </button>
        </div>

        <div className="size-guide__group">
          <p id="size-guide-system" className="size-guide__label">
            Size system
          </p>
          <Segmented
            options={SIZE_SYSTEMS.map((s) => ({ value: s, label: s }))}
            value={system}
            onChange={(next: SizeSystem) => dispatch({ type: 'setSizeSystem', system: next })}
            labelledBy="size-guide-system"
          />
        </div>

        <div className="size-guide__card">
          <table className="size-guide__table">
            <thead>
              <tr>
                <th scope="col">Tops · chest</th>
                <th scope="col">Bottoms · waist</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_KEYS.map((key) => (
                <tr key={key}>
                  <td>
                    <span className="size-guide__size">{sizeLabel('top', key, system)}</span>
                    <span className="size-guide__cm">{MEASUREMENTS.top[key]} cm</span>
                  </td>
                  <td>
                    <span className="size-guide__size">{sizeLabel('bottom', key, system)}</span>
                    <span className="size-guide__cm">{MEASUREMENTS.bottom[key]} cm</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="size-guide__tip">
          Not sure? Lay a well-fitting T-shirt flat, measure armpit to armpit and double it. For bottoms, measure across
          the waistband of trousers that fit and double it.
        </p>
      </motion.div>
    </div>,
    document.body,
  )
}

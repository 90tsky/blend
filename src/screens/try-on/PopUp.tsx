import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import './PopUp.css'

type Props = { trigger: number; action?: ReactNode; fixed?: boolean; children: ReactNode }

// The in-screen pop-up (Figma 1640:7114, e.g. "Saved to your photos"): rises 20px and fades in (250ms), stays about
// 2.5s, then leaves (200ms ease-in), 12 above the button under it. Set `trigger` to a new value (Date.now()) to show it.
// `fixed` pins it to the bottom of the screen instead of above its parent.
export function PopUp({ trigger, action, fixed = false, children }: Props) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!trigger) return
    setShown(trigger)
    const t = window.setTimeout(() => setShown(0), 2500)
    return () => window.clearTimeout(t)
  }, [trigger])

  return (
    <div className={`popup${fixed ? ' popup--fixed' : ''}`} role="status">
      <AnimatePresence>
        {shown ? (
          <motion.div
            key={shown}
            className="popup__pill"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.2, ease: 'easeIn' } }}
          >
            <span>{children}</span>
            {action}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

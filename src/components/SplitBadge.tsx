import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { Icon } from '../ui/Icon'
import './SplitBadge.css'

const cap = (n: number) => (n > 99 ? '99+' : String(n))

// badge · split (Figma 1793:295): the change room count as tops · bottoms, on "UNDO grey".
// Each half hides at 0, the badge hides when the room is empty. With 99+ of both it shows a single "99+".
// Motion: grows in 180ms ease-out, leaves 180ms ease-in; a new count pops +15% in 100ms, settling in 180ms.
// It's visual only: the tab says "Change room, 2 tops, 1 bottom".
export function SplitBadge({ tops, bottoms }: { tops: number; bottoms: number }) {
  const total = tops + bottoms
  const [scope, animate] = useAnimate<HTMLSpanElement>()
  const seen = useRef({ tops, bottoms })

  useEffect(() => {
    const was = seen.current
    seen.current = { tops, bottoms }
    if (was.tops === tops && was.bottoms === bottoms) return
    if (was.tops + was.bottoms === 0 || total === 0 || !scope.current) return // grow / leave instead
    animate(scope.current, { scale: [1, 1.15, 1] }, { duration: 0.28, times: [0, 0.36, 1], ease: ['easeOut', 'easeInOut'] })
  }, [tops, bottoms, total, animate, scope])

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {total > 0 && (
        <motion.span
          key="badge"
          className="split-badge"
          aria-hidden="true"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { duration: 0.18, ease: 'easeOut' } }}
          exit={{ scale: 0, opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }}
        >
          <span ref={scope} className="split-badge__pill">
            {tops > 99 && bottoms > 99 ? (
              <span>99+</span>
            ) : (
              <>
                {tops > 0 && (
                  <span className="split-badge__half">
                    <Icon name="glyph-top" size={12} />
                    {cap(tops)}
                  </span>
                )}
                {bottoms > 0 && (
                  <span className="split-badge__half">
                    <Icon name="glyph-bottom" size={12} />
                    {cap(bottoms)}
                  </span>
                )}
              </>
            )}
          </span>
        </motion.span>
      )}
    </AnimatePresence>
  )
}

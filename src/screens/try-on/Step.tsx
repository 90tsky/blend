import { useEffect, useRef, type ReactNode } from 'react'
import { Icon } from '../../ui/Icon'
import { TopBar } from '../../ui/primitives'
import { useTryOn } from './flow'

type Props = { title: string; subtitle?: ReactNode; fit?: boolean; note?: ReactNode; actions?: ReactNode; children: ReactNode }

// One Try-On screen: the top bar with the logo only (✕ is the one way out), ✕ + title + subtitle, the content, then
// a line and the buttons at the bottom. `fit` steps fill the screen so their photo grows into the space left.
export function Step({ title, subtitle, fit = false, note, actions, children }: Props) {
  const { close } = useTryOn()
  const titleRef = useRef<HTMLHeadingElement>(null)

  // Screen readers start each step from its title.
  useEffect(() => titleRef.current?.focus({ preventScroll: true }), [])

  return (
    <div className={`step${fit ? ' step--fit' : ''}`}>
      <TopBar menu={false} />
      <div className="header">
        <button type="button" className="header__lead" aria-label="Close" onClick={close}>
          <Icon name="close" />
        </button>
        <h1 ref={titleRef} className="header__title" tabIndex={-1}>
          {title}
        </h1>
        {subtitle && <p className="header__subtitle">{subtitle}</p>}
      </div>
      <div className="step__body">{children}</div>
      {(note || actions) && (
        <div className="step__footer">
          {note && <p className="step__note">{note}</p>}
          {actions}
        </div>
      )}
    </div>
  )
}

// The privacy line on the photo screens.
export function Privacy() {
  return (
    <>
      Your photo is only used for this preview. We <b>don’t keep it</b>.
    </>
  )
}

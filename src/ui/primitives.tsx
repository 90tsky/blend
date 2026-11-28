import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Icon, type IconName } from './Icon'
import { Logo } from './Logo'
import './ui.css'

type CtaProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary'; children: ReactNode }

// The Figma "cta" button. Labels are written in sentence case; the style makes them upper case. A plain label goes in a
// span, so it's centred on its capitals like every pill's words (ui.css, .pill-label).
export function Cta({ variant = 'primary', className = '', children, ...rest }: CtaProps) {
  return (
    <button type="button" className={`cta cta--${variant} ${className}`} {...rest}>
      {typeof children === 'string' ? <span>{children}</span> : children}
    </button>
  )
}

type RoundButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName; label: string; dot?: boolean | 'add' }

// 72 × 48 raised white pill with an icon. `label` is the spoken name. `dot` puts a small dark dot at the icon's top
// right; 'add' draws a small white + in it (search with filters on: "add a filter", the user, 28 Nov), in the tags' ✕
// line weight (1.15), so it doesn't read as the product cards' bold +.
export function RoundButton({ icon, label, dot, className = '', ...rest }: RoundButtonProps) {
  return (
    <button type="button" className={`round-btn ${className}`} aria-label={label} {...rest}>
      <Icon name={icon} />
      {dot && (
        <span className={`round-btn__dot${dot === 'add' ? ' round-btn__dot--add' : ''}`} aria-hidden="true">
          {dot === 'add' && (
            <svg viewBox="0 0 10 10" width="10" height="10">
              <path d="M5 2.4v5.2M2.4 5h5.2" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
            </svg>
          )}
        </span>
      )}
    </button>
  )
}

// Fixed top bar: logo left, menu right. "overlay" sits over a photo (white logo on a soft shade).
export function TopBar({ variant = 'plain', menu = true }: { variant?: 'plain' | 'overlay'; menu?: boolean }) {
  const navigate = useNavigate()
  return (
    <header className={`top-bar top-bar--${variant}`}>
      <Logo className="top-bar__logo" />
      {menu && <RoundButton icon="menu" label="Menu" onClick={() => navigate('/menu')} />}
    </header>
  )
}

type HeaderProps = { title: string; subtitle?: ReactNode; lead?: 'back' | 'close' | 'none'; onLead?: () => void }

// Screen header: ← (Back) or ✕ (Close), the title and an optional subtitle.
export function Header({ title, subtitle, lead = 'back', onLead }: HeaderProps) {
  const navigate = useNavigate()
  return (
    <div className="header">
      {lead !== 'none' && (
        <button type="button" className="header__lead" aria-label={lead === 'back' ? 'Back' : 'Close'} onClick={onLead ?? (() => navigate(-1))}>
          <Icon name={lead === 'back' ? 'back' : 'close'} />
        </button>
      )}
      <h1 className="header__title">{title}</h1>
      {subtitle && <p className="header__subtitle">{subtitle}</p>}
    </div>
  )
}

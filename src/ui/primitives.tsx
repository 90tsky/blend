import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Icon, type IconName } from './Icon'
import { Logo } from './Logo'
import './ui.css'

type CtaProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary'; children: ReactNode }

// The Figma "cta" button. Labels are written in sentence case; the style makes them upper case.
export function Cta({ variant = 'primary', className = '', children, ...rest }: CtaProps) {
  return (
    <button type="button" className={`cta cta--${variant} ${className}`} {...rest}>
      {children}
    </button>
  )
}

type RoundButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName; label: string; dot?: boolean }

// 72 × 48 raised white pill with an icon. `label` is the spoken name.
export function RoundButton({ icon, label, dot, className = '', ...rest }: RoundButtonProps) {
  return (
    <button type="button" className={`round-btn ${className}`} aria-label={label} {...rest}>
      <Icon name={icon} />
      {dot && <span className="round-btn__dot" aria-hidden="true" />}
    </button>
  )
}

// Fixed top bar: logo left, menu right. "overlay" sits over a photo (white logo on a soft shade).
export function TopBar({ variant = 'plain', menu = true }: { variant?: 'plain' | 'overlay'; menu?: boolean }) {
  const navigate = useNavigate()
  return (
    <header className={`top-bar top-bar--${variant}`}>
      <Logo className="top-bar__logo" />
      {menu && <RoundButton icon="menu" label="Options" onClick={() => navigate('/options')} />}
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

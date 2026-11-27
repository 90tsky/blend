import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { Header, TopBar } from '../../ui/primitives'
import { Icon } from '../../ui/Icon'
import '../Options.css'
import './menu.css'

// The menu's pages (the user, 27 Nov: "better arranged like in an iPhone settings"): the top bar, a pinned header with
// ← and the title, then the page. The menu itself has no menu button, as it's open.
type PageProps = { title: string; subtitle?: ReactNode; up?: string; className?: string; children: ReactNode }

export function MenuPage({ title, subtitle, up = '/menu', className = '', children }: PageProps) {
  const navigate = useNavigate()
  // Back to where the page was opened from; on a fresh load, up to `up` (the menu, or Events from the menu itself).
  const back = () => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate(up))
  return (
    <main className={`screen options ${className}`}>
      <TopBar menu={false} />
      <div className="options__head">
        <Header title={title} subtitle={subtitle} onLead={back} />
      </div>
      <div className="options__body">{children}</div>
    </main>
  )
}

// A white card of rows with hairlines between them, like an iPhone settings group, with an optional title above and
// note below.
// `radiogroup`: the rows are one choice (Currency), named by this.
export function Group({ title, note, children, label, radiogroup }: { title?: string; note?: ReactNode; children: ReactNode; label?: string; radiogroup?: string }) {
  const id = title ? `group-${title.toLowerCase().replace(/[^a-z]+/g, '-')}` : undefined
  return (
    <section className="menu-group-wrap" aria-labelledby={id} aria-label={title ? undefined : label}>
      {title && (
        <h2 className="menu-group__title" id={id}>
          {title}
        </h2>
      )}
      <ul className="menu-group" role={radiogroup ? 'radiogroup' : undefined} aria-label={radiogroup}>
        {children}
      </ul>
      {note && <p className="menu-group__note">{note}</p>}
    </section>
  )
}

type RowProps = {
  label: ReactNode
  detail?: ReactNode // a second line under the label
  value?: ReactNode // on the right, before › (Currency: EUR)
  lead?: ReactNode // on the left: a photo or picture
  danger?: boolean
  checked?: boolean // a ✓ on the right (a choice in a list)
  spoken?: string
}

function RowFace({ label, detail, value, lead, checked, trail }: RowProps & { trail?: 'chevron' | 'external' }) {
  return (
    <>
      {lead && <span className="menu-row__lead">{lead}</span>}
      <span className="menu-row__text">
        <span className="menu-row__label">{label}</span>
        {detail && <span className="menu-row__detail">{detail}</span>}
      </span>
      {value && <span className="menu-row__value">{value}</span>}
      {checked && <Icon name="check" className="menu-row__check" />}
      {trail && <Icon name={trail} size={20} className="menu-row__trail" />}
    </>
  )
}

const rowClass = (danger?: boolean) => `menu-row${danger ? ' menu-row--danger' : ''}`

// A row that opens another page in blend (›).
export function LinkRow({ to, ...props }: RowProps & { to: string }) {
  return (
    <li>
      <Link to={to} className={rowClass(props.danger)} aria-label={props.spoken}>
        <RowFace {...props} trail="chevron" />
      </Link>
    </li>
  )
}

// A row that leaves blend: an email or another site (↗).
export function OutRow({ href, newTab = true, ...props }: RowProps & { href: string; newTab?: boolean }) {
  return (
    <li>
      <a href={href} className={rowClass(props.danger)} aria-label={props.spoken} {...(newTab ? { target: '_blank', rel: 'noopener' } : {})}>
        <RowFace {...props} trail="external" />
      </a>
    </li>
  )
}

// A row that does something here (Clear recent searches), or picks a choice (✓).
export function ButtonRow({ onClick, disabled, chevron, role, ...props }: RowProps & { onClick: () => void; disabled?: boolean; chevron?: boolean; role?: 'radio' }) {
  return (
    <li role={role ? 'none' : undefined}>
      <button
        type="button"
        className={rowClass(props.danger)}
        aria-label={props.spoken}
        disabled={disabled}
        onClick={onClick}
        role={role}
        aria-checked={role === 'radio' ? Boolean(props.checked) : undefined}
      >
        <RowFace {...props} trail={chevron ? 'chevron' : undefined} />
      </button>
    </li>
  )
}

// A row with an on/off switch. The label names the switch; tapping anywhere on the row flips it.
export function SwitchRow({ id, label, detail, on, onChange }: { id: string; label: string; detail?: string; on: boolean; onChange: (on: boolean) => void }) {
  return (
    <li>
      <div className="menu-row menu-row--switch" onClick={() => onChange(!on)}>
        <span className="menu-row__text">
          <label className="menu-row__label" htmlFor={id} onClick={(e) => e.stopPropagation()}>
            {label}
          </label>
          {detail && (
            <span className="menu-row__detail" id={`${id}-detail`}>
              {detail}
            </span>
          )}
        </span>
        <button
          id={id}
          type="button"
          role="switch"
          className="switch"
          aria-checked={on}
          aria-describedby={detail ? `${id}-detail` : undefined}
          onClick={(e) => {
            e.stopPropagation()
            onChange(!on)
          }}
        >
          <span className="switch__knob" aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}

// A row holding its own control under the label (Appearance's Light · Dark · Auto).
export function ControlRow({ labelId, label, children }: { labelId: string; label: string; children: ReactNode }) {
  return (
    <li>
      <div className="menu-row menu-row--control">
        <span className="menu-row__label" id={labelId}>
          {label}
        </span>
        {children}
      </div>
    </li>
  )
}

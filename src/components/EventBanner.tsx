import type { CSSProperties } from 'react'
import type { EventInfo } from '../data/events'
import './EventBanner.css'

type Props = { event: EventInfo; headingId?: string; eager?: boolean }

// Figma event-banner (378:8785–378:8792): full-bleed photo, the shared shade, and the title as live text in the
// event's own font, its baseline 32 above the bottom. On Events it sticks to the top while its section scrolls.
// Banners don't open anything (since 2 Nov 2026).
export function EventBanner({ event, headingId, eager = false }: Props) {
  const style = { '--banner-font': event.font.family, '--banner-size': event.font.size } as CSSProperties
  return (
    <div className={`event-banner${event.banner ? '' : ' event-banner--plain'}`} style={style}>
      {event.banner && (
        <img
          className="event-banner__photo"
          src={event.banner}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          draggable={false}
        />
      )}
      <h2 id={headingId} className="event-banner__title">
        {event.title}
      </h2>
    </div>
  )
}

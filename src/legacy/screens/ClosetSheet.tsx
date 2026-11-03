import { Garment } from '../components/Garment'
import { Sheet } from '../components/Sheet'
import { formatPrice } from '../data/products'
import { useBag, useStore } from '../state/store'
import './sheets.css'

// Every top × bottom combination in the change room. Tap one to try it on in the change room.
export function ClosetSheet() {
  const { state, dispatch } = useStore()
  const { tops, bottoms } = useBag()
  const outfits = tops.flatMap((top) => bottoms.map((bottom) => ({ top, bottom })))
  const close = () => dispatch({ type: 'openSheet', sheet: null })

  const subtitle =
    outfits.length > 0
      ? `${tops.length} ${tops.length === 1 ? 'top' : 'tops'} × ${bottoms.length} ${bottoms.length === 1 ? 'bottom' : 'bottoms'} = ${outfits.length} ${outfits.length === 1 ? 'outfit' : 'outfits'}`
      : 'Every outfit your pieces can make'

  return (
    <Sheet open={state.sheet === 'closet'} onClose={close} title="Closet" subtitle={subtitle}>
      {outfits.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">{tops.length === 0 && bottoms.length === 0 ? 'Your closet is empty' : `Add a ${tops.length === 0 ? 'top' : 'bottom'} to start`}</p>
          <p className="empty-state__text">Outfits appear here as soon as your change room has at least one top and one bottom. Every new piece multiplies what you can wear.</p>
          <button
            className="pill pill--dark"
            onClick={() => {
              dispatch({ type: 'setTab', tab: 'events' })
              close()
            }}
          >
            Browse events
          </button>
        </div>
      ) : (
        <ul className="closet-grid">
          {outfits.map(({ top, bottom }) => {
            const isCurrent = state.current.top === top.id && state.current.bottom === bottom.id
            return (
              <li key={top.id + bottom.id}>
                <button
                  className={`outfit-card ${isCurrent ? 'is-current' : ''}`}
                  onClick={() => {
                    dispatch({ type: 'showOutfit', top: top.id, bottom: bottom.id })
                    dispatch({ type: 'setTab', tab: 'changeRoom' })
                    close()
                  }}
                  aria-label={`${top.name} with ${bottom.name}, ${formatPrice(top.price + bottom.price)} EUR${isCurrent ? ', showing now' : ''}`}
                >
                  <span className="outfit-card__look">
                    <Garment product={top} side={state.side} className="outfit-card__top" />
                    <Garment product={bottom} side={state.side} className="outfit-card__bottom" />
                  </span>
                  <span className="outfit-card__price">{formatPrice(top.price + bottom.price)} EUR</span>
                  {isCurrent && <span className="outfit-card__badge">Showing</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Sheet>
  )
}

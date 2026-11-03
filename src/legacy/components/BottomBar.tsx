import { formatPrice } from '../data/products'
import { useBag, useStore } from '../state/store'
import './BottomBar.css'

export function BottomBar() {
  const { state, dispatch } = useStore()
  const { items, total } = useBag()

  return (
    <nav className="bottom-bar" aria-label="Main">
      <div className="bottom-bar__tabs">
        <button
          className={`pill ${state.tab === 'events' ? 'pill--outline' : 'pill--light'}`}
          aria-current={state.tab === 'events' ? 'page' : undefined}
          onClick={() => dispatch({ type: 'setTab', tab: 'events' })}
        >
          Events
        </button>
        <button
          className={`pill ${state.tab === 'changeRoom' ? 'pill--outline' : 'pill--light'}`}
          aria-current={state.tab === 'changeRoom' ? 'page' : undefined}
          onClick={() => dispatch({ type: 'setTab', tab: 'changeRoom' })}
        >
          Change room
          {items.length > 0 && (
            <>
              <span className="bottom-bar__count" aria-hidden="true">
                {items.length}
              </span>
              <span className="visually-hidden">, {items.length === 1 ? '1 piece' : `${items.length} pieces`} in your change room</span>
            </>
          )}
        </button>
      </div>
      <button
        className="pill pill--dark pill--block bottom-bar__cart"
        disabled={items.length === 0}
        aria-describedby={items.length === 0 ? 'checkout-hint' : undefined}
        onClick={() => dispatch({ type: 'openSheet', sheet: 'checkout' })}
      >
        <span>Checkout</span>
        {items.length > 0 && <span>{formatPrice(total)} EUR</span>}
      </button>
      <span id="checkout-hint" className="visually-hidden">
        Add pieces to check out.
      </span>
    </nav>
  )
}

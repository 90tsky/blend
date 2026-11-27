import type { Currency as CurrencyCode } from '../../lib/format'
import { useStore } from '../../state/store'
import { ButtonRow, Group, MenuPage } from './List'

export const CURRENCY_NAMES: Record<CurrencyCode, string> = { EUR: 'Euro', USD: 'US dollar', GBP: 'British pound' }
const CODES = Object.keys(CURRENCY_NAMES) as CurrencyCode[]

// Menu › Currency: a list with a ✓ on the chosen one, as on an iPhone. Prices are set in euros and shown in the chosen
// currency at demo rates (lib/format.ts).
export function Currency() {
  const { state, dispatch } = useStore()
  return (
    <MenuPage title="Currency" subtitle="Prices across blend are shown in this currency.">
      <Group radiogroup="Currency" note="Rates are for show: blend is a design project, so nothing is charged.">
        {CODES.map((code) => (
          <ButtonRow
            key={code}
            role="radio"
            label={CURRENCY_NAMES[code]}
            value={code}
            checked={state.currency === code}
            onClick={() => dispatch({ type: 'setCurrency', currency: code })}
          />
        ))}
      </Group>
    </MenuPage>
  )
}

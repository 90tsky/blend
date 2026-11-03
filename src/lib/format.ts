export type Currency = 'EUR' | 'USD' | 'GBP'

// Demo rates: prices are set in EUR and shown in the shopper's chosen currency.
const RATES: Record<Currency, number> = { EUR: 1, USD: 1.08, GBP: 0.85 }

// "42.00", "1,204.00" (comma for thousands, as in the voice guide)
export function formatAmount(eur: number, currency: Currency = 'EUR') {
  return (eur * RATES[currency]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// "42.00 EUR"
export function formatPrice(eur: number, currency: Currency = 'EUR') {
  return `${formatAmount(eur, currency)} ${currency}`
}

// "1 piece", "4 pieces"
export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`
}

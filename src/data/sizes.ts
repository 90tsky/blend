import type { Slot } from './products'

export type SizeSystem = 'EU' | 'US' | 'UK' | 'Asia'
export type SizeKey = 'XS' | 'S' | 'M' | 'L' | 'XL'

export const SIZE_KEYS: SizeKey[] = ['XS', 'S', 'M', 'L', 'XL']
export const SIZE_SYSTEMS: SizeSystem[] = ['EU', 'US', 'UK', 'Asia']

// Labels from the Figma "size system" collection.
const LABELS: Record<Slot, Record<SizeKey, Record<SizeSystem, string>>> = {
  top: {
    XS: { EU: '44', US: 'XS', UK: '34', Asia: 'S' },
    S: { EU: '46', US: 'S', UK: '36', Asia: 'M' },
    M: { EU: '48', US: 'M', UK: '38', Asia: 'L' },
    L: { EU: '50', US: 'L', UK: '40', Asia: 'XL' },
    XL: { EU: '52', US: 'XL', UK: '42', Asia: 'XXL' },
  },
  bottom: {
    XS: { EU: '44', US: '28', UK: '28', Asia: 'S' },
    S: { EU: '46', US: '30', UK: '30', Asia: 'M' },
    M: { EU: '48', US: '32', UK: '32', Asia: 'L' },
    L: { EU: '50', US: '34', UK: '34', Asia: 'XL' },
    XL: { EU: '52', US: '36', UK: '36', Asia: 'XXL' },
  },
}

export function sizeLabel(slot: Slot, key: SizeKey, system: SizeSystem) {
  return LABELS[slot][key][system]
}

// Size guide measurements (cm), from the Figma Size guide: tops by chest, bottoms by waist.
export const MEASUREMENTS: Record<Slot, Record<SizeKey, number>> = {
  top: { XS: 86, S: 92, M: 98, L: 104, XL: 110 },
  bottom: { XS: 72, S: 76, M: 81, L: 86, XL: 91 },
}

// Each occasion (shown to shoppers as an "event") is a capsule: every top in it goes with every bottom in it.
// The 8 events, their order and their pieces follow the Figma prototype (Blend-remake): 4 tops and 2 bottoms each,
// taken from the events line on each Figma product page.
export type Occasion = {
  id: string
  title: string
  // Banner photo. Leave it out until a photo exists; the banner then shows a plain dark background.
  banner?: string
  // Display font for the banner title. Each occasion is meant to get its own personality.
  font: { family: string; weight: number; size: number }
  productIds: string[]
}

const serif = { family: '"Noto Serif", serif', weight: 300, size: 30 }

export const occasions: Occasion[] = [
  {
    id: 'casual',
    title: 'Casual',
    banner: '/events/casual.webp',
    font: { family: '"Notable", sans-serif', weight: 400, size: 44 },
    productIds: ['g21', 'g14', 'g19', 'g08', 'g02', 'g01'],
  },
  {
    id: 'outdoors',
    title: 'Outdoors',
    banner: '/events/outdoors.webp',
    font: serif,
    productIds: ['g11', 'g20', 'g12', 'g16', 'g01', 'g03'],
  },
  {
    id: 'office-hours',
    title: 'Office hours',
    banner: '/events/work.webp',
    font: { family: '"Shrikhand", serif', weight: 400, size: 42 },
    productIds: ['g07', 'g15', 'g13', 'g06', 'g01', 'g03'],
  },
  {
    id: 'day-off',
    title: 'Day off',
    // No banner photo yet: see the plain fallback in OccasionSection.css.
    font: serif,
    productIds: ['g10', 'g08', 'g06', 'g18', 'g02', 'g04'],
  },
  {
    id: 'maternity',
    title: 'Maternity',
    banner: '/events/maternity.webp',
    font: serif,
    productIds: ['g08', 'g06', 'g18', 'g20', 'g02', 'g04'],
  },
  {
    id: 'working-out',
    title: 'Working out',
    banner: '/events/sport.webp',
    font: serif,
    productIds: ['g17', 'g21', 'g18', 'g06', 'g02', 'g04'],
  },
  {
    id: 'night-out',
    title: 'Night out',
    banner: '/events/evening.webp',
    font: serif,
    productIds: ['g15', 'g09', 'g13', 'g07', 'g03', 'g05'],
  },
  {
    id: 'beach-day',
    title: 'Beach day',
    banner: '/events/beach.webp',
    font: serif,
    productIds: ['g17', 'g19', 'g18', 'g14', 'g04', 'g05'],
  },
]

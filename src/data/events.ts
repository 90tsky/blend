import { asset } from '../lib/asset'

// Each event is a capsule: every top in it goes with every bottom in it.
// The 8 events, their order, pieces, banner fonts and sizes follow the Figma file (Blend-remake, Events 320:7350).
export type EventInfo = {
  id: string
  title: string
  banner?: string // photo behind the title; without one the banner falls back to a plain dark plate
  font: { family: string; size: number } // banner title, as in the Figma text styles "banner/…"
  productIds: string[] // 4 tops, then 2 bottoms
}

export const events: EventInfo[] = [
  { id: 'casual', title: 'Casual', banner: asset('events/casual.webp'), font: { family: '"Notable", sans-serif', size: 63 }, productIds: ['g21', 'g14', 'g19', 'g08', 'g02', 'g01'] },
  { id: 'outdoors', title: 'Outdoors', banner: asset('events/outdoors.webp'), font: { family: '"Alfa Slab One", serif', size: 56 }, productIds: ['g11', 'g20', 'g12', 'g16', 'g01', 'g03'] },
  { id: 'office-hours', title: 'Office hours', banner: asset('events/work.webp'), font: { family: '"DM Serif Display", serif', size: 67 }, productIds: ['g07', 'g15', 'g13', 'g06', 'g01', 'g03'] },
  { id: 'day-off', title: 'Day off', font: { family: '"Kranky", cursive', size: 63 }, productIds: ['g10', 'g06', 'g18', 'g08', 'g02', 'g04'] },
  { id: 'maternity', title: 'Maternity', banner: asset('events/maternity.webp'), font: { family: '"Italiana", serif', size: 63 }, productIds: ['g08', 'g06', 'g18', 'g20', 'g02', 'g04'] },
  { id: 'working-out', title: 'Working out', banner: asset('events/sport.webp'), font: { family: '"Racing Sans One", sans-serif', size: 65 }, productIds: ['g17', 'g18', 'g21', 'g06', 'g02', 'g04'] },
  { id: 'night-out', title: 'Night out', banner: asset('events/evening.webp'), font: { family: '"Monoton", cursive', size: 54 }, productIds: ['g15', 'g09', 'g13', 'g07', 'g03', 'g05'] },
  { id: 'beach-day', title: 'Beach day', banner: asset('events/beach.webp'), font: { family: '"Pacifico", cursive', size: 52 }, productIds: ['g17', 'g19', 'g14', 'g18', 'g04', 'g05'] },
]

export const eventsById: Record<string, EventInfo> = Object.fromEntries(events.map((e) => [e.id, e]))

// The events a piece appears in, in Events order ("Casual, Working out").
export function eventsFor(productId: string) {
  return events.filter((e) => e.productIds.includes(productId))
}

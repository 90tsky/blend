import type { Filter, NoteKind } from '../state/store'
import { events } from './events'
import { productsById } from './products'

// The inbox in Menu › Notifications: what blend has already told the shopper (the user, 27 Nov: switches for what to
// hear about, "where in A there is an inbox with past notifications panel"). Demo notes, after the Figma Notifications
// screen (New and Earlier; an order on its way, a piece back in your size, new pieces in an event, a delivery).
export type Note = {
  id: string
  kind: NoteKind
  title: string
  body: string
  when: string // as shown, e.g. "2 h ago"
  isNew: boolean
  image: string // a piece's photo, or the event's banner
  to: string // where tapping it goes
  filter?: Filter // Events opens with this filter on (Events' address follows the store's filters, not the other way)
}

const piece = (id: string) => productsById[id].images.front.src
const banner = (id: string) => events.find((e) => e.id === id)?.banner ?? ''

export const NOTES: Note[] = [
  {
    id: 'restock-g12',
    kind: 'restock',
    title: 'Back in your size',
    body: `${productsById.g12.name} is back. Sizes go fast.`,
    when: '2 h ago',
    isNew: true,
    image: piece('g12'),
    to: '/product/g12',
  },
  {
    id: 'new-night-out',
    kind: 'newIn',
    title: 'New in Night out',
    body: 'Three new pieces for evenings out, and they all go together.',
    when: 'Yesterday',
    isNew: true,
    image: banner('night-out'),
    to: '/events',
    filter: { kind: 'event', value: 'night-out' },
  },
  {
    id: 'order-19877',
    kind: 'orders',
    title: 'Your order is on its way',
    body: 'Order BL-19877 has left the warehouse. It should arrive on Friday.',
    when: 'Mon',
    isNew: false,
    image: piece('g15'),
    to: '/coming-soon?for=orders',
  },
  {
    id: 'order-19302',
    kind: 'orders',
    title: 'Delivered',
    body: 'Order BL-19302 was delivered. Enjoy your new pieces!',
    when: '12 Nov',
    isNew: false,
    image: piece('g03'),
    to: '/coming-soon?for=orders',
  },
]

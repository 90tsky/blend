import garmentImages from './garment-images.json'
import { asset } from '../lib/asset'

export type Slot = 'top' | 'bottom'
export type Side = 'front' | 'back'

export type Product = {
  id: string
  brand: string
  name: string
  price: number // EUR
  slot: Slot
  material: string
  // Size tweak in the change room, so the waistband lines up with the other bottoms (1 = default).
  fit?: number
  images: Record<Side, { src: string; width: number; height: number }>
}

// Fictional labels. Product photos come from Figma via `npm run figma:export`.
const catalog: Omit<Product, 'images'>[] = [
  // Bottoms
  { id: 'g01', slot: 'bottom', brand: 'LOAM', name: 'Cream Cargo Trousers', price: 89, material: 'Organic cotton twill' },
  { id: 'g02', slot: 'bottom', brand: 'LOAM', name: 'Heather Grey Joggers', price: 69, material: 'Organic cotton fleece' },
  { id: 'g03', slot: 'bottom', brand: 'VALE', name: 'Indigo Denim Cargo Trousers', price: 119, material: 'Recycled denim' },
  { id: 'g04', slot: 'bottom', brand: 'LOAM', name: 'Black Drawstring Shorts', price: 45, material: 'Organic cotton jersey', fit: 1.2 },
  { id: 'g05', slot: 'bottom', brand: 'SADDLE', name: 'Studded Suede Shorts', price: 139, material: 'Deadstock suede', fit: 1.2 },

  // Tops
  { id: 'g06', slot: 'top', brand: 'LOAM', name: 'Grey Crewneck Sweatshirt', price: 79, material: 'Organic cotton fleece' },
  { id: 'g07', slot: 'top', brand: 'VALE', name: 'Black Overshirt', price: 95, material: 'Tencel twill' },
  { id: 'g08', slot: 'top', brand: 'LOAM', name: 'Cocoa Oversized Hoodie', price: 89, material: 'Organic cotton fleece' },
  { id: 'g09', slot: 'top', brand: 'SADDLE', name: 'Cropped Suede Trucker Jacket', price: 249, material: 'Deadstock suede' },
  { id: 'g10', slot: 'top', brand: 'VALE', name: 'Cream Cropped Bomber', price: 159, material: 'Recycled nylon' },
  { id: 'g11', slot: 'top', brand: 'VALE', name: 'Colour-Block Windbreaker', price: 149, material: 'Recycled nylon' },
  { id: 'g12', slot: 'top', brand: 'VALE', name: 'Olive Cropped Bomber', price: 159, material: 'Recycled nylon' },
  { id: 'g13', slot: 'top', brand: 'VALE', name: 'Black Cropped Bomber', price: 159, material: 'Recycled nylon' },
  { id: 'g14', slot: 'top', brand: 'LOAM', name: 'Cocoa Oversized Tee', price: 39, material: 'Organic cotton' },
  { id: 'g15', slot: 'top', brand: 'SADDLE', name: 'Cropped Leather Jacket', price: 289, material: 'Vegetable-tanned leather' },
  { id: 'g16', slot: 'top', brand: 'SADDLE', name: 'Suede Field Jacket', price: 269, material: 'Deadstock suede' },
  { id: 'g17', slot: 'top', brand: 'LOAM', name: 'White Ribbed Tank', price: 29, material: 'Organic cotton rib' },
  { id: 'g18', slot: 'top', brand: 'LOAM', name: 'Grey Oversized Tee', price: 39, material: 'Organic cotton' },
  { id: 'g19', slot: 'top', brand: 'LOAM', name: 'White Patch Tee', price: 42, material: 'Organic cotton' },
  { id: 'g20', slot: 'top', brand: 'VALE', name: 'Quilted Liner Jacket', price: 179, material: 'Recycled polyester fill' },
  { id: 'g21', slot: 'top', brand: 'LOAM', name: 'Black Sleeve-Logo Tee', price: 42, material: 'Organic cotton' },
]

// Image paths in the JSON are relative to public/; prefix the app's base path (/blend/).
const withBase = (img: { src: string; width: number; height: number }) => ({ ...img, src: asset(img.src) })
const imagesById = Object.fromEntries(garmentImages.map((g) => [g.id, { front: withBase(g.front), back: withBase(g.back) }]))

export const products: Product[] = catalog.map((p) => ({ ...p, images: imagesById[p.id] }))

export const productsById: Record<string, Product> = Object.fromEntries(products.map((p) => [p.id, p]))

export const tops = products.filter((p) => p.slot === 'top')
export const bottoms = products.filter((p) => p.slot === 'bottom')

import type { Product, Slot } from '../data/products'
import type { SizeKey } from '../data/sizes'
import { asset } from '../lib/asset'

export class TryOnUnavailableError extends Error {
  constructor() {
    super('Virtual try-on is not connected yet')
  }
}

export type Build = 'even' | 'hips' | 'shoulders' | 'middle'

export type TryOnRequest = {
  photo: Blob | null // the shopper's photo; null on the "A model like you" route
  photoUrl: string | null // the same photo as a local object URL
  build: Build
  sizes: Record<Slot, SizeKey>
  outfit: Partial<Record<Slot, Product>>
}

// isDemo: a mock result (labelled "Demo preview"), not a real AI render. revoke frees an object URL the provider made.
export type TryOnResult = { imageUrl: string; isDemo: boolean; revoke?: () => void }

// Any try-on provider: takes the request, resolves with the preview image. Swap the one below for a real one later.
export type TryOnProvider = (request: TryOnRequest, signal?: AbortSignal) => Promise<TryOnResult>

export const DEMO_PHOTO = asset('try-on/demo-person.webp')
export const MOCK_DELAY_MS = 3000

// The designer's mock, not real AI: it waits about 3 seconds like a render would, then shows the shopper's own photo
// (or the demo person on the model route) as a "Demo preview". Nothing is uploaded, so photos never leave the device.
export const mockTryOn: TryOnProvider = (request, signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve({ imageUrl: request.photoUrl ?? DEMO_PHOTO, isDemo: true }), MOCK_DELAY_MS)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(new DOMException('Try-on cancelled', 'AbortError'))
      },
      { once: true },
    )
  })

// A real provider behind our server function (requestTryOn below). Not switched on yet.
export const serverTryOn: TryOnProvider = async (request) => {
  if (!request.photo) throw new TryOnUnavailableError() // the model route needs a provider that can render a model
  const imageUrl = await requestTryOn(await preparePhoto(request.photo), request.outfit)
  return { imageUrl, isDemo: false, revoke: () => URL.revokeObjectURL(imageUrl) }
}

// The provider the app uses. Change this one line (e.g. to serverTryOn) once a provider is connected.
const provider: TryOnProvider = mockTryOn

export function tryOn(request: TryOnRequest, signal?: AbortSignal) {
  return provider(request, signal)
}

// Shrinks the photo before upload: faster, cheaper, and enough detail for try-on models.
export async function preparePhoto(file: Blob, maxSide = 1280): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not read photo'))), 'image/jpeg', 0.9))
}

// Sends the person photo and the selected garments to our backend, which calls the AI provider.
// The backend lives at /api/try-on so the provider's API key never reaches the browser.
export async function requestTryOn(photo: Blob, outfit: Partial<Record<Slot, Product>>): Promise<string> {
  const form = new FormData()
  form.append('person', photo, 'person.jpg')
  for (const [slot, product] of Object.entries(outfit)) {
    if (!product) continue
    form.append(`${slot}Image`, new URL(product.images.front.src, location.origin).href)
    form.append(`${slot}Name`, `${product.brand} ${product.name}`)
  }

  let res: Response
  try {
    res = await fetch('/api/try-on', { method: 'POST', body: form })
  } catch {
    throw new TryOnUnavailableError()
  }
  if (res.status === 404 || res.status === 405 || res.status === 501) throw new TryOnUnavailableError()
  if (!res.ok) throw new Error((await res.text()) || `Try-on failed (${res.status})`)

  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

import { createContext, useContext } from 'react'
import type { Build, TryOnResult } from '../../services/tryOn'

export type Photo = { blob: Blob; url: string }
export type Route = 'photo' | 'model' // the shopper's own photo, or "A model like you"
export type Step = '' | 'camera' | 'camera-off' | 'preview' | 'model' | 'generating' | 'result'

// What the Try-On steps share while the flow is open.
export type Flow = {
  base: string // where Try-On is mounted ("/try-on"), so the steps don't depend on it
  photo: Photo | null
  setPhoto: (blob: Blob | null) => void
  route: Route
  setRoute: (route: Route) => void
  build: Build
  setBuild: (build: Build) => void
  result: TryOnResult | null
  setResult: (result: TryOnResult | null) => void
  go: (step: Step) => void // another step, in place of this one
  close: () => void // ✕: slide down, back to where Try-On was opened
}

export const FlowContext = createContext<Flow | null>(null)

export function useTryOn() {
  const flow = useContext(FlowContext)
  if (!flow) throw new Error('useTryOn must be used inside TryOn')
  return flow
}

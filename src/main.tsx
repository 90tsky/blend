import { StrictMode, useLayoutEffect, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { MotionConfig, MotionGlobalConfig } from 'motion/react'
// Global styles first, so each component's own rules come after them and win.
import './styles/figma-tokens.css'
import './styles/tokens.css'
import './styles/base.css'
import App from './App'
import { watchForUpdates } from './lib/update'
import { StoreProvider, useStore } from './state/store'

watchForUpdates()

// Animations follow the shopper's "reduce motion" setting on the device. Options › Reduce motion stops them all:
// MotionConfig for motion components and useReducedMotionConfig(), the global flag for animations already on screen and
// animate() calls, and data-reduce-motion for CSS transitions (base.css).
function Motion({ children }: { children: ReactNode }) {
  const { state } = useStore()
  const off = state.reduceMotion
  useLayoutEffect(() => {
    MotionGlobalConfig.skipAnimations = off
    document.documentElement.toggleAttribute('data-reduce-motion', off)
  }, [off])
  return (
    <MotionConfig reducedMotion={off ? 'always' : 'user'} skipAnimations={off}>
      {children}
    </MotionConfig>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* The app lives at /blend/ inside the portfolio. */}
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <StoreProvider>
        <Motion>
          <App />
        </Motion>
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
)

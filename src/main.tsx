import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { MotionConfig } from 'motion/react'
// Global styles first, so each component's own rules come after them and win.
import './styles/figma-tokens.css'
import './styles/tokens.css'
import './styles/base.css'
import App from './App'
import { watchForUpdates } from './lib/update'
import { StoreProvider } from './state/store'

watchForUpdates()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* The app lives at /blend/ inside the portfolio. */}
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      {/* Animations follow the shopper's "reduce motion" setting. */}
      <MotionConfig reducedMotion="user">
        <StoreProvider>
          <App />
        </StoreProvider>
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
)

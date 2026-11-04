import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useReducedMotionConfig, useTransform } from 'motion/react'
import { useNavigationType } from 'react-router'
import { TAB_SWITCH, type Tab } from './NavSwitch'
import './TabScreens.css'

const TABS: Tab[] = ['events', 'change-room']

// Where each tab's page was scrolled to. Module scope, so it outlives the layout (a trip to a piece, then Back).
const places: Record<Tab, number> = { events: 0, 'change-room': 0 }

type Pane = { toTop: () => void }
const PaneContext = createContext<Pane>({ toTop: () => window.scrollTo(0, 0) })

// For a screen in a tab: back to the top of its page, whether that's the document or a pane sliding in.
export const usePane = () => useContext(PaneContext)

// Events and the change room side by side, like Figma's Push: one slides out as the other comes in, with the tab
// switch's knob, under the fixed top and bottom bars. At rest the screen in view is part of the page, so Events scrolls
// the document as before. While they slide, both are lifted into screen-sized panes scrolled to where their pages were
// (a fixed bar can't sit inside a moving screen, and the browser has one document scroll); the one that lands gets its
// scroll back. A screen is mounted only while in view or sliding, as before.
export function TabScreens({ tab, screen }: { tab: Tab; screen: ReactNode }) {
  const navigationType = useNavigationType()
  const reduced = useReducedMotionConfig()
  // Each tab's screen as last rendered, so the one leaving keeps showing its own route while it slides out.
  const screens = useRef<Partial<Record<Tab, ReactNode>>>({})
  screens.current[tab] = screen
  // The tab whose screen is part of the page; none while they slide.
  const [flow, setFlow] = useState<Tab | null>(tab)
  const flowNow = useRef(flow)
  const panes = useRef<Partial<Record<Tab, HTMLDivElement | null>>>({})
  // 0: Events in view, 1: the change room in view. Events sits to the left.
  const progress = useMotionValue(tab === 'change-room' ? 1 : 0)
  const x = {
    events: useTransform(progress, (p) => `${-100 * p}%`),
    'change-room': useTransform(progress, (p) => `${100 - 100 * p}%`),
  }

  const pane = useMemo(() => {
    const toTop = (t: Tab) => () => {
      places[t] = 0
      panes.current[t]?.scrollTo(0, 0)
      if (flowNow.current === t) window.scrollTo(0, 0)
    }
    return { events: { toTop: toTop('events') }, 'change-room': { toTop: toTop('change-room') } }
  }, [])

  // A fresh visit opens at the top; Back (or Forward) returns to the remembered place.
  useLayoutEffect(() => {
    if (navigationType !== 'POP') places[tab] = 0
    // Only when the layout opens.
  }, [])

  // A new tab: remember where the page was (before it's lifted out, which resets the document's scroll), then push.
  // A tap mid-way turns the push round from where it is, as the knob does.
  useLayoutEffect(() => {
    const target = tab === 'change-room' ? 1 : 0
    if (progress.get() === target) return
    if (flow) places[flow] = window.scrollY
    if (reduced) {
      progress.jump(target)
      setFlow(tab)
      return
    }
    setFlow(null)
    const push = animate(progress, target, { ...TAB_SWITCH, onComplete: () => setFlow(tab) })
    return () => push.stop()
    // The push follows the tab only; the rest is read at this moment.
  }, [tab])

  // Before the first frame: lifted-out panes show their page where it was; the screen back in the page gets the
  // document's scroll, and keeps its place up to date while it's there.
  useLayoutEffect(() => {
    flowNow.current = flow
    for (const t of TABS) if (t !== flow) panes.current[t]?.scrollTo(0, places[t])
    if (!flow) return
    window.scrollTo(0, places[flow])
    const remember = () => {
      places[flow] = window.scrollY
    }
    window.addEventListener('scroll', remember, { passive: true })
    return () => window.removeEventListener('scroll', remember)
  }, [flow])

  return (
    <div className={flow ? 'tabs' : 'tabs tabs--pushing'}>
      {TABS.map((t) =>
        t === tab || t === flow || !flow ? (
          <motion.div
            key={t}
            ref={(el: HTMLDivElement | null) => {
              panes.current[t] = el
            }}
            className={t === flow ? 'tabs__pane' : 'tabs__pane tabs__pane--frozen'}
            style={{ x: x[t] }}
            inert={t !== tab}
          >
            <PaneContext.Provider value={pane[t]}>{screens.current[t]}</PaneContext.Provider>
          </motion.div>
        ) : null,
      )}
    </div>
  )
}

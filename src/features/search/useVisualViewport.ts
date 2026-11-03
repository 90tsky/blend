import { useEffect, useState } from 'react'

type View = { keyboard: number; height: number }

function read(): View {
  const vv = window.visualViewport
  if (!vv) return { keyboard: 0, height: window.innerHeight }
  // How much of the bottom the phone's keyboard covers (0 when it's closed, or when the page resizes for it).
  return { keyboard: Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)), height: Math.round(vv.height) }
}

// The part of the screen the shopper can see, so the search bar can sit on top of the phone's own keyboard.
export function useVisualViewport() {
  const [view, setView] = useState(read)
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const update = () => {
      const next = read()
      setView((prev) => (prev.keyboard === next.keyboard && prev.height === next.height ? prev : next))
    }
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])
  return view
}

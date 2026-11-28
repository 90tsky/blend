import { useEffect, type RefObject } from 'react'

// Rows that scroll sideways (the filter chips, the search sheet's suggestions) take a mouse wheel too (the user, 28 Nov:
// "i cant scroll already selected tags"). A finger or a trackpad already swipes them, but a mouse wheel only turns up
// and down, and there's no scrollbar to drag. While the row can still move, the wheel moves it; at either end the page
// gets the wheel back. `active` re-attaches it when the row appears (the chip bar renders nothing without filters).
export function useWheelScrollX(ref: RefObject<HTMLElement | null>, active = true) {
  useEffect(() => {
    const el = ref.current
    if (!el || !active) return
    const onWheel = (e: WheelEvent) => {
      // Pinch zoom, or a sideways swipe the browser already handles.
      if (e.ctrlKey || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return
      const max = el.scrollWidth - el.clientWidth
      if (max <= 0) return
      const step = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * el.clientWidth : e.deltaY
      const next = Math.min(max, Math.max(0, el.scrollLeft + step))
      if (next === el.scrollLeft) return
      e.preventDefault()
      el.scrollLeft = next
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [ref, active])
}

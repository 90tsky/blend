import { useSyncExternalStore } from 'react'

// The laptop layout (SplitLayout): Events on the left and the change room always open on the right, from 900 wide (room
// for two columns of cards beside the 430 change room) and 560 tall (the change room's least height). Narrower or
// shorter windows keep the phone layout. SplitLayout.css doesn't repeat this query: its rules hang off `.split`, which only
// exists while this is true.
export const WIDE_QUERY = '(min-width: 900px) and (min-height: 560px)'

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(WIDE_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export function useWide() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(WIDE_QUERY).matches,
    () => false,
  )
}

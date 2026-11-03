// GitHub Pages lets browsers keep the page for 10 minutes, so a home-screen app could keep showing an old version after
// a deploy. On open, and whenever the app comes back to the front, ask for the live build id; if it changed, load the
// page again under a new address (so no cached copy can answer), once per build.
const KEY = 'blend:reloaded-for'

export function watchForUpdates() {
  if (import.meta.env.DEV) return
  // Back from such a reload: drop the ?v= from the address.
  if (new URLSearchParams(location.search).has('v')) history.replaceState(history.state, '', location.pathname + location.hash)

  const check = async () => {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}version.json`, { cache: 'no-store' })
      const { build } = (await res.json()) as { build?: string }
      if (!build || build === __BUILD__ || sessionStorage.getItem(KEY) === build) return
      sessionStorage.setItem(KEY, build)
      location.replace(`${location.pathname}?v=${build}${location.hash}`)
    } catch {
      // Offline or storage blocked: keep the version that's running.
    }
  }
  check()
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check()
  })
}

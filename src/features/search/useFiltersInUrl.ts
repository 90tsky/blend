import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useStore } from '../../state/store'
import { filtersToSearch } from './filterParams'

// Keeps the Events address in step with the filter chips (filterParams.ts): rewritten in place, with no new history
// entry, whenever the chips change while Events is showing. Away from Events (a piece, Checkout) the filters stay in the
// store as before, and Back returns to the Events address they were written to. The store took the chips of the address
// the app opened on, so on the first render they already match and nothing is written.
// An effect, not a layout effect: the router only hears about a new address once its own listener is set up.
export function useFiltersInUrl() {
  const { state } = useStore()
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const wanted = filtersToSearch(state.filters)

  useEffect(() => {
    if (pathname === '/events' && search !== wanted) navigate({ pathname, search: wanted }, { replace: true })
  }, [pathname, search, wanted, navigate])
}

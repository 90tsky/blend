import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { useStore } from '../state/store'
import { Cta, Header, TopBar } from '../ui/primitives'
import './ComingSoon.css'

// What each unfinished part says (?for=…). Before 27 Nov every one of them said "Accounts are coming soon", Notifications
// included (the user: "should it be notifications").
const TOPICS = {
  // SIGN IN and CREATE ACCOUNT on Welcome: the way on is shopping as a guest.
  accounts: {
    title: 'Accounts are coming soon',
    subtitle: 'You’ll be able to sign in and create an account in the next version. For now, you can shop as a guest.',
  },
  orders: {
    title: 'Orders are coming soon',
    subtitle: 'Your orders will be listed here once accounts arrive. Checkout is a demo for now, so nothing is charged or sent.',
  },
  'sign-out': {
    title: 'Accounts are coming soon',
    subtitle: 'You’re shopping as a guest, so there’s nothing to sign out of yet. Your choices stay on this phone.',
  },
  'delete-account': {
    title: 'Accounts are coming soon',
    subtitle: 'You’re shopping as a guest, so there’s no account to delete yet. Emptying the change room clears your pieces.',
  },
} as const

export function ComingSoon() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { dispatch } = useStore()
  const topic = (params.get('for') ?? 'accounts') as keyof typeof TOPICS
  const { title, subtitle } = TOPICS[topic] ?? TOPICS.accounts
  const fromWelcome = !(topic in TOPICS) || topic === 'accounts'

  const back = () => (location.key === 'default' ? navigate(fromWelcome ? '/' : '/menu', { replace: true }) : navigate(-1))

  return (
    <main className="screen screen--below-top-bar coming-soon">
      <TopBar menu={false} />
      <Header title={title} subtitle={subtitle} onLead={back} />
      <div className="coming-soon__actions">
        {fromWelcome ? (
          <Cta
            onClick={() => {
              dispatch({ type: 'setWelcomed' })
              navigate('/events')
            }}
          >
            Continue as guest
          </Cta>
        ) : (
          <Cta variant="secondary" onClick={back}>
            Back
          </Cta>
        )}
      </div>
    </main>
  )
}

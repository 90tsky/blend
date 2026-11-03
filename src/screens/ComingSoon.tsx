import { useLocation, useNavigate } from 'react-router'
import { useStore } from '../state/store'
import { Cta, Header, TopBar } from '../ui/primitives'
import './ComingSoon.css'

// Where SIGN IN and CREATE ACCOUNT lead for now: accounts come in the next version. The way on is shopping as a guest.
export function ComingSoon() {
  const navigate = useNavigate()
  const location = useLocation()
  const { dispatch } = useStore()

  const back = () => (location.key === 'default' ? navigate('/', { replace: true }) : navigate(-1))

  return (
    <main className="screen screen--below-top-bar coming-soon">
      <TopBar menu={false} />
      <Header
        title="Accounts are coming soon"
        subtitle="You’ll be able to sign in and create an account in the next version. For now, you can shop as a guest."
        onLead={back}
      />
      <div className="coming-soon__actions">
        <Cta
          onClick={() => {
            dispatch({ type: 'setWelcomed' })
            navigate('/events')
          }}
        >
          Continue as guest
        </Cta>
      </div>
    </main>
  )
}

import { useAuth } from '../../hooks/useAuth'
import IncomingHireRequests from '../../components/business/IncomingHireRequests'
import SentHireRequests from '../../components/business/SentHireRequests'

// /dashboard/hire-requests -> talent ko aayi hui, business ki bheji hui requests
function HireRequestsPage() {
  const { user } = useAuth()
  return (
    <div className="mx-auto max-w-4xl">
      {user?.role === 'talent' ? <IncomingHireRequests /> : <SentHireRequests />}
    </div>
  )
}

export default HireRequestsPage

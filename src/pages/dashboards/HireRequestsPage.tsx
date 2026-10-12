import { useAuth } from '../../hooks/useAuth'
import IncomingHireRequests from '../../components/business/IncomingHireRequests'
import SentHireRequests from '../../components/business/SentHireRequests'

// /dashboard/hire-requests -> talent ko aayi hui, business ki bheji hui, manager ke talents ki requests
function HireRequestsPage() {
  const { user } = useAuth()
  return (
    <div className="mx-auto max-w-4xl">
      {user?.role === 'talent' ? (
        <IncomingHireRequests />
      ) : user?.role === 'representative' ? (
        // Manager: apne saare talents ki requests ek inbox mein
        <IncomingHireRequests manager />
      ) : (
        <SentHireRequests />
      )}
    </div>
  )
}

export default HireRequestsPage

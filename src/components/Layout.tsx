import { Outlet, useLocation } from 'react-router-dom'
import LiveUpdates from './LiveUpdates'
import Navbar from './nav/Navbar'
import Footer from './Footer'

function Layout() {
  // Home ka hero poori screen ki chaurai leta hai, baqi pages beech ke container mein
  const fullWidth = useLocation().pathname === '/'
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <LiveUpdates />
      <main
        className={fullWidth ? 'w-full flex-1 pb-12' : 'mx-auto w-full max-w-6xl flex-1 px-4 py-8'}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import Loader from '../components/Loader.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

// Centered card layout for the Login and Register pages.
export default function AuthLayout() {
  const { user, loading, authActionPending } = useAuth()

  if (loading || authActionPending) {
    return <Loader text="Checking your account..." />
  }

  if (user) return <Navigate to="/" replace />

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-head">
          <div className="brand"><span className="brand-mark">L</span>Ledgerly</div>
          <ThemeToggle />
        </div>
        <Outlet />
      </div>
    </div>
  )
}

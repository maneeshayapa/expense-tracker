import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import Loader from '../components/Loader.jsx'

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
        <div className="brand">Ledgerly</div>
        <Outlet />
      </div>
    </div>
  )
}

import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import Loader from './Loader.jsx'

// Sends visitors to the login page if they are not logged in.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader text="Checking your account..." />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

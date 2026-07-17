import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageLoader from './Loader'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader label="Checking your session" />
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return children
}

export function InstructorRoute({ children }) {
  const { isAuthenticated, isInstructor, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader label="Checking your session" />
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (!isInstructor) return <Navigate to="/teach" replace />
  return children
}

export function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <PageLoader label="Checking your session" />
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

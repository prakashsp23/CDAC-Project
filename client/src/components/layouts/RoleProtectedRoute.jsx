import { Navigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'

// eslint-disable-next-line react/prop-types
export default function RoleProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation()
  // Check role directly from state (persisted in localStorage)
  const userRole = useSelector(state => state.auth.role)
  // console.log("userRole in roleproted", userRole)

  // If no role stored, redirect to login
  if (!userRole) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if user's role is in the allowed roles list
  const isAllowed = allowedRoles.length === 0 || allowedRoles.some(
    role => role.toUpperCase() === userRole
  )

  if (!isAllowed) {
    toast.error('You do not have permission to access this page')
    // Redirect based on role
    if (userRole === 'CUSTOMER') {
      return <Navigate to="/customers" replace />
    } else if (userRole === 'MECHANIC') {
      return <Navigate to="/mechanic" replace />
    } else if (userRole === 'ADMIN') {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/" replace />
  }

  return children
}

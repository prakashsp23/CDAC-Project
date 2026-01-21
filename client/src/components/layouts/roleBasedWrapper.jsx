import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

/* eslint-disable react/prop-types */


export function RoleBasedAuth({ allowedRoles, children }) {
  const userRole = useSelector(state => state.auth.role)
  if (!userRole) return <Navigate to="/login" />
  if (allowedRoles.includes(userRole)) return <>{children}</>
  return <Navigate to="/" />
}

// Convenience wrappers for each role
export function IsAdmin({ children }) {
  return <RoleBasedAuth allowedRoles={['ADMIN']}>{children}</RoleBasedAuth>
}
export function IsCustomer({ children }) {
  return <RoleBasedAuth allowedRoles={['CUSTOMER']}>{children}</RoleBasedAuth>
}
export function IsMechanic({ children }) {
  return <RoleBasedAuth allowedRoles={['MECHANIC']}>{children}</RoleBasedAuth>
}
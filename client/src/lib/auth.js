/**
 * Auth utility functions
 * Simple helpers for token/role management
 * API calls are handled via query hooks in query/queries/
 */

export function getToken() {
  return localStorage.getItem('token')
}

export function getRole() {
  return localStorage.getItem('role')
}

export function isAuthenticated() {
  return Boolean(getToken())
}

export function forceLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
}

// Alias for consistency
export const clearAuth = forceLogout

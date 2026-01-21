import { useQuery } from '@tanstack/react-query'
import { AdminApi } from '../../services/apiService'
import { userKeys } from './userQueries'
import { bookingKeys } from './bookingQueries'

// Get all users (reuses userKeys)
export function useGetAllUsers(options = {}) {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: AdminApi.fetchAllUsers,
    ...options,
  })
}

// Get stats (reuses userKeys)
export function useGetAdminStats(options = {}) {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: AdminApi.fetchUserStats,
    ...options,
  })
}

// Get mechanics (reuses userKeys with filter)
export function useGetAllMechanics(options = {}) {
  return useQuery({
    queryKey: [...userKeys.lists(), { role: 'mechanic' }],
    queryFn: AdminApi.fetchMechanics,
    select: (data) => data?.filter(user => user.role?.toLowerCase() === 'mechanic'),
    ...options,
  })
}

// Get service requests (reuses bookingKeys)
export function useGetAllServiceRequests(params = {}, options = {}) {
  return useQuery({
    queryKey: [...bookingKeys.lists(), params],
    queryFn: () => AdminApi.fetchAllServiceRequests(params),
    ...options,
  })
}

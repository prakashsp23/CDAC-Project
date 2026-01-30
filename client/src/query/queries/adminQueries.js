import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminApi } from '../../services/apiService'
import { userKeys } from './userQueries'
import { serviceKeys } from './serviceQueries'
import { toast } from 'sonner'

/**
 * Query Keys for Admin
 */
export const adminKeys = {
  all: ['admin'],
  dashboard: () => [...adminKeys.all, 'dashboard'],
}

/**
 * ADMIN QUERIES
 */

// Get admin dashboard data
export function useGetAdminDashboard(options = {}) {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: AdminApi.fetchDashboardData,
    ...options,
  })
}

// Get all users (reuses userKeys)
export function useGetAllUsers(options = {}) {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: AdminApi.fetchAllUsers,
    ...options,
  })
}

// Get all mechanics (uses dedicated endpoint)
export function useGetAllMechanics(options = {}) {
  return useQuery({
    queryKey: [...userKeys.lists(), { role: 'mechanic' }],
    queryFn: AdminApi.fetchMechanics,
    ...options,
  })
}

// Get all service requests (reuses serviceKeys)
export function useGetAllServiceRequests(options = {}) {
  return useQuery({
    queryKey: serviceKeys.allServices(),
    queryFn: AdminApi.fetchAllServiceRequests,
    ...options,
  })
}

/**
 * ADMIN MUTATIONS
 */

// Assign mechanic to service request
export function useAdminAssignMechanicMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceId, mechanicId }) => 
      AdminApi.assignMechanicToService(serviceId, mechanicId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.allServices() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.serviceId) })
      toast.success(data?.message || 'Mechanic assigned successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to assign mechanic')
    },
  })
}

// Accept service request
export function useAdminAcceptServiceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: AdminApi.acceptServiceRequest,
    onSuccess: (data, serviceId) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.allServices() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(serviceId) })
      toast.success(data?.message || 'Service request accepted')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to accept service request')
    },
  })
}

// Reject service request
export function useAdminRejectServiceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceId, reason }) => AdminApi.rejectServiceRequest(serviceId, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.allServices() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.serviceId) })
      toast.success(data?.message || 'Service request rejected')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to reject service request')
    },
  })
}

// Legacy alias
export const useGetAdminStats = useGetAdminDashboard

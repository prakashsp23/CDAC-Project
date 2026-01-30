import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ServiceApi } from '../../services/apiService'
import { toast } from 'sonner'

/**
 * Query Keys for Service Requests
 */
export const serviceKeys = {
  all: ['services'],
  lists: () => [...serviceKeys.all, 'list'],
  myServices: () => [...serviceKeys.all, 'my-services'],
  allServices: () => [...serviceKeys.all, 'all-services'],
  ongoing: () => [...serviceKeys.all, 'ongoing'],
  completed: () => [...serviceKeys.all, 'completed'],
  details: () => [...serviceKeys.all, 'detail'],
  detail: (id) => [...serviceKeys.details(), id],
}

/**
 * SERVICE REQUEST QUERIES (Customer)
 */

// Get my service requests (Customer)
export function useGetMyServices(options = {}) {
  return useQuery({
    queryKey: serviceKeys.myServices(),
    queryFn: ServiceApi.fetchMyServices,
    ...options,
  })
}

// Get ongoing service requests (Customer)
export function useGetOngoingServices(options = {}) {
  return useQuery({
    queryKey: serviceKeys.ongoing(),
    queryFn: ServiceApi.fetchOngoingServices,
    ...options,
  })
}

// Get completed service requests (Customer)
export function useGetCompletedServices(options = {}) {
  return useQuery({
    queryKey: serviceKeys.completed(),
    queryFn: ServiceApi.fetchCompletedServices,
    ...options,
  })
}

// Get all service requests (Admin)
export function useGetAllServices(options = {}) {
  return useQuery({
    queryKey: serviceKeys.allServices(),
    queryFn: ServiceApi.fetchAllServices,
    ...options,
  })
}

// Get service by ID
export function useGetServiceById(serviceId, options = {}) {
  return useQuery({
    queryKey: serviceKeys.detail(serviceId),
    queryFn: () => ServiceApi.fetchServiceById(serviceId),
    enabled: !!serviceId,
    ...options,
  })
}

/**
 * SERVICE REQUEST MUTATIONS
 */

// Create new service request (Customer)
export function useCreateServiceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ServiceApi.createService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.myServices() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.ongoing() })
      toast.success(data?.message || 'Service request created successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to create service request')
    },
  })
}

// Accept service request (Admin)
export function useAcceptServiceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ServiceApi.acceptService,
    onSuccess: (data, serviceId) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.allServices() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(serviceId) })
      toast.success(data?.message || 'Service request accepted')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to accept service request')
    },
  })
}

// Reject service request (Admin)
export function useRejectServiceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceId, reason }) => ServiceApi.rejectService(serviceId, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.allServices() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.serviceId) })
      toast.success(data?.message || 'Service request rejected')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to reject service request')
    },
  })
}

// Assign mechanic to service (Admin)
export function useAssignMechanicMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceId, mechanicId }) => ServiceApi.assignMechanic(serviceId, mechanicId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.allServices() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.serviceId) })
      toast.success(data?.message || 'Mechanic assigned successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to assign mechanic')
    },
  })
}

// Update service execution (Mechanic)
export function useUpdateServiceExecutionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceId, executionData }) => 
      ServiceApi.updateServiceExecution(serviceId, executionData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.serviceId) })
      toast.success(data?.message || 'Service execution updated')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update service execution')
    },
  })
}

// Add note to service (Mechanic)
export function useAddServiceNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceId, noteData }) => ServiceApi.addServiceNote(serviceId, noteData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.serviceId) })
      toast.success(data?.message || 'Note added successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to add note')
    },
  })
}

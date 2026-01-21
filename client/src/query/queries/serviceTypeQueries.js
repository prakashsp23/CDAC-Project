import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ServiceTypeApi } from '../../services/apiService'

export const serviceTypeKeys = {
  all: ['serviceTypes'],
  lists: () => [...serviceTypeKeys.all, 'list'],
  list: (filters) => [...serviceTypeKeys.lists(), filters],
  details: () => [...serviceTypeKeys.all, 'detail'],
  detail: (id) => [...serviceTypeKeys.details(), id],
}

// Get all service types
export function useGetAllServiceTypes(options = {}) {
  return useQuery({
    queryKey: serviceTypeKeys.lists(),
    queryFn: ServiceTypeApi.fetchServiceTypes,
    ...options,
  })
}

// Get service type by ID
export function useGetServiceTypeById(serviceTypeId, options = {}) {
  return useQuery({
    queryKey: serviceTypeKeys.detail(serviceTypeId),
    queryFn: () => ServiceTypeApi.fetchServiceTypeById(serviceTypeId),
    enabled: !!serviceTypeId,
    ...options,
  })
}

// Add service type
export function useAddServiceTypeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ServiceTypeApi.createServiceType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceTypeKeys.lists() })
    },
  })
}

// Update service type
export function useUpdateServiceTypeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceTypeId, data }) =>
      ServiceTypeApi.updateServiceType(serviceTypeId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceTypeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: serviceTypeKeys.detail(variables.serviceTypeId) })
    },
  })
}

// Delete service type
export function useDeleteServiceTypeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ServiceTypeApi.deleteServiceType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceTypeKeys.lists() })
    },
  })
}

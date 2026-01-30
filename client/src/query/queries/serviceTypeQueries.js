import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ServiceCatalogApi } from '../../services/apiService'
import { toast } from 'sonner'

/**
 * Query Keys for Service Catalog
 */
export const serviceCatalogKeys = {
  all: ['serviceCatalogs'],
  lists: () => [...serviceCatalogKeys.all, 'list'],
  list: (filters) => [...serviceCatalogKeys.lists(), filters],
  details: () => [...serviceCatalogKeys.all, 'detail'],
  detail: (id) => [...serviceCatalogKeys.details(), id],
}

// Alias for backward compatibility
export const serviceTypeKeys = serviceCatalogKeys

/**
 * SERVICE CATALOG QUERIES
 */

// Get all service catalogs
export function useGetAllServiceCatalogs(options = {}) {
  return useQuery({
    queryKey: serviceCatalogKeys.lists(),
    queryFn: ServiceCatalogApi.fetchServiceCatalogs,
    ...options,
  })
}

// Get service catalog by ID
export function useGetServiceCatalogById(catalogId, options = {}) {
  return useQuery({
    queryKey: serviceCatalogKeys.detail(catalogId),
    queryFn: () => ServiceCatalogApi.fetchServiceCatalogById(catalogId),
    enabled: !!catalogId,
    ...options,
  })
}

/**
 * SERVICE CATALOG MUTATIONS (Admin)
 */

// Create service catalog
export function useCreateServiceCatalogMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ServiceCatalogApi.createServiceCatalog,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() })
      toast.success(data?.message || 'Service catalog created successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to create service catalog')
    },
  })
}

// Update service catalog
export function useUpdateServiceCatalogMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ catalogId, data }) =>
      ServiceCatalogApi.updateServiceCatalog(catalogId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() })
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.detail(variables.catalogId) })
      toast.success(data?.message || 'Service catalog updated successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update service catalog')
    },
  })
}

// Delete service catalog
export function useDeleteServiceCatalogMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ServiceCatalogApi.deleteServiceCatalog,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() })
      toast.success(data?.message || 'Service catalog deleted successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete service catalog')
    },
  })
}

/**
 * LEGACY ALIASES (for backward compatibility)
 */
export const useGetAllServiceTypes = useGetAllServiceCatalogs
export const useGetServiceTypeById = useGetServiceCatalogById
export const useAddServiceTypeMutation = useCreateServiceCatalogMutation
export const useUpdateServiceTypeMutation = useUpdateServiceCatalogMutation
export const useDeleteServiceTypeMutation = useDeleteServiceCatalogMutation

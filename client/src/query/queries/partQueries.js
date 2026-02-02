import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PartApi } from '../../services/apiService'
import { toast } from 'sonner'

/**
 * Query Keys for Parts
 */
export const partKeys = {
  all: ['parts'],
  lists: () => [...partKeys.all, 'list'],
}

/**
 * PARTS QUERIES
 */

// Get all parts
export function useGetAllParts(options = {}) {
  return useQuery({
    queryKey: partKeys.lists(),
    queryFn: PartApi.fetchParts,
    ...options,
  })
}

/**
 * PARTS MUTATIONS
 */

// Create part (Admin)
export function useCreatePartMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: PartApi.createPart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: partKeys.lists() })
      toast.success(data?.message || 'Part created successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to create part')
    },
  })
}

// Update part (Admin)
export function useUpdatePartMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, partData }) => PartApi.updatePart(id, partData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: partKeys.lists() })
      toast.success(data?.message || 'Part updated successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update part')
    },
  })
}

// Delete part (Admin)
export function useDeletePartMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: PartApi.deletePart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: partKeys.lists() })
      toast.success(data?.message || 'Part deleted successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete part')
    },
  })
}

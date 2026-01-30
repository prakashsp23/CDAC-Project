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

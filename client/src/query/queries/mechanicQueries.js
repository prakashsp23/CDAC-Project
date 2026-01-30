import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MechanicApi } from '../../services/apiService'
import { toast } from 'sonner'

/**
 * Query Keys for Mechanic
 */
export const mechanicKeys = {
  all: ['mechanic'],
  assignedJobs: () => [...mechanicKeys.all, 'assigned-jobs'],
  workLogs: () => [...mechanicKeys.all, 'work-logs'],
}

/**
 * MECHANIC QUERIES
 */

// Get assigned jobs for current mechanic
export function useGetMechanicAssignedJobs(options = {}) {
  return useQuery({
    queryKey: mechanicKeys.assignedJobs(),
    queryFn: MechanicApi.fetchAssignedJobs,
    ...options,
  })
}

// Get mechanic work logs/history
export function useGetMechanicWorkLogs(options = {}) {
  return useQuery({
    queryKey: mechanicKeys.workLogs(),
    queryFn: MechanicApi.fetchWorkLogs,
    ...options,
  })
}

// Alias for backward compatibility
export const useGetMechanicWorkHistory = useGetMechanicWorkLogs

/**
 * MECHANIC MUTATIONS
 */

// Update service execution
export function useUpdateServiceExecutionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceId, executionData }) => 
      MechanicApi.updateServiceExecution(serviceId, executionData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: mechanicKeys.assignedJobs() })
      queryClient.invalidateQueries({ queryKey: mechanicKeys.workLogs() })
      toast.success(data?.message || 'Service execution updated')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update service execution')
    },
  })
}

// Add note to service
export function useAddMechanicNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceId, noteData }) => MechanicApi.addNote(serviceId, noteData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: mechanicKeys.assignedJobs() })
      toast.success(data?.message || 'Note added successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to add note')
    },
  })
}


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

import { serviceKeys } from './serviceQueries'
import { partKeys } from './partQueries'

// Update service execution
export function useUpdateServiceExecutionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceId, executionData }) => 
      MechanicApi.updateServiceExecution(serviceId, executionData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: mechanicKeys.assignedJobs() })
      queryClient.invalidateQueries({ queryKey: mechanicKeys.workLogs() })
      // Invalidate service details to show updated parts/status
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(String(variables.serviceId)) })
      // Invalidate parts list to show updated stock
      queryClient.invalidateQueries({ queryKey: partKeys.lists() })
      
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


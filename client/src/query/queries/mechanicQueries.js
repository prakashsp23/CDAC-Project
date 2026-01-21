import { useQuery } from '@tanstack/react-query'
import { MechanicApi } from '../../services/apiService'

export const mechanicKeys = {
  all: ['mechanic'],
  assignedJobs: () => [...mechanicKeys.all, 'assigned-jobs'],
  workHistory: () => [...mechanicKeys.all, 'work-history'],
}

// Get assigned jobs
export function useGetMechanicAssignedJobs(options = {}) {
  return useQuery({
    queryKey: mechanicKeys.assignedJobs(),
    queryFn: MechanicApi.fetchAssignedJobs,
    ...options,
  })
}

// Get work history
export function useGetMechanicWorkHistory(options = {}) {
  return useQuery({
    queryKey: mechanicKeys.workHistory(),
    queryFn: MechanicApi.fetchWorkHistory,
    ...options,
  })
}



import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { WorklogApi } from '../../services/apiService'

export const worklogKeys = {
  all: ['worklogs'],
  lists: () => [...worklogKeys.all, 'list'],
  list: (filters) => [...worklogKeys.lists(), filters],
  byBooking: (bookingId) => [...worklogKeys.all, 'booking', bookingId],
}


// Get worklogs by booking ID
export function useGetWorklogsByBookingId(bookingId, options = {}) {
  return useQuery({
    queryKey: worklogKeys.byBooking(bookingId),
    queryFn: () => WorklogApi.fetchWorklogsByBookingId(bookingId),
    enabled: !!bookingId,
    ...options,
  })
}

// Create worklog
export function useCreateWorklogMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: WorklogApi.createWorklog,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: worklogKeys.lists() })
      if (variables.bookingId) {
        queryClient.invalidateQueries({
          queryKey: worklogKeys.byBooking(variables.bookingId)
        })
      }
    },
  })
}

// Update worklog
export function useUpdateWorklogMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ worklogId, data }) =>
      WorklogApi.updateWorklog(worklogId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: worklogKeys.lists() })
      if (data.bookingId) {
        queryClient.invalidateQueries({
          queryKey: worklogKeys.byBooking(data.bookingId)
        })
      }
    },
  })
}

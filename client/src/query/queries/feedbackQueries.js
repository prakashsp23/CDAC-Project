import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FeedbackApi } from '../../services/apiService'
import { toast } from 'sonner'
import { serviceKeys } from './serviceQueries'

/**
 * Query Keys for Feedback
 */
export const feedbackKeys = {
  all: ['feedbacks'],
  lists: () => [...feedbackKeys.all, 'list'],
  myFeedbacks: () => [...feedbackKeys.all, 'my-feedbacks'],
  allFeedbacks: () => [...feedbackKeys.all, 'all-feedbacks'],
}

/**
 * FEEDBACK QUERIES
 */

// Get my feedbacks
export function useGetMyFeedbacks(options = {}) {
  return useQuery({
    queryKey: feedbackKeys.myFeedbacks(),
    queryFn: FeedbackApi.fetchMyFeedbacks,
    ...options,
  })
}

// Get all feedbacks (Admin)
export function useGetAllFeedbacks(options = {}) {
  return useQuery({
    queryKey: feedbackKeys.allFeedbacks(),
    queryFn: FeedbackApi.fetchAllFeedbacks,
    ...options,
  })
}

/**
 * FEEDBACK MUTATIONS
 */

// Submit feedback
export function useSubmitFeedbackMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: FeedbackApi.submitFeedback,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() })
      queryClient.invalidateQueries({ queryKey: feedbackKeys.myFeedbacks() })
      queryClient.invalidateQueries({ queryKey: serviceKeys.completed() })
      toast.success(data?.message || 'Feedback submitted successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to submit feedback')
    },
  })
}

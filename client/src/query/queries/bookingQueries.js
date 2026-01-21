import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BookingApi } from '../../services/apiService'

export const bookingKeys = {
  all: ['bookings'],
  lists: () => [...bookingKeys.all, 'list'],
  list: (filters) => [...bookingKeys.lists(), filters],
  details: () => [...bookingKeys.all, 'detail'],
  detail: (id) => [...bookingKeys.details(), id],
}

// Get all bookings
export function useGetAllBookings(options = {}) {
  return useQuery({
    queryKey: bookingKeys.lists(),
    queryFn: BookingApi.fetchBookings,
    ...options,
  })
}

// Get booking by ID
export function useGetBookingById(bookingId, options = {}) {
  return useQuery({
    queryKey: bookingKeys.detail(bookingId),
    queryFn: () => BookingApi.fetchBookingById(bookingId),
    enabled: !!bookingId,
    ...options,
  })
}

// Create booking
export function useCreateBookingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: BookingApi.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() })
    },
  })
}

// Assign mechanic to booking (Admin)
export function useAssignMechanicMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookingId, mechanicId }) =>
      BookingApi.assignMechanic(bookingId, mechanicId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() })
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.bookingId) })
    },
  })
}

// Update booking status
export function useUpdateBookingStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookingId, status }) =>
      BookingApi.updateBookingStatus(bookingId, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() })
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.bookingId) })
    },
  })
}

// Delete booking
export function useDeleteBookingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: BookingApi.deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() })
    },
  })
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserApi } from '../../services/apiService'
import { toast } from 'sonner'

/**
 * Query Keys
 */
export const userKeys = {
    all: ['users'],
    lists: () => [...userKeys.all, 'list'],
    list: (filters) => [...userKeys.lists(), filters],
    details: () => [...userKeys.all, 'detail'],
    detail: (id) => [...userKeys.details(), id],
    me: () => [...userKeys.all, 'me'],
    mechanics: () => [...userKeys.all, 'mechanics'],
}

/**
 * USER QUERIES
 */

// Get all users (Admin)
export function useGetAllUsers(options = {}) {
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: UserApi.fetchAllUsers,
        ...options,
    })
}

// Get current user
export function useGetCurrentUser(options = {}) {
    return useQuery({
        queryKey: userKeys.me(),
        queryFn: UserApi.fetchCurrentUser,
        ...options,
    })
}

// Get user by ID
export function useGetUserById(userId, options = {}) {
    return useQuery({
        queryKey: userKeys.detail(userId),
        queryFn: () => UserApi.fetchUserById(userId),
        enabled: !!userId,
        ...options,
    })
}

// Get all mechanics
export function useGetMechanics(options = {}) {
    return useQuery({
        queryKey: userKeys.mechanics(),
        queryFn: UserApi.fetchMechanics,
        ...options,
    })
}

/**
 * USER MUTATIONS
 */

// Update current user profile
export function useUpdateCurrentUserMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: UserApi.updateCurrentUser,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userKeys.me() })
            toast.success(data?.message || 'Profile updated successfully')
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to update profile')
        },
    })
}

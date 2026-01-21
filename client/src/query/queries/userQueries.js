import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserApi } from '../../services/apiService'

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
    stats: () => [...userKeys.all, 'stats'],
}

/**
 * User Queries
 */

// Get all users (Admin)
// export function useGetAllUsers(options = {}) {
//     return useQuery({
//         queryKey: userKeys.lists(),
//         queryFn: userService.getAllUsers,
//         ...options,
//     })
// }

// Get current user
export function useGetCurrentUser(options = {}) {
    return useQuery({
        queryKey: userKeys.me(),
        queryFn: UserApi.fetchCurrentUser,
        ...options,
    })
}

// Get user stats
export function useGetUserStats(options = {}) {
    return useQuery({
        queryKey: userKeys.stats(),
        queryFn: UserApi.fetchUserStats,
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

/**
 * User Mutations
 */

// Note: User updates would go here if available in API
export function useUpdateUserMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ userId, data }) => UserApi.updateUser(userId, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() })
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) })
        },
    })
}

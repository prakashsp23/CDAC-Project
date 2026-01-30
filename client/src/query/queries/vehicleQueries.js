import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { VehicleApi } from '../../services/apiService'
import { toast } from 'sonner'

/**
 * Query Keys for Vehicles
 */
export const vehicleKeys = {
    all: ['vehicles'],
    lists: () => [...vehicleKeys.all, 'list'],
    list: (filters) => [...vehicleKeys.lists(), filters],
    details: () => [...vehicleKeys.all, 'detail'],
    detail: (id) => [...vehicleKeys.details(), id],
}

/**
 * VEHICLE QUERIES
 */

// Get all vehicles for current user
export function useGetAllVehicles(options = {}) {
    return useQuery({
        queryKey: vehicleKeys.lists(),
        queryFn: VehicleApi.fetchVehicles,
        ...options,
    })
}

/**
 * VEHICLE MUTATIONS
 */

// Add vehicle
export function useAddVehicleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: VehicleApi.createVehicle,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
            toast.success(data?.message || 'Vehicle added successfully')
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to add vehicle')
        },
    })
}

// Update vehicle
export function useUpdateVehicleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ carId, data }) => VehicleApi.updateVehicle(carId, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
            queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(variables.carId) })
            toast.success(data?.message || 'Vehicle updated successfully')
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to update vehicle')
        },
    })
}

// Delete vehicle
export function useDeleteVehicleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: VehicleApi.deleteVehicle,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
            toast.success(data?.message || 'Vehicle deleted successfully')
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to delete vehicle')
        },
    })
}

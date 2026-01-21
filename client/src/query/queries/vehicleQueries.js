import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { VehicleApi } from '../../services/apiService'

export const vehicleKeys = {
    all: ['vehicles'],
    lists: () => [...vehicleKeys.all, 'list'],
    list: (filters) => [...vehicleKeys.lists(), filters],
    details: () => [...vehicleKeys.all, 'detail'],
    detail: (id) => [...vehicleKeys.details(), id],
}


// Get all vehicles
export function useGetAllVehicles(options = {}) {
    return useQuery({
        queryKey: vehicleKeys.lists(),
        queryFn: VehicleApi.fetchVehicles,
        ...options,
    })
}

// Get vehicle by ID
export function useGetVehicleById(vehicleId, options = {}) {
    return useQuery({
        queryKey: vehicleKeys.detail(vehicleId),
        queryFn: () => VehicleApi.fetchVehicleById(vehicleId),
        enabled: !!vehicleId,
        ...options,
    })
}

// Add vehicle
export function useAddVehicleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: VehicleApi.createVehicle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
        },
    })
}

// Update vehicle
export function useUpdateVehicleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ vehicleId, data }) => VehicleApi.updateVehicle(vehicleId, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
            queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(variables.vehicleId) })
        },
    })
}

// Delete vehicle
export function useDeleteVehicleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: VehicleApi.deleteVehicle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
        },
    })
}

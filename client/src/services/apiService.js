import apiClient from '../lib/api'
export const AuthApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },

  changePassword: async (passwordData) => {
    const response = await apiClient.post('/auth/change-password', passwordData)
    return response.data
  },
}

export const UserApi = {
  // Get all users (Admin only)
  fetchAllUsers: async () => {
    const response = await apiClient.get('/users')
    return response.data
  },

  // Get current user profile
  fetchCurrentUser: async () => {
    const response = await apiClient.get('/users/me')
    return response.data
  },

  // Get user stats
  fetchUserStats: async () => {
    const response = await apiClient.get('/users/stats')
    return response.data
  },

  // Get user details by ID
  fetchUserById: async (userId) => {
    const response = await apiClient.get(`/users/id/${userId}`)
    return response.data
  },
}

export const VehicleApi = {
  // Get all vehicles for current user
  fetchVehicles: async () => {
    const response = await apiClient.get('/vehicles')
    return response.data
  },

  // Get vehicle by ID
  fetchVehicleById: async (vehicleId) => {
    const response = await apiClient.get(`/vehicles/${vehicleId}`)
    return response.data
  },

  // Add new vehicle
  createVehicle: async (vehicleData) => {
    const response = await apiClient.post('/vehicles', vehicleData)
    return response.data
  },

  // Update vehicle
  updateVehicle: async (vehicleId, vehicleData) => {
    const response = await apiClient.patch(`/vehicles/${vehicleId}`, vehicleData)
    return response.data
  },

  // Delete vehicle
  deleteVehicle: async (vehicleId) => {
    const response = await apiClient.delete(`/vehicles/${vehicleId}`)
    return response.data
  },
}

export const ServiceTypeApi = {
  // Get all service types
  fetchServiceTypes: async () => {
    const response = await apiClient.get('/service-types')
    return response.data
  },

  // Get service type by ID
  fetchServiceTypeById: async (serviceTypeId) => {
    const response = await apiClient.get(`/service-types/${serviceTypeId}`)
    return response.data
  },

  // Add new service type (Admin only)
  createServiceType: async (serviceData) => {
    const response = await apiClient.post('/service-types', serviceData)
    return response.data
  },

  // Update service type (Admin only)
  updateServiceType: async (serviceTypeId, serviceData) => {
    const response = await apiClient.put(`/service-types/${serviceTypeId}`, serviceData)
    return response.data
  },

  // Delete service type (Admin only)
  deleteServiceType: async (serviceTypeId) => {
    const response = await apiClient.delete(`/service-types/${serviceTypeId}`)
    return response.data
  },
}

// ==================== BOOKING SERVICES ====================
export const BookingApi = {
  // Get all bookings
  fetchBookings: async () => {
    const response = await apiClient.get('/bookings')
    return response.data
  },

  // Get booking by ID
  fetchBookingById: async (bookingId) => {
    const response = await apiClient.get(`/bookings/${bookingId}`)
    return response.data
  },

  // Create new booking
  createBooking: async (bookingData) => {
    const response = await apiClient.post('/bookings', bookingData)
    return response.data
  },

  // Assign mechanic to booking (Admin only)
  assignMechanic: async (bookingId, mechanicId) => {
    const response = await apiClient.put(`/bookings/${bookingId}/assign`, {
      mechanicId
    })
    return response.data
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    const response = await apiClient.put(`/bookings/${bookingId}/status`, {
      status
    })
    return response.data
  },

  // Delete booking
  deleteBooking: async (bookingId) => {
    const response = await apiClient.delete(`/bookings/${bookingId}`)
    return response.data
  },
}

// ==================== WORKLOG SERVICES ====================
export const WorklogApi = {
  // Create worklog (Mechanic only)
  createWorklog: async (worklogData) => {
    const response = await apiClient.post('/worklogs', worklogData)
    return response.data
  },

  // Get worklogs by booking ID
  fetchWorklogsByBookingId: async (bookingId) => {
    const response = await apiClient.get(`/worklogs/${bookingId}`)
    return response.data
  },

  // Update worklog (Mechanic only)
  updateWorklog: async (worklogId, worklogData) => {
    const response = await apiClient.put(`/worklogs/${worklogId}`, worklogData)
    return response.data
  },
}

export const AdminApi = {
  // Get all users
  fetchAllUsers: async () => {
    const response = await apiClient.get('/users')
    return response.data
  },

  // Get user stats
  fetchUserStats: async () => {
    const response = await apiClient.get('/users/stats')
    return response.data
  },

  // Get all mechanics
  fetchMechanics: async () => {
    const response = await apiClient.get('/users')
    // Filter mechanics on the frontend or use a specific endpoint if available
    return response.data
  },

  // Get all service requests (bookings)
  fetchAllServiceRequests: async (params = {}) => {
    const response = await apiClient.get('/bookings', { params })
    return response.data
  },

  // Assign mechanic to booking
  assignMechanicToBooking: async (bookingId, mechanicId) => {
    const response = await apiClient.put(`/bookings/${bookingId}/assign`, {
      mechanicId
    })
    return response.data
  },
}

export const MechanicApi = {
  // Get assigned jobs (bookings assigned to current mechanic)
  fetchAssignedJobs: async () => {
    const response = await apiClient.get('/bookings')
    // Filter by current mechanic on frontend or use specific endpoint
    return response.data
  },

  // Get work history (completed worklogs)
  fetchWorkHistory: async () => {
    const response = await apiClient.get('/worklogs')
    return response.data
  },

  // Update job status
  updateJobStatus: async (bookingId, status) => {
    const response = await apiClient.put(`/bookings/${bookingId}/status`, {
      status
    })
    return response.data
  },

  // Create worklog
  createWorklog: async (worklogData) => {
    const response = await apiClient.post('/worklogs', worklogData)
    return response.data
  },

  // Update worklog
  updateWorklog: async (worklogId, worklogData) => {
    const response = await apiClient.put(`/worklogs/${worklogId}`, worklogData)
    return response.data
  },
}

export const HealthApi = {
  check: async () => {
    const response = await apiClient.get('/health')
    return response.data
  },
}

// Service Catalog (alias for serviceTypeService)
export const CatalogApi = {
  fetchCatalog: ServiceTypeApi.fetchServiceTypes,
  fetchServiceTypeById: ServiceTypeApi.fetchServiceTypeById,
}

// Service (alias for bookingService)
export const ServiceApi = {
  fetchServices: BookingApi.fetchBookings,
  fetchServiceById: BookingApi.fetchBookingById,
  createService: BookingApi.createBooking,
  updateService: BookingApi.updateBookingStatus,
  cancelService: BookingApi.deleteBooking,
}

export const FeedbackApi = {
  fetchFeedbacks: async () => {
    const response = await apiClient.get('/feedback')
    return response.data
  },

  submitFeedback: async (feedbackData) => {
    const response = await apiClient.post('/feedback', feedbackData)
    return response.data
  },

  fetchFeedbackById: async (feedbackId) => {
    const response = await apiClient.get(`/feedback/${feedbackId}`)
    return response.data
  },
}

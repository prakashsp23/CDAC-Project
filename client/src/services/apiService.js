import apiClient from '../lib/api'

// ==================== AUTHENTICATION SERVICES ====================
export const AuthApi = {
  // POST /auth/login
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  // POST /auth/register
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },

  // PUT /user/change-password
  changePassword: async (passwordData) => {
    const response = await apiClient.put('/user/change-password', passwordData)
    return response.data
  },
}

// ==================== USER SERVICES ====================
export const UserApi = {
  // GET /user - Get all users
  fetchAllUsers: async () => {
    const response = await apiClient.get('/user')
    return response.data
  },

  // GET /user/me - Get current authenticated user profile
  fetchCurrentUser: async () => {
    const response = await apiClient.get('/user/me')
    return response.data
  },

  // GET /user/{userId} - Get user by ID
  fetchUserById: async (userId) => {
    const response = await apiClient.get(`/user/${userId}`)
    return response.data
  },

  // PUT /user/me - Update current user profile
  updateCurrentUser: async (userData) => {
    const response = await apiClient.put('/user/me', userData)
    return response.data
  },

  // GET /user/mechanics - Get all mechanics
  fetchMechanics: async () => {
    const response = await apiClient.get('/user/mechanics')
    return response.data
  },
}

// ==================== VEHICLE SERVICES ====================
export const VehicleApi = {
  // GET /vehicle - Get all vehicles for current user
  fetchVehicles: async () => {
    const response = await apiClient.get('/vehicle')
    return response.data
  },

  // POST /vehicle - Add a new vehicle
  createVehicle: async (vehicleData) => {
    const response = await apiClient.post('/vehicle', vehicleData)
    return response.data
  },

  // PUT /vehicle/{carId} - Update vehicle by ID
  updateVehicle: async (carId, vehicleData) => {
    const response = await apiClient.put(`/vehicle/${carId}`, vehicleData)
    return response.data
  },

  // DELETE /vehicle/{carId} - Delete vehicle by ID
  deleteVehicle: async (carId) => {
    const response = await apiClient.delete(`/vehicle/${carId}`)
    return response.data
  },
}

// ==================== SERVICE CATALOG SERVICES ====================
export const ServiceCatalogApi = {
  // GET /service-catalog - Get all service catalogs
  fetchServiceCatalogs: async () => {
    const response = await apiClient.get('/service-catalog')
    return response.data
  },

  // GET /service-catalog/{id} - Get service catalog by ID
  fetchServiceCatalogById: async (catalogId) => {
    const response = await apiClient.get(`/service-catalog/${catalogId}`)
    return response.data
  },

  // POST /service-catalog - Create new service catalog (Admin)
  createServiceCatalog: async (catalogData) => {
    const response = await apiClient.post('/service-catalog', catalogData)
    return response.data
  },

  // PUT /service-catalog/{id} - Update service catalog by ID (Admin)
  updateServiceCatalog: async (catalogId, catalogData) => {
    const response = await apiClient.put(`/service-catalog/${catalogId}`, catalogData)
    return response.data
  },

  // DELETE /service-catalog/{id} - Delete service catalog by ID (Admin)
  deleteServiceCatalog: async (catalogId) => {
    const response = await apiClient.delete(`/service-catalog/${catalogId}`)
    return response.data
  },
}

// ==================== SERVICE REQUEST SERVICES ====================
export const ServiceApi = {
  // POST /service - Create new service request (Customer)
  createService: async (serviceData) => {
    const response = await apiClient.post('/service', serviceData)
    return response.data
  },

  // GET /service - Get my service requests (Customer)
  fetchMyServices: async () => {
    const response = await apiClient.get('/service')
    return response.data
  },

  // GET /service/all - Get all service requests (Admin)
  fetchAllServices: async () => {
    const response = await apiClient.get('/service/all')
    return response.data
  },

  // GET /service/{serviceId} - Get service by ID
  fetchServiceById: async (serviceId) => {
    const response = await apiClient.get(`/service/${serviceId}`)
    return response.data
  },

  // GET /service/ongoing - Get ongoing service requests for current user (Customer)
  fetchOngoingServices: async () => {
    const response = await apiClient.get('/service/ongoing')
    return response.data
  },

  // GET /service/completed - Get completed service requests for current user (Customer)
  fetchCompletedServices: async () => {
    const response = await apiClient.get('/service/completed')
    return response.data
  },

  // PUT /service/{serviceId}/accept - Accept a service request (Admin)
  acceptService: async (serviceId) => {
    const response = await apiClient.put(`/service/${serviceId}/accept`)
    return response.data
  },

  // PUT /service/{serviceId}/assign/{mechanicId} - Assign mechanic to service request (Admin)
  assignMechanic: async (serviceId, mechanicId) => {
    const response = await apiClient.put(`/service/${serviceId}/assign/${mechanicId}`)
    return response.data
  },

  // PUT /service/{serviceId}/reject - Reject a service request (Admin)
  rejectService: async (serviceId, reason) => {
    const response = await apiClient.put(`/service/${serviceId}/reject`, { reason })
    return response.data
  },

  // PUT /service/{serviceId}/update-execution - Update service execution details (Mechanic)
  updateServiceExecution: async (serviceId, executionData) => {
    const response = await apiClient.put(`/service/${serviceId}/update-execution`, executionData)
    return response.data
  },

  // POST /service/{serviceId}/note - Add note to service request (Mechanic)
  addServiceNote: async (serviceId, noteData) => {
    const response = await apiClient.post(`/service/${serviceId}/note`, noteData)
    return response.data
  },
}

// ==================== MECHANIC SERVICES ====================
export const MechanicApi = {
  // GET /service/mechanic/worklogs - Get mechanic work history/logs
  fetchWorkLogs: async () => {
    const response = await apiClient.get('/service/mechanic/worklogs')
    return response.data
  },

  // GET /service/mechanic/assigned-jobs - Get assigned jobs for current mechanic
  fetchAssignedJobs: async () => {
    const response = await apiClient.get('/service/mechanic/assigned-jobs')
    return response.data
  },

  // PUT /service/{serviceId}/update-execution - Update service execution (reuses ServiceApi)
  updateServiceExecution: async (serviceId, executionData) => {
    const response = await apiClient.put(`/service/${serviceId}/update-execution`, executionData)
    return response.data
  },

  // POST /service/{serviceId}/note - Add note to service (reuses ServiceApi)
  addNote: async (serviceId, noteData) => {
    const response = await apiClient.post(`/service/${serviceId}/note`, noteData)
    return response.data
  },
}

// ==================== PARTS SERVICES ====================
export const PartApi = {
  // GET /parts - Get all parts
  fetchParts: async () => {
    const response = await apiClient.get('/parts')
    return response.data
  },

  // DELETE /parts/{id} - Delete part by ID (Admin)
  deletePart: async (partId) => {
    const response = await apiClient.delete(`/parts/${partId}`)
    return response.data
  },
}

// ==================== FEEDBACK SERVICES ====================
export const FeedbackApi = {
  // GET /feedback/me - Get my feedbacks
  fetchMyFeedbacks: async () => {
    const response = await apiClient.get('/feedback/me')
    return response.data
  },

  // POST /feedback/submit - Submit new feedback
  submitFeedback: async (feedbackData) => {
    const response = await apiClient.post('/feedback/submit', feedbackData)
    return response.data
  },

  // GET /feedback/all - Get all feedbacks (Admin)
  fetchAllFeedbacks: async () => {
    const response = await apiClient.get('/feedback/all')
    return response.data
  },
}

// ==================== ADMIN DASHBOARD SERVICES ====================
export const AdminApi = {
  // GET /admin/dashboard - Get admin dashboard data
  fetchDashboardData: async () => {
    const response = await apiClient.get('/admin/dashboard')
    return response.data
  },

  // Reuse user endpoints
  fetchAllUsers: UserApi.fetchAllUsers,
  fetchMechanics: UserApi.fetchMechanics,
  
  // Reuse service endpoints
  fetchAllServiceRequests: ServiceApi.fetchAllServices,
  assignMechanicToService: ServiceApi.assignMechanic,
  acceptServiceRequest: ServiceApi.acceptService,
  rejectServiceRequest: ServiceApi.rejectService,
}

// ==================== LEGACY ALIASES (for backward compatibility) ====================
// Note: These are deprecated. Use the specific APIs above instead.

export const ServiceTypeApi = ServiceCatalogApi // Alias for backward compatibility
export const CatalogApi = ServiceCatalogApi // Alias

// BookingApi deprecated - use ServiceApi instead
export const BookingApi = {
  fetchBookings: ServiceApi.fetchMyServices,
  fetchBookingById: (id) => ServiceApi.fetchMyServices().then(services => services.find(s => s.id === id)),
  createBooking: ServiceApi.createService,
  assignMechanic: ServiceApi.assignMechanic,
  updateBookingStatus: ServiceApi.updateServiceExecution,
  deleteBooking: (id) => console.warn('Delete booking not available in new API'),
}

// WorklogApi deprecated - use MechanicApi instead
export const WorklogApi = {
  fetchWorklogsByBookingId: () => console.warn('Worklog by booking ID not available - use MechanicApi.fetchWorkLogs'),
  createWorklog: MechanicApi.addNote,
  updateWorklog: MechanicApi.updateServiceExecution,
}

export const HealthApi = {
  check: async () => {
    const response = await apiClient.get('/health')
    return response.data
  },
}

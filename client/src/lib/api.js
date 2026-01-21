import axios from 'axios'
import { forceLogout, getToken } from './auth'

const API_URL = 'https://carsexptest.onrender.com/api'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token automatically
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
let isLoggingOut = false

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true
      forceLogout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default apiClient

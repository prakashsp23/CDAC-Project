import axios from 'axios'
import { forceLogout, getToken } from './auth'

// Default: your backend URL. Override with VITE_API_URL (e.g. /api in Docker/k8s so nginx proxies to backend).
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/'

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

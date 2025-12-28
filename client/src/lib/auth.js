import axios from 'axios'

const API_URL = 'http://localhost:8080' 

export async function loginUser(credentials) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: { 'Content-Type': 'application/json' },
    })

    const data = response.data

    if (data?.token) {
      localStorage.setItem('token', data.token)
    }

    return data
  } catch (error) {
    const message = error?.response?.data?.message || error.message || 'Login failed'
    console.error('Login error:', message)
    throw new Error(message)
  }
}

export async function registerUser(userData) {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      headers: { 'Content-Type': 'application/json' },
    })

    const data = response.data

    if (data?.token) {
      localStorage.setItem('token', data.token)
    }

    return data
  } catch (error) {
    const message = error?.response?.data?.message || error.message || 'Registration failed'
    console.error('Registration error:', message)
    throw new Error(message)
  }
}

export function logout() {
  localStorage.removeItem('token')
}

export function getToken() {
  return localStorage.getItem('token')
}

export function isAuthenticated() {
  return Boolean(getToken())
}

export async function changePassword({ oldPassword, newPassword }) {
  try {
    const token = getToken()
    if(!token) throw new Error('Not authenticated');
    
    const response = await axios.post(
      `${API_URL}/auth/change-password`,
      { oldPassword, newPassword },
      { headers: { 
        'Content-Type': 'application/json', 
        Authorization: token ? `Bearer ${token}` : '' 
        }
      }
    )

    return response.data
  } catch (error) {
    const message = error?.response?.data?.message || error.message || 'Change password failed'
    console.error('Change password error:', message)
    throw new Error(message)
  }
}

export async function getUserProfile() {
  try {
    const token = getToken()
    if (!token) throw new Error('Not authenticated')

    const response = await axios.get(
      `${API_URL}/user/profile`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data
  } catch (error) {
    const message = error?.response?.data?.message || error.message || 'Failed to fetch profile'
    console.error('Get profile error:', message)
    throw new Error(message)
  }
}
import apiClient from './api'

export const authService = {
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData)
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('authToken', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    return response.data
  },

  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials)
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('authToken', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    return response.data
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  },

  getToken() {
    return localStorage.getItem('authToken')
  },
}






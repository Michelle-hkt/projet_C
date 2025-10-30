import apiClient from './api'

export const customerService = {
  async updateProfile(profileData) {
    const response = await apiClient.put('/customer/profile', profileData)
    return response.data
  },

  async addFavorite(announcementId) {
    const response = await apiClient.post('/customer/favorites', {
      announcementId: announcementId,
    })
    return response.data
  },

  async removeFavorite(announcementId) {
    const response = await apiClient.delete(`/customer/favorites/${announcementId}`)
    return response.data
  },

  async getMyFavorites() {
    const response = await apiClient.get('/customer/favorites')
    return response.data
  },

  async addPreference(preferenceKeyId) {
    const response = await apiClient.post('/customer/preferences', {
      preferenceKeyId: preferenceKeyId,
    })
    return response.data
  },

  async removePreference(preferenceKeyId) {
    const response = await apiClient.delete(`/customer/preferences/${preferenceKeyId}`)
    return response.data
  },

  async getMyPreferences() {
    const response = await apiClient.get('/customer/preferences')
    return response.data
  },
}

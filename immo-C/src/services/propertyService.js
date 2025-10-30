import apiClient from './api'

export const propertyService = {
  async getAllPropertyTypes() {
    const response = await apiClient.get('/property-types')
    return { data: response.data }
  },

  async getPropertyTypeById(id) {
    const response = await apiClient.get(`/property-types/${id}`)
    return response.data
  },

  async createPropertyType(propertyData) {
    const response = await apiClient.post('/property-types', propertyData)
    return response.data
  },

  async updatePropertyType(id, propertyData) {
    const response = await apiClient.put(`/property-types/${id}`, propertyData)
    return response.data
  },

  async deletePropertyType(id) {
    const response = await apiClient.delete(`/property-types/${id}`)
    return response.data
  },

  async getAllPreferences() {
    const response = await apiClient.get('/preferences')
    return { data: response.data }
  },

  async createPreference(preferenceData) {
    const response = await apiClient.post('/preferences', preferenceData)
    return response.data
  },

  async updatePreference(id, preferenceData) {
    const response = await apiClient.put(`/preferences/${id}`, preferenceData)
    return response.data
  },

  async deletePreference(id) {
    const response = await apiClient.delete(`/preferences/${id}`)
    return response.data
  },
}

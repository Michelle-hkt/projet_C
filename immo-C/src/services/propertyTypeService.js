import apiClient from './api'

export const propertyTypeService = {
  async getAllPropertyTypes() {
    const response = await apiClient.get('/property-types')
    return { data: response.data }
  },

  async getPropertyTypeById(id) {
    const response = await apiClient.get(`/property-types/${id}`)
    return response.data
  },
}

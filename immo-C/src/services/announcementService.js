import apiClient from './api'

export const announcementService = {
  async getAllAnnouncements() {
    const response = await apiClient.get('/announcements')
    return response.data
  },

  async getRecentAnnouncements() {
    const response = await apiClient.get('/announcements/recent')
    return response.data
  },

  async searchAnnouncements(params) {
    const response = await apiClient.get('/announcements/search', { params })
    return response.data
  },

  async getAnnouncementById(id) {
    const response = await apiClient.get(`/announcements/${id}`)
    return response.data
  },

  async getMyAnnouncements() {
    const response = await apiClient.get('/my-announcements')
    return response.data
  },

  async createAnnouncement(announcementData) {
    const response = await apiClient.post('/my-announcements', announcementData)
    return response.data
  },

  async createMyAnnouncement(announcementData) {
    return this.createAnnouncement(announcementData)
  },

  async updateAnnouncement(id, announcementData) {
    const response = await apiClient.put(`/my-announcements/${id}`, announcementData)
    return response.data
  },

  async deleteAnnouncement(id) {
    const response = await apiClient.delete(`/my-announcements/${id}`)
    return response.data
  },
}

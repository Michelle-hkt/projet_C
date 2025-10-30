import apiClient from './api'

export const notificationService = {
  async getMyNotifications() {
    const response = await apiClient.get('/notifications')
    return response.data
  },

  async countUnreadNotifications() {
    const response = await apiClient.get('/notifications/unread/count')
    return response.data
  },

  async markAsRead(notificationId) {
    const response = await apiClient.put(`/notifications/${notificationId}/read`)
    return response.data
  },

  async markAllAsRead() {
    const response = await apiClient.put('/notifications/read-all')
    return response.data
  },

  async deleteNotification(notificationId) {
    const response = await apiClient.delete(`/notifications/${notificationId}`)
    return response.data
  },
}






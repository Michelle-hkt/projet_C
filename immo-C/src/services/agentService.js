import apiClient from './api'

export const agentService = {
  async registerAgent(agentData) {
    const response = await apiClient.post('/agent/register', agentData)
    return response.data
  },

  async getMyProfile() {
    const response = await apiClient.get('/agent/profile')
    return response.data
  },

  async getMyWalletBalance() {
    const response = await apiClient.get('/agent/wallet')
    return response.data
  },

  async requestWithdrawal(amount) {
    const response = await apiClient.post('/agent/wallet/withdraw', { amount })
    return response.data
  },

  async getAllAgents() {
    const response = await apiClient.get('/agent/all')
    return response.data
  },

  async getPendingAgents() {
    const response = await apiClient.get('/agent/pending')
    return response.data
  },

  async getValidatedAgents() {
    const response = await apiClient.get('/agent/validated')
    return response.data
  },

  async validateAgent(agentId) {
    const response = await apiClient.put(`/agent/validate/${agentId}`)
    return response.data
  },

  async invalidateAgent(agentId) {
    const response = await apiClient.put(`/agent/invalidate/${agentId}`)
    return response.data
  },

  async rejectAgent(agentId) {
    const response = await apiClient.delete(`/agent/reject/${agentId}`)
    return response.data
  },

  async getMyAssignedAnnouncements() {
    const response = await apiClient.get('/agent/my-announcements')
    return response.data
  },

  async generateSponsorshipLink() {
    const response = await apiClient.get('/agent/sponsorship-link')
    return response.data
  },

  async getMySponsoredCustomers() {
    const response = await apiClient.get('/agent/my-sponsored-customers')
    return response.data
  },

  async getMyCommissions() {
    const response = await apiClient.get('/agent/commissions')
    return response.data
  },
}

import apiClient from './api'

export const paymentService = {
  getWalletBalance() {
    return apiClient
      .get('/payment/wallet')
      .then((response) => response.data)
      .catch((error) => {
        console.error('Erreur lors de la récupération du solde:', error)
        throw error
      })
  },

  rechargeWallet(amount, paymentMethod, price) {
    return apiClient
      .post('/payment/wallet/recharge', {
        amount,
        paymentMethod,
        amountPaid: price,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Erreur lors de la recharge:', error)
        throw error
      })
  },

  getTransactionHistory() {
    return apiClient
      .get('/wallet-transactions')
      .then((response) => response.data)
      .catch((error) => {
        console.error("Erreur lors de la récupération de l'historique:", error)
        throw error
      })
  },

  getPaymentHistory() {
    return apiClient
      .get('/payment/history')
      .then((response) => response.data)
      .catch((error) => {
        console.error("Erreur lors de la récupération de l'historique des paiements:", error)
        throw error
      })
  },

  payForOnSiteVisit(announcementId) {
    return apiClient
      .post('/payment/on-site-visit', { announcementId })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Erreur lors du paiement de la visite sur site:', error)
        throw error
      })
  },

  payForVirtualVisit(announcementId) {
    return apiClient
      .post('/payment/virtual-visit', { announcementId })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Erreur lors du paiement de la visite virtuelle:', error)
        throw error
      })
  },

  payForCreateVirtualTour(announcementId) {
    return apiClient
      .post('/payment/create-virtual-tour', { announcementId })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Erreur lors de la création de la visite virtuelle:', error)
        throw error
      })
  },

  payForPublishAnnouncement(announcementId) {
    return apiClient
      .post('/payment/publish-announcement', { announcementId })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Erreur lors du paiement de la publication:', error)
        throw error
      })
  },
}

import apiClient from './api'

/**
 * Service de gestion des paiements et du wallet
 */
export const paymentService = {
  /**
   * Récupère le solde du wallet de l'utilisateur connecté
   * @returns {Promise} - Balance du wallet
   */
  getWalletBalance() {
    return apiClient
      .get('/wallet/balance')
      .then((response) => response.data)
      .catch((error) => {
        console.error('Erreur lors de la récupération du solde:', error)
        throw error
      })
  },

  /**
   * Recharge le wallet via un agrégateur de paiement
   * @param {number} amount - Montant à créditer dans le wallet (en FCFA)
   * @param {string} paymentMethod - Méthode de paiement (Orange Money, MTN, Wave)
   * @param {number} price - Montant réellement payé (en FCFA)
   * @returns {Promise} - Détails de la transaction
   */
  rechargeWallet(amount, paymentMethod, price) {
    return apiClient
      .post('/payments/recharge', {
        amount,
        paymentMethod,
        price,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Erreur lors de la recharge:', error)
        throw error
      })
  },

  /**
   * Récupère l'historique des transactions du wallet
   * @returns {Promise} - Liste des transactions
   */
  getTransactionHistory() {
    return apiClient
      .get('/wallet/transactions')
      .then((response) => response.data)
      .catch((error) => {
        console.error("Erreur lors de la récupération de l'historique:", error)
        throw error
      })
  },

  /**
   * Récupère l'historique des paiements (recharges uniquement)
   * @returns {Promise} - Liste des paiements
   */
  getPaymentHistory() {
    return apiClient
      .get('/payments/history')
      .then((response) => response.data)
      .catch((error) => {
        console.error("Erreur lors de la récupération de l'historique des paiements:", error)
        throw error
      })
  },
}

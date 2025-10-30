<script setup>
import { ref, onMounted } from 'vue'
import { agentService } from '@/services/agentService'

const walletBalance = ref(0)
const isLoading = ref(true)
const withdrawAmount = ref(1000)
const successMessage = ref('')
const errorMessage = ref('')

const loadWallet = async () => {
  isLoading.value = true
  try {
    const response = await agentService.getMyWalletBalance()
    walletBalance.value = response.balance || 0
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement du wallet'
    console.error('Erreur:', error)
  } finally {
    isLoading.value = false
  }
}

const handleWithdrawal = async () => {
  if (withdrawAmount.value < 1000) {
    errorMessage.value = 'Le montant minimum de retrait est de 1000 immo'
    setTimeout(() => (errorMessage.value = ''), 3000)
    return
  }

  if (withdrawAmount.value > walletBalance.value) {
    errorMessage.value = 'Solde insuffisant'
    setTimeout(() => (errorMessage.value = ''), 3000)
    return
  }

  try {
    await agentService.requestWithdrawal(withdrawAmount.value)
    successMessage.value = 'Demande de retrait envoyée avec succès'
    setTimeout(() => (successMessage.value = ''), 3000)
    withdrawAmount.value = 1000
    loadWallet()
    // Émettre un événement pour mettre à jour le wallet dans le layout
    window.dispatchEvent(new Event('wallet-updated'))
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la demande de retrait'
    setTimeout(() => (errorMessage.value = ''), 3000)
  }
}

onMounted(() => {
  loadWallet()
})
</script>

<template>
  <div class="wallet_view">
    <div class="page_header">
      <h1>Mon Portefeuille</h1>
      <p>Gérer mes gains et demandes de retrait</p>
    </div>

    <div v-if="successMessage" class="alert success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert error">{{ errorMessage }}</div>

    <div v-if="isLoading" class="loading">Chargement...</div>

    <div v-else class="wallet_content">
      <div class="balance_card">
        <h2>Solde disponible</h2>
        <div class="balance_amount">
          <span class="amount">{{ walletBalance.toLocaleString() }}</span>
          <span class="currency">immo</span>
        </div>
      </div>

      <div class="withdrawal_card">
        <h2>Demander un retrait</h2>
        <p class="info_text">Montant minimum : 1000 immo</p>
        
        <div class="form_group">
          <label>Montant à retirer</label>
          <input 
            v-model.number="withdrawAmount" 
            type="number" 
            min="1000"
            :max="walletBalance"
            placeholder="Montant"
          />
        </div>

        <button 
          @click="handleWithdrawal" 
          class="btn_withdraw"
          :disabled="withdrawAmount < 1000 || withdrawAmount > walletBalance"
        >
          <i class="fas fa-money-bill-wave"></i>
          Demander le retrait
        </button>

        <div class="info_box">
          <i class="fas fa-info-circle"></i>
          <p>Les demandes de retrait sont traitées sous 48h. Vous recevrez une notification une fois le retrait effectué.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wallet_view {
  max-width: 800px;
}

.page_header {
  margin-bottom: 30px;
}

.page_header h1 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.page_header p {
  font-size: 14px;
  color: #666;
}

.alert {
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.alert.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert.error {
  background-color: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

.loading {
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #666;
}

.wallet_content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.balance_card {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  color: #fff;
  box-shadow: 0 4px 20px rgba(40,167,69,0.3);
}

.balance_card h2 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
  opacity: 0.9;
}

.balance_amount {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 10px;
}

.amount {
  font-size: 48px;
  font-weight: bold;
}

.currency {
  font-size: 24px;
  opacity: 0.9;
}

.withdrawal_card {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.withdrawal_card h2 {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.info_text {
  font-size: 14px;
  color: #666;
  margin-bottom: 25px;
}

.form_group {
  margin-bottom: 20px;
}

.form_group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form_group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border 0.3s;
}

.form_group input:focus {
  outline: none;
  border-color: #28a745;
}

.btn_withdraw {
  width: 100%;
  padding: 15px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.btn_withdraw:hover:not(:disabled) {
  background-color: #218838;
  transform: translateY(-2px);
}

.btn_withdraw:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.info_box {
  background-color: #e7f3ff;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.info_box i {
  font-size: 20px;
  color: #274abb;
  margin-top: 2px;
}

.info_box p {
  font-size: 13px;
  color: #555;
  line-height: 1.6;
  margin: 0;
}
</style>



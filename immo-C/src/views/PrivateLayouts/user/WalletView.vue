<script setup>
import { ref, onMounted } from 'vue'
import { paymentService } from '@/services/paymentService'

const walletBalance = ref(0)
const isLoading = ref(false)
const isPageLoading = ref(true)
const successMessage = ref('')
const errorMessage = ref('')

// Packs de recharge disponibles
const immoPacks = ref([
  { 
    id: 1, 
    amount: 3000, 
    price: 2000, 
    popular: false,
    type: 'recharge',
    icon: '💰',
    description: 'Pack Standard'
  },
  { 
    id: 2, 
    amount: 15000, 
    price: 10000, 
    popular: true,
    type: 'recharge',
    icon: '💎',
    description: 'Pack Premium'
  },
  { 
    id: 3, 
    amount: 0, 
    price: 16500, 
    popular: false,
    type: 'subscription',
    icon: '⭐',
    description: 'Pass immo+',
    benefits: [
      'Accès illimité aux visites virtuelles',
      'Réduction de 20% sur toutes les transactions'
    ]
  },
])

const loadWallet = async () => {
  try {
    const response = await paymentService.getWalletBalance()
    walletBalance.value = response.balance || 0
  } catch (error) {
    console.error('Erreur lors du chargement du wallet:', error)
  }
}

const handleRecharge = async (pack) => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Note: paymentMethod et phoneNumber seront renseignés par l'utilisateur via un modal
    // Pour le moment, on utilise des valeurs par défaut
    
    if (pack.type === 'subscription') {
      // Pour l'abonnement, on simule l'activation du pass
      // TODO: Implémenter la logique d'abonnement côté backend
      successMessage.value = `Pass immo+ activé avec succès ! Profitez de tous vos avantages.`
      setTimeout(() => (successMessage.value = ''), 3000)
    } else {
      // Recharge classique
      const response = await paymentService.rechargeWallet(
        pack.amount,
        'Orange Money', // À remplacer par le choix de l'utilisateur
        pack.price // Montant payé en FCFA
      )

      if (response.message) {
        successMessage.value = `Recharge de ${pack.amount.toLocaleString()} immo effectuée avec succès !`
        await loadWallet()
        // Émettre un événement pour mettre à jour le wallet dans le layout
        window.dispatchEvent(new Event('wallet-updated'))
        setTimeout(() => (successMessage.value = ''), 3000)
      }
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la recharge'
    setTimeout(() => (errorMessage.value = ''), 3000)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  isPageLoading.value = true
  try {
    await loadWallet()
  } catch (error) {
    console.error('Erreur lors du chargement de la page:', error)
  } finally {
    isPageLoading.value = false
  }
})
</script>

<template>
  <div class="wallet">
    <!-- Loader pendant le chargement -->
    <div v-if="isPageLoading" class="page_loader">
      <div class="loader_spinner"></div>
      <p>Chargement en cours...</p>
    </div>

    <!-- Contenu de la page -->
    <div v-else class="wallet_contain">
      <div class="wallet_contain_top">
        <div class="wallet_contain_top_title">Mon Portefeuille</div>
        
        <div v-if="successMessage" class="success_message">{{ successMessage }}</div>
        <div v-if="errorMessage" class="error_message">{{ errorMessage }}</div>
        
        <div class="balance_container">
          <div class="current_balance">
            <p class="current_balance_label">Solde actuel</p>
            <p class="current_balance_amount">{{ walletBalance.toLocaleString() }} <span>immo</span></p>
          </div>
        </div>
      </div>

      <div class="wallet_contain_bottom">
        <h2 class="packs_title">Packs de recharge</h2>
        <div class="packs_grid">
          <div
            v-for="pack in immoPacks"
            :key="pack.id"
            class="pack_card"
            :class="{ popular: pack.popular, subscription: pack.type === 'subscription' }"
          >
            <div v-if="pack.popular" class="popular_badge">Populaire</div>
            <div class="pack_card_icon">{{ pack.icon }}</div>
            <h3 class="pack_card_title">{{ pack.description }}</h3>
            
            <!-- Pack de recharge classique -->
            <div v-if="pack.type === 'recharge'">
              <h3 class="pack_card_amount">{{ pack.amount.toLocaleString() }} <span>immo</span></h3>
              <p class="pack_card_price">{{ pack.price.toLocaleString() }} FCFA</p>
            </div>
            
            <!-- Pack abonnement -->
            <div v-else-if="pack.type === 'subscription'" class="subscription_content">
              <p class="pack_card_price">{{ pack.price.toLocaleString() }} FCFA<span class="period">/mois</span></p>
              <ul class="benefits_list">
                <li v-for="(benefit, index) in pack.benefits" :key="index">{{ benefit }}</li>
              </ul>
            </div>
            
            <button
              class="pack_card_button"
              :disabled="isLoading"
              @click="handleRecharge(pack)"
            >
              {{ isLoading ? 'Chargement...' : pack.type === 'subscription' ? 'S\'abonner' : 'Recharger' }}
            </button>
          </div>
        </div>

        <div class="info_section">
          <h3>ℹ️ Informations importantes</h3>
          <ul>
            <li>Les immo sont utilisés pour payer tous les services sur la plateforme</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wallet {
  margin-bottom: 50px;
}

.wallet_contain {
  padding: 0;
}

.wallet_contain_top {
  margin-bottom: 20px;
}

.wallet_contain_top_title {
  background-color: #000;
  color: #fff;
  font-weight: bold;
  padding: 12px 10px;
  text-align: center;
  margin-bottom: 15px;
}

.balance_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  gap: 15px;
}

.current_balance {
  background: linear-gradient(135deg, #274abb 0%, #1d3a8f 100%);
  padding: 12px 25px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(39, 74, 187, 0.3);
  display: flex;
  align-items: center;
  gap: 15px;
}

.current_balance_label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin: 0;
}

.current_balance_amount {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.current_balance_amount span {
  font-size: 16px;
  color: #ffd700;
  margin-left: 5px;
}

.success_message {
  background-color: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #c3e6cb;
}

.error_message {
  background-color: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #fcc;
}

.wallet_contain_bottom {
  padding: 20px;
}

.packs_title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.packs_grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 992px) {
  .packs_grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
}

.pack_card {
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 25px 20px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 380px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.pack_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #274abb;
}

.pack_card.popular {
  border-color: #ffd700;
  border-width: 3px;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.popular_badge {
  position: absolute;
  top: 10px;
  right: -30px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
  padding: 5px 40px;
  font-size: 12px;
  font-weight: bold;
  transform: rotate(45deg);
}

.pack_card_icon {
  font-size: 42px;
  margin-bottom: 12px;
}

.pack_card_title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 8px 0 15px 0;
}

.pack_card_amount {
  font-size: 28px;
  font-weight: bold;
  color: #274abb;
  margin: 10px 0;
}

.pack_card_amount span {
  font-size: 16px;
  color: #ffd700;
}

.pack_card_price {
  font-size: 20px;
  color: #333;
  margin: 10px 0;
  font-weight: 600;
}

.period {
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

.subscription_content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.benefits_list {
  list-style: none;
  padding: 0;
  margin: 15px 0;
  text-align: left;
}

.benefits_list li {
  font-size: 13px;
  color: #555;
  padding: 6px 0;
  position: relative;
  padding-left: 22px;
}

.benefits_list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #28a745;
  font-weight: bold;
  font-size: 14px;
}

.pack_card.subscription {
  border-color: #ff6b6b;
  background: linear-gradient(135deg, #fff 0%, #fff5f5 100%);
}

.pack_card.subscription:hover {
  border-color: #ff6b6b;
}

.pack_card_button {
  width: 100%;
  padding: 12px;
  background-color: #274abb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pack_card_button:hover {
  background-color: #1d3a8f;
  transform: scale(1.05);
}

.pack_card_button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: scale(1);
}

.info_section {
  background-color: #f5f7fb;
  padding: 25px;
  border-radius: 10px;
  margin-top: 30px;
}

.info_section h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.info_section ul {
  list-style: none;
  padding: 0;
}

.info_section li {
  padding: 8px 0;
  color: #666;
  font-size: 15px;
}

.info_section li::before {
  content: '✓ ';
  color: #274abb;
  font-weight: bold;
  margin-right: 10px;
}

.page_loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 50px;
}

.loader_spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #274abb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.page_loader p {
  color: #666;
  font-size: 16px;
  font-weight: 500;
}
</style>


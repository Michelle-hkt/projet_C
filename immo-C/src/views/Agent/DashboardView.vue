<script setup>
import { ref, onMounted } from 'vue'
import { agentService } from '@/services/agentService'

const stats = ref({
  announcements: 0,
  sponsoredCustomers: 0,
  totalCommissions: 0,
  walletBalance: 0,
})
const isLoading = ref(true)

const loadStats = async () => {
  isLoading.value = true
  try {
    const [announcements, customers, commissions, wallet] = await Promise.all([
      agentService.getMyAssignedAnnouncements(),
      agentService.getMySponsoredCustomers(),
      agentService.getMyCommissions(),
      agentService.getMyWalletBalance(),
    ])

    stats.value = {
      announcements: announcements.count || announcements.data?.length || 0,
      sponsoredCustomers: customers.count || customers.data?.length || 0,
      totalCommissions: commissions.totalCommissions || 0,
      walletBalance: wallet.balance || 0,
    }
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>

<template>
  <div class="agent_dashboard">
    <div class="dashboard_header">
      <h1>Mon Dashboard</h1>
      <p>Vue d'ensemble de votre activité</p>
    </div>

    <div v-if="isLoading" class="loading">Chargement...</div>

    <div v-else class="stats_grid">
      <div class="stat_card">
        <div class="stat_icon announcements">
          <i class="fas fa-home"></i>
        </div>
        <div class="stat_content">
          <h3>{{ stats.announcements }}</h3>
          <p>Annonces assignées</p>
        </div>
      </div>

      <div class="stat_card">
        <div class="stat_icon customers">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat_content">
          <h3>{{ stats.sponsoredCustomers }}</h3>
          <p>Clients parrainés</p>
        </div>
      </div>

      <div class="stat_card">
        <div class="stat_icon commissions">
          <i class="fas fa-money-bill-wave"></i>
        </div>
        <div class="stat_content">
          <h3>{{ stats.totalCommissions.toLocaleString() }} immo</h3>
          <p>Commissions gagnées</p>
        </div>
      </div>

      <div class="stat_card">
        <div class="stat_icon wallet">
          <i class="fas fa-wallet"></i>
        </div>
        <div class="stat_content">
          <h3>{{ stats.walletBalance.toLocaleString() }} immo</h3>
          <p>Solde disponible</p>
        </div>
      </div>
    </div>

    <div class="quick_actions">
      <h2>Actions rapides</h2>
      <div class="actions_grid">
        <RouterLink to="/agent/announcements" class="action_card">
          <i class="fas fa-home"></i>
          <h3>Mes Annonces</h3>
          <p>Voir mes annonces assignées</p>
        </RouterLink>

        <RouterLink to="/agent/sponsorship" class="action_card">
          <i class="fas fa-share-alt"></i>
          <h3>Mon Lien de Parrainage</h3>
          <p>Partager et gagner des commissions</p>
        </RouterLink>

        <RouterLink to="/agent/wallet" class="action_card">
          <i class="fas fa-wallet"></i>
          <h3>Mon Portefeuille</h3>
          <p>Gérer mes gains et retraits</p>
        </RouterLink>

        <RouterLink to="/agent/commissions" class="action_card">
          <i class="fas fa-chart-line"></i>
          <h3>Mes Commissions</h3>
          <p>Historique des gains</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agent_dashboard {
  max-width: 1400px;
}

.dashboard_header {
  margin-bottom: 40px;
}

.dashboard_header h1 {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.dashboard_header p {
  font-size: 16px;
  color: #666;
}

.loading {
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #666;
}

.stats_grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

.stat_card {
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s;
}

.stat_card:hover {
  transform: translateY(-5px);
}

.stat_icon {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;
}

.stat_icon.announcements {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat_icon.customers {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat_icon.commissions {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat_icon.wallet {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat_content h3 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat_content p {
  font-size: 13px;
  color: #666;
}

.quick_actions {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.quick_actions h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 25px;
}

.actions_grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.action_card {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.action_card:hover {
  background: #fff;
  border-color: #28a745;
  box-shadow: 0 4px 12px rgba(40,167,69,0.2);
}

.action_card i {
  font-size: 48px;
  color: #28a745;
  margin-bottom: 15px;
}

.action_card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.action_card p {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .stats_grid {
    grid-template-columns: 1fr;
  }

  .actions_grid {
    grid-template-columns: 1fr;
  }
}
</style>



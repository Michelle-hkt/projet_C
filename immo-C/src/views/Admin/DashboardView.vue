<script setup>
import { ref, onMounted } from 'vue'
import { agentService } from '@/services/agentService'

const stats = ref({
  total: 0,
  pending: 0,
  validated: 0,
})
const isLoading = ref(true)

const loadStats = async () => {
  isLoading.value = true
  try {
    const [allAgents, pendingAgents, validatedAgents] = await Promise.all([
      agentService.getAllAgents(),
      agentService.getPendingAgents(),
      agentService.getValidatedAgents(),
    ])

    stats.value = {
      total: allAgents.count || allAgents.data?.length || 0,
      pending: pendingAgents.count || pendingAgents.data?.length || 0,
      validated: validatedAgents.count || validatedAgents.data?.length || 0,
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
  <div class="admin_dashboard">
    <div class="dashboard_header">
      <h1>Dashboard Administrateur</h1>
      <p>Bienvenue sur votre tableau de bord</p>
    </div>

    <div v-if="isLoading" class="loading">Chargement...</div>

    <div v-else class="stats_grid">
      <div class="stat_card">
        <div class="stat_icon total">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat_content">
          <h3>{{ stats.total }}</h3>
          <p>Total des agents</p>
        </div>
      </div>

      <div class="stat_card">
        <div class="stat_icon pending">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat_content">
          <h3>{{ stats.pending }}</h3>
          <p>Agents en attente</p>
        </div>
      </div>

      <div class="stat_card">
        <div class="stat_icon validated">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat_content">
          <h3>{{ stats.validated }}</h3>
          <p>Agents validés</p>
        </div>
      </div>
    </div>

    <div class="quick_actions">
      <h2>Actions rapides</h2>
      <div class="actions_grid">
        <RouterLink to="/admin/agents/pending" class="action_card">
          <i class="fas fa-user-clock"></i>
          <h3>Agents en attente</h3>
          <p>Valider les nouvelles demandes</p>
        </RouterLink>

        <RouterLink to="/admin/agents/all" class="action_card">
          <i class="fas fa-list"></i>
          <h3>Tous les agents</h3>
          <p>Voir la liste complète</p>
        </RouterLink>

        <RouterLink to="/admin/agents/validated" class="action_card">
          <i class="fas fa-user-check"></i>
          <h3>Agents validés</h3>
          <p>Gérer les agents actifs</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin_dashboard {
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

.stat_card {
  background: #fff;
  padding: 30px;
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
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: #fff;
}

.stat_icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat_icon.pending {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat_icon.validated {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat_content h3 {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat_content p {
  font-size: 14px;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  border-color: #274abb;
  box-shadow: 0 4px 12px rgba(39,74,187,0.2);
}

.action_card i {
  font-size: 48px;
  color: #274abb;
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
</style>



<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { agentService } from '@/services/agentService'

const route = useRoute()
const agents = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')

// Détermine le type de filtre selon la route
const filterType = computed(() => {
  if (route.path.includes('/agents/pending')) return 'pending'
  if (route.path.includes('/agents/validated')) return 'validated'
  return 'all'
})

// Titre de la page selon le filtre
const pageTitle = computed(() => {
  if (filterType.value === 'pending') return 'Agents en attente'
  if (filterType.value === 'validated') return 'Agents validés'
  return 'Tous les agents'
})

// Description de la page
const pageDescription = computed(() => {
  if (filterType.value === 'pending') return 'Valider les nouvelles demandes d\'inscription'
  if (filterType.value === 'validated') return 'Gérer les agents actifs de la plateforme'
  return 'Gérer tous les agents de la plateforme'
})

const loadAgents = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    let response
    
    // Appeler le bon service selon le filtre
    if (filterType.value === 'pending') {
      response = await agentService.getPendingAgents()
    } else if (filterType.value === 'validated') {
      response = await agentService.getValidatedAgents()
    } else {
      response = await agentService.getAllAgents()
    }
    
    agents.value = response.data || []
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des agents'
    console.error('Erreur:', error)
  } finally {
    isLoading.value = false
  }
}

// Recharger quand la route change
watch(() => route.path, () => {
  loadAgents()
})

const handleValidate = async (agentId) => {
  if (!confirm('Voulez-vous vraiment valider cet agent ?')) return
  
  try {
    await agentService.validateAgent(agentId)
    successMessage.value = 'Agent validé avec succès'
    setTimeout(() => (successMessage.value = ''), 3000)
    loadAgents()
  } catch (error) {
    errorMessage.value = 'Erreur lors de la validation'
    setTimeout(() => (errorMessage.value = ''), 3000)
  }
}

const handleInvalidate = async (agentId) => {
  if (!confirm('Voulez-vous vraiment invalider cet agent ?')) return
  
  try {
    await agentService.invalidateAgent(agentId)
    successMessage.value = 'Agent invalidé avec succès'
    setTimeout(() => (successMessage.value = ''), 3000)
    loadAgents()
  } catch (error) {
    errorMessage.value = 'Erreur lors de l\'invalidation'
    setTimeout(() => (errorMessage.value = ''), 3000)
  }
}

const handleReject = async (agentId) => {
  if (!confirm('Voulez-vous vraiment rejeter et supprimer cet agent ? Cette action est irréversible.')) return
  
  try {
    await agentService.rejectAgent(agentId)
    successMessage.value = 'Agent rejeté et supprimé avec succès'
    setTimeout(() => (successMessage.value = ''), 3000)
    loadAgents()
  } catch (error) {
    errorMessage.value = 'Erreur lors du rejet'
    setTimeout(() => (errorMessage.value = ''), 3000)
  }
}

onMounted(() => {
  loadAgents()
})
</script>

<template>
  <div class="agents_view">
    <div class="page_header">
      <h1>{{ pageTitle }}</h1>
      <p>{{ pageDescription }}</p>
    </div>

    <!-- Statistiques -->
    <div v-if="!isLoading && agents.length > 0" class="stats_badge">
      <i class="fas fa-users"></i>
      <span>{{ agents.length }} agent(s) {{ filterType === 'pending' ? 'en attente' : filterType === 'validated' ? 'validé(s)' : 'au total' }}</span>
    </div>

    <div v-if="successMessage" class="alert success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert error">{{ errorMessage }}</div>

    <div v-if="isLoading" class="loading">Chargement...</div>

    <div v-else-if="agents.length === 0" class="empty_message">
      <i class="fas fa-users"></i>
      <p>Aucun agent trouvé dans cette catégorie</p>
    </div>

    <div v-else class="agents_grid">
      <div v-for="agent in agents" :key="agent._id" class="agent_card">
        <div class="agent_header">
          <div class="agent_avatar">
            <i class="fas fa-user-tie"></i>
          </div>
          <div class="agent_info">
            <h3>{{ agent.userId?.firstName }} {{ agent.userId?.lastName }}</h3>
            <p class="agent_email">{{ agent.userId?.email }}</p>
            <span class="status_badge" :class="agent.isValide ? 'validated' : 'pending'">
              {{ agent.isValide ? 'Validé' : 'En attente' }}
            </span>
          </div>
        </div>

        <div class="agent_details">
          <div class="detail_row">
            <i class="fas fa-phone"></i>
            <span>{{ agent.phoneNumber }}</span>
          </div>
          <div class="detail_row">
            <i class="fas fa-calendar"></i>
            <span>Inscrit le {{ new Date(agent.createdAt).toLocaleDateString('fr-FR') }}</span>
          </div>
          <div class="detail_row">
            <i class="fas fa-user-check"></i>
            <span>{{ agent.isValide ? 'Compte actif' : 'Compte non validé' }}</span>
          </div>
        </div>

        <div class="agent_actions">
          <button 
            v-if="!agent.isValide" 
            @click="handleValidate(agent._id)" 
            class="btn_validate"
          >
            <i class="fas fa-check"></i> Valider
          </button>
          <button 
            v-if="agent.isValide" 
            @click="handleInvalidate(agent._id)" 
            class="btn_invalidate"
          >
            <i class="fas fa-ban"></i> Invalider
          </button>
          <button 
            @click="handleReject(agent._id)" 
            class="btn_reject"
          >
            <i class="fas fa-trash"></i> Rejeter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agents_view {
  max-width: 1400px;
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

.stats_badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #274abb;
  color: #fff;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
}

.stats_badge i {
  font-size: 16px;
  color: #fff;
}

.stats_badge span {
  color: #fff;
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

.empty_message {
  text-align: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 12px;
}

.empty_message i {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 20px;
}

.empty_message p {
  font-size: 18px;
  color: #666;
}

.agents_grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.agent_card {
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.agent_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.agent_header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.agent_avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.agent_avatar i {
  color: #fff;
}

.agent_info {
  flex: 1;
}

.agent_info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.agent_email {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.status_badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status_badge.validated {
  background-color: #d4edda;
  color: #155724;
}

.status_badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.agent_details {
  margin-bottom: 20px;
}

.detail_row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  font-size: 14px;
  color: #555;
}

.detail_row i {
  font-size: 16px;
  color: #274abb;
  width: 20px;
}

.agent_actions {
  display: flex;
  gap: 10px;
}

.agent_actions button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn_validate {
  background-color: #28a745;
  color: #fff;
}

.btn_validate i {
  color: #fff;
}

.btn_validate:hover {
  background-color: #218838;
}

.btn_invalidate {
  background-color: #ffc107;
  color: #fff;
}

.btn_invalidate i {
  color: #fff;
}

.btn_invalidate:hover {
  background-color: #e0a800;
}

.btn_reject {
  background-color: #dc3545;
  color: #fff;
}

.btn_reject i {
  color: #fff;
}

.btn_reject:hover {
  background-color: #c82333;
}

@media (max-width: 768px) {
  .agents_grid {
    grid-template-columns: 1fr;
  }

  .agent_actions {
    flex-direction: column;
  }
}
</style>



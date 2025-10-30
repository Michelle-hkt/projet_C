<script setup>
import { ref, computed, onMounted } from 'vue'
import { agentService } from '@/services/agentService'

const commissions = ref([])
const isLoading = ref(false)

const totalCommissions = computed(() => {
  return commissions.value.reduce((sum, c) => sum + (c.amount || 0), 0)
})

const loadCommissions = async () => {
  isLoading.value = true
  try {
    const response = await agentService.getMyCommissions()
    commissions.value = response.data || response.commissions || []
  } catch (error) {
    console.error('Erreur lors du chargement des commissions:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadCommissions()
})
</script>

<template>
  <div class="commissions_view">
    <div class="page_header">
      <h1>Mes Commissions</h1>
      <p>Historique de vos commissions de parrainage</p>
    </div>

    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Chargement des commissions...
    </div>

    <div v-else-if="commissions.length === 0" class="empty_state">
      <i class="fas fa-money-bill-wave"></i>
      <h3>Aucune commission</h3>
      <p>Vous n'avez pas encore reçu de commissions.</p>
      <RouterLink to="/agent/sponsorship" class="btn_primary">
        <i class="fas fa-share-alt"></i>
        Commencer à parrainer
      </RouterLink>
    </div>

    <div v-else class="commissions_container">
      <div class="total_card">
        <div class="total_content">
          <i class="fas fa-coins"></i>
          <div>
            <h3>{{ totalCommissions.toLocaleString() }} FCFA</h3>
            <p>Total des commissions</p>
          </div>
        </div>
      </div>

      <div class="commissions_table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Client</th>
              <th>Description</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="commission in commissions" :key="commission._id">
              <td>{{ new Date(commission.createdAt).toLocaleDateString('fr-FR') }}</td>
              <td>
                <span class="commission_type">
                  <i class="fas fa-user-plus"></i>
                  Parrainage
                </span>
              </td>
              <td>
                {{ commission.customerId?.firstName }} {{ commission.customerId?.lastName }}
              </td>
              <td>{{ commission.description || 'Commission de parrainage' }}</td>
              <td class="amount">
                <strong>{{ commission.amount?.toLocaleString() }} FCFA</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.commissions_view {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.page_header {
  margin-bottom: 30px;
}

.page_header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 700;
}

.page_header p {
  font-size: 16px;
  color: #666;
}

.loading,
.empty_state {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 12px;
}

.loading i,
.empty_state i {
  font-size: 48px;
  color: #28a745;
  margin-bottom: 20px;
}

.empty_state h3 {
  font-size: 22px;
  color: #333;
  margin-bottom: 10px;
}

.empty_state p {
  font-size: 16px;
  color: #666;
  margin-bottom: 25px;
}

.btn_primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #28a745;
  color: #fff;
  padding: 12px 25px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn_primary:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn_primary i {
  color: #fff;
}

.commissions_container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.total_card {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  border-radius: 12px;
  padding: 30px;
  color: #fff;
}

.total_content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total_content i {
  font-size: 48px;
  opacity: 0.9;
}

.total_content h3 {
  font-size: 36px;
  margin-bottom: 5px;
}

.total_content p {
  font-size: 16px;
  opacity: 0.9;
}

.commissions_table {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th {
  text-align: left;
  padding: 15px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
}

td {
  padding: 15px 20px;
  font-size: 14px;
  color: #555;
  border-bottom: 1px solid #f1f3f5;
}

tr:hover {
  background: #f8f9fa;
}

.commission_type {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #d4edda;
  color: #155724;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.commission_type i {
  color: #28a745;
}

.amount {
  color: #28a745;
  font-weight: 600;
}

@media (max-width: 768px) {
  .commissions_view {
    padding: 20px;
  }

  .page_header h1 {
    font-size: 24px;
  }

  .commissions_table {
    overflow-x: auto;
  }

  table {
    min-width: 600px;
  }
}
</style>


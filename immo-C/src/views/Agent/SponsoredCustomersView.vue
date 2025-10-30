<script setup>
import { ref, onMounted } from 'vue'
import { agentService } from '@/services/agentService'

const customers = ref([])
const isLoading = ref(false)

const loadSponsoredCustomers = async () => {
  isLoading.value = true
  try {
    const response = await agentService.getMySponsoredCustomers()
    customers.value = response.data || response.customers || []
  } catch (error) {
    console.error('Erreur lors du chargement des clients:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadSponsoredCustomers()
})
</script>

<template>
  <div class="sponsored_customers_view">
    <div class="page_header">
      <h1>Clients Parrainés</h1>
      <p>Liste des clients que vous avez parrainés</p>
    </div>

    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Chargement des clients...
    </div>

    <div v-else-if="customers.length === 0" class="empty_state">
      <i class="fas fa-users"></i>
      <h3>Aucun client parrainé</h3>
      <p>Vous n'avez pas encore parrainé de clients.</p>
      <RouterLink to="/agent/sponsorship" class="btn_primary">
        <i class="fas fa-share-alt"></i>
        Voir mon lien de parrainage
      </RouterLink>
    </div>

    <div v-else class="customers_container">
      <div class="stats_card">
        <div class="stat_item">
          <i class="fas fa-users"></i>
          <div>
            <h3>{{ customers.length }}</h3>
            <p>Client{{ customers.length > 1 ? 's' : '' }} parrainé{{ customers.length > 1 ? 's' : '' }}</p>
          </div>
        </div>
      </div>

      <div class="customers_table">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Date d'inscription</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer._id">
              <td>
                <div class="customer_info">
                  <div class="customer_avatar">
                    {{ customer.firstName?.[0] }}{{ customer.lastName?.[0] }}
                  </div>
                  <span>{{ customer.firstName }} {{ customer.lastName }}</span>
                </div>
              </td>
              <td>{{ customer.email }}</td>
              <td>{{ customer.phoneNumber || 'Non renseigné' }}</td>
              <td>{{ new Date(customer.createdAt).toLocaleDateString('fr-FR') }}</td>
              <td>
                <span class="status_badge" :class="{ active: customer.isActive }">
                  {{ customer.isActive ? 'Actif' : 'Inactif' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sponsored_customers_view {
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

.customers_container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.stats_card {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  border-radius: 12px;
  padding: 30px;
  color: #fff;
}

.stat_item {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat_item i {
  font-size: 48px;
  opacity: 0.9;
}

.stat_item h3 {
  font-size: 36px;
  margin-bottom: 5px;
}

.stat_item p {
  font-size: 16px;
  opacity: 0.9;
}

.customers_table {
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

.customer_info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.customer_avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #28a745;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.status_badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: #dc3545;
  color: #fff;
}

.status_badge.active {
  background: #28a745;
}

@media (max-width: 768px) {
  .sponsored_customers_view {
    padding: 20px;
  }

  .page_header h1 {
    font-size: 24px;
  }

  .customers_table {
    overflow-x: auto;
  }

  table {
    min-width: 600px;
  }
}
</style>


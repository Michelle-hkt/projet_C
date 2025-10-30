<script setup>
import { ref, onMounted } from 'vue'
import { agentService } from '@/services/agentService'

const announcements = ref([])
const isLoading = ref(false)

const loadAnnouncements = async () => {
  isLoading.value = true
  try {
    const response = await agentService.getMyAssignedAnnouncements()
    announcements.value = response.data || response.announcements || []
  } catch (error) {
    console.error('Erreur lors du chargement des annonces:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadAnnouncements()
})
</script>

<template>
  <div class="agent_announcements_view">
    <div class="page_header">
      <h1>Mes Annonces Assignées</h1>
      <p>Annonces qui vous ont été attribuées </p>
    </div>

    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Chargement des annonces...
    </div>

    <div v-else-if="announcements.length === 0" class="empty_state">
      <i class="fas fa-home"></i>
      <h3>Aucune annonce assignée</h3>
      <p>Vous n'avez pas encore d'annonces assignées pour le moment.</p>
    </div>

    <div v-else class="announcements_grid">
      <div 
        v-for="announcement in announcements" 
        :key="announcement._id" 
        class="announcement_card"
      >
        <div class="announcement_image">
          <img 
            v-if="announcement.images?.[0]" 
            :src="announcement.images[0]" 
            alt="Property"
          />
          <div v-else class="no_image">
            <i class="fas fa-home"></i>
          </div>
        </div>

        <div class="announcement_content">
          <h3>{{ announcement.title }}</h3>
          <p class="announcement_type">
            <i class="fas fa-tag"></i>
            {{ announcement.propertyTypeId?.name || 'Type non défini' }}
          </p>
          <p class="announcement_location">
            <i class="fas fa-map-marker-alt"></i>
            {{ announcement.location }}
          </p>
          <p class="announcement_price">
            {{ announcement.price?.toLocaleString() }} FCFA
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agent_announcements_view {
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
}

.announcements_grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.announcement_card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.announcement_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.announcement_image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f8f9fa;
}

.announcement_image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no_image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
}

.no_image i {
  font-size: 60px;
  color: #fff;
}

.announcement_content {
  padding: 20px;
}

.announcement_content h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.announcement_type,
.announcement_location {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.announcement_type i,
.announcement_location i {
  color: #28a745;
}

.announcement_price {
  font-size: 20px;
  color: #28a745;
  font-weight: 700;
  margin-top: 12px;
}

@media (max-width: 768px) {
  .agent_announcements_view {
    padding: 20px;
  }

  .page_header h1 {
    font-size: 24px;
  }

  .announcements_grid {
    grid-template-columns: 1fr;
  }
}
</style>


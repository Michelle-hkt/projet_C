<script setup>
import { ref, computed, onMounted } from 'vue'
import { customerService } from '@/services/customerService'
import AnnouncementBox from '@/components/AnnouncementBox.vue'

const favorites = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 6

const paginatedFavorites = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return favorites.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(favorites.value.length / itemsPerPage)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

const loadFavorites = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await customerService.getMyFavorites()
    favorites.value = response || []
    console.log('Favoris chargés:', favorites.value)
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des favoris'
    console.error('Erreur:', error)
  } finally {
    isLoading.value = false
  }
}

const removeFavorite = async (announcementId) => {
  try {
    await customerService.removeFavorite(announcementId)
    favorites.value = favorites.value.filter((fav) => fav.announcement._id !== announcementId)
    
    // Réinitialiser la page si elle devient vide
    if (paginatedFavorites.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression du favori'
    console.error('Erreur:', error)
  }
}

onMounted(() => {
  loadFavorites()
})
</script>

<template>
  <div class="favorite">
    <div class="favorite_contain">
      <div class="favorite_contain_top">
        <div class="favorite_contain_top_title">Mes favoris</div>
      </div>

      <div v-if="isLoading" class="page_loader">
        <div class="loader_spinner"></div>
        <p>Chargement en cours...</p>
      </div>

      <div v-else-if="errorMessage" class="error_message">{{ errorMessage }}</div>

      <div v-else-if="favorites.length === 0" class="empty_message">
        <p>Vous n'avez aucun favori pour le moment</p>
      </div>

      <div v-else class="favorite_contain_list">
        <div v-for="favorite in paginatedFavorites" :key="favorite._id" class="favorite_item">
          <AnnouncementBox
            :announcementId="favorite.announcement._id"
            :propertyImage="favorite.announcement.images?.[0] || '/src/assets/images/banner.jpeg'"
            :title="favorite.announcement.title"
            :location="`${favorite.announcement.district}, ${favorite.announcement.address}`"
            :status="favorite.announcement.status || 'Disponible'"
            :price="favorite.announcement.price"
            :bathrooms="favorite.announcement.numberOfBathrooms || 0"
            :livingRoom="favorite.announcement.numberOfLivingRooms || 0"
            :bedroom="favorite.announcement.numberOfBedrooms || 0"
            :kitchen="favorite.announcement.numberOfKitchen || 0"
            :isFavorite="true"
          />
          <button class="remove_btn" @click="removeFavorite(favorite.announcement._id)">
            Retirer des favoris
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="favorites.length > itemsPerPage" class="pagination">
        <button 
          class="pagination_btn" 
          @click="prevPage" 
          :disabled="currentPage === 1"
        >
          ← Précédent
        </button>
        
        <div class="pagination_pages">
          <button
            v-for="page in totalPages"
            :key="page"
            class="pagination_page"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          class="pagination_btn" 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
        >
          Suivant →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.favorite {
  margin-bottom: 50px;
}

.favorite_contain_top_title {
  background-color: #000;
  color: #fff;
  font-weight: bold;
  padding: 12px 10px;
  text-align: center;
  margin-bottom: 20px;
}

.favorite_contain_list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
  padding: 20px;
}

.favorite_item :deep(.recent_contain_list_item) {
  width: 260px;
}

.favorite_item :deep(.recent_contain_list_item_img) {
  height: 150px;
}

.favorite_item :deep(.recent_contain_list_item_info_title) {
  font-size: 16px;
}

.favorite_item :deep(.recent_contain_list_item_description) {
  padding: 10px 15px 0px 10px;
}

.favorite_item :deep(.recent_contain_list_item_details) {
  font-size: 13px;
  margin-bottom: 15px;
}

.favorite_item :deep(.recent_contain_list_item_price) {
  font-size: 16px;
}

.favorite_item {
  position: relative;
}

.remove_btn {
  width: 260px;
  margin-top: 10px;
  padding: 10px;
  background-color: #ff385c;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
  font-size: 14px;
}

.remove_btn:hover {
  background-color: #e00b41;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
  padding: 20px;
}

.pagination_btn {
  padding: 10px 20px;
  background-color: #274abb;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.pagination_btn:hover:not(:disabled) {
  background-color: #1d3a8f;
}

.pagination_btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination_pages {
  display: flex;
  gap: 8px;
}

.pagination_page {
  width: 40px;
  height: 40px;
  background-color: #fff;
  color: #274abb;
  border: 2px solid #274abb;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.pagination_page:hover {
  background-color: #e3f2fd;
}

.pagination_page.active {
  background-color: #274abb;
  color: #fff;
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

.error_message {
  background-color: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 6px;
  margin: 20px;
  text-align: center;
  border: 1px solid #fcc;
}

.empty_message {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}
</style>
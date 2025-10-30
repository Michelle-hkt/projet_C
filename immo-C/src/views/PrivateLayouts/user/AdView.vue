<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { announcementService } from '@/services/announcementService'
import AnnouncementBox from '@/components/AnnouncementBox.vue'

const router = useRouter()

const announcements = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const showGuideModal = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 6

const paginatedAnnouncements = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return announcements.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(announcements.value.length / itemsPerPage)
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

const loadMyAnnouncements = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await announcementService.getMyAnnouncements()
    announcements.value = response || []
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement de vos annonces'
    console.error('Erreur:', error)
  } finally {
    isLoading.value = false
  }
}

const goToCreateAnnouncement = () => {
  router.push('/user/announcements/create')
}

const openGuideModal = () => {
  showGuideModal.value = true
}

const closeGuideModal = () => {
  showGuideModal.value = false
}

const editAnnouncement = (announcementId) => {
  // Cette route sera créée plus tard
  router.push(`/user/announcements/edit/${announcementId}`)
}

const deleteAnnouncement = async (announcementId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
    return
  }

  try {
    await announcementService.deleteAnnouncement(announcementId)
    announcements.value = announcements.value.filter((ann) => ann._id !== announcementId)
    
    // Réinitialiser la page si elle devient vide
    if (paginatedAnnouncements.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression de l\'annonce'
    console.error('Erreur:', error)
  }
}

onMounted(() => {
  loadMyAnnouncements()
})
</script>

<template>
  <div class="ad">
    <div class="ad_contain">
      <div class="ad_contain_top">
        <div class="ad_contain_top_title">Mes annonces</div>
        <div class="button_container">
          <button class="guide_btn" @click="openGuideModal">
            Comment créer une visite virtuelle
          </button>
          <button class="create_btn" @click="goToCreateAnnouncement">
            Créer une annonce
          </button>
        </div>
      </div>

      <!-- Modal Guide des visites virtuelles -->
      <div v-if="showGuideModal" class="modal_virtual_tour" @click="closeGuideModal">
        <div class="modal_content" @click.stop>
          <div class="modal_header">
            <h2>Comment créer une visite virtuelle</h2>
            <button class="close_btn" @click="closeGuideModal">×</button>
          </div>
          <div class="modal_body">
            <div class="step">
              <div class="step_number">1</div>
              <div class="step_content">
                <div class="step_icon">📱🔄</div>
                <h3>Prenez des photos 360º de qualité</h3>
                <p>Avec l'aide d'un professionnel ou en utilisant une application (ex: ProCam X lite), prenez des photos 360 claires et bien éclairées de votre bien immobilier.</p>
              </div>
            </div>

            <div class="step">
              <div class="step_number">2</div>
              <div class="step_content">
                <div class="step_icon">📤</div>
                <h3>Envoyez vos photos</h3>
                <p>Chargez le fichier contenant les images 360. Réglez la note et laissez nous faire.</p>
              </div>
            </div>

            <div class="important_text">
              <strong>Important :</strong> Plus vos photos sont de bonne qualité, plus la visite virtuelle sera immersive. Assurez-vous que les pièces soient bien rangées et éclairées naturellement.
            </div>
          </div>
          <div class="modal_footer">
            <button class="modal_close_btn" @click="closeGuideModal">Fermer</button>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="page_loader">
        <div class="loader_spinner"></div>
        <p>Chargement en cours...</p>
      </div>

      <div v-else-if="errorMessage" class="error_message">{{ errorMessage }}</div>

      <div v-else-if="announcements.length === 0" class="empty_message">
        <p>Vous n'avez créé aucune annonce pour le moment</p>
      </div>

      <div v-else class="ad_contain_list">
        <div v-for="announcement in paginatedAnnouncements" :key="announcement._id" class="ad_item">
          <AnnouncementBox
            :announcementId="announcement._id"
            :propertyImage="announcement.images?.[0] || '/src/assets/images/banner.jpeg'"
            :title="announcement.title"
            :location="`${announcement.district}, ${announcement.address}`"
            :status="announcement.status || 'Disponible'"
            :price="announcement.price"
            :bathrooms="announcement.numberOfBathrooms || 0"
            :livingRoom="announcement.numberOfLivingRooms || 0"
            :bedroom="announcement.numberOfBedrooms || 0"
            :kitchen="announcement.numberOfKitchen || 0"
          />
          <div class="action_buttons">
            <button class="edit_btn" @click="editAnnouncement(announcement._id)">
              Modifier
            </button>
            <button class="delete_btn" @click="deleteAnnouncement(announcement._id)">
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="announcements.length > itemsPerPage" class="pagination">
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
.ad {
  margin-bottom: 50px;
}

.ad_contain_top {
  margin-bottom: 20px;
}

.ad_contain_top_title {
  background-color: #000;
  color: #fff;
  font-weight: bold;
  padding: 12px 10px;
  text-align: center;
  margin-bottom: 15px;
}

.button_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  gap: 15px;
}

.guide_btn,
.create_btn {
  padding: 12px 20px;
  background-color: #274abb;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: background-color 0.3s ease;
}

.guide_btn:hover,
.create_btn:hover {
  background-color: #1d3a8f;
}

.ad_contain_list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
  padding: 20px;
}

.ad_item {
  position: relative;
}

.ad_item :deep(.recent_contain_list_item) {
  width: 260px;
}

.ad_item :deep(.recent_contain_list_item_img) {
  height: 150px;
}

.ad_item :deep(.recent_contain_list_item_info_title) {
  font-size: 16px;
}

.ad_item :deep(.recent_contain_list_item_description) {
  padding: 10px 15px 0px 10px;
}

.ad_item :deep(.recent_contain_list_item_details) {
  font-size: 13px;
  margin-bottom: 15px;
}

.ad_item :deep(.recent_contain_list_item_price) {
  font-size: 16px;
}

.action_buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  width: 260px;
}

.edit_btn,
.delete_btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 14px;
}

.edit_btn {
  background-color: #274abb;
  color: #fff;
}

.edit_btn:hover {
  background-color: #1d3a8f;
}

.delete_btn {
  background-color: #ff385c;
  color: #fff;
}

.delete_btn:hover {
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
}

.empty_message p {
  font-size: 18px;
  color: #666;
}

/* Modal */
.modal_virtual_tour {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal_content {
  background: #fff;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 2px solid #e0e0e0;
  border-radius: 12px 12px 0 0;
}

.modal_header h2 {
  margin: 0;
  color: #000;
  font-size: 24px;
  font-weight: 700;
}

.close_btn {
  background: none;
  border: none;
  font-size: 36px;
  color: #000;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.close_btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.modal_body {
  padding: 25px 20px 20px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 15px;
}

.step {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 30px 20px 20px 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  position: relative;
}

.step_number {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #274abb;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
}

.step_content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  text-align: center;
}

.step_icon {
  font-size: 40px;
}

.step_content h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 700;
}

.step_content p {
  margin: 0;
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}

.important_text {
  grid-column: 1 / -1;
  padding: 15px;
  background-color: #e3f2fd;
  border-radius: 10px;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-top: 5px;
}

.important_text strong {
  color: #1976d2;
  font-weight: 700;
}

.modal_footer {
  padding: 15px 25px;
  border-top: 2px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

.modal_close_btn {
  padding: 10px 25px;
  background-color: #274abb;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: background-color 0.3s ease;
}

.modal_close_btn:hover {
  background-color: #1d3a8f;
}

@media (max-width: 768px) {
  .button_container {
    flex-direction: column;
    padding: 0 10px;
    gap: 10px;
  }

  .guide_btn,
  .create_btn {
    width: 100%;
  }

  .ad_contain_list {
    grid-template-columns: 1fr;
  }

  .modal_content {
    max-height: 95vh;
  }

  .modal_header {
    padding: 20px;
  }

  .modal_header h2 {
    font-size: 20px;
  }

  .modal_body {
    padding: 20px;
    grid-template-columns: 1fr;
  }

  .step {
    flex-direction: column;
    gap: 15px;
  }

  .step_number {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }
}
</style>

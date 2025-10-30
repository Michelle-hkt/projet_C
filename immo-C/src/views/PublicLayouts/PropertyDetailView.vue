<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { announcementService } from '@/services/announcementService'
import { paymentService } from '@/services/paymentService'
import AddFavorite from '@/components/AddFavorite.vue'

const route = useRoute()
const router = useRouter()

const announcement = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const currentImageIndex = ref(0)
const showRequestModal = ref(false)
const showVirtualTourModal = ref(false)

const loadAnnouncement = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const announcementId = route.params.id
    const response = await announcementService.getAnnouncementById(announcementId)
    announcement.value = response.data || response
    console.log('Annonce chargée:', announcement.value)
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement de l\'annonce'
    console.error('Erreur:', error)
  } finally {
    isLoading.value = false
  }
}

const changeImage = (index) => {
  currentImageIndex.value = index
}

const nextImage = () => {
  if (announcement.value?.images) {
    currentImageIndex.value = (currentImageIndex.value + 1) % announcement.value.images.length
  }
}

const prevImage = () => {
  if (announcement.value?.images) {
    currentImageIndex.value = currentImageIndex.value === 0 
      ? announcement.value.images.length - 1 
      : currentImageIndex.value - 1
  }
}

const requestVisit = () => {
  showRequestModal.value = true
}

const requestVirtualTour = () => {
  showVirtualTourModal.value = true
}

const confirmRequestVisit = async () => {
  try {
    // Appel API pour demander une visite sur site
    await paymentService.payForOnSiteVisit(announcement.value._id)
    alert('Demande de visite envoyée avec succès ! Un agent vous contactera bientôt.')
    showRequestModal.value = false
  } catch (error) {
    alert('Erreur lors de la demande de visite: ' + (error.response?.data?.message || error.message))
  }
}

const confirmVirtualTour = async () => {
  try {
    // Appel API pour accéder à la visite virtuelle
    const response = await paymentService.payForVirtualVisit(announcement.value._id)
    alert('Accès à la visite virtuelle accordé !')
    
    // Ouvrir l'URL de la visite virtuelle dans un nouvel onglet
    if (response.visitUrl && response.visitUrl !== 'N/A') {
      window.open(response.visitUrl, '_blank')
    }
    
    showVirtualTourModal.value = false
  } catch (error) {
    alert('Erreur lors de l\'accès à la visite virtuelle: ' + (error.response?.data?.message || error.message))
  }
}

const goBack = () => {
  router.back()
}

// Forcer le header blanc avec texte noir sur cette page
const applyHeaderStyle = () => {
  const header = document.querySelector('.header')
  if (header) {
    header.classList.add('force-white-announcements')
  }
}

// Gérer la box-shadow au scroll (sans changer la couleur)
const handleScrollShadow = () => {
  const header = document.querySelector('.header')
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add('with-shadow')
    } else {
      header.classList.remove('with-shadow')
    }
  }
}

onMounted(() => {
  loadAnnouncement()
  applyHeaderStyle()
  window.addEventListener('scroll', handleScrollShadow)
})

onUnmounted(() => {
  const header = document.querySelector('.header')
  if (header) {
    header.classList.remove('force-white-announcements', 'with-shadow')
  }
  // Retirer l'écouteur de scroll
  window.removeEventListener('scroll', handleScrollShadow)
})
</script>

<template>
  <div class="property_detail">
    <!-- Loader -->
    <div v-if="isLoading" class="page_loader">
      <div class="loader_spinner"></div>
      <p>Chargement en cours...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="errorMessage" class="error_container">
      <p class="error_message">{{ errorMessage }}</p>
      <button @click="goBack" class="back_btn">Retour</button>
    </div>

    <!-- Contenu -->
    <div v-else-if="announcement" class="property_container">
      <!-- Header avec titre et prix -->
      <div class="property_header">
        <button @click="goBack" class="back_button">
          <i class="fas fa-arrow-left"></i> Retour
        </button>
        <div class="header_content">
          <div class="header_left">
            <h1 class="property_title">{{ announcement.title }}</h1>
            <p class="property_location">
              <i class="fas fa-map-marker-alt"></i>
              {{ announcement.district }}, {{ announcement.address }}
            </p>
          </div>
          <div class="header_right">
            <span class="property_status" :class="announcement.status">
              {{ announcement.status === 'a_louer' ? 'À LOUER' : 'À VENDRE' }}
            </span>
            <h2 class="property_price">{{ announcement.price.toLocaleString() }} FCFA</h2>
            <AddFavorite 
              v-if="announcement._id" 
              :announcementId="announcement._id" 
              :initialFavorite="false" 
            />
          </div>
        </div>
      </div>

      <!-- Galerie d'images -->
      <div class="property_gallery">
        <div class="gallery_main">
          <img 
            :src="announcement.images?.[currentImageIndex] || '/src/assets/images/banner.jpeg'" 
            :alt="announcement.title"
          >
          <button v-if="announcement.images?.length > 1" class="gallery_nav prev" @click="prevImage">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button v-if="announcement.images?.length > 1" class="gallery_nav next" @click="nextImage">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <div v-if="announcement.images?.length > 1" class="gallery_thumbnails">
          <img 
            v-for="(image, index) in announcement.images" 
            :key="index"
            :src="image"
            :alt="`Image ${index + 1}`"
            :class="{ active: index === currentImageIndex }"
            @click="changeImage(index)"
          >
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="property_content">
        <!-- Colonne gauche -->
        <div class="content_left">
          <!-- Description -->
          <section class="property_section">
            <h3 class="section_title">Description</h3>
            <p class="property_description">{{ announcement.description }}</p>
          </section>

          <!-- Détails de la propriété -->
          <section class="property_section">
            <h3 class="section_title">Détails de la propriété</h3>
            <div class="details_grid">
              <div class="detail_item">
                <span class="detail_label">Type de bien</span>
                <span class="detail_value">{{ announcement.propertyType?.name || 'N/A' }}</span>
              </div>
              <div class="detail_item">
                <span class="detail_label">Statut</span>
                <span class="detail_value">{{ announcement.status === 'a_louer' ? 'À louer' : 'À vendre' }}</span>
              </div>
              <div class="detail_item">
                <span class="detail_label">Prix</span>
                <span class="detail_value">{{ announcement.price.toLocaleString() }} FCFA</span>
              </div>
              <div class="detail_item">
                <span class="detail_label">Surface</span>
                <span class="detail_value">{{ announcement.area || 'N/A' }} m²</span>
              </div>
              <div class="detail_item">
                <span class="detail_label">Chambres</span>
                <span class="detail_value">{{ announcement.numberOfBedrooms || 0 }}</span>
              </div>
              <div class="detail_item">
                <span class="detail_label">Salles de bain</span>
                <span class="detail_value">{{ announcement.numberOfBathrooms || 0 }}</span>
              </div>
              <div class="detail_item">
                <span class="detail_label">Salons</span>
                <span class="detail_value">{{ announcement.numberOfLivingRooms || 0 }}</span>
              </div>
              <div class="detail_item">
                <span class="detail_label">Cuisines</span>
                <span class="detail_value">{{ announcement.numberOfKitchen || 0 }}</span>
              </div>
              <div v-if="announcement.status === 'a_louer'" class="detail_item">
                <span class="detail_label">Caution</span>
                <span class="detail_value">{{ announcement.securityDeposit?.toLocaleString() || 'N/A' }} FCFA</span>
              </div>
              <div v-if="announcement.status === 'a_louer'" class="detail_item">
                <span class="detail_label">Avance</span>
                <span class="detail_value">{{ announcement.advancePayment?.toLocaleString() || 'N/A' }} FCFA</span>
              </div>
            </div>
          </section>

          <!-- Équipements -->
          <section v-if="announcement.equipment && announcement.equipment.length > 0" class="property_section">
            <h3 class="section_title">Équipements</h3>
            <div class="amenities_grid">
              <div v-for="(item, index) in announcement.equipment" :key="index" class="amenity_item">
                <i class="fas fa-check-circle"></i>
                <span>{{ item }}</span>
              </div>
            </div>
          </section>

          <!-- Localisation -->
          <section class="property_section">
            <h3 class="section_title">Localisation</h3>
            <div class="location_info">
              <p><strong>Ville:</strong> {{ announcement.city || 'N/A' }}</p>
              <p><strong>Quartier:</strong> {{ announcement.district || 'N/A' }}</p>
              <p><strong>Adresse:</strong> {{ announcement.address || 'N/A' }}</p>
            </div>
          </section>
        </div>

        <!-- Colonne droite (sidebar) -->
        <div class="content_right">
          <!-- Actions -->
          <div class="action_card">
            <h3>Réserver une visite</h3>
            <p class="action_description">Choisissez le type de visite qui vous convient</p>
            
            <button class="action_btn primary" @click="requestVisit">
              <i class="fas fa-calendar-check"></i>
              Demander une visite
            </button>
            
            <button class="action_btn secondary" @click="requestVirtualTour">
              <i class="fas fa-vr-cardboard"></i>
              Faire la visite virtuelle
            </button>

            <div class="action_info">
              <p><i class="fas fa-info-circle"></i> La visite sur site coûte <strong>1000 immo</strong></p>
              <p><i class="fas fa-info-circle"></i> La visite virtuelle coûte <strong>1500 immo</strong></p>
            </div>
          </div>

          <!-- Informations complémentaires -->
          <div class="info_card">
            <h3>Informations</h3>
            <div class="info_item">
              <i class="fas fa-calendar-alt"></i>
              <div>
                <span class="info_label">Publié le</span>
                <span class="info_value">{{ new Date(announcement.publicationDate).toLocaleDateString('fr-FR') }}</span>
              </div>
            </div>
            <div class="info_item">
              <i class="fas fa-eye"></i>
              <div>
                <span class="info_label">Vues</span>
                <span class="info_value">{{ announcement.views || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal demande de visite -->
    <div v-if="showRequestModal" class="modal_overlay" @click="showRequestModal = false">
      <div class="modal_content" @click.stop>
        <button class="modal_close" @click="showRequestModal = false">×</button>
        <h2>Demander une visite sur site</h2>
        <p>Vous allez réserver une visite sur site pour cette propriété.</p>
        <p class="modal_price"><strong>Coût:</strong> 1000 immo</p>
        <p class="modal_info">Un agent vous contactera pour convenir d'un rendez-vous.</p>
        <div class="modal_actions">
          <button class="btn_cancel" @click="showRequestModal = false">Annuler</button>
          <button class="btn_confirm" @click="confirmRequestVisit">Confirmer</button>
        </div>
      </div>
    </div>

    <!-- Modal visite virtuelle -->
    <div v-if="showVirtualTourModal" class="modal_overlay" @click="showVirtualTourModal = false">
      <div class="modal_content" @click.stop>
        <button class="modal_close" @click="showVirtualTourModal = false">×</button>
        <h2>Visite virtuelle</h2>
        <p>Vous allez accéder à la visite virtuelle de cette propriété.</p>
        <p class="modal_price"><strong>Coût:</strong> 1500 immo</p>
        <p class="modal_info">Vous serez redirigé vers la visite virtuelle après confirmation.</p>
        <div class="modal_actions">
          <button class="btn_cancel" @click="showVirtualTourModal = false">Annuler</button>
          <button class="btn_confirm" @click="confirmVirtualTour">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.property_detail {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 100px;
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

.error_container {
  text-align: center;
  padding: 60px 20px;
}

.error_message {
  color: #c33;
  font-size: 18px;
  margin-bottom: 20px;
}

.back_btn {
  padding: 12px 24px;
  background-color: #274abb;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.property_container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.property_header {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.back_button {
  background: none;
  border: none;
  color: #274abb;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  margin-bottom: 15px;
  transition: color 0.3s;
}

.back_button:hover {
  color: #1d3a8f;
}

.header_content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.header_left {
  flex: 1;
}

.property_title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.property_location {
  font-size: 16px;
  color: #666;
}

.property_location i {
  color: #274abb;
  margin-right: 5px;
}

.header_right {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.property_status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.property_status.a_louer {
  background-color: #17a2b8;
}

.property_status.a_vendre {
  background-color: #28a745;
}

.property_price {
  font-size: 28px;
  font-weight: bold;
  color: #274abb;
  margin: 0;
}

/* Galerie */
.property_gallery {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.gallery_main {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
}

.gallery_main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery_nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  transition: background 0.3s;
}

.gallery_nav:hover {
  background: rgba(0,0,0,0.7);
}

.gallery_nav.prev {
  left: 20px;
}

.gallery_nav.next {
  right: 20px;
}

.gallery_thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.gallery_thumbnails img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s, border 0.3s;
  border: 3px solid transparent;
}

.gallery_thumbnails img:hover,
.gallery_thumbnails img.active {
  opacity: 1;
  border-color: #274abb;
}

/* Contenu principal */
.property_content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
}

.content_left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.property_section {
  background: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section_title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.property_description {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
}

.details_grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.detail_item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail_label {
  font-size: 14px;
  color: #777;
  font-weight: 500;
}

.detail_value {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.amenities_grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.amenity_item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: #555;
}

.amenity_item i {
  color: #28a745;
  font-size: 16px;
}

.location_info p {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}

.location_info strong {
  color: #333;
  margin-right: 8px;
}

/* Sidebar */
.content_right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action_card,
.info_card {
  background: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.action_card h3,
.info_card h3 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.action_description {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.action_btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
  transition: all 0.3s;
}

.action_btn.primary {
  background-color: #274abb;
  color: #fff;
}

.action_btn.primary:hover {
  background-color: #1d3a8f;
}

.action_btn.secondary {
  background-color: #28a745;
  color: #fff;
}

.action_btn.secondary:hover {
  background-color: #218838;
}

.action_info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.action_info p {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action_info i {
  color: #274abb;
}

.info_item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info_item:last-child {
  border-bottom: none;
}

.info_item i {
  font-size: 20px;
  color: #274abb;
  width: 24px;
  text-align: center;
}

.info_item > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info_label {
  font-size: 13px;
  color: #777;
}

.info_value {
  font-size: 15px;
  color: #333;
  font-weight: 600;
}

/* Modals */
.modal_overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal_content {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  position: relative;
}

.modal_close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  line-height: 1;
}

.modal_close:hover {
  color: #333;
}

.modal_content h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
}

.modal_content p {
  font-size: 16px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.6;
}

.modal_price {
  font-size: 18px;
  color: #274abb;
  font-weight: 600;
}

.modal_info {
  font-size: 14px;
  color: #777;
  font-style: italic;
}

.modal_actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.btn_cancel,
.btn_confirm {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn_cancel {
  background-color: #f0f0f0;
  color: #333;
}

.btn_cancel:hover {
  background-color: #e0e0e0;
}

.btn_confirm {
  background-color: #274abb;
  color: #fff;
}

.btn_confirm:hover {
  background-color: #1d3a8f;
}

/* Responsive */
@media (max-width: 992px) {
  .property_content {
    grid-template-columns: 1fr;
  }

  .header_content {
    flex-direction: column;
  }

  .header_right {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .details_grid {
    grid-template-columns: 1fr;
  }

  .gallery_main {
    height: 350px;
  }
}

@media (max-width: 576px) {
  .property_title {
    font-size: 24px;
  }

  .property_price {
    font-size: 22px;
  }

  .gallery_main {
    height: 250px;
  }

  .amenities_grid {
    grid-template-columns: 1fr;
  }
}
</style>


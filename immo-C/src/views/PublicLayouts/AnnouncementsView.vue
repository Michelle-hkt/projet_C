<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAnnouncementStore } from '@/stores/announcementStore'
import { usePropertyTypeStore } from '@/stores/propertyTypeStore'
import AnnouncementBox from '@/components/AnnouncementBox.vue'
import SectionTitle from '@/components/SectionTitle.vue'

const announcementStore = useAnnouncementStore()
const propertyTypeStore = usePropertyTypeStore()

const announcements = ref([])
const isLoading = ref(false)
const isPageLoading = ref(true)
const errorMessage = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 9

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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Mêmes champs que la page d'accueil
const type = ref('')
const category = ref('')
const location = ref('')
const price = ref('')

const categoryOptions = ['A vendre', 'A louer']

const loadPropertyTypes = async () => {
  try {
    // Utiliser le store - les données seront déjà en cache si disponibles
    await propertyTypeStore.fetchPropertyTypes()
  } catch (error) {
    console.error('Erreur lors du chargement des types:', error)
  }
}

const loadAnnouncements = async () => {
  isLoading.value = true
  errorMessage.value = ''
  currentPage.value = 1

  try {
    // Utiliser le store - les données seront déjà en cache si disponibles
    const data = await announcementStore.fetchAnnouncements()
    announcements.value = data || []
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des annonces'
    console.error('Erreur:', error)
  } finally {
    isLoading.value = false
  }
}

const searchAnnouncements = async () => {
  isLoading.value = true
  errorMessage.value = ''
  currentPage.value = 1

  try {
    const params = {}
    if (type.value) params.propertyType = type.value
    if (category.value) params.category = category.value
    if (location.value) params.location = location.value
    if (price.value) params.maxPrice = price.value

    const response = await announcementStore.searchAnnouncements(params)
    announcements.value = response || []
  } catch (error) {
    errorMessage.value = 'Erreur lors de la recherche'
    console.error('Erreur:', error)
  } finally {
    isLoading.value = false
  }
}

const resetFilters = () => {
  type.value = ''
  category.value = ''
  location.value = ''
  price.value = ''
  loadAnnouncements()
}

// Forcer le header blanc avec texte noir sur cette page
const forceWhiteHeader = () => {
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

onMounted(async () => {
  isPageLoading.value = true
  try {
    await Promise.all([
      loadPropertyTypes(),
      loadAnnouncements()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement de la page:', error)
  } finally {
    isPageLoading.value = false
  }
  
  forceWhiteHeader()
  // Ajouter l'écouteur pour la shadow uniquement
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
  <section class="announcements">
    <!-- Loader pendant le chargement initial -->
    <div v-if="isPageLoading" class="page_loader_full">
      <div class="loader_spinner"></div>
      <p>Chargement en cours...</p>
    </div>

    <!-- Contenu de la page -->
    <template v-else>
    <div class="banner_search">
      <div class="container">
        <div class="banner_search_contain">
          <SectionTitle h3Title="TOUTES NOS" h2Title="ANNONCES" />
          <div class="search_form_container">
            <form @submit.prevent="searchAnnouncements" class="search_form">
              <!-- input Type -->
              <select v-model="type" class="search_field">
                <option value="" disabled selected>Type</option>
                <option v-for="propertyType in propertyTypeStore.all" :key="propertyType._id" :value="propertyType._id">
                  {{ propertyType.name }}
                </option>
              </select>

              <!-- input Catégorie -->
              <select v-model="category" class="search_field">
                <option value="" disabled selected>Catégorie</option>
                <option v-for="(opt, index) in categoryOptions" :key="index" :value="opt">
                  {{ opt }}
                </option>
              </select>

              <!-- input Lieux -->
              <input v-model="location" type="text" placeholder="Lieux" class="search_field" />

              <!-- input Prix max -->
              <input v-model="price" type="number" placeholder="Prix max" class="search_field" />

              <!-- input Bouton -->
              <button type="submit" class="search_button">Rechercher</button>
              <button type="button" class="reset_button" @click="resetFilters">
                Réinitialiser
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="announcements_list_section">
      <div class="container">
        <div v-if="isLoading" class="loading">Chargement des annonces...</div>

        <div v-else-if="errorMessage" class="error_message">{{ errorMessage }}</div>

        <div v-else-if="announcements.length === 0" class="empty_message">
          <p>Aucune annonce trouvée</p>
        </div>

        <div v-else class="announcements_grid">
          <AnnouncementBox
            v-for="announcement in paginatedAnnouncements"
            :key="announcement._id"
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
  </section>
</template>

<style scoped>
.announcements {
  padding-top: 130px;
  background-color: #f5f7fb;
  min-height: 100vh;
}

.banner_search {
  padding: 40px 0;
  margin-bottom: 40px;
}

.banner_search_contain {
  text-align: center;
}

.search_form_container {
  margin-top: 30px;
}

.search_form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.search_field {
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  outline: none;
  min-width: 180px;
  flex: 1;
  max-width: 250px;
}

.search_field:focus {
  border-color: #274abb;
}

.search_button {
  padding: 12px 25px;
  background-color: #274abb;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
}

.search_button:hover {
  background-color: #1d3a8f;
}

.reset_button {
  padding: 12px 25px;
  background-color: #fff;
  color: #274abb;
  border: 1px solid #274abb;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
}

.reset_button:hover {
  background-color: #f5f7fb;
}

.announcements_list_section {
  padding: 20px 0 60px 0;
}

.announcements_grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.loading {
  text-align: center;
  padding: 60px;
  font-size: 20px;
  color: #666;
}

.error_message {
  background-color: #fee;
  color: #c33;
  padding: 20px;
  border-radius: 8px;
  margin: 40px auto;
  max-width: 600px;
  text-align: center;
  border: 1px solid #fcc;
}

.empty_message {
  text-align: center;
  padding: 80px 20px;
  font-size: 20px;
  color: #666;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 40px;
  margin-bottom: 40px;
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

@media (max-width: 768px) {
  .search_form {
    flex-direction: column;
  }

  .search_field {
    width: 100%;
    max-width: 100%;
  }

  .search_button,
  .reset_button {
    width: 100%;
  }

  .announcements_grid {
    grid-template-columns: 1fr;
  }
}

.page_loader_full {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 100px 50px;
}

.loader_spinner {
  width: 60px;
  height: 60px;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #274abb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 25px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.page_loader_full p {
  color: #666;
  font-size: 18px;
  font-weight: 600;
}
</style>



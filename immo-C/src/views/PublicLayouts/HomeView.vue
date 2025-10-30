<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { Pagination, Autoplay } from 'swiper/modules'
import AnnouncementBox from '@/components/AnnouncementBox.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import { useAnnouncementStore } from '@/stores/announcementStore'
import { usePropertyTypeStore } from '@/stores/propertyTypeStore'

const router = useRouter()
const announcementStore = useAnnouncementStore()
const propertyTypeStore = usePropertyTypeStore()

const type = ref('')
const category = ref('')
const location = ref('')
const price = ref('')

const recentAnnouncements = ref([])
const popularAnnouncements = ref([])
const isLoadingRecent = ref(true)
const isLoadingPopular = ref(true)

const categoryOptions = ['A vendre', 'A louer']

const categoryTable = [
  {
    name: 'Appartement',
    description: 'Trouvez votre appartement idéal, moderne et lumineux !',
    img: '/src/assets/icons/appart2.png',
  },
  {
    name: 'Maison',
    description: 'Découvrez la maison parfaite pour votre famille.',
    img: '/src/assets/icons/maison2.png',
  },
  {
    name: 'Terrain',
    description: 'Dénichez le terrain qui concrétisera votre projet.',
    img: '/src/assets/icons/terrain2.png',
  },
  {
    name: 'boutique',
    description: 'Trouvez la boutique idéale pour lancer votre activité.',
    img: '/src/assets/icons/boutique2.png',
  },
]

const loadPropertyTypes = async () => {
  try {
    await propertyTypeStore.fetchPropertyTypes()
  } catch (error) {
    console.error('Erreur lors du chargement des types de propriété:', error)
  }
}

const loadRecentAnnouncements = async () => {
  isLoadingRecent.value = true
  try {
    const data = await announcementStore.fetchRecentAnnouncements()
    recentAnnouncements.value = data || []
  } catch (error) {
    console.error('Erreur lors du chargement des annonces récentes:', error)
  } finally {
    isLoadingRecent.value = false
  }
}

const loadPopularAnnouncements = async () => {
  isLoadingPopular.value = true
  try {
    const data = await announcementStore.fetchAnnouncements()
    popularAnnouncements.value = (data || []).slice(0, 6)
  } catch (error) {
    console.error('Erreur lors du chargement des annonces populaires:', error)
  } finally {
    isLoadingPopular.value = false
  }
}

const handleSearch = (event) => {
  event.preventDefault()
  const params = new URLSearchParams()
  if (type.value) params.append('propertyType', type.value)
  if (category.value) params.append('category', category.value)
  if (location.value) params.append('location', location.value)
  if (price.value) params.append('maxPrice', price.value)
  router.push({ path: '/announcements', query: Object.fromEntries(params) })
}

// Animation au scroll
const handleScrollAnimation = () => {
  const animatedElements = document.querySelectorAll('.animate-on-scroll')
  
  animatedElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementBottom = element.getBoundingClientRect().bottom
    const windowHeight = window.innerHeight
    
    if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
      element.classList.add('animated')
    }
  })
}

onMounted(() => {
  loadPropertyTypes()
  loadRecentAnnouncements()
  loadPopularAnnouncements()
  
  // Ajouter l'écouteur de scroll pour les animations
  window.addEventListener('scroll', handleScrollAnimation)
  // Déclencher l'animation au chargement
  setTimeout(handleScrollAnimation, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScrollAnimation)
})
</script>
<template>
  <!-- Banner -->
  <section class="banner">
    <div class="container">
      <div class="banner_contain">
        <!-- titre et text -->
        <div class="banner_contain_text banner-fade-in">
          <div class="banner_contain_text_title">
            <h1>Trouvez ce que vous cherchez en un clic</h1>
            <div class="banner_sub_title">
              <h5>
                Explorez une large gamme de maisons, appartements et terrains soigneusement
                sélectionnés, et trouvez facilement le bien qui correspond exactement à vos besoins
                et envies.
              </h5>
            </div>
          </div>
        </div>
        <!-- formulaire de recherche -->
        <div class="banner_contain_searchbar banner-fade-in-delay">
          <form class="search_form" @submit="handleSearch">
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
          </form>
        </div>
      </div>
    </div>
  </section>
  <!-- Propriété recentes -->
  <section class="recent">
    <div class="container">
      <div class="recent_contain">
        <SectionTitle h3Title="LES PLUS" h2Title="RECENTS" />
        <div v-if="isLoadingRecent" class="loading">Chargement...</div>
        <div v-else-if="recentAnnouncements.length === 0" class="empty_message">
          Aucune annonce récente pour le moment
        </div>
        <div v-else class="recent_contain_bottom">
          <Swiper
            :modules="[Pagination, Autoplay]"
            :slides-per-view="3"
            :autoplay="{ delay: 2000, disableOnInteraction: false }"
            :space-between="10"
            pagination
            class="recent_swiper"
          >
            <SwiperSlide v-for="announcement in recentAnnouncements" :key="announcement._id">
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
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  </section>
  <!-- Ce que nous proposons -->
  <section class="service parallax parallax-1">
    <div class="container">
      <div class="service_contain">
        <div class="service_contain_top">
          <SectionTitle h3Title="CE QUE NOUS" h2Title="PROPOSONS" />
        </div>
        <div class="service_contain_bottom">
          <div
            class="service_contain_bottom_item animate-on-scroll"
            v-for="(category, index) in categoryTable"
            :key="index"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="service_contain_bottom_item_logo"><img :src="category.img" alt="" /></div>
            <div class="service_contain_bottom_item_title">{{ category.name }}</div>
            <div class="service_contain_bottom_item_texte">{{ category.description }}</div>
            <RouterLink to="/announcements" class="service_contain_bottom_item_link"
              >Explorer <i class="fas fa-arrow-right"></i
            ></RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- les plus populaires -->
  <section class="popular">
    <div class="container">
      <div class="popular_contain">
        <div class="popular_contain_top">
          <SectionTitle h3Title="LES PLUS" h2Title="POPULAIRES" />
        </div>
        <div v-if="isLoadingPopular" class="loading">Chargement...</div>
        <div v-else-if="popularAnnouncements.length === 0" class="empty_message">
          Aucune annonce disponible pour le moment
        </div>
        <div v-else class="popular_contain_bottom">
          <AnnouncementBox
            v-for="(announcement, index) in popularAnnouncements"
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
            class="animate-on-scroll"
            :style="{ animationDelay: `${index * 0.1}s` }"
          />
        </div>
        <div class="popular_contain_bottom_button">
          <RouterLink to="/announcements">
            <button>Voir plus<i class="fas fa-arrow-right"></i></button>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
  <!-- PROMOTEUR -->
  <section class="promotor parallax parallax-2">
    <div class="container">
      <div class="promotor_contain">
        <div class="promotor_contain_top">
          <SectionTitle h3Title="VOUS ÊTES AUSSI" h2Title="PROMOTEUR" />
        </div>
        <div class="promotor_contain_text">Vendez vos biens en juste trois étapes</div>
        <div class="promotor_contain_bottom">
          <div class="promotor_contain_botttom_item animate-on-scroll" style="animation-delay: 0s">
            <span class="item_logo"><img src="@/assets/icons/news.png" alt="" /></span>
            <p class="item_title">Créer une annonce</p>
            <p class="item_text">
              Donnez vie à votre bien en quelques clics. Décrivez-le, ajoutez des photos et mettez
              en avant ses atouts !
            </p>
          </div>
          <div class="promotor_contain_botttom_item animate-on-scroll" style="animation-delay: 0.1s">
            <span class="item_logo"><img src="@/assets/icons/VVt.png" alt="" /></span>
            <p class="item_title">Ajoutez une visite virtuelle</p>
            <p class="item_text">
              Offrez une expérience immersive à vos visiteurs. Permettez-leur de découvrir votre
              bien sans se déplacer !
            </p>
          </div>
          <div class="promotor_contain_botttom_item animate-on-scroll" style="animation-delay: 0.2s">
            <span class="item_logo"><img src="@/assets/icons/pub.png" alt="" /></span>
            <p class="item_title">Publiez l'annonce</p>
            <p class="item_text">
              Rendez votre bien visible auprès de milliers d'acheteurs potentiels. Publier, c'est
              franchir la première étape vers la vente !
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- AGENT -->
  <section class="agent">
    <div class="container">
      <div class="agent_contain">
        <div class="agent_contain_top">
          <SectionTitle h3Title="SERIEZ VOUS" h2Title="INTÉRESSÉ ?" />
        </div>
        <div class="agent_contain_bottom">
          <div class="agent_contain_bottom_left animate-on-scroll animate-slide-from-left">
            <p class="agent_contain_bottom_left_title">Rejoignez notre communauté d'agents</p>
            <p class="agent_contain_bottom_left_text">
              Tu connais bien ta zone et cherches un bon plan pour arrondir tes fins de mois ?
              Rejoins Babomon et touche une commission à chaque vente ou location conclue. C'est
              simple, flexible et accessible à tous !
            </p>
            <div class="agent_contain_bottom_left_button">
              <RouterLink to="/agent/register">
                <button>Devenir agent</button>
              </RouterLink>
            </div>
          </div>
          <div class="agent_contain_bottom_right animate-on-scroll animate-slide-from-right" style="animation-delay: 0.3s">
            <img src="@/assets/images/agent.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style>
.banner {
  display: block;
  height: 100vh;
  position: relative;
  z-index: 99;
  background-image:
    linear-gradient(#00000033 0%, #00000033), url('@/assets/images/banner_home.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}
.banner_contain {
  display: flex;
  flex-direction: column;
}
.banner_contain_text_title {
  font-family: 'Montserrat', sans-serif;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 70px;
}
.banner_contain_text_title h1 {
  color: #fff;
  font-size: 45px;
  line-height: 66px;
  font-weight: 700;
  margin-bottom: 30px;
}
.banner_sub_title {
  width: 600px;
  text-align: center;
}
.banner_contain_text_title h5 {
  color: #fff;
  font-size: 18px;
}
.banner .container {
  width: 100%;
  max-width: 1300px;
}
/* ============== la searchbar =============== */
.banner_contain_searchbar {
  border: 1px solid #ebebeb;
  box-shadow: 0px 0px 0px 8px #ffffff33;
  padding: 30px 20px;
  border: none;
  background-color: #fff;
  border-radius: 10px;
}
.search_form {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
}
.search_field {
  padding: 15px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  width: 90%;
  cursor: pointer;
}
.search_field:focus {
  border-color: #274abb;
}
.search_button {
  padding: 15px 20px;
  background-color: #274abb;
  color: #ffffff;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.5s ease;
  border: 1px solid #274abb;
}
.search_button:hover {
  background-color: #ffffff;
  color: #274abb;
  border: 1px solid #000;
}

/* ============= proriété recentes=========== */
.recent {
  padding: 60px 0px;
  background-color: #f5f7fb !important;
}
.recent_contain_bottom {
  width: 100%;
  padding: 20px 0px;
}

.recent_swiper {
  width: 100%;
}
/* =========Parallax============ */
.parallax {
  position: relative;
  height: 500px;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}
.parallax::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.4);
}

.parallax .content {
  position: relative;
  z-index: 1;
  max-width: 800px;
}
.parallax-1 {
  background-image: linear-gradient(#00000033 0%, #00000033), url('@/assets/images/mb.jpeg');
}
.parallax-2 {
  background-image: linear-gradient(#00000033 0%, #00000033), url('@/assets/images/promo.jpeg');
}

/* ============== SERVICE PROPOSÉ=========== */
.service {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.service_contain {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.service_contain_bottom {
  display: flex;
  gap: 20px;
  justify-content: center;
}
.service_contain_bottom_item {
  background-color: #0f161c;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.06) !important;
  padding: 35px 25px 30px 25px;
}
.service_contain_bottom_item_logo {
  position: absolute;
  z-index: 30;
  top: -35px;
  right: 15px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #274abb;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.service_contain_bottom_item_logo img {
  object-fit: cover;
  width: 50px;
  height: 50px;
}
.service_contain_bottom_item_title {
  color: #fff;
  font-weight: 600;
  margin-bottom: 18px;
  font-size: 18px;
}
.service_contain_bottom_item_texte {
  color: #fff;
  line-height: 26px;
  margin-bottom: 15px;
}
.service_contain_bottom_item_link {
  color: #fff !important;
  cursor: pointer;
}
.service_contain_bottom_item_link:hover {
  color: #ff385c !important;
}
.service_contain_bottom_item_link i:hover {
  color: #ff385c !important;
}
/*============ LES PLUS POPULAIRES ============== */
.popular {
  padding: 80px 0px 50px 0px;
  background-color: #f5f7fb;
}
.popular_contain_bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 30px;
}
.popular_contain_bottom_button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 0px;
}
.popular_contain_bottom_button button {
  background-color: #274abb;
  color: #fff;
  border: none;
  padding: 13px 25px;
  border-radius: 36px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.5s ease;
}
.popular_contain_bottom_button button:hover {
  background-color: #0f161c;
  padding: 13px 27px;
  font-size: 20px;
}
.popular_contain_bottom_button button i {
  color: #fff;
  margin-left: 10px;
}
/* ========== PROMOTEUR =========== */
.promotor_contain {
  padding: 50px 0px 0px 0px;
}
.promotor_contain_text {
  font-size: 28px;
  color: #000;
  font-weight: bold;
  margin-bottom: 30px;
}
.promotor_contain_bottom {
  display: flex;
  align-items: center;
  gap: 30px;
}
.promotor_contain_botttom_item {
  background-color: #ebebeb;
  padding: 20px 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  transition: transform 0.4s ease;
  cursor: pointer;
}
.promotor_contain_botttom_item:hover {
  transform: scale(1.05);
}
.item_logo img {
  width: 50px;
  margin-bottom: 30px;
  margin-top: 10px;
}
.item_title {
  font-weight: bold;
  font-size: 18px;
  color: #0f1b26;
  margin-bottom: 15px;
}
.item_text {
  text-align: center;
}
/*============== AGENTS ============*/
.agent_contain {
  padding: 50px 0px 30px 0px;
}
.agent_contain_bottom {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: #e8ecfa;
}
.agent_contain_bottom_left {
  width: 40%;
}
.agent_contain_bottom_left_title {
  font-size: 28px;
  color: #000;
  font-weight: bold;
  margin-bottom: 30px;
}
.agent_contain_bottom_left_text {
  font-size: 19px;
  color: #000;
  margin-bottom: 25px;
}
.agent_contain_bottom_left_button button {
  background-color: #274abb;
  padding: 13px 25px;
  border: none;
  color: #fff;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
}
.agent_contain_bottom_left_button button:hover {
  background-color: #ff0000de;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.empty_message {
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #999;
}

/* ============== ANIMATIONS ============== */

/* Animation pour le banner */
.banner-fade-in {
  opacity: 0;
  transform: translateY(50px);
  animation: fadeInUp 1s ease forwards;
}

.banner-fade-in-delay {
  opacity: 0;
  transform: translateY(50px);
  animation: fadeInUp 1s ease 0.3s forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation pour les cartes au scroll */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.animate-on-scroll.animated {
  opacity: 1;
  transform: translateY(0);
}

/* Animation pour les cartes d'annonces (AnnouncementBox) */
.popular_contain_bottom .animate-on-scroll {
  opacity: 0;
  transform: scale(0.9) translateY(40px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.popular_contain_bottom .animate-on-scroll.animated {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Animation pour les cartes de services */
.service_contain_bottom_item.animate-on-scroll {
  opacity: 0;
  transform: translateY(50px) scale(0.95);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.service_contain_bottom_item.animate-on-scroll.animated {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Animation pour les cartes promoteur */
.promotor_contain_botttom_item.animate-on-scroll {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.promotor_contain_botttom_item.animate-on-scroll.animated {
  opacity: 1;
  transform: translateY(0);
}

/* Animation pour la section Agent - Slide depuis la gauche */
.animate-slide-from-left {
  opacity: 0;
  transform: translateX(-100px);
  transition: opacity 1s ease, transform 1s ease;
}

.animate-slide-from-left.animated {
  opacity: 1;
  transform: translateX(0);
}

/* Animation pour la section Agent - Slide depuis la droite */
.animate-slide-from-right {
  opacity: 0;
  transform: translateX(100px);
  transition: opacity 1s ease, transform 1s ease;
}

.animate-slide-from-right.animated {
  opacity: 1;
  transform: translateX(0);
}
</style>

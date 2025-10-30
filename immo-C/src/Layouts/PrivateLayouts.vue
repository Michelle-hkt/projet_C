<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import { paymentService } from '@/services/paymentService'

const router = useRouter()
const selectedFile = ref(null)
const walletBalance = ref(0)

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0]
  console.log('Fichier sélectionné :', selectedFile.value)
}

const triggerFileInput = () => {
  document.getElementById('fileUpload').click()
}

const loadWallet = async () => {
  try {
    const response = await paymentService.getWalletBalance()
    walletBalance.value = response.balance || 0
  } catch (error) {
    console.error('Erreur lors du chargement du wallet:', error)
  }
}

const handleLogout = async () => {
  await authService.logout()
  // Émettre un événement personnalisé pour informer le header
  window.dispatchEvent(new Event('auth-changed'))
  router.push('/home')
}

onMounted(() => {
  loadWallet()
  // Écouter un événement personnalisé pour recharger le wallet
  window.addEventListener('wallet-updated', loadWallet)
})
</script>

<template>
  <section class="box">
    <div class="banner">
      <RouterLink to="/announcements" class="back_button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Retour</span>
      </RouterLink>
      <div class="container">
        <div class="banner_user_contain">
          <div class="banner_left">
            <h1 v-if="$route.path === '/user/profile'">Mon profile</h1>
            <h1 v-if="$route.path === '/user/announcements'">Mes annonces</h1>
            <h1 v-if="$route.path === '/user/favorites'">Mes favories</h1>
            <h1 v-if="$route.path === '/user/notifications'">Mes notifications</h1>
            <h1 v-if="$route.path === '/user/wallet'">Mon portefeuille</h1>
          </div>
          <div class="banner_right">
            <p class="banner_right_balance">{{ walletBalance }} <span>immo</span></p>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="container">
        <div class="main_contain">
          <div class="main_contain_left">
            <div class="main_contain_left_img">
              <img src="../assets/images/go.jpeg" alt="" />
              <!-- Bouton Upload -->
              <button class="upload-btn" @click="triggerFileInput">Changer la photo</button>
              <input id="fileUpload" type="file" @change="handleFileUpload" style="display: none" />
            </div>
            <ul class="main_contain_left_menu">
              <li class="main_contain_left_menu__item">
                <span :class="{ icon_active_section: $route.path === '/user/profile' }"
                  ><img src="../assets/icons/person.png" alt=""
                /></span>
                <RouterLink to="/user/profile" @click="isSidebarVisible = false">
                  <p :class="{ text_active_section: $route.path === '/user/profile' }">Profile</p>
                </RouterLink>
              </li>

              <li class="main_contain_left_menu__item">
                <span :class="{ icon_active_section: $route.path === '/user/announcements' }"
                  ><img src="../assets/icons/ad.png" alt=""
                /></span>
                <RouterLink to="/user/announcements" @click="isSidebarVisible = false">
                  <p :class="{ text_active_section: $route.path === '/user/announcements' }">
                    Annonces
                  </p>
                </RouterLink>
              </li>

              <li class="main_contain_left_menu__item">
                <span :class="{ icon_active_section: $route.path === '/user/favorites' }"
                  ><img src="../assets/icons/star.png" alt=""
                /></span>
                <RouterLink to="/user/favorites" @click="isSidebarVisible = false">
                  <p :class="{ text_active_section: $route.path === '/user/favorites' }">
                    Favories
                  </p>
                </RouterLink>
              </li>

              <li class="main_contain_left_menu__item">
                <span :class="{ icon_active_section: $route.path === '/user/notifications' }"
                  ><img src="../assets/icons/notif.png" alt=""
                /></span>
                <RouterLink to="/user/notifications" @click="isSidebarVisible = false">
                  <p :class="{ text_active_section: $route.path === '/user/notifications' }">
                    Notifications
                  </p>
                </RouterLink>
              </li>

              <li class="main_contain_left_menu__item">
                <span :class="{ icon_active_section: $route.path === '/user/wallet' }"
                  ><img src="../assets/icons/person.png" alt=""
                /></span>
                <RouterLink to="/user/wallet" @click="isSidebarVisible = false">
                  <p :class="{ text_active_section: $route.path === '/user/wallet' }">
                    Portefeuille
                  </p>
                </RouterLink>
              </li>

              <li class="main_contain_left_menu__item" @click="handleLogout">
                <span><img src="../assets/icons/1.png" alt="" /></span>
                <p style="cursor: pointer">Déconnection</p>
              </li>
            </ul>
          </div>
          <div class="main_contain_right">
            <RouterView />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ===================== Banner =================== */
.banner {
  width: 100%;
  height: 300px;
  background-image: linear-gradient(#00000099, #000000b3), url('../assets/images/banner.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
}

.back_button {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 20px;
  transition: all 0.3s ease;
  z-index: 10;
}

.back_button:hover svg {
  stroke: #7a9be1;
}

.back_button:hover span {
  color: #7a9be1;
}

.back_button svg {
  width: 20px;
  height: 20px;
  stroke: #fff;
  transition: stroke 0.3s ease;
}

.back_button span {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  transition: color 0.3s ease;
}

.banner_user_contain {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner_left h1 {
  color: #f3f2f2;
  font-weight: bold;
  font-size: 28px;
}

.banner_right {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 15px 25px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  min-width: 180px;
}

.banner_right_balance {
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}

.banner_right_balance span {
  font-size: 16px;
  font-weight: 600;
  color: #ffd700;
  margin-left: 5px;
}
/* ==================== main =======================*/
.icon_active_section {
  background-color: #4a6fa5 !important;
}
.text_active_section {
  color: #4a6fa5 !important;
}

.main_contain {
  display: flex;
  gap: 20px;
}
/* ============= main_left ==============*/

.main_contain_left {
  max-width: 260px;
  border-radius: 0px 0px 6px 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: auto;
}
.main_contain_left_img {
  position: relative;
  height: 260px;
  overflow: hidden;
  border-radius: 6px;
  margin-bottom: 40px;
}
.main_contain_left_img img {
  
  object-fit: cover;
}
.upload-btn {
  position: absolute;
  bottom: 10px;
  left: 20%;
  background-color: white;
  border: 1px solid #ccc;
  padding: 6px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}

.upload-btn:hover {
  background-color: #f0f0f0;
}
.main_contain_left_menu__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
}
.main_contain_left_menu__item:hover {
  cursor: pointer;
  background-color: #edebeb;
}
.main_contain_left_menu__item span {
  width: 35px;
  height: 35px;
  padding: 4px;
  border-radius: 50%;
  background-color: #edebeb;
}

/* ============= main_right ==============*/
.main_contain_right {
  border-radius: 0px 0px 6px 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: auto;
  flex: 1;
}
</style>


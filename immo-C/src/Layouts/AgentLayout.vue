<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { agentService } from '@/services/agentService'

const router = useRouter()
const user = ref(null)
const walletBalance = ref(0)

const loadUserInfo = () => {
  const storedUser = localStorage.getItem('currentUser')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
}

const loadWalletBalance = async () => {
  try {
    const response = await agentService.getMyWalletBalance()
    walletBalance.value = response.balance || 0
  } catch (error) {
    console.error('Erreur lors du chargement du wallet:', error)
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('currentUser')
  router.push('/login')
}

onMounted(() => {
  loadUserInfo()
  loadWalletBalance()
  
  // Écouter les événements de mise à jour du wallet
  window.addEventListener('wallet-updated', loadWalletBalance)
})
</script>

<template>
  <div class="agent_layout">
    <div class="agent_sidebar">
      <div class="sidebar_header">
        <div class="logo">
          <img src="/src/assets/images/logo.png" alt="Logo" />
        </div>
        <div class="user_info">
          <div class="user_avatar">
            <i class="fas fa-user-tie"></i>
          </div>
          <h3>{{ user?.firstName }} {{ user?.lastName }}</h3>
          <p class="user_role">Agent Immobilier</p>
          <div class="wallet_badge">
            <i class="fas fa-wallet"></i>
            <span>{{ walletBalance.toLocaleString() }} immo</span>
          </div>
        </div>
      </div>

      <nav class="sidebar_menu">
        <h4 class="menu_title">Navigation</h4>
        <RouterLink to="/agent/dashboard" class="menu_item">
          <i class="fas fa-chart-line"></i>
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink to="/agent/profile" class="menu_item">
          <i class="fas fa-user"></i>
          <span>Mon Profil</span>
        </RouterLink>
        <RouterLink to="/agent/announcements" class="menu_item">
          <i class="fas fa-home"></i>
          <span>Mes Annonces</span>
        </RouterLink>
        <RouterLink to="/agent/wallet" class="menu_item">
          <i class="fas fa-wallet"></i>
          <span>Mon Portefeuille</span>
        </RouterLink>
        <RouterLink to="/agent/commissions" class="menu_item">
          <i class="fas fa-money-bill-wave"></i>
          <span>Mes Commissions</span>
        </RouterLink>
        <RouterLink to="/agent/sponsorship" class="menu_item">
          <i class="fas fa-share-alt"></i>
          <span>Parrainage</span>
        </RouterLink>
        <RouterLink to="/agent/sponsored-customers" class="menu_item">
          <i class="fas fa-users"></i>
          <span>Clients Parrainés</span>
        </RouterLink>
        <button @click="logout" class="menu_item logout_btn">
          <i class="fas fa-sign-out-alt"></i>
          <span>Déconnexion</span>
        </button>
      </nav>
    </div>

    <div class="agent_content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.agent_layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.agent_sidebar {
  width: 280px;
  background-color: #fff;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.sidebar_header {
  padding: 30px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo img {
  width: 120px;
}

.user_info {
  text-align: center;
}

.user_avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  border-radius: 50%;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user_avatar i {
  font-size: 36px;
  color: #fff;
}

.user_info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.user_role {
  font-size: 13px;
  color: #666;
  background-color: #d4edda;
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 10px;
}

.wallet_badge {
  background: linear-gradient(135deg, #274abb 0%, #1d3a8f 100%);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.wallet_badge i {
  font-size: 16px;
}

.sidebar_menu {
  padding: 20px;
}

.menu_title {
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 15px;
  padding-left: 10px;
  letter-spacing: 0.5px;
}

.menu_item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #666;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 5px;
  transition: all 0.3s;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 15px;
}

.menu_item i {
  font-size: 18px;
  margin-right: 12px;
  width: 20px;
}

.menu_item:hover {
  background-color: #f0f0f0;
  color: #28a745;
}

.menu_item.router-link-active {
  background-color: #28a745;
  color: #fff;
}

.logout_btn {
  margin-top: 20px;
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
}

.logout_btn:hover {
  background-color: #fee;
  color: #c33;
}

.agent_content {
  flex: 1;
  margin-left: 280px;
  padding: 30px;
  overflow-y: auto;
}

@media (max-width: 992px) {
  .agent_sidebar {
    width: 70px;
  }

  .sidebar_header .logo img {
    width: 40px;
  }

  .user_info h3,
  .user_role,
  .wallet_badge,
  .menu_title {
    display: none;
  }

  .user_avatar {
    width: 50px;
    height: 50px;
  }

  .user_avatar i {
    font-size: 24px;
  }

  .menu_item span {
    display: none;
  }

  .menu_item {
    justify-content: center;
    padding: 12px;
  }

  .menu_item i {
    margin-right: 0;
  }

  .agent_content {
    margin-left: 70px;
  }
}
</style>



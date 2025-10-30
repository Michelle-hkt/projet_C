<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)

const loadUserInfo = () => {
  const storedUser = localStorage.getItem('currentUser')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
}

const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  window.dispatchEvent(new Event('auth-changed'))
  router.push('/login')
}

onMounted(() => {
  loadUserInfo()
})
</script>

<template>
  <div class="admin_layout">
    <div class="admin_sidebar">
      <div class="sidebar_header">
        <div class="logo">
          <img src="/src/assets/images/logo.png" alt="Logo" />
        </div>
        <div class="user_info">
          <div class="user_avatar">
            <i class="fas fa-user-shield"></i>
          </div>
          <h3>{{ user?.firstName }} {{ user?.lastName }}</h3>
          <p class="user_role">Administrateur</p>
        </div>
      </div>

      <nav class="sidebar_menu">
        <h4 class="menu_title">Navigation</h4>
        <RouterLink to="/admin/dashboard" class="menu_item">
          <i class="fas fa-chart-line"></i>
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink to="/admin/agents/all" class="menu_item">
          <i class="fas fa-users"></i>
          <span>Tous les agents</span>
        </RouterLink>
        <RouterLink to="/admin/agents/pending" class="menu_item">
          <i class="fas fa-clock"></i>
          <span>Agents en attente</span>
        </RouterLink>
        <RouterLink to="/admin/agents/validated" class="menu_item">
          <i class="fas fa-user-check"></i>
          <span>Agents validés</span>
        </RouterLink>
        <button @click="logout" class="menu_item logout_btn">
          <i class="fas fa-sign-out-alt"></i>
          <span>Déconnexion</span>
        </button>
      </nav>
    </div>

    <div class="admin_content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.admin_layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.admin_sidebar {
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
  background: linear-gradient(135deg, #274abb 0%, #1d3a8f 100%);
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
  background-color: #e3f2fd;
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
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
  color: #274abb;
}

.menu_item.router-link-active {
  background-color: #274abb;
  color: #fff;
}

.menu_item.router-link-active i {
  color: #fff;
}

.menu_item.router-link-active span {
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

.admin_content {
  flex: 1;
  margin-left: 280px;
  padding: 30px;
  overflow-y: auto;
}

@media (max-width: 992px) {
  .admin_sidebar {
    width: 70px;
  }

  .sidebar_header .logo img {
    width: 40px;
  }

  .user_info h3,
  .user_role,
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

  .admin_content {
    margin-left: 70px;
  }
}
</style>


<script setup>
import HeaderProfil from '@/components/HeaderProfil.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { authService } from '@/services/authService'
//import { useRouter } from 'vue-router'

//const router = useRouter()
const isScrolled = ref(false)
const isAuthenticated = ref(false)
const currentUser = ref(null)

const handleScroll = () => {
  // Ne pas appliquer le scroll si la page force le header blanc (page Annonces)
  const header = document.querySelector('.header')
  if (header && header.classList.contains('force-white-announcements')) {
    return // Ne rien faire sur la page Annonces
  }
  isScrolled.value = window.scrollY > 100
}

const checkAuth = () => {
  isAuthenticated.value = authService.isAuthenticated()
  currentUser.value = authService.getCurrentUser()
}

const handleAuthChange = () => {
  checkAuth()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('auth-changed', handleAuthChange)
  checkAuth()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('auth-changed', handleAuthChange)
})
</script>

<template>
  <header class="header" :class="{ scrolled: isScrolled }">
    <div class="container_home">
      <div class="header_contain">
        <div class="header_contain_left">
          <div class="header_contain_left_image">
            <RouterLink to="/home"><img src="../assets/images/logo.png" alt="" /></RouterLink>
          </div>
          <ul class="header_contain_menu" :class="{ ul_scrolled: isScrolled }">
            <li class="header_contain_menu_item">
              <RouterLink to="/home" active-class="active-link">Accueil</RouterLink>
            </li>
            <li class="header_contain_menu_item">
              <RouterLink to="/announcements" active-class="active-link">Annonces</RouterLink>
            </li>
            <li class="header_contain_menu_item">
              <RouterLink to="/about" active-class="active-link">A propos</RouterLink>
            </li>
          </ul>
        </div>
        <div class="header_contain_right">
          <HeaderProfil v-if="isAuthenticated" :user="currentUser" />
          <ul class="header_contain_right_list" v-if="!isAuthenticated">
            <li><RouterLink to="/register" :class="{ a_scrolled: isScrolled }">S'inscrire</RouterLink></li>
            <li><RouterLink to="/login" :class="{ a_scrolled: isScrolled }">Se connecter</RouterLink></li>
            <div class="menu_hamburger">
              <button class="hamburger_btn">
                <span class="hamburger_box"></span>
                <span class="hamburger_box"></span>
                <span class="hamburger_box"></span>
              </button>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<style>
.header {
  position: fixed;
  width: 100%;
  z-index: 120;
  top: 0;
  transition: background-color 0.3s ease;
  padding: 15px;
}
.scrolled {
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
/* Forcer header blanc avec texte noir (pour page Annonces) */
.force-white-announcements {
  background-color: white !important;
  /* Pas de box-shadow par défaut, elle sera ajoutée au scroll */
}
.force-white-announcements .header_contain_menu_item a {
  color: black !important;
}
.force-white-announcements .header_contain_menu_item:hover {
  background-color: #1d3a8f;
}
.force-white-announcements .header_contain_menu_item:hover a {
  color: #fff !important;
}
/* Style pour le lien actif (page courante) sur page Annonces */
.force-white-announcements .header_contain_menu_item:has(.active-link) {
  background-color: #1d3a8f;
}
.force-white-announcements .header_contain_menu_item .active-link {
  color: #fff !important;
}
.force-white-announcements .header_contain_right a {
  background-color: #274abb !important;
  color: #fff !important;
}
/* Ajouter uniquement la box-shadow au scroll (page Annonces) */
.force-white-announcements.with-shadow {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}
.ul_scrolled .header_contain_menu_item a {
  color: black !important;
}
.ul_scrolled .header_contain_menu_item:hover {
  background-color: #1d3a8f;
}
.ul_scrolled .header_contain_menu_item:hover a {
  color: #fff !important;
}
/* Style pour le lien actif (page courante) quand scrollé */
.ul_scrolled .header_contain_menu_item:has(.active-link) {
  background-color: #1d3a8f;
}
.ul_scrolled .header_contain_menu_item .active-link {
  color: #fff !important;
}
.header_contain {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header_contain_left {
  display: flex;
  gap: 60px;
}
.header_contain_left_image {
  width: 100px;
  overflow: hidden;
}
.header_contain_left img {
  width: 100%;
  object-fit: cover;
}
.header_contain_menu {
  display: flex;
  align-items: center;
  gap: 90px;
}
.header_contain_menu_item {
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
}
.header_contain_menu_item:hover {
  background-color: #1d3a8f;
}
.header_contain_menu_item a {
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  transition: color 0.3s ease;
}
.header_contain_menu_item:hover a {
  color: #fff;
}
/* Style pour le lien actif (page courante) */
.header_contain_menu_item:has(.active-link) {
  background-color: #1d3a8f;
}
.header_contain_menu_item .active-link {
  color: #fff !important;
}

.header_contain_right_list {
  display: flex;
  gap: 20px;
  align-items: center;
}
.header_contain_right a {
  /* background-color: #274abb; */
  padding: 8px 20px;
  border-radius: 5px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  border: 1px solid;
}
.a_scrolled {
  background-color: #274abb !important;
}
.header_contain_right a:hover {
  background-color: #292929;
}
.menu_hamburger {
  display: none;
}
.menu_hamburger_active {
  display: block;
}
.hamburger_btn {
  padding: 7px 5px;
  border: none;
  background-color: #ebebeb;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hamburger_box {
  position: relative;
  width: 30px;
  height: 4px;
  background-color: black;
  display: block;
  border-radius: 8px;
}
</style>

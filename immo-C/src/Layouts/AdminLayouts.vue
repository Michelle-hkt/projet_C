<script setup>
import { RouterLink } from 'vue-router'
import { ref /* , onMounted, onUnmounted */ } from 'vue'

// état réactif qui gère l’ouverture/fermeture
const isSidebarVisible = ref(false)

// fonction pour basculer l’état
const toggleSidebarVisibility = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}
</script>

<template>
  <section class="bigbox">
    <div class="bigbox__left" :class="{ sidebar_visible: isSidebarVisible }">
      <!-- ma sidebar -->
      <aside class="bigbox__sidebar" @click.stop>
        <RouterLink to="/home" class="bigbox__sidebar__logo" @click="isSidebarVisible = false">
          LOGO
        </RouterLink>
        <ul class="bigbox__sidebar__menu">
          <li
            class="bigbox__sidebar__menu__item"
            :class="{ active_section: $route.path === '/user/profile' }"
          >
            <RouterLink to="/user/profile" @click="isSidebarVisible = false">Profile</RouterLink>
          </li>
          <li
            class="bigbox__sidebar__menu__item"
            :class="{ active_section: $route.path === '/user/announcements' }"
          >
            <RouterLink to="/user/announcements" @click="isSidebarVisible = false">Annonces</RouterLink>
          </li>
          <li
            class="bigbox__sidebar__menu__item"
            :class="{ active_section: $route.path === '/user/favorites' }"
          >
            <RouterLink to="/user/favorites" @click="isSidebarVisible = false">Favories</RouterLink>
          </li>
          <li
            class="bigbox__sidebar__menu__item"
            :class="{ active_section: $route.path === '/user/notifications' }"
          >
            <RouterLink to="/user/notifications" @click="isSidebarVisible = false"
              >Notifications</RouterLink
            >
          </li>
          <li class="bigbox__sidebar__menu__item">
            <RouterLink to="/home" @click="isSidebarVisible = false">Déconnection</RouterLink>
          </li>
        </ul>
      </aside>
    </div>

    <!-- Overlay -->
    <div v-if="isSidebarVisible" class="bigbox__overlay" @click="isSidebarVisible = false"></div>

    <div class="bigbox__rigth">
      <!-- ma nav bar -->
      <nav class="bigbox__nav">
        <div class="bigbox__nav__logo">
          <RouterLink to="/home"> LOGO </RouterLink>
        </div>
        <div class="bigbox__nav__contain">
          <div class="bigbox__nav__contain__left">
            <RouterLink to="/home" class="bigbox__nav__link"></RouterLink>
          </div>
          <RouterLink
            to="#"
            class="bigbox__nav__btn"
            @click.prevent="toggleSidebarVisibility"
            aria-label="Basculer la sidebar"
            ><span></span
          ></RouterLink>
        </div>
      </nav>

      <main class="bigbox__main">
        <section class="bigbox__main__contain">
          <RouterView />
        </section>
      </main>
    </div>
  </section>
</template>

<style>
.bigbox {
  height: auto;
  width: 100%;
  background-color: #e7d9dc;
  padding-bottom: 20px;
}

.sidebar_visible {
  left: 0 !important;
}

.bigbox__overlay {
  position: fixed; /* overlay couvre tout l’écran */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw; /* pour couvrir toute la largeur */
  height: 100vh;
  background-color: #00000066;
  z-index: 99; 
}

/* ====================la sidebar=====================*/

.bigbox__left {
  width: 250px;
  background-color: #0d0d4d;
  height: 100vh;
  padding: 30px 20px;
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  transition: width 250ms;
}
.bigbox__sidebar__logo {
  display: block;
  text-align: center;
  background-color: #ef9494;
  padding: 10px;
  border-radius: 10px;
  font-weight: bold;
  margin-bottom: 60px;
}
.bigbox__sidebar__menu__item {
  margin-bottom: 40px;
  padding: 10px;
  border-radius: 10px;
}
.bigbox__sidebar__menu__item:hover {
  background-color: #ffffff1b;
}

.bigbox__sidebar__menu__item a {
  color: #fff;
  font-size: 20px;
}
.active_section {
  background-color: #ffffff21;
}
.bigbox__rigth {
  padding-left: 250px;
}
/* ==================la nav bar=======================*/
.bigbox__nav {
  background-color: #fff;
  position: sticky;
  z-index: 102;
  height: 100px;
  padding: 10px;
  top: 0;
  left: 0;
  display: flex;
  /* justify-content: flex-end; */
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 8px 16px 0px #00000033;
}
.bigbox__nav__contain {
  display: flex;
  align-items: center;
  gap: 20px;
}
.bigbox__nav__logo {
  text-align: center;
  background-color: #ef9494;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: bold;
  display: none;
}
.bigbox__nav__contain__left {
  background-color: #e7d9dc;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.bigbox__nav__btn {
  display: none;
  height: 30px;
  width: 30px;
}
.bigbox__nav__btn span {
  display: block;
  height: 3px;
  background-color: #000;
  border-radius: 4px;
  position: absolute;
  width: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.bigbox__nav__btn span:before {
  content: '';
  position: absolute;
  height: 3px;
  width: 30px;
  background-color: #000;
  border-radius: 4px;
  top: -10px;
  left: 0;
}
.bigbox__nav__btn span:after {
  content: '';
  position: absolute;
  height: 3px;
  width: 30px;
  background-color: #000;
  border-radius: 4px;
  bottom: -10px;
  left: 0;
}

.bigbox__nav__link {
  display: block;
  height: 11px;
  width: 11px;
  border: 1px solid #000;
  border-radius: 50%;
}
.bigbox__nav__link:before {
  content: '';
  position: absolute;
  height: 10px;
  width: 14px;
  border: 1px solid #000;
  left: 5px;
  transform: translateX(-50%);
  top: 11px;
  border-bottom: none;
  border-radius: 20px 20px 0px 0px;
}

/* ==================le main======================= */

.bigbox__main__contain {
  margin: 15px;
  background-color: #fff;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  border-radius: 15px;
  box-shadow: 0px 10px 20px 3px #997c80;
}
.bigbox__main__contain__text {
  font-size: 60px;
}

.bigbox__main__container {
  background-color: #fff;
  min-height: calc(100vh - 115px);
  margin: 10px;
  padding: 15px;
  border-radius: 15px;
}

.main__content__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60px;
}
.main__content__top__left i {
  font-size: 20px;
  margin-right: 5px;
}
.main__content__top__left__btn {
  font-size: 20px;
  padding: 9px 15px;
  border-radius: 15px;
  border: none;
  cursor: pointer;
}

.main__content__top__left__btn:hover {
  background-color: green;
  color: #fff;
}
.main__content__top__rigth__text {
  font-size: 20px;
  font-weight: 500;
}
.main__content__top__rigth__text span {
  font-size: 18px;
  font-weight: 500;
}

.main__content__bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 600px) {
  /* Sidebar masquée par défaut */
  .bigbox__left {
    position: fixed;
    top: 0;
    left: -250px;
    transition: left 0.3s ease-in-out;
  }

  /* Quand elle est visible (au clic sur hamburger) */
  .sidebar_visible {
    left: 0;
  }

  /* Le logo et le menu hamburger deviennent visibles */
  .bigbox__nav__logo,
  .bigbox__nav__btn {
    display: block !important;
  }

  /* La partie droite prend tout l’espace */
  .bigbox__rigth {
    padding-left: 0 !important;
    width: 100%;
  }

  /* Empêcher le body de scroller quand la sidebar est ouverte */
  body.sidebar-open {
    overflow: hidden;
  }
}
</style>

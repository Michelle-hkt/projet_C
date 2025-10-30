import './assets/css/main.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAnnouncementStore } from './stores/announcementStore'
import { usePropertyTypeStore } from './stores/propertyTypeStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

// Initialiser les stores
const announcementStore = useAnnouncementStore()
const propertyTypeStore = usePropertyTypeStore()

// Nettoyer l'ancien cache des annonces (trop lourd pour localStorage)
localStorage.removeItem('announcements')
localStorage.removeItem('recentAnnouncements')

// Initialiser le cache des types de propriété depuis localStorage (données légères)
propertyTypeStore.initFromCache()

// Pré-charger les données immédiatement en arrière-plan (sans attendre)
// Les données seront disponibles dès que l'utilisateur accède aux pages
announcementStore.fetchAnnouncements()
announcementStore.fetchRecentAnnouncements()
propertyTypeStore.fetchPropertyTypes()

import { defineStore } from 'pinia'
import { announcementService } from '@/services/announcementService'

export const useAnnouncementStore = defineStore('announcements', {
  state: () => ({
    announcements: [],
    recentAnnouncements: [],
    isLoading: false,
    lastFetch: null,
    cacheExpiry: 5 * 60 * 1000, // 5 minutes
  }),

  getters: {
    allAnnouncements: (state) => state.announcements,
    recent: (state) => state.recentAnnouncements,
    isCacheValid: (state) => {
      if (!state.lastFetch) return false
      return Date.now() - state.lastFetch < state.cacheExpiry
    },
  },

  actions: {
    async fetchAnnouncements(forceRefresh = false) {
      // Si le cache est valide et qu'on ne force pas le refresh, retourner les données en cache
      if (this.isCacheValid && !forceRefresh && this.announcements.length > 0) {
        return this.announcements
      }

      this.isLoading = true
      try {
        const response = await announcementService.getAllAnnouncements()
        this.announcements = response.data || []
        this.lastFetch = Date.now()

        // Note: Pas de sauvegarde dans localStorage car les images base64 sont trop lourdes
        // Les données restent en mémoire pendant la session (cache en RAM via Pinia)

        return this.announcements
      } catch (error) {
        console.error('Erreur lors du chargement des annonces:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchRecentAnnouncements(forceRefresh = false) {
      if (this.isCacheValid && !forceRefresh && this.recentAnnouncements.length > 0) {
        return this.recentAnnouncements
      }

      this.isLoading = true
      try {
        const response = await announcementService.getRecentAnnouncements()
        this.recentAnnouncements = response.data || []
        this.lastFetch = Date.now()
        return this.recentAnnouncements
      } catch (error) {
        console.error('Erreur lors du chargement des annonces récentes:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async searchAnnouncements(params) {
      this.isLoading = true
      try {
        const response = await announcementService.searchAnnouncements(params)
        return response || []
      } catch (error) {
        console.error('Erreur lors de la recherche:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    clearCache() {
      this.announcements = []
      this.recentAnnouncements = []
      this.lastFetch = null
    },
  },
})

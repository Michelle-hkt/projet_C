import { defineStore } from 'pinia'
import { propertyService } from '@/services/propertyService'

export const usePropertyTypeStore = defineStore('propertyTypes', {
  state: () => ({
    propertyTypes: [],
    isLoading: false,
    lastFetch: null,
  }),

  getters: {
    all: (state) => state.propertyTypes,
    hasData: (state) => state.propertyTypes.length > 0,
  },

  actions: {
    async fetchPropertyTypes(forceRefresh = false) {
      // Si on a déjà les données et qu'on ne force pas le refresh, les retourner
      if (this.hasData && !forceRefresh) {
        return this.propertyTypes
      }

      this.isLoading = true
      try {
        const response = await propertyService.getAllPropertyTypes()
        this.propertyTypes = response.data || []
        this.lastFetch = Date.now()

        // Sauvegarder dans localStorage
        localStorage.setItem(
          'propertyTypes',
          JSON.stringify({
            data: this.propertyTypes,
            timestamp: this.lastFetch,
          }),
        )

        return this.propertyTypes
      } catch (error) {
        console.error('Erreur lors du chargement des types de propriété:', error)

        // En cas d'erreur, essayer de charger depuis localStorage
        const cached = localStorage.getItem('propertyTypes')
        if (cached) {
          const parsed = JSON.parse(cached)
          this.propertyTypes = parsed.data
          this.lastFetch = parsed.timestamp
        }

        throw error
      } finally {
        this.isLoading = false
      }
    },

    clearCache() {
      this.propertyTypes = []
      this.lastFetch = null
      localStorage.removeItem('propertyTypes')
    },

    // Initialiser depuis localStorage au démarrage
    initFromCache() {
      const cached = localStorage.getItem('propertyTypes')
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          this.propertyTypes = parsed.data
          this.lastFetch = parsed.timestamp
        } catch (error) {
          console.error('Erreur lors du chargement du cache:', error)
          localStorage.removeItem('propertyTypes')
        }
      }
    },
  },
})


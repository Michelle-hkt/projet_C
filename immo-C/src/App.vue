<script setup>
import Loader from '@/components/Loader.vue';
import { useLoader } from '@/composables/useLoader';

/**
 * Composant racine de l'application
 * Le loader global s'affiche automatiquement quand isLoading = true
 * Chaque page gère son propre chargement
 */

// Récupération de l'état global du loader
const { isLoading } = useLoader();
</script>

<template>
  <!-- Loader global : s'affiche au-dessus de tout quand isLoading est true -->
  <Loader 
    :visible="isLoading" 
    message="Chargement en cours..."
  />

  <!-- Contenu principal de l'application -->
  <RouterView />
</template>

<style scoped>
/* Styles globaux si nécessaire */
</style>

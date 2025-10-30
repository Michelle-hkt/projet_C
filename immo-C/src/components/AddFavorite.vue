<script setup>
import { ref, defineProps } from 'vue'
import { customerService } from '@/services/customerService'

const props = defineProps({
  announcementId: {
    type: String,
    required: true,
  },
  initialFavorite: {
    type: Boolean,
    default: false,
  },
})

const isFavorite = ref(props.initialFavorite)
const isLoading = ref(false)

async function toggleFavorite() {
  if (isLoading.value) return

  isLoading.value = true
  try {
    if (isFavorite.value) {
      // Retirer des favoris
      await customerService.removeFavorite(props.announcementId)
      isFavorite.value = false
      console.log('Retiré des favoris:', props.announcementId)
    } else {
      // Ajouter aux favoris
      await customerService.addFavorite(props.announcementId)
      isFavorite.value = true
      console.log('Ajouté aux favoris:', props.announcementId)
    }
  } catch (error) {
    console.error('Erreur lors de la gestion des favoris:', error)
    // Remettre l'état précédent en cas d'erreur
    isFavorite.value = !isFavorite.value
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="favorite_container">
    <i 
      class="fas fa-heart"
      :class="{ favorite: isFavorite }"
      @click="toggleFavorite"
    ></i>
  </div>
</template>

<style scoped>
.favorite_container {
 
  cursor: pointer;  
}
.favorite_container i{
  font-size: 19px;  
}

.fas.fa-heart {
  color: gray;
  transition: color 0.3s; 
}

/* Couleur quand c'est favori */
.fas.fa-heart.favorite {
  color: red;
}
</style>

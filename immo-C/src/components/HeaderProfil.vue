<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  }
})

// Calculer les initiales de l'utilisateur
const userInitials = computed(() => {
  if (!props.user) return ''
  const firstName = props.user.firstName || ''
  const lastName = props.user.lastName || ''
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
})

// Vérifier si l'utilisateur a une photo
const hasPhoto = computed(() => {
  return props.user?.profileImage || false
})

// Vérifier si l'utilisateur est actif
const isActive = computed(() => {
  return props.user?.isActive || false
})
</script>

<template>
  <RouterLink to="/user/profile" class="header_profil" :class="{ header_profil_active: isActive }">
    <img v-if="hasPhoto" :src="user.profileImage" :alt="user.firstName" />
    <div v-else class="header_profil_initials">{{ userInitials }}</div>
  </RouterLink>
</template>

<style scoped>
.header_profil {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e4e3e3;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #274abb;
  text-decoration: none;
  transition: all 0.3s ease;
}

.header_profil_active {
  border-color: rgb(1, 207, 1);
}

.header_profil:hover {
  border-color: rgb(1, 207, 1);
  transform: scale(1.05);
}

.header_profil img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header_profil_initials {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
}
</style>

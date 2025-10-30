<template>
  <!-- Overlay du loader : fond semi-transparent qui bloque les interactions -->
  <Transition name="fade">
    <div 
      v-if="visible" 
      class="loader-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <!-- Conteneur du loader centré -->
      <div class="loader-container">
        <!-- Logo avec animation -->
        <div class="logo-wrapper">
          <img 
            :src="logoSrc" 
            alt="Logo" 
            class="loader-logo"
          />
          <!-- Cercle animé autour du logo (spinner) -->
          <div class="spinner-ring"></div>
        </div>
        
        <!-- Message de chargement (optionnel) -->
        <p v-if="message" class="loader-message">
          {{ message }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps } from 'vue';

/**
 * Props du composant Loader
 * - visible : contrôle l'affichage du loader
 * - message : texte affiché sous le logo (optionnel)
 * - logoSrc : chemin vers le logo (par défaut : logo principal du site)
 */
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Chargement en cours...'
  },
  logoSrc: {
    type: String,
    default: new URL('@/assets/images/logo.png', import.meta.url).href
  }
});
</script>

<style scoped>
/* ========================================
   OVERLAY - Fond semi-transparent bloquant
   ======================================== */
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* Fond sombre semi-transparent - MODIFIABLE ICI */
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Au-dessus de tout */
  backdrop-filter: blur(4px); /* Flou léger pour l'effet moderne */
}

/* ========================================
   CONTENEUR - Centre le contenu du loader
   ======================================== */
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

/* ========================================
   LOGO - Wrapper avec animation pulsation
   ======================================== */
.logo-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Logo principal avec animation de pulsation */
.loader-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  z-index: 2;
  /* Animation de pulsation douce */
  animation: pulse 2s ease-in-out infinite;
}

/* Animation de pulsation - MODIFIABLE ICI */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* ========================================
   SPINNER - Cercle tournant autour du logo
   ======================================== */
.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ff6b35; /* COULEUR PRINCIPALE - MODIFIABLE ICI */
  border-radius: 50%;
  /* Animation de rotation */
  animation: spin 1.2s linear infinite;
}

/* Animation de rotation - VITESSE MODIFIABLE ICI (1.2s) */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* ========================================
   MESSAGE - Texte sous le logo
   ======================================== */
.loader-message {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.5px;
}

/* ========================================
   TRANSITIONS - Apparition/Disparition
   ======================================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========================================
   RESPONSIVE - Adaptation mobile
   ======================================== */
@media (max-width: 768px) {
  .loader-container {
    padding: 1.5rem;
    gap: 1rem;
  }

  .logo-wrapper {
    width: 100px;
    height: 100px;
  }

  .loader-logo {
    width: 65px;
    height: 65px;
  }

  .loader-message {
    font-size: 0.9rem;
  }
}

/* ========================================
   CHECKLIST DE PERSONNALISATION :
   
   1. Changer la couleur du fond :
      → Ligne 54 : background-color
   
   2. Changer la couleur du spinner :
      → Ligne 113 : border-top-color
   
   3. Changer la vitesse de rotation :
      → Ligne 117 : animation duration (1.2s)
   
   4. Changer la vitesse de pulsation :
      → Ligne 92 : animation duration (2s)
   
   5. Changer le logo :
      → Passer une prop logoSrc différente
   
   6. Désactiver la pulsation :
      → Ligne 92 : Supprimer l'animation
   
   7. Changer le flou d'arrière-plan :
      → Ligne 57 : backdrop-filter blur(4px)
   ======================================== */
</style>


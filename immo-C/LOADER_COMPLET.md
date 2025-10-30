# 🎯 LOADER GLOBAL - CODE COMPLET À COPIER

## 📦 Livrables (3 fichiers + mise à jour)

---

## 1️⃣ `/src/components/Loader.vue`

```vue
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
```

---

## 2️⃣ `/src/composables/useLoader.js`

```javascript
/**
 * =========================================
 * COMPOSABLE GLOBAL : useLoader()
 * =========================================
 * 
 * Gère l'état global du loader de l'application.
 * Permet d'afficher/masquer le loader depuis n'importe quel composant.
 * 
 * UTILISATION :
 * ```js
 * import { useLoader } from '@/composables/useLoader';
 * 
 * const { isLoading, showLoader, hideLoader } = useLoader();
 * 
 * // Afficher le loader
 * showLoader();
 * 
 * // Masquer le loader
 * hideLoader();
 * 
 * // Vérifier l'état
 * console.log(isLoading.value);
 * ```
 */

import { ref } from 'vue';

/**
 * État global du loader (partagé entre tous les composants)
 * Utilise un ref réactif accessible depuis n'importe où
 */
const isLoading = ref(false);

/**
 * Compteur de requêtes en cours
 * Permet de gérer plusieurs appels simultanés
 * Le loader ne se masque que quand toutes les requêtes sont terminées
 */
let loadingCounter = 0;

/**
 * Fonction principale du composable
 * Retourne les méthodes et l'état pour contrôler le loader
 */
export function useLoader() {
  /**
   * Affiche le loader
   * Incrémente le compteur pour gérer les appels multiples
   */
  const showLoader = () => {
    loadingCounter++;
    isLoading.value = true;
  };

  /**
   * Masque le loader
   * Décrémente le compteur et masque uniquement si toutes les requêtes sont terminées
   */
  const hideLoader = () => {
    loadingCounter--;
    // Ne masque le loader que si aucune requête n'est en cours
    if (loadingCounter <= 0) {
      loadingCounter = 0; // Sécurité : évite les valeurs négatives
      isLoading.value = false;
    }
  };

  /**
   * Force la fermeture du loader
   * Utile en cas d'erreur ou pour réinitialiser l'état
   */
  const forceHideLoader = () => {
    loadingCounter = 0;
    isLoading.value = false;
  };

  /**
   * Wrapper pour exécuter une fonction avec le loader
   * Affiche automatiquement le loader pendant l'exécution
   * 
   * @param {Function} asyncFunction - Fonction asynchrone à exécuter
   * @returns {Promise} - Résultat de la fonction
   * 
   * EXEMPLE :
   * ```js
   * const data = await withLoader(async () => {
   *   return await axios.get('/api/data');
   * });
   * ```
   */
  const withLoader = async (asyncFunction) => {
    try {
      showLoader();
      const result = await asyncFunction();
      return result;
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      throw error; // Propage l'erreur pour gestion dans le composant
    } finally {
      hideLoader();
    }
  };

  // Retourne les fonctions et l'état
  return {
    isLoading,       // État réactif (booléen)
    showLoader,      // Afficher le loader
    hideLoader,      // Masquer le loader
    forceHideLoader, // Forcer la fermeture
    withLoader       // Wrapper automatique
  };
}

/**
 * =========================================
 * EXEMPLES D'UTILISATION AVANCÉS
 * =========================================
 * 
 * 1. UTILISATION BASIQUE :
 * ```js
 * const { showLoader, hideLoader } = useLoader();
 * 
 * showLoader();
 * await fetchData();
 * hideLoader();
 * ```
 * 
 * 2. AVEC TRY/CATCH :
 * ```js
 * const { showLoader, hideLoader } = useLoader();
 * 
 * try {
 *   showLoader();
 *   const data = await axios.get('/api/data');
 *   console.log(data);
 * } catch (error) {
 *   console.error(error);
 * } finally {
 *   hideLoader();
 * }
 * ```
 * 
 * 3. AVEC WRAPPER AUTOMATIQUE :
 * ```js
 * const { withLoader } = useLoader();
 * 
 * const data = await withLoader(async () => {
 *   return await axios.get('/api/data');
 * });
 * ```
 * 
 * 4. REQUÊTES MULTIPLES SIMULTANÉES :
 * ```js
 * // Le loader reste affiché tant qu'une requête est en cours
 * showLoader(); // Counter = 1
 * axios.get('/api/data1').then(() => hideLoader()); // Counter = 0 ou 1
 * 
 * showLoader(); // Counter = 2
 * axios.get('/api/data2').then(() => hideLoader()); // Counter = 1 ou 0
 * 
 * // Le loader disparaît seulement quand les 2 sont terminées
 * ```
 * 
 * 5. FORCER LA FERMETURE (EN CAS D'ERREUR) :
 * ```js
 * const { forceHideLoader } = useLoader();
 * 
 * // En cas d'erreur critique, forcer la fermeture
 * window.addEventListener('error', () => {
 *   forceHideLoader();
 * });
 * ```
 */
```

---

## 3️⃣ Mise à jour de `/src/App.vue`

```vue
<script setup>
import { onMounted } from 'vue';
import Loader from '@/components/Loader.vue';
import { useLoader } from '@/composables/useLoader';

/**
 * Composant racine de l'application
 * Intègre le loader global qui sera affiché sur toute l'application
 */

// Récupération du composable loader
const { isLoading, showLoader, hideLoader } = useLoader();

/**
 * Simulation d'un chargement initial au montage de l'application
 * (Optionnel : à adapter selon vos besoins)
 */
onMounted(async () => {
  // Afficher le loader pendant le chargement initial
  showLoader();
  
  try {
    // Simuler un chargement de données initiales
    // Exemple : charger la config, les données utilisateur, etc.
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Vous pouvez remplacer par un vrai appel API :
    // await axios.get('/api/init');
    // await fetchInitialData();
    
  } catch (error) {
    console.error('Erreur lors du chargement initial:', error);
  } finally {
    // Masquer le loader une fois le chargement terminé
    hideLoader();
  }
});
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
```

---

## 4️⃣ Exemple d'utilisation dans une page (HomeView.vue)

```vue
<script setup>
import { onMounted, ref } from 'vue';
import { useLoader } from '@/composables/useLoader';
import axios from 'axios';

/**
 * Exemple d'utilisation du loader dans une page
 */

// Récupération du composable loader
const { withLoader, showLoader, hideLoader } = useLoader();

// État local
const announcements = ref([]);
const propertyTypes = ref([]);

/**
 * Chargement initial des données au montage
 */
onMounted(async () => {
  await loadInitialData();
});

/**
 * MÉTHODE 1 : Utilisation avec withLoader (recommandé)
 * Le loader s'affiche et se masque automatiquement
 */
const loadInitialData = async () => {
  try {
    const data = await withLoader(async () => {
      // Requêtes parallèles
      const [announcementsRes, typesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/announcements/recent'),
        axios.get('http://localhost:5000/api/property-types')
      ]);
      
      return {
        announcements: announcementsRes.data,
        types: typesRes.data
      };
    });
    
    announcements.value = data.announcements;
    propertyTypes.value = data.types;
    
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
  }
};

/**
 * MÉTHODE 2 : Utilisation classique avec showLoader/hideLoader
 */
const refresh = async () => {
  showLoader();
  
  try {
    const response = await axios.get('http://localhost:5000/api/announcements/recent');
    announcements.value = response.data;
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    hideLoader();
  }
};

/**
 * MÉTHODE 3 : Utilisation lors d'un clic bouton avec recherche
 */
const handleSearch = async (searchTerm) => {
  showLoader();
  
  try {
    const response = await axios.get(`http://localhost:5000/api/announcements/search?q=${searchTerm}`);
    announcements.value = response.data;
  } catch (error) {
    console.error('Erreur de recherche:', error);
  } finally {
    hideLoader();
  }
};
</script>

<template>
  <div class="home-view">
    <h1>Page d'accueil</h1>
    
    <!-- Bouton de rafraîchissement -->
    <button @click="refresh" class="refresh-btn">
      Rafraîchir les données
    </button>
    
    <!-- Bouton de recherche -->
    <button @click="handleSearch('villa')" class="search-btn">
      Rechercher "villa"
    </button>
    
    <!-- Affichage des annonces -->
    <div class="announcements-list">
      <div 
        v-for="ad in announcements" 
        :key="ad._id"
        class="announcement-item"
      >
        <h3>{{ ad.title }}</h3>
        <p>{{ ad.description }}</p>
      </div>
    </div>
    
    <!-- Affichage des types de propriété -->
    <div class="property-types">
      <h2>Types de propriété</h2>
      <ul>
        <li v-for="type in propertyTypes" :key="type._id">
          {{ type.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  padding: 2rem;
}

.refresh-btn,
.search-btn {
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  background-color: #ff6b35;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.refresh-btn:hover,
.search-btn:hover {
  background-color: #e55a2b;
}

.announcements-list {
  margin-top: 2rem;
}

.announcement-item {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.property-types {
  margin-top: 2rem;
}

.property-types ul {
  list-style: none;
  padding: 0;
}

.property-types li {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: #f5f5f5;
  border-radius: 0.25rem;
}
</style>
```

---

## 📋 Checklist de personnalisation

### 🎨 Modifier le logo
```vue
<!-- Dans App.vue ou n'importe quel composant -->
<Loader 
  :visible="isLoading" 
  logoSrc="/src/assets/images/logo2.png"
/>
```

### 🎨 Modifier la couleur du fond
```css
/* Dans Loader.vue, ligne 54 */
.loader-overlay {
  background-color: rgba(255, 255, 255, 0.9); /* Fond blanc */
  /* ou */
  background-color: rgba(0, 0, 0, 0.8); /* Fond noir plus foncé */
}
```

### 🎨 Modifier la couleur du spinner
```css
/* Dans Loader.vue, ligne 113 */
.spinner-ring {
  border-top-color: #3498db; /* Bleu */
  /* ou */
  border-top-color: #2ecc71; /* Vert */
  /* ou */
  border-top-color: #e74c3c; /* Rouge */
}
```

### ⚡ Modifier la vitesse d'animation
```css
/* Rotation du spinner - Ligne 117 */
animation: spin 0.8s linear infinite; /* Plus rapide */
/* ou */
animation: spin 2s linear infinite; /* Plus lent */

/* Pulsation du logo - Ligne 92 */
animation: pulse 1s ease-in-out infinite; /* Plus rapide */
/* ou */
animation: pulse 3s ease-in-out infinite; /* Plus lent */
```

---

## ✅ Installation

1. Créer le dossier `/src/composables/` si nécessaire
2. Copier le fichier `Loader.vue` dans `/src/components/`
3. Copier le fichier `useLoader.js` dans `/src/composables/`
4. Mettre à jour `App.vue` avec le nouveau code
5. Utiliser dans vos pages selon les exemples ci-dessus

---

## 🎉 C'est prêt !

Le loader global est opérationnel et utilisable dans toute l'application !


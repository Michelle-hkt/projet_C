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


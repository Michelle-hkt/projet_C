<script setup>
import { ref, onMounted } from 'vue'
import { authService } from '@/services/authService'
import { customerService } from '@/services/customerService'
import { propertyService } from '@/services/propertyService'
import { paymentService } from '@/services/paymentService'

const user = ref(null)
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phoneNumber = ref('')
const address = ref('')

const allPreferences = ref([])
const selectedPreferences = ref([])
const showDropdown = ref(false)
const walletBalance = ref(0)
const isLoading = ref(false)
const isPageLoading = ref(true)
const successMessage = ref('')
const errorMessage = ref('')

const loadUserData = () => {
  user.value = authService.getCurrentUser()
  if (user.value) {
    firstName.value = user.value.firstName || ''
    lastName.value = user.value.lastName || ''
    email.value = user.value.email || ''
    phoneNumber.value = user.value.phoneNumber || ''
    address.value = user.value.address || ''
  }
}

const loadPreferences = async () => {
  try {
    const allPrefsResponse = await propertyService.getAllPreferences()
    allPreferences.value = allPrefsResponse.data || []

    const myPrefsResponse = await customerService.getMyPreferences()
    selectedPreferences.value = myPrefsResponse || []
  } catch (error) {
    console.error('Erreur lors du chargement des préférences:', error)
  }
}

const loadWallet = async () => {
  try {
    const response = await paymentService.getWalletBalance()
    walletBalance.value = response.balance || 0
  } catch (error) {
    console.error('Erreur lors du chargement du wallet:', error)
  }
}

const addPreference = async (preference) => {
  try {
    console.log('➕ Ajout de préférence:', preference)
    console.log('ID envoyé:', preference._id)
    
    const response = await customerService.addPreference(preference._id)
    console.log('✅ Préférence ajoutée:', response)
    
    selectedPreferences.value.push(preference)
    showDropdown.value = false
    successMessage.value = 'Préférence ajoutée avec succès'
    setTimeout(() => (successMessage.value = ''), 1500)
  } catch (error) {
    console.error('❌ Erreur ajout préférence:', error)
    console.error('Détails:', error.response?.data)
    errorMessage.value = error.response?.data?.message || 'Erreur lors de l\'ajout de la préférence'
    setTimeout(() => (errorMessage.value = ''), 1500)
  }
}

const removePreference = async (preference) => {
  try {
    console.log('➖ Suppression de préférence:', preference)
    console.log('ID envoyé:', preference._id)
    
    const response = await customerService.removePreference(preference._id)
    console.log('✅ Préférence supprimée:', response)
    
    selectedPreferences.value = selectedPreferences.value.filter((p) => p._id !== preference._id)
    successMessage.value = 'Préférence supprimée avec succès'
    setTimeout(() => (successMessage.value = ''), 1000)
  } catch (error) {
    console.error('❌ Erreur suppression préférence:', error)
    console.error('Détails:', error.response?.data)
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la suppression de la préférence'
    setTimeout(() => (errorMessage.value = ''), 1000)
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleUpdateProfile = async () => {
  isLoading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const profileData = {
      firstName: firstName.value,
      lastName: lastName.value,
      phoneNumber: phoneNumber.value,
      address: address.value,
    }

    console.log('📤 Données envoyées au backend:', profileData)
    console.log('🏷️ Préférences actuelles:', selectedPreferences.value)

    const response = await customerService.updateProfile(profileData)
    
    console.log('✅ Réponse du backend:', response)
    
    if (response.message) {
      // Mettre à jour les données dans localStorage
      const currentUser = authService.getCurrentUser()
      if (currentUser) {
        currentUser.firstName = firstName.value
        currentUser.lastName = lastName.value
        currentUser.phoneNumber = phoneNumber.value
        currentUser.address = address.value
        localStorage.setItem('user', JSON.stringify(currentUser))
        
        // Émettre un événement pour mettre à jour le header
        window.dispatchEvent(new Event('auth-changed'))
      }
      
      successMessage.value = 'Profil mis à jour avec succès'
      setTimeout(() => (successMessage.value = ''), 2000)
    }
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error)
    console.error('Détails de l\'erreur:', error.response?.data)
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la mise à jour du profil'
    setTimeout(() => (errorMessage.value = ''), 2000)
  } finally {
    isLoading.value = false
  }
}

const availablePreferences = () => {
  return allPreferences.value.filter(
    (pref) => !selectedPreferences.value.find((sp) => sp._id === pref._id)
  )
}

onMounted(async () => {
  isPageLoading.value = true
  try {
    loadUserData()
    await Promise.all([
      loadPreferences(),
      loadWallet()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement de la page:', error)
  } finally {
    isPageLoading.value = false
  }
})
</script>

<template>
  <div class="profile">
    <!-- Loader pendant le chargement -->
    <div v-if="isPageLoading" class="page_loader">
      <div class="loader_spinner"></div>
      <p>Chargement en cours...</p>
    </div>

    <!-- Contenu de la page -->
    <div v-else class="profile_contain">
      <div class="profile_contain_top">
        <div class="profile_contain_top_title">Mon compte</div>

        <div v-if="successMessage" class="success_message">{{ successMessage }}</div>
        <div v-if="errorMessage" class="error_message">{{ errorMessage }}</div>

        <form @submit.prevent="handleUpdateProfile" class="form">
          <!-- Nom -->
          <div class="form_item">
            <label for="lastname" class="form_label">Nom</label>
            <input v-model="lastName" type="text" id="lastname" class="form_input" />
          </div>

          <!-- Prénom -->
          <div class="form_item">
            <label for="firstname" class="form_label">Prénom</label>
            <input v-model="firstName" type="text" id="firstname" class="form_input" />
          </div>

          <!-- Email -->
          <div class="form_item">
            <label for="email" class="form_label">Email</label>
            <input v-model="email" type="email" id="email" class="form_input" disabled />
          </div>

          <!-- Téléphone -->
          <div class="form_item">
            <label for="phone" class="form_label">Téléphone</label>
            <input v-model="phoneNumber" type="tel" id="phone" class="form_input" />
          </div>

          <!-- Adresse -->
          <div class="form_item">
            <label for="address" class="form_label">Adresse</label>
            <input v-model="address" type="text" id="address" class="form_input" />
          </div>

          <!-- Préférences -->
          <div class="preferences-container">
            <label>Mes préférences :</label>
            <div class="preferences-input">
              <!-- Tags sélectionnés -->
              <span
                v-for="preference in selectedPreferences"
                :key="preference._id"
                class="preference-tag"
              >
                {{ preference.name }}
                <span class="remove" @click="removePreference(preference)">×</span>
              </span>

              <!-- Bouton + -->
              <button type="button" class="add-btn" @click.stop="toggleDropdown">+</button>

              <!-- liste déroulante -->
              <ul v-if="showDropdown" class="taglist">
                <li
                  v-for="preference in availablePreferences()"
                  :key="preference._id"
                  @click.stop="addPreference(preference)"
                >
                  {{ preference.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Bouton Enregistrer -->
          <div class="form_button">
            <button type="submit" :disabled="isLoading">
              {{ isLoading ? 'Enregistrement...' : 'Modifier et Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
  margin-bottom: 50px;
}
.profile_contain_top_title {
  background-color: #000;
  color: #fff;
  font-weight: bold;
  padding: 12px 10px;
  
  text-align: center;
  margin-bottom: 20px;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}
.form_item {
  display: flex;
  flex-direction: column;
  width: 70%;
}
.form_item input {
  border-radius: 8px;
  padding: 10px 7px;
  border: 1px solid #ccc;
  font-size: 16px;
  outline: none;
}


/* =============Préférences============== */
.preferences-container {
  display: flex;
  flex-direction: column;
  width: 70%;
  position: relative;
}

.preferences-input {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px;
  position: relative; /* nécessaire pour dropdown absolute */
}

.preference-tag {
  background-color: #f1f1f1;
  padding: 5px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.preference-tag .remove {
  cursor: pointer;
  font-weight: bold;
}

.add-btn {
  border: none;
  background-color: #000;
  color: #fff;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.taglist {
  position: absolute;
  top: 100%; /* positionné la liste juste en dessous du champ */
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  z-index: 500;
  padding: 0;
  margin-top: 4px;
  list-style: none;
}

.taglist li {
  padding: 8px 10px;
  cursor: pointer;
}

.taglist li:hover {
  background-color: #f5f5f5;
}

.form_button {
  width: 70%;
  display: flex;
  justify-content: end;
}
.form_button button {
  padding: 10px 13px;
  border: none;
  background-color: #000;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
}

.form_button button:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.success_message {
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  text-align: center;
  border: 1px solid #c3e6cb;
}

.error_message {
  background-color: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  text-align: center;
  border: 1px solid #fcc;
}

.page_loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 50px;
}

.loader_spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #274abb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.page_loader p {
  color: #666;
  font-size: 16px;
  font-weight: 500;
}
</style>

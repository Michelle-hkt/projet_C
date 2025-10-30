<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { agentService } from '@/services/agentService'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const phoneNumber = ref('')
const address = ref('')
const description = ref('')
const profileImage = ref('')
const profileImageName = ref('')
const cipImage = ref('')
const cipImageName = ref('')
const acceptTerms = ref(false)
const errorMessage = ref('')
const showToast = ref(false)
const isLoading = ref(false)
const showPassword = ref(false)

// Fonction pour convertir l'image en base64
const handleProfileImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    profileImageName.value = file.name
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleCipImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    cipImageName.value = file.name
    const reader = new FileReader()
    reader.onload = (e) => {
      cipImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleRegister = async () => {
  errorMessage.value = ''

  if (!acceptTerms.value) {
    errorMessage.value = 'Vous devez accepter les conditions d\'utilisation'
    return
  }

  isLoading.value = true

  try {
    const response = await agentService.registerAgent({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      phoneNumber: phoneNumber.value,
      address: address.value,
      description: description.value,
      profileImage: profileImage.value,
      cipImage: cipImage.value,
    })

    if (response.success) {
      // Vider le formulaire
      firstName.value = ''
      lastName.value = ''
      email.value = ''
      password.value = ''
      phoneNumber.value = ''
      address.value = ''
      description.value = ''
      profileImage.value = ''
      profileImageName.value = ''
      cipImage.value = ''
      cipImageName.value = ''
      acceptTerms.value = false
      
      // Afficher la notification toast en haut à droite
      showToast.value = true
      
      // Après 3 secondes, cacher la toast et rediriger vers la page d'accueil
      setTimeout(() => {
        showToast.value = false
        router.push('/home')
      }, 3000)
    }
  } catch (error) {
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Une erreur est survenue lors de l\'inscription'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="box">
    <!-- Notification toast en haut à droite -->
    <div v-if="showToast" class="toast_notification">
      <div class="toast_notification_content">
        <div class="toast_notification_icon">✓</div>
        <div class="toast_notification_message">
          <p class="toast_notification_title">Inscription bien reçue</p>
          <p class="toast_notification_text">En attente de validation de la part de l'admin</p>
        </div>
      </div>
    </div>

    <RouterLink to="/home" class="back_arrow">
      <span>←</span> Retour à l'accueil
    </RouterLink>

    <div class="card">
      <div class="card_right">
        <form @submit.prevent="handleRegister" class="form">
          <p class="form_title">Devenir Agent</p>

          <div v-if="errorMessage" class="error_message">
            {{ errorMessage }}
          </div>

          <!-- Ligne 1: Nom | Prénom -->
          <div class="form_row">
            <div class="form_item">
              <label>Nom</label>
              <input v-model="lastName" type="text" required />
            </div>

            <div class="form_item">
              <label>Prénom</label>
              <input v-model="firstName" type="text" required />
            </div>
          </div>

          <!-- Ligne 2: Email | Adresse -->
          <div class="form_row">
            <div class="form_item">
              <label>Email</label>
              <input v-model="email" type="email" required />
            </div>

            <div class="form_item">
              <label>Adresse / Localisation</label>
              <input 
                v-model="address" 
                type="text" 
                placeholder="Ex: Cotonou, Cadjèhoun" 
                required 
              />
            </div>
          </div>

          <!-- Ligne 3: Téléphone | Mot de passe -->
          <div class="form_row">
            <div class="form_item">
              <label>Téléphone</label>
              <input v-model="phoneNumber" type="tel" required />
            </div>

            <div class="form_item">
              <label>Mot de passe</label>
              <div class="password_wrapper">
                <input v-model="password" :type="showPassword ? 'text' : 'password'" required />
                <button type="button" class="toggle_password" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Photo de profil (full width) -->
          <div class="form_item">
            <label>Photo de profil</label>
            <div class="file_upload_container">
              <input 
                type="file" 
                @change="handleProfileImageUpload" 
                accept="image/*" 
                required 
                id="profileImage"
                class="file_input"
              />
              <label for="profileImage" class="file_label">
                <span>{{ profileImageName || 'Choisir une photo de profil' }}</span>
              </label>
            </div>
            <small class="form_hint">Formats acceptés: JPG, PNG, JPEG (Max 5MB)</small>
          </div>

          <!-- Image CIP (full width) -->
          <div class="form_item">
            <label>Image CIP (Certificat d'Identité Personnelle)</label>
            <div class="file_upload_container">
              <input 
                type="file" 
                @change="handleCipImageUpload" 
                accept="image/*" 
                required 
                id="cipImage"
                class="file_input"
              />
              <label for="cipImage" class="file_label">
                <span>{{ cipImageName || 'Choisir votre certificat CIP' }}</span>
              </label>
            </div>
            <small class="form_hint">Votre certificat d'identité personnelle</small>
          </div>

          <!-- Description (full width) -->
          <div class="form_item">
            <label>Description</label>
            <textarea 
              v-model="description" 
              placeholder="Décrivez-vous en quelques lignes..."
              rows="4"
              minlength="20"
              required
            ></textarea>
            <small class="form_hint">{{ description.length }}/20 caractères minimum</small>
          </div>

          <div class="remember_me">
            <label>
              <input v-model="acceptTerms" type="checkbox" /> J'accepte les conditions
              d'utilisation et je comprends que mon compte sera validé par un administrateur
            </label>
          </div>

          <button type="submit" class="form_button" :disabled="isLoading">
            {{ isLoading ? 'Inscription...' : 'S\'inscrire comme agent' }}
          </button>

          <div class="login_link">
            <p>Vous avez déjà un compte ? <RouterLink to="/login">Se connecter</RouterLink></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background-image: linear-gradient(#00000099, #000000b3), url('../assets/images/authimg.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.back_arrow {
  position: absolute;
  top: 30px;
  left: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 100;
}

.back_arrow:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateX(-5px);
}

.back_arrow span {
  font-size: 24px;
  font-weight: bold;
}

.card {
  width: 600px;
  max-width: 95%;
  border-radius: 15px;
  background-color: #fff;
}

.card_right {
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form_title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 25px;
  text-align: center;
  color: #274abb;
}

.form_row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.form_item {
  position: relative;
  margin-bottom: 20px;
}

.form_row .form_item {
  margin-bottom: 0;
}

.password_wrapper {
  position: relative;
  width: 100%;
}

.toggle_password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.3s ease;
}

.toggle_password:hover {
  color: #274abb;
}

.toggle_password svg {
  width: 20px;
  height: 20px;
}

.form_item label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form_item input,
.form_item textarea {
  width: 100%;
  padding: 12px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  font-family: inherit;
}

.form_item textarea {
  resize: vertical;
  min-height: 100px;
}

.form_item input:focus,
.form_item textarea:focus {
  border-color: #274abb;
}

.form_hint {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  font-style: italic;
}

/* File upload styles */
.file_upload_container {
  width: 100%;
}

.file_input {
  display: none;
}

.file_label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 15px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
  font-size: 14px;
}

.file_label:hover {
  border-color: #274abb;
  background-color: #f0f4ff;
  color: #274abb;
}

.file_label span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remember_me {
  margin-bottom: 20px;
}

.remember_me label {
  font-size: 14px;
  line-height: 1.4;
}

.remember_me input {
  margin-right: 5px;
}

.form_button {
  width: 100%;
  padding: 12px;
  background-color: #274abb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.form_button:hover {
  background-color: #1d3a8f;
}

.form_button:disabled {
  background-color: #666;
  cursor: not-allowed;
}

/* Notification toast en haut à droite */
.toast_notification {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 9999;
  animation: slideInRight 0.5s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast_notification_content {
  background-color: #fff;
  border-left: 5px solid #28a745;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  min-width: 350px;
  max-width: 400px;
}

.toast_notification_icon {
  width: 40px;
  height: 40px;
  background-color: #28a745;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  flex-shrink: 0;
}

.toast_notification_message {
  flex: 1;
}

.toast_notification_title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.toast_notification_text {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.error_message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
  border: 1px solid #fcc;
}

.login_link {
  text-align: center;
  margin-top: 15px;
}

.login_link a {
  color: #007bff;
  text-decoration: none;
}

.login_link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .card {
    width: 90%;
  }

  .card_right {
    padding: 20px;
  }

  .form_row {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .form_row .form_item {
    margin-bottom: 0;
  }

  .back_arrow {
    top: 20px;
    left: 20px;
    padding: 8px 15px;
    font-size: 14px;
  }

  .back_arrow span {
    font-size: 20px;
  }
}
</style>



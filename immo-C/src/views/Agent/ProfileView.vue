<script setup>
import { ref, onMounted } from 'vue'
import { agentService } from '@/services/agentService'

const agent = ref(null)
const isLoading = ref(false)
const isEditing = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const phoneNumber = ref('')
const address = ref('')
const description = ref('')
const profileImageUrl = ref('')
const cipImageUrl = ref('')

const profileImageFile = ref(null)
const cipImageFile = ref(null)
const profileImagePreview = ref('')
const cipImagePreview = ref('')

const handleProfileImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Veuillez sélectionner une image valide'
    setTimeout(() => errorMessage.value = '', 3000)
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'L\'image ne doit pas dépasser 5 MB'
    setTimeout(() => errorMessage.value = '', 3000)
    return
  }

  profileImageFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    profileImagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleCipImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Veuillez sélectionner une image valide'
    setTimeout(() => errorMessage.value = '', 3000)
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'L\'image ne doit pas dépasser 5 MB'
    setTimeout(() => errorMessage.value = '', 3000)
    return
  }

  cipImageFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    cipImagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const loadProfile = async () => {
  try {
    const response = await agentService.getMyProfile()
    agent.value = response.data || response
    

    const agentData = response.data || response
    agent.value = {
      ...agentData.user,
      ...agentData,
    }
    

    phoneNumber.value = agent.value.phoneNumber || ''
    address.value = agent.value.address || ''
    description.value = agent.value.description || ''
    profileImageUrl.value = agent.value.profileImage || ''
    cipImageUrl.value = agent.value.cipImage || ''
    

    profileImagePreview.value = ''
    cipImagePreview.value = ''
    profileImageFile.value = null
    cipImageFile.value = null
  } catch (error) {
    console.error('❌ Erreur lors du chargement du profil:', error)
    errorMessage.value = 'Impossible de charger le profil'
  }
}

const updateProfile = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const profileData = {
      phoneNumber: phoneNumber.value,
      address: address.value,
      description: description.value,
    }

    if (profileImageFile.value) {
      const base64Image = await fileToBase64(profileImageFile.value)
      profileData.profileImage = base64Image
    }
    
    if (cipImageFile.value) {
      const base64Image = await fileToBase64(cipImageFile.value)
      profileData.cipImage = base64Image
    }

    const response = await agentService.updateMyProfile(profileData)
    
    if (response.success) {
      successMessage.value = response.message || 'Profil mis à jour avec succès'
      isEditing.value = false
      await loadProfile()
      

      window.dispatchEvent(new Event('agent-profile-updated'))
      
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error)
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la mise à jour du profil'
    
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  } finally {
    isLoading.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
  phoneNumber.value = agent.value.phoneNumber || ''
  address.value = agent.value.address || ''
  description.value = agent.value.description || ''
  profileImageUrl.value = agent.value.profileImage || ''
  cipImageUrl.value = agent.value.cipImage || ''
  

  profileImageFile.value = null
  cipImageFile.value = null
  profileImagePreview.value = ''
  cipImagePreview.value = ''
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="agent_profile_view">
    <div class="page_header">
      <h1>Mon Profil</h1>
      <p>Gérez vos informations personnelles</p>
    </div>

    <!-- Messages de succès/erreur -->
    <div v-if="successMessage" class="alert alert_success">
      <i class="fas fa-check-circle"></i>
      {{ successMessage }}
    </div>
    
    <div v-if="errorMessage" class="alert alert_error">
      <i class="fas fa-exclamation-circle"></i>
      {{ errorMessage }}
    </div>

    <div v-if="agent" class="profile_container">
      <!-- Carte de profil -->
      <div class="profile_card">
        <div class="profile_header">
          <div class="profile_avatar">
            <img 
              v-if="agent.profileImage" 
              :src="agent.profileImage" 
              :alt="`${agent.firstName} ${agent.lastName}`"
            />
            <i v-else class="fas fa-user-tie"></i>
          </div>
          
          <div class="profile_info">
            <h2>{{ agent.firstName }} {{ agent.lastName }}</h2>
            <p class="profile_role">
              <i class="fas fa-briefcase"></i>
              Agent Immobilier
            </p>
            <p class="profile_status" :class="{ validated: agent.isValide }">
              <i :class="agent.isValide ? 'fas fa-check-circle' : 'fas fa-clock'"></i>
              {{ agent.isValide ? 'Compte Validé' : 'En attente de validation' }}
            </p>
          </div>
        </div>

        <div class="profile_details">
          <div class="detail_item">
            <i class="fas fa-envelope"></i>
            <div>
              <span class="detail_label">Email</span>
              <span class="detail_value">{{ agent.email }}</span>
            </div>
          </div>

          <div class="detail_item">
            <i class="fas fa-phone"></i>
            <div>
              <span class="detail_label">Téléphone</span>
              <span class="detail_value">{{ agent.phoneNumber || 'Non renseigné' }}</span>
            </div>
          </div>

          <div class="detail_item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <span class="detail_label">Adresse</span>
              <span class="detail_value">{{ agent.address || 'Non renseignée' }}</span>
            </div>
          </div>

          <div v-if="agent.sponsorshipCode" class="detail_item">
            <i class="fas fa-share-alt"></i>
            <div>
              <span class="detail_label">Code de parrainage</span>
              <span class="detail_value code">{{ agent.sponsorshipCode }}</span>
            </div>
          </div>
        </div>

        <div v-if="agent.description" class="profile_bio">
          <h3><i class="fas fa-info-circle"></i> Description</h3>
          <p>{{ agent.description }}</p>
        </div>

        <div v-if="!isEditing" class="profile_actions">
          <button @click="isEditing = true" class="btn_edit">
            <i class="fas fa-edit"></i>
            Modifier le profil
          </button>
        </div>
      </div>

      <!-- Formulaire d'édition -->
      <div v-if="isEditing" class="edit_card">
        <div class="card_header">
          <h2>
            <i class="fas fa-edit"></i>
            Modifier mon profil
          </h2>
        </div>

        <form @submit.prevent="updateProfile" class="edit_form">
          <div class="form_row">
            <div class="form_group">
              <label for="phoneNumber">
                <i class="fas fa-phone"></i>
                Téléphone
              </label>
              <input
                id="phoneNumber"
                v-model="phoneNumber"
                type="tel"
                placeholder="+237 6XX XX XX XX"
                required
              />
            </div>

            <div class="form_group">
              <label for="address">
                <i class="fas fa-map-marker-alt"></i>
                Adresse
              </label>
              <input
                id="address"
                v-model="address"
                type="text"
                placeholder="Votre adresse"
                required
              />
            </div>
          </div>

          <div class="form_group">
            <label for="description">
              <i class="fas fa-align-left"></i>
              Description
            </label>
            <textarea
              id="description"
              v-model="description"
              rows="5"
              placeholder="Présentez-vous et décrivez votre expérience..."
              required
            ></textarea>
          </div>

          <div class="form_group">
            <label for="profileImage">
              <i class="fas fa-image"></i>
              Photo de profil
            </label>
            <div class="image_upload_container">
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                @change="handleProfileImageUpload"
                class="file_input"
              />
              <label for="profileImage" class="file_label">
                <i class="fas fa-cloud-upload-alt"></i>
                <span v-if="!profileImageFile">Choisir une photo</span>
                <span v-else>{{ profileImageFile.name }}</span>
              </label>
              <div v-if="profileImagePreview || agent?.profileImage" class="image_preview">
                <img :src="profileImagePreview || agent?.profileImage" alt="Prévisualisation" />
                <button 
                  v-if="profileImagePreview" 
                  type="button" 
                  @click="profileImagePreview = ''; profileImageFile = null" 
                  class="btn_remove_preview"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <small>Formats acceptés : JPG, PNG, GIF (max 5 MB)</small>
          </div>

          <div class="form_group">
            <label for="cipImage">
              <i class="fas fa-id-card"></i>
              Carte d'identité (CIP)
            </label>
            <div class="image_upload_container">
              <input
                id="cipImage"
                type="file"
                accept="image/*"
                @change="handleCipImageUpload"
                class="file_input"
              />
              <label for="cipImage" class="file_label">
                <i class="fas fa-cloud-upload-alt"></i>
                <span v-if="!cipImageFile">Choisir une photo</span>
                <span v-else>{{ cipImageFile.name }}</span>
              </label>
              <div v-if="cipImagePreview || agent?.cipImage" class="image_preview">
                <img :src="cipImagePreview || agent?.cipImage" alt="Prévisualisation" />
                <button 
                  v-if="cipImagePreview" 
                  type="button" 
                  @click="cipImagePreview = ''; cipImageFile = null" 
                  class="btn_remove_preview"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <small>Formats acceptés : JPG, PNG, GIF (max 5 MB)</small>
          </div>

          <div class="form_actions">
            <button 
              type="button" 
              @click="cancelEdit" 
              class="btn_cancel"
              :disabled="isLoading"
            >
              <i class="fas fa-times"></i>
              Annuler
            </button>
            
            <button 
              type="submit" 
              class="btn_save"
              :disabled="isLoading"
            >
              <i class="fas fa-save"></i>
              {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Documents -->
      <div v-if="!isEditing" class="documents_card">
        <div class="card_header">
          <h2>
            <i class="fas fa-file-alt"></i>
            Mes Documents
          </h2>
        </div>

        <div class="documents_grid">
          <div class="document_item">
            <div class="document_icon">
              <i class="fas fa-image"></i>
            </div>
            <div class="document_info">
              <h4>Photo de profil</h4>
              <p v-if="agent.profileImage">Disponible</p>
              <p v-else class="not_available">Non fournie</p>
            </div>
            <a 
              v-if="agent.profileImage" 
              :href="agent.profileImage" 
              target="_blank" 
              class="btn_view"
            >
              <i class="fas fa-eye"></i>
            </a>
          </div>

          <div class="document_item">
            <div class="document_icon">
              <i class="fas fa-id-card"></i>
            </div>
            <div class="document_info">
              <h4>Carte d'identité (CIP)</h4>
              <p v-if="agent.cipImage">Disponible</p>
              <p v-else class="not_available">Non fournie</p>
            </div>
            <a 
              v-if="agent.cipImage" 
              :href="agent.cipImage" 
              target="_blank" 
              class="btn_view"
            >
              <i class="fas fa-eye"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agent_profile_view {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.page_header {
  margin-bottom: 30px;
}

.page_header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 700;
}

.page_header p {
  font-size: 16px;
  color: #666;
}

/* Alerts */
.alert {
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
}

.alert i {
  font-size: 20px;
}

.alert_success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert_error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Container */
.profile_container {
  display: grid;
  gap: 25px;
}

/* Carte de profil */
.profile_card,
.edit_card,
.documents_card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile_header {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  padding: 40px 30px;
  display: flex;
  align-items: center;
  gap: 25px;
  color: #fff;
}

.profile_avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.profile_avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile_avatar i {
  font-size: 50px;
  color: #28a745;
}

.profile_info h2 {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 700;
  color: #fff;
}

.profile_role {
  font-size: 16px;
  margin-bottom: 8px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
}

.profile_role i {
  color: #fff;
}

.profile_status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 14px;
  color: #fff;
}

.profile_status i {
  color: #fff;
}

.profile_status.validated {
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
}

/* Détails du profil */
.profile_details {
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.detail_item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.detail_item i {
  font-size: 20px;
  color: #28a745;
  margin-top: 4px;
}

.detail_item > div {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail_label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.detail_value {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.detail_value.code {
  font-family: 'Courier New', monospace;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

/* Bio */
.profile_bio {
  padding: 0 30px 30px;
  border-top: 1px solid #eee;
  padding-top: 25px;
  margin-top: 5px;
}

.profile_bio h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile_bio h3 i {
  color: #28a745;
}

.profile_bio p {
  font-size: 15px;
  color: #555;
  line-height: 1.6;
}

/* Actions */
.profile_actions {
  padding: 0 30px 30px;
  display: flex;
  justify-content: flex-end;
}

.btn_edit {
  background: #28a745;
  color: #fff;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn_edit:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn_edit i {
  color: #fff;
}

/* Formulaire d'édition */
.card_header {
  padding: 25px 30px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.card_header h2 {
  font-size: 22px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
}

.card_header i {
  color: #28a745;
}

.edit_form {
  padding: 30px;
}

.form_row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form_group {
  margin-bottom: 20px;
}

.form_group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form_group label i {
  color: #28a745;
}

.form_group input,
.form_group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form_group input:focus,
.form_group textarea:focus {
  outline: none;
  border-color: #28a745;
}

.form_group textarea {
  resize: vertical;
  min-height: 100px;
}

.form_group small {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #666;
}

/* Upload d'images */
.image_upload_container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.file_input {
  display: none;
}

.file_label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 20px;
  background: #f8f9fa;
  border: 2px dashed #28a745;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 15px;
  color: #28a745;
  font-weight: 600;
}

.file_label:hover {
  background: #e8f5e9;
  border-color: #218838;
}

.file_label i {
  font-size: 20px;
  color: #28a745;
}

.image_preview {
  position: relative;
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #eee;
}

.image_preview img {
  width: 100%;
  height: auto;
  display: block;
}

.btn_remove_preview {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  background: rgba(220, 53, 69, 0.9);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn_remove_preview:hover {
  background: #dc3545;
  transform: scale(1.1);
}

.btn_remove_preview i {
  color: #fff;
  font-size: 14px;
}

.form_actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 25px;
  border-top: 1px solid #eee;
}

.btn_cancel,
.btn_save {
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  border: none;
}

.btn_cancel {
  background: #6c757d;
  color: #fff;
}

.btn_cancel:hover:not(:disabled) {
  background: #5a6268;
}

.btn_save {
  background: #28a745;
  color: #fff;
}

.btn_save:hover:not(:disabled) {
  background: #218838;
}

.btn_cancel:disabled,
.btn_save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn_cancel i,
.btn_save i {
  color: #fff;
}

/* Documents */
.documents_grid {
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.document_item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #eee;
}

.document_icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.document_icon i {
  font-size: 24px;
  color: #fff;
}

.document_info {
  flex: 1;
}

.document_info h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}

.document_info p {
  font-size: 14px;
  color: #28a745;
  font-weight: 600;
}

.document_info .not_available {
  color: #dc3545;
}

.btn_view {
  width: 40px;
  height: 40px;
  background: #28a745;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s;
}

.btn_view:hover {
  background: #218838;
  transform: scale(1.1);
}

.btn_view i {
  font-size: 18px;
  color: #fff;
}

/* Responsive */
@media (max-width: 768px) {
  .agent_profile_view {
    padding: 20px;
  }

  .page_header h1 {
    font-size: 24px;
  }

  .profile_header {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
  }

  .profile_avatar {
    width: 100px;
    height: 100px;
  }

  .profile_info h2 {
    font-size: 22px;
  }

  .profile_details {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .form_row {
    grid-template-columns: 1fr;
  }

  .form_actions {
    flex-direction: column-reverse;
  }

  .btn_cancel,
  .btn_save {
    width: 100%;
    justify-content: center;
  }
}
</style>


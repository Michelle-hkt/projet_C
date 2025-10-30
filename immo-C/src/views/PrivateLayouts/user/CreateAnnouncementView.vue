<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { announcementService } from '@/services/announcementService'
import { usePropertyTypeStore } from '@/stores/propertyTypeStore'

const router = useRouter()
const propertyTypeStore = usePropertyTypeStore()

// États du formulaire
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showConfirmModal = ref(false)
const confirmationDetails = ref({
  hasVirtualTour: false,
  virtualTourCost: 1500,
  publicationCost: 1000,
  commission: 0,
  totalCost: 1000
})

// Gestion des étapes
const currentStep = ref(1)
const totalSteps = 4

const steps = [
  { number: 1, title: 'Description et Prix' },
  { number: 2, title: 'Caractéristiques' },
  { number: 3, title: 'Localisation' },
  { number: 4, title: 'Photos et Médias' }
]

// Progression en pourcentage
const progressPercentage = computed(() => {
  return (currentStep.value / totalSteps) * 100
})

// Données du formulaire
const formData = ref({
  title: '',
  description: '',
  status: 'a_louer',
  propertyType: '',
  price: '',
  deposit: '',
  advance: '',
  landArea: '',
  numberOfLivingRooms: 0,
  numberOfBedrooms: 0,
  numberOfBathrooms: 0,
  numberOfFloor: 0,
  numberOfKitchen: 0,
  generalCondition: 'bon',
  address: '',
  district: '',
  garage: false,
  internalToilet: false,
  externalToilet: false,
  landTitle: '',
  gallery: [],
  photo360File: null
})

// Prévisualisation des images
const galleryPreviews = ref([])
const photo360Preview = ref(null)

// Charger les types de propriétés
const loadPropertyTypes = async () => {
  try {
    await propertyTypeStore.fetchPropertyTypes()
  } catch (error) {
    console.error('Erreur lors du chargement des types de propriété:', error)
  }
}

// Gestion des images de la galerie avec compression
const handleGalleryImages = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      // Créer une image pour la compresser
      const img = new Image()
      img.onload = () => {
        // Créer un canvas pour redimensionner l'image
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Définir la taille maximale
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 1200
        let width = img.width
        let height = img.height
        
        // Calculer les nouvelles dimensions en gardant le ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }
        
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convertir en base64 avec compression (qualité 0.7)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
        
        galleryPreviews.value.push(compressedBase64)
        formData.value.gallery.push({ imageUrl: compressedBase64 })
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

// Supprimer une image de la galerie
const removeGalleryImage = (index) => {
  galleryPreviews.value.splice(index, 1)
  formData.value.gallery.splice(index, 1)
}

// Gestion du fichier 360
const handlePhoto360File = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.photo360File = file
    photo360Preview.value = file.name
  }
}

// Navigation entre les étapes
const nextStep = () => {
  if (validateCurrentStep()) {
    if (currentStep.value < totalSteps) {
      currentStep.value++
      errorMessage.value = ''
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    errorMessage.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToStep = (stepNumber) => {
  if (stepNumber <= currentStep.value || validateSteps(stepNumber - 1)) {
    currentStep.value = stepNumber
    errorMessage.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Validation par étape
const validateCurrentStep = () => {
  errorMessage.value = ''
  
  switch (currentStep.value) {
    case 1:
      if (!formData.value.title) {
        errorMessage.value = 'Le titre est obligatoire'
        return false
      }
      if (!formData.value.description) {
        errorMessage.value = 'La description est obligatoire'
        return false
      }
      if (!formData.value.propertyType) {
        errorMessage.value = 'Le type de bien est obligatoire'
        return false
      }
      if (!formData.value.price) {
        errorMessage.value = 'Le prix est obligatoire'
        return false
      }
      break
    
    case 2:
      if (formData.value.numberOfBedrooms < 0) {
        errorMessage.value = 'Le nombre de chambres ne peut pas être négatif'
        return false
      }
      if (formData.value.numberOfBathrooms < 0) {
        errorMessage.value = 'Le nombre de salles de bain ne peut pas être négatif'
        return false
      }
      if (formData.value.numberOfKitchen < 0) {
        errorMessage.value = 'Le nombre de cuisines ne peut pas être négatif'
        return false
      }
      break
    
    case 3:
      if (!formData.value.address) {
        errorMessage.value = 'L\'adresse est obligatoire'
        return false
      }
      if (!formData.value.district) {
        errorMessage.value = 'Le quartier est obligatoire'
        return false
      }
      break
    
    case 4:
      // Optionnel pour les photos
      break
  }
  
  return true
}

const validateSteps = (upToStep) => {
  for (let i = 1; i <= upToStep; i++) {
    const previousStep = currentStep.value
    currentStep.value = i
    if (!validateCurrentStep()) {
      currentStep.value = previousStep
      return false
    }
  }
  currentStep.value = upToStep + 1
  return true
}

// Afficher le popup de confirmation
const submitForm = () => {
  // Validation basique
  if (!formData.value.title || !formData.value.description || !formData.value.propertyType) {
    errorMessage.value = 'Veuillez remplir tous les champs obligatoires'
    setTimeout(() => errorMessage.value = '', 3000)
    return
  }

  // Calculer les coûts
  const hasVirtualTour = formData.value.photo360File !== null
  const virtualTourCost = hasVirtualTour ? 1500 : 0
  const publicationCost = 1000
  
  // Calculer la commission (5% du prix pour vente, 2% pour location)
  const price = Number(formData.value.price) || 0
  let commission = 0
  if (formData.value.status === 'a_vendre') {
    commission = Math.round(price * 0.05)
  } else if (formData.value.status === 'a_louer') {
    commission = Math.round(price * 0.02)
  }
  
  const totalCost = publicationCost + virtualTourCost + commission

  confirmationDetails.value = {
    hasVirtualTour,
    virtualTourCost,
    publicationCost,
    commission,
    totalCost
  }

  showConfirmModal.value = true
}

// Confirmer et créer l'annonce
const confirmCreateAnnouncement = async () => {
  showConfirmModal.value = false
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Ne pas inclure photo360File dans l'envoi (sera géré séparément)
    const { photo360File, ...formDataToSend } = formData.value
    
    const dataToSend = {
      ...formDataToSend,
      price: Number(formDataToSend.price) || 0,
      deposit: Number(formDataToSend.deposit) || 0,
      advance: Number(formDataToSend.advance) || 0,
      landArea: Number(formDataToSend.landArea) || 0,
      numberOfLivingRooms: Number(formDataToSend.numberOfLivingRooms) || 0,
      numberOfBedrooms: Number(formDataToSend.numberOfBedrooms) || 0,
      numberOfBathrooms: Number(formDataToSend.numberOfBathrooms) || 0,
      numberOfFloor: Number(formDataToSend.numberOfFloor) || 0,
      numberOfKitchen: Number(formDataToSend.numberOfKitchen) || 0,
      // Structurer virtualTour selon ce que le backend attend
      virtualTour: {
        visitUrl: "N/A",
        photo360: photo360File || null
      }
    }
    
    const response = await announcementService.createMyAnnouncement(dataToSend)
    
    successMessage.value = 'Annonce créée et publiée avec succès !'
    
    setTimeout(() => {
      router.push('/user/announcements')
    }, 2000)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la création de l\'annonce'
    console.error('Erreur:', error.response?.data?.message || error.message)
  } finally {
    isLoading.value = false
  }
}

// Annuler la création
const cancelConfirmation = () => {
  showConfirmModal.value = false
}

onMounted(() => {
  loadPropertyTypes()
})
</script>

<template>
  <div class="create_announcement">
    <div class="create_announcement_container">
      <!-- Header -->
      <div class="page_header">
        <button class="back_btn" @click="router.push('/user/announcements')">
          ← Retour
        </button>
        <h1>Créer une nouvelle annonce</h1>
      </div>

      <!-- Stepper Navigation -->
      <div class="stepper_container">
        <div class="progress_bar">
          <div class="progress_fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        
        <div class="stepper_steps">
          <div 
            v-for="step in steps" 
            :key="step.number"
            :class="['stepper_step', { 
              active: currentStep === step.number,
              completed: currentStep > step.number
            }]"
            @click="goToStep(step.number)"
          >
            <span class="step_number">Étape {{ step.number }}</span>
            <span class="step_title">{{ step.title }}</span>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div v-if="successMessage" class="success_message">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="error_message">
        {{ errorMessage }}
      </div>

      <!-- Modal de confirmation -->
      <div v-if="showConfirmModal" class="modal_confirm" @click="cancelConfirmation">
        <div class="modal_confirm_content" @click.stop>
          <h2>Confirmation de publication</h2>
          
          <div class="confirm_details">
            <div class="detail_item">
              <span class="detail_label">Frais de publication :</span>
              <span class="detail_value">{{ confirmationDetails.publicationCost.toLocaleString() }} immo</span>
            </div>
            
            <div class="detail_item">
              <span class="detail_label">Commission :</span>
              <span class="detail_value">{{ confirmationDetails.commission.toLocaleString() }} immo</span>
            </div>
            
            <div v-if="confirmationDetails.hasVirtualTour" class="detail_item">
              <span class="detail_label">Visite virtuelle :</span>
              <span class="detail_value">{{ confirmationDetails.virtualTourCost.toLocaleString() }} immo</span>
            </div>
            
            <div class="detail_item total">
              <span class="detail_label">Total :</span>
              <span class="detail_value">{{ confirmationDetails.totalCost.toLocaleString() }} immo</span>
            </div>
          </div>
          
          <p class="confirm_message">
            Ce montant sera automatiquement déduit de votre portefeuille.
            L'annonce sera créée et publiée immédiatement.
          </p>
          
          <div class="confirm_actions">
            <button class="btn_cancel" @click="cancelConfirmation">Annuler</button>
            <button class="btn_confirm" @click="confirmCreateAnnouncement">
              Confirmer et publier
            </button>
          </div>
        </div>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="submitForm" class="announcement_form">
        
        <!-- Section 1: Description et Prix -->
        <div v-if="currentStep === 1" class="form_section">
          <h2 class="section_title">Description et Prix du bien</h2>
          
          <div class="form_group">
            <label for="title">Titre de l'annonce <span class="required">*</span></label>
            <input 
              type="text" 
              id="title" 
              v-model="formData.title" 
              placeholder="Ex: Belle maison moderne avec jardin"
              required
            />
          </div>

          <div class="form_group">
            <label for="description">Description <span class="required">*</span></label>
            <textarea 
              id="description" 
              v-model="formData.description" 
              rows="6"
              placeholder="Décrivez votre bien en détail..."
              required
            ></textarea>
          </div>

          <div class="form_row">
            <div class="form_group">
              <label for="status">Statut <span class="required">*</span></label>
              <select id="status" v-model="formData.status" required>
                <option value="a_vendre">À vendre</option>
                <option value="a_louer">À louer</option>
              </select>
            </div>

            <div class="form_group">
              <label for="propertyType">Type de bien <span class="required">*</span></label>
              <select id="propertyType" v-model="formData.propertyType" required>
                <option value="">Sélectionnez un type</option>
                <option 
                  v-for="type in propertyTypeStore.all" 
                  :key="type._id" 
                  :value="type._id"
                >
                  {{ type.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form_row">
            <div class="form_group">
              <label for="price">Prix (FCFA) <span class="required">*</span></label>
              <input 
                type="number" 
                id="price" 
                v-model="formData.price" 
                placeholder="Ex: 50000000"
                required
              />
            </div>

            <div class="form_group">
              <label for="deposit">Caution (FCFA)</label>
              <input 
                type="number" 
                id="deposit" 
                v-model="formData.deposit" 
                placeholder="Ex: 500000"
              />
            </div>

            <div class="form_group">
              <label for="advance">Avance (FCFA)</label>
              <input 
                type="number" 
                id="advance" 
                v-model="formData.advance" 
                placeholder="Ex: 1000000"
              />
            </div>
          </div>

          <div class="form_group">
            <label for="landArea">Superficie (m²)</label>
            <input 
              type="number" 
              id="landArea" 
              v-model="formData.landArea" 
              placeholder="Ex: 250"
            />
          </div>
        </div>

        <!-- Section 2: Caractéristiques -->
        <div v-if="currentStep === 2" class="form_section">
          <h2 class="section_title">Caractéristiques du bien</h2>
          
          <div class="form_row three_cols">
            <div class="form_group">
              <label for="livingRooms">Salons</label>
              <input 
                type="number" 
                id="livingRooms" 
                v-model="formData.numberOfLivingRooms" 
                min="0"
              />
            </div>

            <div class="form_group">
              <label for="bedrooms">Chambres <span class="required">*</span></label>
              <input 
                type="number" 
                id="bedrooms" 
                v-model="formData.numberOfBedrooms" 
                min="0"
                required
              />
            </div>

            <div class="form_group">
              <label for="bathrooms">Salles de bain <span class="required">*</span></label>
              <input 
                type="number" 
                id="bathrooms" 
                v-model="formData.numberOfBathrooms" 
                min="0"
                required
              />
            </div>
          </div>

          <div class="form_row three_cols">
            <div class="form_group">
              <label for="kitchens">Cuisines <span class="required">*</span></label>
              <input 
                type="number" 
                id="kitchens" 
                v-model="formData.numberOfKitchen" 
                min="0"
                required
              />
            </div>

            <div class="form_group">
              <label for="floors">Nombre d'étages</label>
              <input 
                type="number" 
                id="floors" 
                v-model="formData.numberOfFloor" 
                min="0"
              />
            </div>

            <div class="form_group">
              <label for="condition">État général <span class="required">*</span></label>
              <select id="condition" v-model="formData.generalCondition" required>
                <option value="excellent">Excellent</option>
                <option value="tres_bon">Très bon</option>
                <option value="bon">Bon</option>
                <option value="moyen">Moyen</option>
                <option value="a_renover">À rénover</option>
              </select>
            </div>
          </div>

          <div class="form_group">
            <label>Équipements</label>
            <div class="checkbox_group">
              <label class="checkbox_item">
                <input type="checkbox" v-model="formData.garage" />
                <span>Garage</span>
              </label>
              <label class="checkbox_item">
                <input type="checkbox" v-model="formData.internalToilet" />
                <span>Toilette interne</span>
              </label>
              <label class="checkbox_item">
                <input type="checkbox" v-model="formData.externalToilet" />
                <span>Toilette externe</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Section 3: Localisation -->
        <div v-if="currentStep === 3" class="form_section">
          <h2 class="section_title">Localisation</h2>
          
          <div class="form_group">
            <label for="address">Adresse <span class="required">*</span></label>
            <input 
              type="text" 
              id="address" 
              v-model="formData.address" 
              placeholder="Ex: Rue 123, Quartier Résidentiel"
              required
            />
          </div>

          <div class="form_row">
            <div class="form_group">
              <label for="district">Quartier <span class="required">*</span></label>
              <input 
                type="text" 
                id="district" 
                v-model="formData.district" 
                placeholder="Ex: Cocody"
                required
              />
            </div>

            <div class="form_group">
              <label for="landTitle">Titre foncier</label>
              <input 
                type="text" 
                id="landTitle" 
                v-model="formData.landTitle" 
                placeholder="Numéro du titre foncier"
              />
            </div>
          </div>
        </div>

        <!-- Section 4: Photos et Visite Virtuelle -->
        <div v-if="currentStep === 4" class="form_section">
          <h2 class="section_title">Photos et Visite Virtuelle</h2>
          
          <div class="form_group">
            <label for="gallery">Photos du bien <span class="required">*</span></label>
            <div class="file_upload_area">
              <input 
                type="file" 
                id="gallery" 
                @change="handleGalleryImages"
                accept="image/*"
                multiple
                class="file_input"
              />
              <label for="gallery" class="file_label">
                <span class="upload_icon">📷</span>
                <span>Cliquez pour ajouter des photos</span>
                <span class="upload_hint">Vous pouvez sélectionner plusieurs images</span>
              </label>
            </div>

            <!-- Prévisualisation des images -->
            <div v-if="galleryPreviews.length > 0" class="gallery_preview">
              <div 
                v-for="(preview, index) in galleryPreviews" 
                :key="index" 
                class="preview_item"
              >
                <img :src="preview" alt="Preview" />
                <button 
                  type="button" 
                  class="remove_btn" 
                  @click="removeGalleryImage(index)"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <div class="form_group">
            <label for="photo360">Fichier photos 360° (optionnel)</label>
            <div class="file_upload_area">
              <input 
                type="file" 
                id="photo360" 
                @change="handlePhoto360File"
                accept=".zip,.rar,.7z"
                class="file_input"
              />
              <label for="photo360" class="file_label">
                <span class="upload_icon">📦</span>
                <span>Cliquez pour ajouter le fichier 360°</span>
                <span class="upload_hint">Format accepté: ZIP, RAR, 7Z</span>
              </label>
            </div>

            <div v-if="photo360Preview" class="file_preview">
              <span class="file_icon">📦</span>
              <span class="file_name">{{ photo360Preview }}</span>
              <button 
                type="button" 
                class="remove_file_btn" 
                @click="photo360Preview = null; formData.photo360File = null"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Boutons de navigation -->
        <div class="form_navigation">
          <button 
            v-if="currentStep > 1"
            type="button" 
            class="nav_btn prev_btn" 
            @click="previousStep"
            :disabled="isLoading"
          >
            ← Précédent
          </button>
          
          <button 
            type="button" 
            class="nav_btn cancel_btn" 
            @click="router.push('/user/announcements')"
            :disabled="isLoading"
          >
            Annuler
          </button>
          
          <button 
            v-if="currentStep < totalSteps"
            type="button" 
            class="nav_btn next_btn" 
            @click="nextStep"
            :disabled="isLoading"
          >
            Suivant →
          </button>
          
          <button 
            v-else
            type="submit" 
            class="nav_btn submit_btn" 
            :disabled="isLoading"
          >
            <span v-if="isLoading">Création en cours...</span>
            <span v-else>✓ Créer l'annonce</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.create_announcement {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30px 20px;
}

.create_announcement_container {
  max-width: 1000px;
  margin: 0 auto;
}

.page_header {
  background: #fff;
  padding: 25px 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back_btn {
  background: none;
  border: none;
  color: #274abb;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 15px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.back_btn:hover {
  color: #1d3a8f;
}

.page_header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
  font-weight: 700;
}

/* Stepper */
.stepper_container {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.progress_bar {
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 10px;
  margin-bottom: 30px;
  overflow: hidden;
}

.progress_fill {
  height: 100%;
  background: linear-gradient(90deg, #274abb 0%, #4a6fa5 100%);
  border-radius: 10px;
  transition: width 0.4s ease;
}

.stepper_steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.stepper_step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.step_number {
  font-size: 11px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

.stepper_step.active .step_number {
  color: #274abb;
}

.step_title {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  transition: color 0.3s ease;
}

.stepper_step.active .step_title {
  color: #274abb;
}

/* Messages */
.success_message,
.error_message {
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 600;
}

.success_message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error_message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Formulaire */
.announcement_form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form_section {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section_title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0 0 25px 0;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.form_group {
  margin-bottom: 20px;
}

.form_group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 15px;
}

.required {
  color: #e74c3c;
}

.form_group input[type="text"],
.form_group input[type="number"],
.form_group select,
.form_group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  font-family: inherit;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form_group input:focus,
.form_group select:focus,
.form_group textarea:focus {
  outline: none;
  border-color: #274abb;
  box-shadow: 0 0 0 3px rgba(39, 74, 187, 0.1);
}

.form_group textarea {
  resize: vertical;
  min-height: 120px;
}

/* Lignes de formulaire */
.form_row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form_row.three_cols {
  grid-template-columns: repeat(3, 1fr);
}

/* Checkboxes */
.checkbox_group {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

.checkbox_item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #555;
}

.checkbox_item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Upload de fichiers */
.file_upload_area {
  position: relative;
  margin-bottom: 15px;
}

.file_input {
  display: none;
}

.file_label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background-color: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file_label:hover {
  border-color: #274abb;
  background-color: #f0f4ff;
}

.upload_icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.file_label span {
  display: block;
  text-align: center;
}

.file_label > span:nth-child(2) {
  font-weight: 600;
  color: #333;
  font-size: 16px;
  margin-bottom: 5px;
}

.upload_hint {
  font-size: 13px;
  color: #999;
}

/* Prévisualisation galerie */
.gallery_preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.preview_item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
}

.preview_item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove_btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  background-color: rgba(231, 76, 60, 0.9);
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.remove_btn:hover {
  background-color: rgba(192, 57, 43, 1);
}

/* Prévisualisation fichier */
.file_preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: #f0f4ff;
  border: 1px solid #d0dff7;
  border-radius: 6px;
  margin-top: 15px;
}

.file_icon {
  font-size: 32px;
}

.file_name {
  flex: 1;
  font-weight: 600;
  color: #333;
}

.remove_file_btn {
  width: 28px;
  height: 28px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.remove_file_btn:hover {
  background-color: #c0392b;
}

/* Navigation du formulaire */
.form_navigation {
  display: flex;
  gap: 15px;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav_btn {
  padding: 14px 35px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.prev_btn {
  background-color: #e0e0e0;
  color: #666;
  margin-right: auto;
}

.prev_btn:hover:not(:disabled) {
  background-color: #d0d0d0;
}

.cancel_btn {
  background-color: #fff;
  color: #666;
  border: 2px solid #e0e0e0;
}

.cancel_btn:hover:not(:disabled) {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.next_btn {
  background-color: #274abb;
  color: #fff;
  margin-left: auto;
}

.next_btn:hover:not(:disabled) {
  background-color: #1d3a8f;
  transform: translateX(3px);
}

.submit_btn {
  background-color: #27ae60;
  color: #fff;
  margin-left: auto;
}

.submit_btn:hover:not(:disabled) {
  background-color: #229954;
}

  .nav_btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Modal de confirmation */
  .modal_confirm {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal_confirm_content {
    background: #fff;
    border-radius: 12px;
    max-width: 500px;
    width: 100%;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .modal_confirm_content h2 {
    margin: 0 0 25px 0;
    font-size: 24px;
    color: #333;
    font-weight: 700;
    text-align: center;
  }

  .confirm_details {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .detail_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .detail_item:last-child {
    border-bottom: none;
  }

  .detail_item.total {
    margin-top: 10px;
    padding-top: 15px;
    border-top: 2px solid #274abb;
    border-bottom: none;
    font-weight: 700;
    font-size: 18px;
  }

  .detail_label {
    color: #666;
    font-weight: 600;
  }

  .detail_item.total .detail_label,
  .detail_item.total .detail_value {
    color: #274abb;
  }

  .detail_value {
    color: #333;
    font-weight: 600;
  }

  .confirm_message {
    color: #666;
    line-height: 1.6;
    margin-bottom: 25px;
    text-align: center;
    font-size: 14px;
  }

  .confirm_actions {
    display: flex;
    gap: 15px;
    justify-content: center;
  }

  .btn_cancel,
  .btn_confirm {
    padding: 12px 30px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn_cancel {
    background-color: #e0e0e0;
    color: #666;
  }

  .btn_cancel:hover {
    background-color: #d0d0d0;
  }

  .btn_confirm {
    background-color: #274abb;
    color: #fff;
  }

  .btn_confirm:hover {
    background-color: #1d3a8f;
  }

  /* Responsive */
  @media (max-width: 768px) {
  .create_announcement {
    padding: 20px 15px;
  }

  .page_header,
  .form_section,
  .form_actions {
    padding: 20px;
  }

  .page_header h1 {
    font-size: 22px;
  }

  .section_title {
    font-size: 18px;
  }

  .form_row,
  .form_row.three_cols {
    grid-template-columns: 1fr;
  }

  .gallery_preview {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .stepper_container {
    padding: 20px;
  }

  .stepper_steps {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .step_number {
    font-size: 10px;
  }

  .step_title {
    font-size: 11px;
  }

  .form_navigation {
    flex-wrap: wrap;
    padding: 20px;
  }

  .prev_btn,
  .next_btn,
  .submit_btn {
    flex: 1;
    min-width: 150px;
  }

  .cancel_btn {
    width: 100%;
    order: 3;
  }
}
</style>


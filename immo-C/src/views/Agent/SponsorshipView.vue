<script setup>
import { ref, onMounted } from 'vue'
import { agentService } from '@/services/agentService'

const sponsorshipData = ref(null)
const isLoading = ref(true)
const copied = ref(false)

const loadSponsorshipLink = async () => {
  isLoading.value = true
  try {
    const response = await agentService.generateSponsorshipLink()
    sponsorshipData.value = response.data || response
  } catch (error) {
    console.error('Erreur lors du chargement du lien de parrainage:', error)
  } finally {
    isLoading.value = false
  }
}

const copyToClipboard = async () => {
  if (sponsorshipData.value?.sponsorshipLink) {
    try {
      await navigator.clipboard.writeText(sponsorshipData.value.sponsorshipLink)
      copied.value = true
      setTimeout(() => (copied.value = false), 3000)
    } catch (error) {
      console.error('Erreur lors de la copie:', error)
    }
  }
}

onMounted(() => {
  loadSponsorshipLink()
})
</script>

<template>
  <div class="sponsorship_view">
    <div class="page_header">
      <h1>Mon Lien de Parrainage</h1>
      <p>Parrainez des clients et gagnez 30% de commissions sur leurs visites</p>
    </div>

    <div v-if="isLoading" class="loading">Chargement...</div>

    <div v-else-if="sponsorshipData" class="sponsorship_content">
      <div class="link_card">
        <div class="form_group">
          <label for="sponsorshipLink">Votre lien de parrainage</label>
          <div class="link_display">
            <input 
              id="sponsorshipLink"
              :value="sponsorshipData.sponsorshipLink" 
              readonly 
              class="link_input"
            />
            <button @click="copyToClipboard" class="btn_copy">
              <i :class="copied ? 'fas fa-check' : 'fas fa-copy'"></i>
              {{ copied ? 'Copié !' : 'Copier' }}
            </button>
          </div>
        </div>
        
        <div class="code_display">
          <span class="label">Code de parrainage :</span>
          <span class="code">{{ sponsorshipData.sponsorshipCode }}</span>
        </div>
      </div>

      <div class="info_card">
        <h2>Comment ça marche ?</h2>
        <div class="steps">
          <div class="step">
            <div class="step_number">1</div>
            <div class="step_content">
              <h3>Partagez votre lien</h3>
              <p>Envoyez votre lien de parrainage à vos contacts</p>
            </div>
          </div>

          <div class="step">
            <div class="step_number">2</div>
            <div class="step_content">
              <h3>Inscription</h3>
              <p>Vos filleuls s'inscrivent via votre lien</p>
            </div>
          </div>

          <div class="step">
            <div class="step_number">3</div>
            <div class="step_content">
              <h3>Gagnez des commissions</h3>
              <p>Vous recevez 30% de commission sur leurs visites</p>
            </div>
          </div>
        </div>
      </div>

      <div class="benefits_card">
        <h2>Vos avantages</h2>
        <ul class="benefits_list">
          <li>
            <i class="fas fa-check-circle"></i>
            <span>30% de commission sur les visites virtuelles de vos filleuls</span>
          </li>
          <li>
            <i class="fas fa-check-circle"></i>
            <span>30% de commission sur les visites sur site de vos filleuls</span>
          </li>
          <li>
            <i class="fas fa-check-circle"></i>
            <span>Commissions versées automatiquement dans votre wallet</span>
          </li>
          <li>
            <i class="fas fa-check-circle"></i>
            <span>Suivi en temps réel de vos filleuls et gains</span>
          </li>
        </ul>
      </div>

      <RouterLink to="/agent/sponsored-customers" class="btn_view_customers">
        <i class="fas fa-users"></i>
        Voir mes clients parrainés
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.sponsorship_view {
  max-width: 900px;
}

.page_header {
  margin-bottom: 30px;
}

.page_header h1 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.page_header p {
  font-size: 14px;
  color: #666;
}

.loading {
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #666;
}

.sponsorship_content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.link_card,
.info_card,
.benefits_card {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h2 {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.form_group {
  margin-bottom: 25px;
}

.form_group label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.link_display {
  display: flex;
  gap: 10px;
}

.link_input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8f9fa;
}

.btn_copy {
  padding: 12px 24px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.btn_copy i {
  color: #fff;
}

.btn_copy:hover {
  background-color: #218838;
}

.code_display {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.label {
  font-size: 14px;
  color: #666;
}

.code {
  font-size: 18px;
  font-weight: bold;
  color: #28a745;
  letter-spacing: 2px;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.step_number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  flex-shrink: 0;
}

.step_content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.step_content p {
  font-size: 14px;
  color: #666;
}

.benefits_list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefits_list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.benefits_list li:last-child {
  border-bottom: none;
}

.benefits_list i {
  font-size: 20px;
  color: #28a745;
  margin-top: 2px;
}

.benefits_list span {
  font-size: 15px;
  color: #555;
  line-height: 1.6;
}

.btn_view_customers {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: #fff;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.3s;
}

.btn_view_customers i {
  color: #fff;
}

.btn_view_customers:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40,167,69,0.3);
}

@media (max-width: 768px) {
  .link_display {
    flex-direction: column;
  }

  .code_display {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>



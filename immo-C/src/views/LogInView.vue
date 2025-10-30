<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const response = await authService.login({
      email: email.value,
      password: password.value,
    })

    if (response.success) {
      const user = response.data.user
      
      // Vider le formulaire
      email.value = ''
      password.value = ''
      rememberMe.value = false
      
      // Émettre un événement pour informer le header
      window.dispatchEvent(new Event('auth-changed'))
      
      if (user.role === 'customer') {
        router.push('/user/profile')
      } else if (user.role === 'agent') {
        router.push('/agent/dashboard')
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard')
      }
    }
  } catch (error) {
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Une erreur est survenue lors de la connexion'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="box">
    <RouterLink to="/home" class="back_arrow">
      <span>←</span> Retour à l'accueil
    </RouterLink>
    <div class="card">
      <div class="card_right">
        <form @submit.prevent="handleLogin" class="form">
          <p class="form_title">Se connecter</p>

          <div v-if="errorMessage" class="error_message">
            {{ errorMessage }}
          </div>

          <div class="form_item">
            <label for="email" class="form_label">Email</label>
            <input v-model="email" type="email" id="email" required />
          </div>

          <div class="form_item">
            <label for="password" class="form_label">Mot de passe</label>
            <div class="password_wrapper">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password" required />
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

          <div class="forgot_password">
            <a href="#">Mot de passe oublié ?</a>
          </div>

          <div class="remember_me">
            <label><input v-model="rememberMe" type="checkbox" /> Se souvenir de moi</label>
          </div>

          <button type="submit" class="form_button" :disabled="isLoading">
            {{ isLoading ? 'Connexion...' : 'Connexion' }}
          </button>

          <div class="register_link">
            <p>Vous n'avez pas de compte ? <RouterLink to="/register">S'inscrire</RouterLink></p>
          </div>
        </form>
      </div>
    </div>
  </div>

  <RouterView />
</template>

<style scoped>
.box {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f2f2;
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
  width: 500px;
  border-radius: 15px;
  box-shadow: 0 2px 6px #0000000d;
  background-color: #fff;
}


.card_right {
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form_title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  text-align: center;
}

.form_item {
  margin-bottom: 20px;
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

.form_item input {
  width: 100%;
  padding: 16px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 18px;
  outline: none;
}
.forgot_password {
  text-align: right;
  margin-bottom: 15px;
}
.forgot_password a {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}
.forgot_password a:hover {
  text-decoration: underline;
}
.remember_me {
  margin-bottom: 20px;
}
.remember_me input {
  margin-right: 5px;
}

.form_button{
  width: 100%;
  padding: 12px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  font-weight: 600;
}

button:hover {
  background-color: #333;
}
.register_link {
  text-align: center;
  margin-top: 15px;
}

.register_link a {
  color: #007bff;
  text-decoration: none;
}

.register_link a:hover {
  text-decoration: underline;
}

.error_message {
  background-color: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
  border: 1px solid #fcc;
}

.form_button:disabled {
  background-color: #666;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .card {
    width: 90%;
  }

  .card_right {
    padding: 20px;
  }
}
</style>



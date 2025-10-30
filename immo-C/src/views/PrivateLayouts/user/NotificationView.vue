<script setup>
import { ref, computed, onMounted } from 'vue'
import { notificationService } from '@/services/notificationService'

const notifications = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12

const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return notifications.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(notifications.value.length / itemsPerPage)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

const loadNotifications = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await notificationService.getMyNotifications()
    notifications.value = response.data || []
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des notifications'
    console.error('Erreur:', error)
  } finally {
    isLoading.value = false
  }
}

const markAsRead = async (notificationId) => {
  try {
    await notificationService.markAsRead(notificationId)
    const notification = notifications.value.find((n) => n._id === notificationId)
    if (notification) {
      notification.isRead = true
    }
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error)
  }
}

const markAllAsRead = async () => {
  try {
    await notificationService.markAllAsRead()
    notifications.value.forEach((n) => (n.isRead = true))
  } catch (error) {
    errorMessage.value = 'Erreur lors du marquage de toutes les notifications'
  }
}

const deleteNotification = async (notificationId) => {
  try {
    await notificationService.deleteNotification(notificationId)
    notifications.value = notifications.value.filter((n) => n._id !== notificationId)
    
    // Réinitialiser la page si elle devient vide
    if (paginatedNotifications.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression de la notification'
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getActionBadgeColor = (action) => {
  const colors = {
    paiement: '#274abb',
    visite: '#ff385c',
    visite_virtuelle: '#00b894',
  }
  return colors[action] || '#666'
}

onMounted(() => {
  loadNotifications()
})
</script>

<template>
  <div class="notification">
    <div class="notification_contain">
      <div class="notification_contain_top">
        <div class="notification_contain_top_title">Mes notifications</div>
        <button
          v-if="notifications.some((n) => !n.isRead)"
          class="mark_all_btn"
          @click="markAllAsRead"
        >
          Tout marquer comme lu
        </button>
      </div>

      <div v-if="isLoading" class="page_loader">
        <div class="loader_spinner"></div>
        <p>Chargement en cours...</p>
      </div>

      <div v-else-if="errorMessage" class="error_message">{{ errorMessage }}</div>

      <div v-else-if="notifications.length === 0" class="empty_message">
        <p>Vous n'avez aucune notification</p>
      </div>

      <div v-else class="notification_contain_list">
        <div
          v-for="notification in paginatedNotifications"
          :key="notification._id"
          class="notification_item"
          :class="{ unread: !notification.isRead }"
          @click="markAsRead(notification._id)"
        >
          <div class="notification_header">
            <span
              class="action_badge"
              :style="{ backgroundColor: getActionBadgeColor(notification.action) }"
            >
              {{ notification.action }}
            </span>
            <span class="notification_date">{{ formatDate(notification.createdAt) }}</span>
          </div>
          <div class="notification_content">
            <h3 class="notification_title">{{ notification.title }}</h3>
            <p class="notification_message">{{ notification.message }}</p>
          </div>
          <div class="notification_actions">
            <button class="delete_btn" @click.stop="deleteNotification(notification._id)">
              <i class="fas fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="notifications.length > itemsPerPage" class="pagination">
        <button 
          class="pagination_btn" 
          @click="prevPage" 
          :disabled="currentPage === 1"
        >
          ← Précédent
        </button>
        
        <div class="pagination_pages">
          <button
            v-for="page in totalPages"
            :key="page"
            class="pagination_page"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          class="pagination_btn" 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
        >
          Suivant →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification {
  margin-bottom: 50px;
}

.notification_contain_top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.notification_contain_top_title {
  background-color: #000;
  color: #fff;
  font-weight: bold;
  padding: 12px 20px;
  border-radius: 6px;
  flex: 1;
  text-align: center;
}

.mark_all_btn {
  margin-left: 15px;
  padding: 10px 20px;
  background-color: #274abb;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
}

.mark_all_btn:hover {
  background-color: #1d3a8f;
}

.notification_contain_list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
}

.notification_item {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification_item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.notification_item.unread {
  background-color: #f0f7ff;
  border-left: 4px solid #274abb;
}

.notification_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.action_badge {
  padding: 5px 12px;
  border-radius: 20px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.notification_date {
  font-size: 13px;
  color: #999;
}

.notification_content {
  margin-bottom: 15px;
}

.notification_title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.notification_message {
  font-size: 15px;
  color: #666;
  line-height: 1.5;
}

.notification_actions {
  display: flex;
  justify-content: flex-end;
}

.delete_btn {
  padding: 8px 15px;
  background-color: transparent;
  color: #ff385c;
  border: 1px solid #ff385c;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.delete_btn:hover {
  background-color: #ff385c;
  color: #fff;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
  padding: 20px;
}

.pagination_btn {
  padding: 10px 20px;
  background-color: #274abb;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.pagination_btn:hover:not(:disabled) {
  background-color: #1d3a8f;
}

.pagination_btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination_pages {
  display: flex;
  gap: 8px;
}

.pagination_page {
  width: 40px;
  height: 40px;
  background-color: #fff;
  color: #274abb;
  border: 2px solid #274abb;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.pagination_page:hover {
  background-color: #e3f2fd;
}

.pagination_page.active {
  background-color: #274abb;
  color: #fff;
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

.error_message {
  background-color: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 6px;
  margin: 20px;
  text-align: center;
  border: 1px solid #fcc;
}

.empty_message {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}
</style>
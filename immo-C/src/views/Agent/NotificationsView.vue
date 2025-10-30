<script setup>
import { ref, computed, onMounted } from 'vue'
import { notificationService } from '@/services/notificationService'

const notifications = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

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
    preference: '#6c757d',
    validation_compte: '#28a745',
  }
  return colors[action] || '#666'
}

onMounted(() => {
  loadNotifications()
})
</script>

<template>
  <div class="notifications_page">
    <div class="page_header">
      <h1>Mes Notifications</h1>
      <button
        v-if="notifications.some((n) => !n.isRead)"
        class="mark_all_btn"
        @click="markAllAsRead"
      >
        <i class="fas fa-check-double"></i>
        Tout marquer comme lu
      </button>
    </div>

    <div v-if="isLoading" class="page_loader">
      <div class="loader_spinner"></div>
      <p>Chargement en cours...</p>
    </div>

    <div v-else-if="errorMessage" class="error_message">
      <i class="fas fa-exclamation-circle"></i>
      {{ errorMessage }}
    </div>

    <div v-else-if="notifications.length === 0" class="empty_state">
      <i class="fas fa-bell-slash"></i>
      <h3>Aucune notification</h3>
      <p>Vous n'avez aucune notification pour le moment</p>
    </div>

    <div v-else class="notifications_list">
      <div
        v-for="notification in paginatedNotifications"
        :key="notification._id"
        class="notification_card"
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
          <span class="notification_date">
            <i class="fas fa-clock"></i>
            {{ formatDate(notification.createdAt) }}
          </span>
        </div>
        <div class="notification_content">
          <h3 class="notification_title">
            <i v-if="!notification.isRead" class="fas fa-circle unread_dot"></i>
            {{ notification.title }}
          </h3>
          <p class="notification_message">{{ notification.message }}</p>
        </div>
        <div class="notification_actions">
          <button class="delete_btn" @click.stop="deleteNotification(notification._id)">
            <i class="fas fa-trash"></i>
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
        <i class="fas fa-chevron-left"></i>
        Précédent
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
        Suivant
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.notifications_page {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.page_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page_header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.mark_all_btn {
  padding: 12px 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.mark_all_btn:hover {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
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
  border-top: 5px solid #28a745;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error_message {
  text-align: center;
  padding: 40px 20px;
  color: #dc3545;
  font-size: 16px;
}

.error_message i {
  font-size: 48px;
  margin-bottom: 15px;
  display: block;
}

.empty_state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.empty_state i {
  font-size: 80px;
  color: #ddd;
  margin-bottom: 20px;
}

.empty_state h3 {
  font-size: 24px;
  color: #666;
  margin-bottom: 10px;
}

.empty_state p {
  font-size: 16px;
  color: #999;
}

.notifications_list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification_card {
  background-color: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.notification_card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #28a745;
}

.notification_card.unread {
  background-color: #f8fff9;
  border-color: #28a745;
  border-left-width: 5px;
}

.notification_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.action_badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.notification_date {
  font-size: 13px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 5px;
}

.notification_content {
  margin-bottom: 15px;
}

.notification_title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.unread_dot {
  font-size: 8px;
  color: #28a745;
}

.notification_message {
  font-size: 15px;
  line-height: 1.6;
  color: #666;
  white-space: pre-wrap;
}

.notification_actions {
  display: flex;
  justify-content: flex-end;
}

.delete_btn {
  padding: 8px 16px;
  background-color: transparent;
  color: #dc3545;
  border: 1px solid #dc3545;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.delete_btn:hover {
  background-color: #dc3545;
  color: #fff;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 40px;
  padding: 20px 0;
}

.pagination_btn {
  padding: 10px 20px;
  background-color: #fff;
  color: #28a745;
  border: 2px solid #28a745;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination_btn:hover:not(:disabled) {
  background-color: #28a745;
  color: #fff;
}

.pagination_btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination_pages {
  display: flex;
  gap: 8px;
}

.pagination_page {
  width: 40px;
  height: 40px;
  background-color: #fff;
  color: #333;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.pagination_page:hover {
  border-color: #28a745;
  color: #28a745;
}

.pagination_page.active {
  background-color: #28a745;
  color: #fff;
  border-color: #28a745;
}

/* Responsive */
@media (max-width: 768px) {
  .notifications_page {
    padding: 20px;
  }

  .page_header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .page_header h1 {
    font-size: 24px;
  }

  .notification_card {
    padding: 15px;
  }

  .notification_header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 10px;
  }

  .pagination_btn {
    font-size: 14px;
    padding: 8px 15px;
  }
}
</style>


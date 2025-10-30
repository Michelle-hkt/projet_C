import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/PublicLayouts/HomeView.vue'
import AnnouncementsView from '@/views/PublicLayouts/AnnouncementsView.vue'
import PropertyDetailView from '@/views/PublicLayouts/PropertyDetailView.vue'
import AboutView from '@/views/PublicLayouts/AboutView.vue'
import ProfileView from '@/views/PrivateLayouts/user/ProfileView.vue'
import PublicLayouts from '@/Layouts/PublicLayouts.vue'
import PrivateLayouts from '@/Layouts/PrivateLayouts.vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import AgentLayout from '@/Layouts/AgentLayout.vue'
import AdView from '@/views/PrivateLayouts/user/AdView.vue'
import CreateAnnouncementView from '@/views/PrivateLayouts/user/CreateAnnouncementView.vue'
import FavoriteView from '@/views/PrivateLayouts/user/FavoriteView.vue'
import NotificationView from '@/views/PrivateLayouts/user/NotificationView.vue'
import WalletView from '@/views/PrivateLayouts/user/WalletView.vue'
import LogInView from '@/views/LogInView.vue'
import RegisterView from '@/views/RegisterView.vue'
import AgentRegisterView from '@/views/AgentRegisterView.vue'

// Admin Views
import AdminDashboard from '@/views/Admin/DashboardView.vue'
import AllAgentsView from '@/views/Admin/AllAgentsView.vue'

// Agent Views
import AgentDashboard from '@/views/Agent/DashboardView.vue'
import AgentWalletView from '@/views/Agent/WalletView.vue'
import SponsorshipView from '@/views/Agent/SponsorshipView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/login',
      name: 'login',
      component: LogInView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/agent/register',
      name: 'agent-register',
      component: AgentRegisterView,
    },
    {
      path: '/',
      component: PublicLayouts,
      children: [
        {
          path: 'home',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'announcements',
          name: 'announcements-public',
          component: AnnouncementsView,
        },
        {
          path: 'property/:id',
          name: 'property-detail',
          component: PropertyDetailView,
        },
        {
          path: 'about',
          name: 'about',
          component: AboutView,
        },
      ],
    },
    {
      path: '/user',
      component: PrivateLayouts,
      children: [
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
        },
        {
          path: 'announcements',
          name: 'my-announcements',
          component: AdView,
        },
        {
          path: 'announcements/create',
          name: 'create-announcement',
          component: CreateAnnouncementView,
        },
        {
          path: 'favorites',
          name: 'favorites',
          component: FavoriteView,
        },
        {
          path: 'notifications',
          name: 'notifications',
          component: NotificationView,
        },
        {
          path: 'wallet',
          name: 'wallet',
          component: WalletView,
        },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: AdminDashboard,
        },
        {
          path: 'agents/all',
          name: 'admin-all-agents',
          component: AllAgentsView,
        },
        {
          path: 'agents/pending',
          name: 'admin-pending-agents',
          component: AllAgentsView,
        },
        {
          path: 'agents/validated',
          name: 'admin-validated-agents',
          component: AllAgentsView,
        },
      ],
    },
    {
      path: '/agent',
      component: AgentLayout,
      children: [
        {
          path: 'dashboard',
          name: 'agent-dashboard',
          component: AgentDashboard,
        },
        {
          path: 'wallet',
          name: 'agent-wallet',
          component: AgentWalletView,
        },
        {
          path: 'sponsorship',
          name: 'agent-sponsorship',
          component: SponsorshipView,
        },
      ],
    },
  ],
})

export default router

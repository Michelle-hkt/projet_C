import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/authService'
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
import AgentProfileView from '@/views/Agent/ProfileView.vue'
import AgentWalletView from '@/views/Agent/WalletView.vue'
import AgentAnnouncementsView from '@/views/Agent/AnnouncementsView.vue'
import SponsorshipView from '@/views/Agent/SponsorshipView.vue'
import SponsoredCustomersView from '@/views/Agent/SponsoredCustomersView.vue'
import CommissionsView from '@/views/Agent/CommissionsView.vue'
import AgentNotificationsView from '@/views/Agent/NotificationsView.vue'

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
          path: 'profile',
          name: 'agent-profile',
          component: AgentProfileView,
        },
        {
          path: 'announcements',
          name: 'agent-announcements',
          component: AgentAnnouncementsView,
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
        {
          path: 'sponsored-customers',
          name: 'agent-sponsored-customers',
          component: SponsoredCustomersView,
        },
        {
          path: 'commissions',
          name: 'agent-commissions',
          component: CommissionsView,
        },
        {
          path: 'notifications',
          name: 'agent-notifications',
          component: AgentNotificationsView,
        },
      ],
    },
  ],
})

// Navigation Guards - Contrôle d'accès basé sur les rôles
router.beforeEach((to, from, next) => {
  const currentUser = authService.getCurrentUser()
  const userRole = currentUser?.role

  // Pages publiques accessibles sans authentification
  const publicPages = ['/login', '/register', '/agent/register']
  const isPublicPage = publicPages.includes(to.path)

  // Pages publiques du site (home, announcements, etc.)
  const publicSitePages = ['/', '/home', '/announcements', '/about']
  const isPublicSitePage = publicSitePages.includes(to.path) || to.path.startsWith('/property/')

  // Si l'utilisateur n'est pas connecté
  if (!currentUser) {
    // Autoriser l'accès aux pages publiques et aux pages du site
    if (isPublicPage || isPublicSitePage) {
      next()
    } else {
      // Rediriger vers login pour toute autre page
      next('/login')
    }
    return
  }

  // Si l'utilisateur est connecté, appliquer les règles selon le rôle
  switch (userRole) {
    case 'agent':
      // Les agents ne peuvent accéder qu'à /agent/* et /login
      if (to.path.startsWith('/agent/')) {
        next()
      } else if (to.path === '/login') {
        // Si déjà connecté et va vers login, rediriger vers dashboard
        next('/agent/dashboard')
      } else {
        // Bloquer l'accès aux pages publiques, customer et admin
        console.warn("⛔ Accès refusé : Les agents ne peuvent accéder qu'à leur espace")
        next('/agent/dashboard')
      }
      break

    case 'customer':
      // Les customers peuvent accéder à /user/*, pages publiques du site
      if (to.path.startsWith('/user/') || isPublicSitePage) {
        next()
      } else if (to.path === '/login') {
        next('/user/profile')
      } else if (to.path.startsWith('/agent/') || to.path.startsWith('/admin/')) {
        // Bloquer l'accès aux espaces agent et admin
        console.warn('⛔ Accès refusé : Les customers ne peuvent pas accéder à cet espace')
        next('/user/profile')
      } else {
        next()
      }
      break

    case 'admin':
      // Les admins ne peuvent accéder qu'à /admin/* et /login
      if (to.path.startsWith('/admin/')) {
        next()
      } else if (to.path === '/login') {
        next('/admin/dashboard')
      } else {
        // Bloquer l'accès aux autres espaces
        console.warn("⛔ Accès refusé : Les admins ne peuvent accéder qu'à leur espace")
        next('/admin/dashboard')
      }
      break

    default:
      // Rôle inconnu, rediriger vers login
      next('/login')
      break
  }
})

export default router

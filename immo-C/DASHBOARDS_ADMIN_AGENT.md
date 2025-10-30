# Dashboards Admin & Agent

Dashboards complets créés pour l'administrateur et les agents, inspirés de [FindHouses User Profile](https://code-theme.com/html/findhouses/user-profile.html).

---

## 🎨 Layouts Créés

### 1. **AdminLayout.vue**

Layout avec sidebar pour l'administrateur.

**Fonctionnalités :**

- Avatar avec icône admin
- Affichage du nom et rôle
- Menu de navigation avec icônes
- Design responsive (sidebar rétractable sur mobile)
- Bouton de déconnexion

**Navigation :**

- Dashboard
- Tous les agents
- Agents en attente
- Agents validés
- Déconnexion

---

### 2. **AgentLayout.vue**

Layout avec sidebar pour les agents.

**Fonctionnalités :**

- Avatar avec icône agent
- Affichage du nom et rôle
- Badge avec solde du wallet (mise à jour automatique)
- Menu de navigation avec icônes
- Design responsive
- Bouton de déconnexion

**Navigation :**

- Dashboard
- Mon Profil
- Mes Annonces
- Mon Portefeuille
- Mes Commissions
- Parrainage
- Clients Parrainés
- Déconnexion

---

## 📊 Vues Admin

### 1. **Admin Dashboard** (`/admin/dashboard`)

**Statistiques affichées :**

- Total des agents
- Agents en attente de validation
- Agents validés

**Actions rapides :**

- Accès rapide aux agents en attente
- Voir tous les agents
- Voir les agents validés

**Design :**

- Cartes de statistiques avec gradients colorés
- Grille responsive
- Animations au survol

---

### 2. **All Agents View** (`/admin/agents/all`)

**Fonctionnalités :**

- Liste de tous les agents (validés et non validés)
- Affichage en grille de cartes
- Informations par agent :
  - Photo (avatar avec icône)
  - Nom complet
  - Email
  - Téléphone
  - Date d'inscription
  - Statut (Validé / En attente)

**Actions disponibles :**

- ✅ **Valider** un agent (si non validé)
- ⛔ **Invalider** un agent (si validé)
- 🗑️ **Rejeter et supprimer** un agent

**Messages de confirmation :**

- Messages de succès/erreur
- Rechargement automatique après action

---

## 📊 Vues Agent

### 1. **Agent Dashboard** (`/agent/dashboard`)

**Statistiques affichées :**

- Nombre d'annonces assignées
- Nombre de clients parrainés
- Total des commissions gagnées
- Solde du wallet

**Actions rapides :**

- Accès à mes annonces
- Générer lien de parrainage
- Consulter le portefeuille
- Voir l'historique des commissions

**Design :**

- 4 cartes de statistiques avec gradients uniques
- Grille responsive
- Liens vers les pages détaillées

---

### 2. **Agent Wallet View** (`/agent/wallet`)

**Fonctionnalités :**

- Affichage du solde disponible (grande carte gradient)
- Formulaire de demande de retrait :
  - Montant minimum : 1000 immo
  - Validation du montant (max = solde)
  - Bouton de retrait avec icône
- Messages de succès/erreur
- Info sur le délai de traitement (48h)

**Validations :**

- Montant minimum 1000 immo
- Ne peut pas retirer plus que le solde
- Mise à jour automatique du wallet après retrait

---

### 3. **Sponsorship View** (`/agent/sponsorship`)

**Fonctionnalités :**

- Affichage du lien de parrainage complet
- Bouton "Copier" avec feedback visuel
- Affichage du code de parrainage

**Section "Comment ça marche" :**

1. Partager votre lien
2. Inscription des filleuls
3. Gagner des commissions

**Avantages listés :**

- 30% de commission sur visites virtuelles
- 30% de commission sur visites sur site
- Versement automatique dans le wallet
- Suivi en temps réel

**Action :**

- Bouton vers la liste des clients parrainés

---

## 🗺️ Routes Configurées

### Routes Admin

```
/admin/dashboard              → Dashboard admin
/admin/agents/all             → Tous les agents
/admin/agents/pending         → Agents en attente
/admin/agents/validated       → Agents validés
```

### Routes Agent

```
/agent/dashboard              → Dashboard agent
/agent/wallet                 → Portefeuille agent
/agent/sponsorship            → Lien de parrainage
/agent/profile                → Profil agent (à créer)
/agent/announcements          → Annonces assignées (à créer)
/agent/commissions            → Historique commissions (à créer)
/agent/sponsored-customers    → Clients parrainés (à créer)
```

---

## 🎯 Fonctionnalités Techniques

### Chargement des données

- Appels API via les services (`agentService`)
- Gestion de l'état de chargement
- Messages d'erreur

### Mise à jour automatique

- Événements personnalisés (`wallet-updated`)
- Rechargement après actions (validation, retrait)

### Responsive Design

- Sidebar rétractable sur mobile (70px)
- Grilles adaptatives
- Masquage des labels sur petit écran

### UX/UI

- Animations au survol
- Gradients colorés
- Icônes Font Awesome
- Messages de feedback
- Boutons d'action colorés selon l'action

---

## 📝 Vues Restantes à Créer

### Pour Admin

- `PendingAgentsView.vue` (peut réutiliser AllAgentsView avec filtre)
- `ValidatedAgentsView.vue` (peut réutiliser AllAgentsView avec filtre)

### Pour Agent

- `ProfileView.vue` - Voir et modifier son profil
- `AnnouncementsView.vue` - Liste des annonces assignées
- `CommissionsView.vue` - Historique détaillé des commissions
- `SponsoredCustomersView.vue` - Liste des clients parrainés

---

## 🔗 Intégration

### Services utilisés

- `agentService.js` - Toutes les méthodes agent/admin
- Méthodes synchronisées avec le backend

### État global

- localStorage pour user info
- Événements window pour communication inter-composants

---

## 🎨 Palette de Couleurs

### Admin

- Primaire : `#274abb` (bleu)
- Gradients variés pour les stats

### Agent

- Primaire : `#28a745` (vert)
- Success : `#28a745`
- Warning : `#ffc107`
- Danger : `#dc3545`

---

## 📱 Responsive

- **Desktop** : Sidebar 280px
- **Tablet/Mobile** : Sidebar 70px
- **Grilles** : Auto-fit avec min/max
- **Formulaires** : Stack vertical sur mobile

---

Date de création : 30 octobre 2025


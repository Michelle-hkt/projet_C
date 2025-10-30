# 🔌 API Endpoints - Documentation Complète

## 📋 Base URL

```
http://localhost:3000/api/v1
```

---

## 🔐 Authentification

Toutes les routes protégées nécessitent un header :

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 1️⃣ AUTHENTIFICATION (`/api/v1/auth`)

## 📝 Inscription Customer

```http
POST /api/v1/auth/register
Content-Type: application/json

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "phoneNumber": "61234567",
  "whatsappNumber": "61234567",
  "sponsorshipCode": "AGT-XXXXXXXX" // Optionnel
}

Réponse (201):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "customer",
    "isActive": true,
    "phoneNumber": "61234567"
  },
  "customer": { ... },
  "wallet": { "id": "...", "balance": 0 }
}
```

## 🔑 Connexion

```http
POST /api/v1/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "Password123!"
}

Réponse (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "customer",
    "isActive": true,
    "phoneNumber": "61234567",
    "address": "..."
  }
}
```

---

# 2️⃣ AGENTS (`/api/v1/agent`)

## 📝 Inscription Agent

```http
POST /api/v1/agent/register
Content-Type: application/json

Body:
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "password": "Password123!",
  "phoneNumber": "61234567",
  "address": "Cotonou, Cadjèhoun",
  "description": "Agent immobilier avec 10 ans d'expérience...",
  "cipImage": "https://example.com/cip-jean.jpg"
}

Réponse (201):
{
  "success": true,
  "message": "Inscription réussie. En attente de validation...",
  "data": {
    "user": { ... },
    "agent": { ... }
  }
}
```

## 👤 Profil Agent

```http
GET /api/v1/agent/profile
Authorization: Bearer <token>

Réponse (200):
{
  "success": true,
  "data": {
    "id": "...",
    "user": { ... },
    "phoneNumber": "...",
    "address": "...",
    "description": "...",
    "cipImage": "...",
    "isValide": true,
    "sponsorshipCode": "AGT-XXXXXXXX",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

## 🏠 Mes Annonces Assignées

```http
GET /api/v1/agent/my-announcements
Authorization: Bearer <token>

Réponse (200):
{
  "success": true,
  "count": 5,
  "message": "Vous avez 5 annonce(s) assignée(s)",
  "data": [
    {
      "_id": "...",
      "title": "Villa moderne",
      "description": "...",
      "price": 50000000,
      "district": "Cotonou",
      "user": {
        "firstName": "Marie",
        "lastName": "Martin",
        "email": "marie@example.com"
      },
      "propertyType": { ... },
      "assignedAgents": ["...", "...", "..."],
      "commission": 2500000,
      "createdAt": "..."
    }
  ]
}
```

## 🔗 Générer Lien de Parrainage

```http
GET /api/v1/agent/sponsorship-link
Authorization: Bearer <token>

Réponse (200):
{
  "success": true,
  "data": {
    "sponsorshipCode": "AGT-A1B2C3D4",
    "sponsorshipLink": "http://localhost:5173/register?ref=AGT-A1B2C3D4",
    "agentName": "Jean Dupont"
  }
}
```

## 👥 Mes Clients Parrainés

```http
GET /api/v1/agent/my-sponsored-customers
Authorization: Bearer <token>

Réponse (200):
{
  "success": true,
  "count": 3,
  "message": "Vous avez parrainé 3 client(s)",
  "data": [
    {
      "customerId": "...",
      "firstName": "Marie",
      "lastName": "Martin",
      "email": "marie@example.com",
      "registeredAt": "2025-10-15T..."
    }
  ]
}
```

## 💰 Historique des Commissions

```http
GET /api/v1/agent/commissions
Authorization: Bearer <token>

Réponse (200):
{
  "success": true,
  "count": 12,
  "totalCommissions": 3600,
  "data": [
    {
      "_id": "...",
      "wallet": "...",
      "serviceType": "Commission parrainage",
      "transactionType": "deposit",
      "amount": 300,
      "description": "Commission de parrainage pour visite sur site...",
      "createdAt": "2025-10-20T..."
    }
  ]
}
```

## 💳 Solde du Wallet Agent

```http
GET /api/v1/agent/wallet
Authorization: Bearer <token>

Réponse (200):
{
  "success": true,
  "data": {
    "balance": 3600,
    "currency": "FCFA"
  }
}
```

## 💸 Demande de Retrait

```http
POST /api/v1/agent/wallet/withdraw
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "amount": 5000,
  "paymentMethod": "Orange Money",
  "phoneNumber": "61234567"
}

Réponse (200):
{
  "success": true,
  "message": "Demande de retrait enregistrée...",
  "data": {
    "newBalance": 0,
    "withdrawalAmount": 5000,
    "paymentMethod": "Orange Money",
    "status": "pending"
  }
}
```

## 📋 Liste Tous les Agents (Admin)

```http
GET /api/v1/agent/all
Authorization: Bearer <admin_token>

Réponse (200):
{
  "success": true,
  "count": 15,
  "data": [ ... ]
}
```

## ⏳ Agents en Attente (Admin)

```http
GET /api/v1/agent/pending
Authorization: Bearer <admin_token>

Réponse (200):
{
  "success": true,
  "count": 3,
  "message": "3 inscription(s) en attente de validation",
  "data": [ ... ]
}
```

## ✅ Agents Validés (Admin)

```http
GET /api/v1/agent/validated
Authorization: Bearer <admin_token>

Réponse (200):
{
  "success": true,
  "count": 12,
  "data": [ ... ]
}
```

## ✔️ Valider un Agent (Admin)

```http
PUT /api/v1/agent/validate/:agentId
Authorization: Bearer <admin_token>

Réponse (200):
{
  "success": true,
  "message": "Agent validé avec succès...",
  "data": { ... }
}
```

## ❌ Invalider un Agent (Admin)

```http
PUT /api/v1/agent/invalidate/:agentId
Authorization: Bearer <admin_token>

Réponse (200):
{
  "success": true,
  "message": "Agent invalidé avec succès",
  "data": { ... }
}
```

## 🗑️ Rejeter un Agent (Admin)

```http
DELETE /api/v1/agent/reject/:agentId
Authorization: Bearer <admin_token>

Réponse (200):
{
  "success": true,
  "message": "Inscription rejetée et supprimée...",
  "data": { ... }
}
```

---

# 3️⃣ VISITES AGENTS (`/api/v1/agent/visits`)

## 📋 Demandes de Visite en Attente

```http
GET /api/v1/agent/visits/pending
Authorization: Bearer <agent_token>

Réponse (200):
{
  "success": true,
  "count": 5,
  "message": "5 demande(s) de visite en attente",
  "data": [
    {
      "_id": "...",
      "userId": {
        "firstName": "Marie",
        "lastName": "Martin",
        "email": "marie@example.com"
      },
      "announcementId": {
        "title": "Villa moderne",
        "location": "Cotonou",
        "price": 50000000,
        "user": { ... }
      },
      "status": "en_attente",
      "createdAt": "..."
    }
  ]
}
```

## ✅ Mes Visites Acceptées

```http
GET /api/v1/agent/visits/accepted
Authorization: Bearer <agent_token>

Réponse (200):
{
  "success": true,
  "count": 3,
  "data": [ ... ]
}
```

## 📅 Mes Visites Confirmées

```http
GET /api/v1/agent/visits/confirmed
Authorization: Bearer <agent_token>

Réponse (200):
{
  "success": true,
  "count": 2,
  "data": [ ... ]
}
```

## ✔️ Accepter une Demande de Visite

```http
PUT /api/v1/agent/visits/:visitId/accept
Authorization: Bearer <agent_token>

Réponse (200):
{
  "success": true,
  "message": "Demande acceptée avec succès. Commissions distribuées.",
  "data": {
    "visit": { ... },
    "customerInfo": {
      "firstName": "Marie",
      "lastName": "Martin",
      "email": "marie@example.com",
      "phoneNumber": "67890123",
      "whatsappNumber": "67890123"
    },
    "propertyOwnerInfo": { ... }
  }
}
```

## 📆 Confirmer une Visite

```http
PUT /api/v1/agent/visits/:visitId/confirm
Authorization: Bearer <agent_token>
Content-Type: application/json

Body:
{
  "visitDate": "2025-10-30",
  "visitTime": "10:00",
  "meetingPlace": "Devant l'immeuble, Rue des Palmiers"
}

Réponse (200):
{
  "success": true,
  "message": "Visite confirmée avec succès. Customer notifié.",
  "data": { ... }
}
```

## ❌ Annuler une Visite

```http
PUT /api/v1/agent/visits/:visitId/cancel
Authorization: Bearer <agent_token>
Content-Type: application/json

Body:
{
  "reason": "Indisponibilité de l'agent" // Optionnel
}

Réponse (200):
{
  "success": true,
  "message": "Visite annulée. Customer notifié.",
  "data": { ... }
}
```

---

# 4️⃣ ANNONCES PUBLIQUES (`/api/v1/announcements`)

## 🔍 Recherche d'Annonces

```http
GET /api/v1/announcements/search?district=Cotonou&status=a_vendre&price=50000000

Réponse (200):
[
  {
    "_id": "...",
    "title": "Villa moderne",
    "description": "...",
    "status": "a_vendre",
    "price": 50000000,
    "district": "Cotonou",
    "isValid": true,
    ...
  }
]
```

## 📋 Toutes les Annonces

```http
GET /api/v1/announcements

Réponse (200):
[ ... ]
```

## 🆕 Annonces Récentes

```http
GET /api/v1/announcements/recent?limit=10

Réponse (200):
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

## 📄 Détails d'une Annonce

```http
GET /api/v1/announcements/:id

Réponse (200):
{
  "_id": "...",
  "title": "Villa moderne",
  "description": "...",
  "price": 50000000,
  "commission": 2500000,
  "assignedAgents": ["...", "...", "..."],
  ...
}
```

---

# 5️⃣ MES ANNONCES (`/api/v1/my-announcements`)

## ➕ Créer une Annonce

```http
POST /api/v1/my-announcements
Authorization: Bearer <customer_token>
Content-Type: application/json

Body:
{
  "title": "Villa moderne",
  "description": "Belle villa avec piscine...",
  "status": "a_vendre",
  "price": 50000000,
  "deposit": 10000000,
  "advance": 5000000,
  "district": "Cotonou",
  "address": "Rue des Palmiers, Cadjèhoun",
  "landArea": 500,
  "numberOfLivingRooms": 1,
  "numberOfBedrooms": 4,
  "numberOfBathrooms": 3,
  "numberOfKitchen": 1,
  "numberOfFloor": 2,
  "generalCondition": "Excellent",
  "garage": true,
  "internalToilet": true,
  "externalToilet": false,
  "landTitle": "TF 12345",
  "propertyType": "6123..." // ObjectId du type de bien
}

Réponse (201):
{
  "message": "Annonce créée avec succès",
  "data": { ... },
  "assignedAgents": 3,
  "commission": 2500000
}

Note:
- Coût: 5,000 immo débité automatiquement
- 3 agents assignés automatiquement (rotation + géolocalisation)
- Customer reçoit notification avec détails des agents
```

## 📋 Mes Annonces

```http
GET /api/v1/my-announcements
Authorization: Bearer <customer_token>

Réponse (200):
[ ... ]
```

## ✏️ Modifier une Annonce

```http
PUT /api/v1/my-announcements/:id
Authorization: Bearer <customer_token>
Content-Type: application/json

Body:
{
  "title": "Nouveau titre",
  "price": 55000000,
  ...
}

Réponse (200):
{
  "message": "Annonce modifiée avec succès"
}
```

## 🗑️ Supprimer une Annonce

```http
DELETE /api/v1/my-announcements/:id
Authorization: Bearer <customer_token>

Réponse (200):
{
  "message": "Annonce supprimée avec succès"
}
```

---

# 6️⃣ PAIEMENTS & WALLET (`/api/v1/payment`)

## 💳 Consulter le Solde

```http
GET /api/v1/payment/wallet
Authorization: Bearer <customer_token>

Réponse (200):
{
  "balance": 15000
}
```

## 💰 Recharger le Wallet

```http
POST /api/v1/payment/wallet/recharge
Authorization: Bearer <customer_token>
Content-Type: application/json

Body:
{
  "immoAmount": 10000,
  "paymentMethod": "Orange Money",
  "fcfaAmount": 5000
}

Réponse (200):
{
  "message": "Wallet rechargé avec succès",
  "newBalance": 25000
}

Note: Intégration avec agrégateur de paiement (à venir)
```

## 🖼️ Visite Virtuelle

```http
POST /api/v1/payment/virtual-visit
Authorization: Bearer <customer_token>
Content-Type: application/json

Body:
{
  "announcementId": "..."
}

Réponse (200):
{
  "message": "Paiement effectué avec succès",
  "visitUrl": "https://virtual-tour.com/..."
}

Coût: 2,000 immo
Commission (si parrainé): 70% plateforme, 30% agent parrain
```

## 🏠 Visite sur Site

```http
POST /api/v1/payment/on-site-visit
Authorization: Bearer <customer_token>
Content-Type: application/json

Body:
{
  "announcementId": "..."
}

Réponse (200):
{
  "message": "Demande envoyée. 3 agent(s) notifiés."
}

Coût: 1,000 immo
Commission (si parrainé): 70% plateforme, 30% agent parrain
Note: Seuls les 3 agents assignés à l'annonce sont notifiés
```

## 🎥 Créer une Visite Virtuelle

```http
POST /api/v1/payment/create-virtual-tour
Authorization: Bearer <customer_token>
Content-Type: application/json

Body:
{
  "announcementId": "..."
}

Réponse (200):
{
  "message": "Paiement effectué. Visite virtuelle disponible dans un instant"
}

Coût: 10,000 immo
Note: Intégration avec API externe (à venir)
```

---

# 7️⃣ CUSTOMER (`/api/v1/customer`)

## 👤 Mettre à Jour le Profil

```http
PUT /api/v1/customer/profile
Authorization: Bearer <customer_token>
Content-Type: application/json

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "61234567",
  "whatsappNumber": "61234567",
  "address": "Cotonou, Cadjèhoun"
}

Réponse (200):
{
  "message": "Profil mis à jour avec succès"
}
```

## ⭐ Ajouter une Préférence

```http
POST /api/v1/customer/preferences
Authorization: Bearer <customer_token>
Content-Type: application/json

Body:
{
  "preferenceKeyId": "..." // ObjectId du type de bien
}

Réponse (200):
{
  "message": "Préférence ajoutée"
}
```

## 🗑️ Retirer une Préférence

```http
DELETE /api/v1/customer/preferences/:preferenceKeyId
Authorization: Bearer <customer_token>

Réponse (200):
{
  "message": "Préférence retirée"
}
```

## 📋 Mes Préférences

```http
GET /api/v1/customer/preferences
Authorization: Bearer <customer_token>

Réponse (200):
[
  {
    "_id": "...",
    "name": "Maison",
    "description": "..."
  }
]
```

## ❤️ Ajouter aux Favoris

```http
POST /api/v1/customer/favorites
Authorization: Bearer <customer_token>
Content-Type: application/json

Body:
{
  "announcementId": "..."
}

Réponse (201):
{
  "message": "Ajouté aux favoris",
  "data": { ... }
}
```

## 💔 Retirer des Favoris

```http
DELETE /api/v1/customer/favorites/:announcementId
Authorization: Bearer <customer_token>

Réponse (200):
{
  "message": "Retiré des favoris"
}
```

## 📋 Mes Favoris

```http
GET /api/v1/customer/favorites
Authorization: Bearer <customer_token>

Réponse (200):
[
  {
    "_id": "...",
    "user": "...",
    "announcement": {
      "title": "Villa moderne",
      "price": 50000000,
      ...
    }
  }
]
```

## 🔔 Mes Notifications

```http
GET /api/v1/customer/notifications
Authorization: Bearer <customer_token>

Réponse (200):
[
  {
    "_id": "...",
    "user": "...",
    "title": "Agents assignés à votre annonce",
    "message": "Votre annonce 'Villa moderne' a été créée...",
    "action": "visite",
    "isRead": false,
    "announcement": { ... },
    "createdAt": "..."
  }
]
```

## ✅ Marquer Notification comme Lue

```http
PUT /api/v1/customer/notifications/:notificationId/read
Authorization: Bearer <customer_token>

Réponse (200):
{
  "message": "Notification marquée comme lue"
}
```

---

# 8️⃣ NOTIFICATIONS (`/api/v1/notifications`)

## 📋 Liste des Notifications

```http
GET /api/v1/notifications
Authorization: Bearer <token>

Réponse (200):
[
  {
    "_id": "...",
    "user": "...",
    "title": "Nouvelle annonce assignée",
    "message": "...",
    "action": "visite",
    "isRead": false,
    "emailSent": false,
    "announcement": { ... },
    "createdAt": "..."
  }
]
```

---

# 9️⃣ TYPES DE BIENS (`/api/v1/property`)

## 📋 Liste des Types

```http
GET /api/v1/property

Réponse (200):
[
  {
    "_id": "...",
    "name": "Maison",
    "description": "..."
  }
]
```

---

# 🔟 PRÉFÉRENCES (`/api/v1/preferences`)

## 📋 Liste des Clés de Préférence

```http
GET /api/v1/preferences

Réponse (200):
[
  {
    "_id": "...",
    "name": "Maison",
    "description": "Type de bien préféré"
  }
]
```

---

# 📊 RÉSUMÉ DES ENDPOINTS

## Par Rôle

### 🌐 PUBLIC (Sans authentification)

- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/agent/register` - Inscription agent
- `GET /api/v1/announcements` - Toutes les annonces
- `GET /api/v1/announcements/search` - Recherche
- `GET /api/v1/announcements/recent` - Annonces récentes
- `GET /api/v1/announcements/:id` - Détails annonce
- `GET /api/v1/property` - Types de biens
- `GET /api/v1/preferences` - Préférences

### 👥 CUSTOMER

- Toutes les routes `/api/v1/customer/*`
- Toutes les routes `/api/v1/my-announcements/*`
- Toutes les routes `/api/v1/payment/*`

### 🏢 AGENT

- Toutes les routes `/api/v1/agent/*` (sauf admin)
- Toutes les routes `/api/v1/agent/visits/*`

### ⚙️ ADMIN

- `GET /api/v1/agent/all` - Tous les agents
- `GET /api/v1/agent/pending` - Agents en attente
- `GET /api/v1/agent/validated` - Agents validés
- `PUT /api/v1/agent/validate/:agentId` - Valider
- `PUT /api/v1/agent/invalidate/:agentId` - Invalider
- `DELETE /api/v1/agent/reject/:agentId` - Rejeter

---

# 🔄 FLUX COMPLETS

## Création d'Annonce avec Assignation

```
1. POST /api/v1/my-announcements
   → Débit de 5,000 immo
   → Calcul commission (5% vente / 10% location)
   → Assignation de 3 agents (rotation + géo)
   → Notification aux 3 agents
   → Notification au customer avec détails des agents
```

## Visite sur Site avec Commission

```
1. POST /api/v1/payment/on-site-visit
   → Débit de 1,000 immo
   → Création demande visite (status: en_attente)
   → Notification aux 3 agents assignés uniquement

2. PUT /api/v1/agent/visits/:visitId/accept
   → Commission distribuée automatiquement:
      - Si parrainé: 70% plateforme, 30% parrain
      - Sinon: 100% plateforme
   → Customer notifié

3. PUT /api/v1/agent/visits/:visitId/confirm
   → Date, heure, lieu définis
   → Customer notifié avec tous les détails
```

## Parrainage et Commission

```
1. GET /api/v1/agent/sponsorship-link
   → Récupération du lien: /register?ref=AGT-XXXXXXXX

2. POST /api/v1/auth/register (avec sponsorshipCode)
   → Customer lié à l'agent parrain

3. POST /api/v1/payment/virtual-visit (par le customer parrainé)
   → 30% commission pour le parrain (600 immo)
   → 70% pour la plateforme (1,400 immo)
```

---

# ⚡ CODES D'ERREUR

```
200 - OK
201 - Created
400 - Bad Request (données invalides)
401 - Unauthorized (pas de token ou token invalide)
403 - Forbidden (accès refusé, rôle incorrect)
404 - Not Found (ressource introuvable)
500 - Internal Server Error
```

---

# 🧪 EXEMPLES DE TESTS (Postman/Thunder Client)

## Collection Postman

1. **Créer une variable d'environnement** : `baseUrl = http://localhost:3000/api/v1`
2. **Créer une variable** : `token` (sera remplie après login)

## Test Complet : Customer Parrainé

```javascript
// 1. Agent génère son lien
GET {{baseUrl}}/agent/sponsorship-link
Headers: Authorization: Bearer {{agentToken}}

// 2. Customer s'inscrit avec code
POST {{baseUrl}}/auth/register
Body: { ..., "sponsorshipCode": "AGT-XXXXXXXX" }

// 3. Customer crée une annonce
POST {{baseUrl}}/my-announcements
Body: { ... }

// 4. Customer demande une visite
POST {{baseUrl}}/payment/on-site-visit
Body: { "announcementId": "..." }

// 5. Agent accepte
PUT {{baseUrl}}/agent/visits/:visitId/accept
→ Commission de 300 immo pour le parrain automatique

// 6. Vérifier les commissions
GET {{baseUrl}}/agent/commissions
→ Total augmenté de 300 immo
```

---

**Date de création :** Octobre 2025  
**Version Backend :** 1.1.0  
**Développeur :** Assistant AI + Michelle  
**Statut :** ✅ Toutes les API sont connectées et opérationnelles



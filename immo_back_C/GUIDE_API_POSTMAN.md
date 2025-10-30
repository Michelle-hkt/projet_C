# 📡 GUIDE COMPLET DES APIs - TESTS POSTMAN

**URL de base :** `http://localhost:3000/api/v1`

---

## 📋 TABLE DES MATIÈRES

1. [Authentification](#1-authentification-auth)
2. [Agents](#2-agents-agent)
3. [Visites Agents](#3-visites-agents-agentvisits)
4. [Customers](#4-customers-customer)
5. [Annonces (Publiques)](#5-annonces-publiques-announcements)
6. [Mes Annonces (Customer/Admin)](#6-mes-annonces-my-announcements)
7. [Paiements](#7-paiements-payment)
8. [Notifications](#8-notifications-notifications)
9. [Types de Propriété](#9-types-de-propriété-property)
10. [Clés de Préférences](#10-clés-de-préférences-preferences)

---
 
## 🎯 LÉGENDE

| Icône | Signification                           |
| ----- | --------------------------------------- |
| 🌍    | Route publique (pas d'authentification) |
| 🔐    | Authentification requise                |
| 👤    | Customer uniquement                     |
| 🏢    | Agent uniquement                        |
| 👑    | Admin uniquement                        |
| 👤👑  | Customer OU Admin                       |

---

## 1. AUTHENTIFICATION (/auth)

### 1.1 Inscription Customer 🌍

```
POST /api/v1/auth/register
```

**Body (JSON) :**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password@123"
}
```

**Règles password :**

- 8-30 caractères
- Au moins 1 majuscule
- Au moins 1 minuscule
- Au moins 1 chiffre
- Au moins 1 caractère spécial

**Réponse (201) :**

```json
{
  "user": {
    "id": "67123abc...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "customer"
  },
  "customer": {
    "id": "67124def...",
    "userId": "67123abc..."
  },
  "wallet": {
    "id": "67125ghi...",
    "balance": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 1.2 Connexion 🌍

```
POST /api/v1/auth/login
```

**Body (JSON) :**

```json
{
  "email": "john.doe@example.com",
  "password": "Password@123"
}
```

**Réponse (200) :**

```json
{
  "user": {
    "id": "67123abc...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "customer",
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Important :** Copiez le `token` pour les prochaines requêtes !

---

### 1.3 Déconnexion 🌍

```
POST /api/v1/auth/logout
```

**Body :** Aucun

**Réponse (200) :**

```json
{
  "message": "Déconnexion réussie"
}
```

---

## 2. AGENTS (/agent)

### 2.1 Inscription Agent 🌍

```
POST /api/v1/agent/register
```

**Body (JSON) :**

```json
{
  "firstName": "Marie",
  "lastName": "Agent",
  "email": "marie.agent@example.com",
  "password": "Agent@123",
  "phoneNumber": "+22507000000"
}
```

**Réponse (201) :**

```json
{
  "user": {
    "id": "67200abc...",
    "firstName": "Marie",
    "lastName": "Agent",
    "email": "marie.agent@example.com",
    "role": "agent",
    "isActive": false
  },
  "agent": {
    "id": "67201def...",
    "phoneNumber": "+22507000000",
    "isValide": false
  },
  "wallet": {
    "id": "67202ghi...",
    "balance": 0
  },
  "message": "Inscription réussie. Votre compte est en attente de validation par un administrateur."
}
```

**Note :** L'agent ne peut pas se connecter tant qu'un admin ne l'a pas validé.

---

### 2.2 Mon Profil Agent 🔐🏢

```
GET /api/v1/agent/profile
```

**Headers :**

```
Authorization: Bearer <agent_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": {
    "_id": "67201def...",
    "userId": {
      "_id": "67200abc...",
      "firstName": "Marie",
      "lastName": "Agent",
      "email": "marie.agent@example.com"
    },
    "phoneNumber": "+22507000000",
    "isValide": true
  }
}
```

---

### 2.3 Liste de tous les agents 🔐👑

```
GET /api/v1/agent/all
```

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": [
    {
      "_id": "67201def...",
      "userId": {
        "firstName": "Marie",
        "lastName": "Agent",
        "email": "marie.agent@example.com"
      },
      "phoneNumber": "+22507000000",
      "isValide": true
    }
  ]
}
```

---

### 2.4 Agents en attente 🔐👑

```
GET /api/v1/agent/pending
```

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "67201def...",
      "userId": {
        "firstName": "Marie",
        "lastName": "Agent",
        "email": "marie.agent@example.com",
        "isActive": false
      },
      "phoneNumber": "+22507000000",
      "isValide": false
    }
  ]
}
```

---

### 2.5 Agents validés 🔐👑

```
GET /api/v1/agent/validated
```

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

---

### 2.6 Valider un agent 🔐👑

```
PUT /api/v1/agent/validate/:agentId
```

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Paramètres :**

- `agentId` : ID de l'agent à valider

**Exemple :**

```
PUT /api/v1/agent/validate/67201def...
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Agent validé avec succès. Une notification a été envoyée à l'utilisateur.",
  "data": {
    "agent": {...},
    "user": {...}
  }
}
```

**Action :** Notification envoyée à l'agent + Compte activé

---

### 2.7 Invalider un agent 🔐👑

```
PUT /api/v1/agent/invalidate/:agentId
```

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Agent invalidé avec succès"
}
```

---

### 2.8 Rejeter une inscription 🔐👑

```
DELETE /api/v1/agent/reject/:agentId
```

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Inscription de l'agent Marie Agent rejetée et supprimée avec succès.",
  "deletedAgent": {
    "firstName": "Marie",
    "lastName": "Agent",
    "email": "marie.agent@example.com"
  }
}
```

**Action :** Agent + User supprimés + Notification envoyée

---

### 2.9 Mon solde wallet 🔐🏢

```
GET /api/v1/agent/wallet
```

**Headers :**

```
Authorization: Bearer <agent_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": {
    "balance": 15000,
    "currency": "FCFA"
  }
}
```

---

### 2.10 Demander un retrait 🔐🏢

```
POST /api/v1/agent/wallet/withdraw
```

**Headers :**

```
Authorization: Bearer <agent_token>
```

**Body (JSON) :**

```json
{
  "amount": 10000,
  "paymentMethod": "orange_money",
  "phoneNumber": "+22507000000"
}
```

**Méthodes disponibles :**

- `"orange_money"`
- `"mtn_money"`
- `"wave"`

**Montant minimum :** 1000 FCFA

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Demande de retrait enregistrée avec succès",
  "data": {
    "amount": 10000,
    "paymentMethod": "orange_money",
    "newBalance": 5000,
    "paymentId": "67300abc..."
  }
}
```

---

## 3. VISITES AGENTS (/agent/visits)

### 3.1 Demandes en attente 🔐🏢

```
GET /api/v1/agent/visits/pending
```

**Headers :**

```
Authorization: Bearer <agent_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "67400abc...",
      "userId": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "announcementId": {
        "title": "Villa moderne 3 chambres",
        "address": "Cocody, Abidjan"
      },
      "status": "en_attente",
      "createdAt": "2025-10-27T10:00:00.000Z"
    }
  ]
}
```

---

### 3.2 Mes visites acceptées 🔐🏢

```
GET /api/v1/agent/visits/accepted
```

**Headers :**

```
Authorization: Bearer <agent_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

---

### 3.3 Mes visites confirmées 🔐🏢

```
GET /api/v1/agent/visits/confirmed
```

**Headers :**

```
Authorization: Bearer <agent_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 1,
  "data": [...]
}
```

---

### 3.4 Accepter une demande 🔐🏢

```
PUT /api/v1/agent/visits/:visitId/accept
```

**Headers :**

```
Authorization: Bearer <agent_token>
```

**Exemple :**

```
PUT /api/v1/agent/visits/67400abc.../accept
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Demande de visite acceptée avec succès",
  "data": {
    "_id": "67400abc...",
    "status": "accepter",
    "agentId": "67201def..."
  }
}
```

**Action :** Notification envoyée au customer

---

### 3.5 Confirmer une visite 🔐🏢

```
PUT /api/v1/agent/visits/:visitId/confirm
```

**Headers :**

```
Authorization: Bearer <agent_token>
```

**Body (JSON) :**

```json
{
  "visitTime": "14h30",
  "meetingPlace": "Devant l'immeuble, entrée principale"
}
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Visite confirmée avec succès",
  "data": {
    "_id": "67400abc...",
    "status": "confirmer",
    "visitTime": "14h30",
    "meetingPlace": "Devant l'immeuble, entrée principale"
  }
}
```

**Action :** Notification envoyée au customer avec date/heure/lieu

---

### 3.6 Annuler une visite 🔐🏢

```
PUT /api/v1/agent/visits/:visitId/cancel
```

**Headers :**

```
Authorization: Bearer <agent_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Visite annulée avec succès",
  "data": {
    "_id": "67400abc...",
    "status": "annuler"
  }
}
```

---

## 4. CUSTOMERS (/customer)

### 4.1 Ajouter une préférence 🔐

```
POST /api/v1/customer/preferences
```

**Headers :**

```
Authorization: Bearer <customer_token>
```

**Body (JSON) :**

```json
{
  "preferenceKeyId": "67500abc...",
  "value": "Villa"
}
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Préférence ajoutée avec succès"
}
```

---

### 4.2 Supprimer une préférence 🔐

```
DELETE /api/v1/customer/preferences/:preferenceKeyId
```

**Headers :**

```
Authorization: Bearer <customer_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Préférence supprimée avec succès"
}
```

---

### 4.3 Mes préférences 🔐

```
GET /api/v1/customer/preferences
```

**Headers :**

```
Authorization: Bearer <customer_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": [
    {
      "preferenceKey": {
        "name": "Type de propriété",
        "key": "propertyType"
      },
      "value": "Villa"
    }
  ]
}
```

---

### 4.4 Ajouter aux favoris 🔐

```
POST /api/v1/customer/favorites
```

**Headers :**

```
Authorization: Bearer <customer_token>
```

**Body (JSON) :**

```json
{
  "announcementId": "67600abc..."
}
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Annonce ajoutée aux favoris"
}
```

---

### 4.5 Retirer des favoris 🔐

```
DELETE /api/v1/customer/favorites/:announcementId
```

**Headers :**

```
Authorization: Bearer <customer_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Annonce retirée des favoris"
}
```

---

### 4.6 Mes favoris 🔐

```
GET /api/v1/customer/favorites
```

**Headers :**

```
Authorization: Bearer <customer_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": [
    {
      "_id": "67600abc...",
      "title": "Villa moderne 3 chambres",
      "price": 50000000,
      "images": ["url1", "url2"]
    }
  ]
}
```

---

## 5. ANNONCES PUBLIQUES (/announcements)

### 5.1 Toutes les annonces 🌍

```
GET /api/v1/announcements
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "67600abc...",
      "title": "Villa moderne 3 chambres",
      "description": "Belle villa avec piscine",
      "price": 50000000,
      "address": "Cocody, Abidjan",
      "propertyType": "Villa",
      "images": ["url1", "url2"],
      "visitUrl": "https://...",
      "user": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "createdAt": "2025-10-25T10:00:00.000Z"
    }
  ]
}
```

---

### 5.2 Annonce par ID 🌍

```
GET /api/v1/announcements/:id
```

**Exemple :**

```
GET /api/v1/announcements/67600abc...
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": {
    "_id": "67600abc...",
    "title": "Villa moderne 3 chambres",
    ...
  }
}
```

---

### 5.3 Recherche d'annonces 🌍

```
GET /api/v1/announcements/search?keyword=villa&minPrice=10000000&maxPrice=100000000
```

**Paramètres de query :**

- `keyword` : Mot-clé dans titre ou description
- `minPrice` : Prix minimum
- `maxPrice` : Prix maximum
- `propertyType` : Type de propriété
- `address` : Ville ou quartier

**Réponse (200) :**

```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

---

## 6. MES ANNONCES (/my-announcements)

### 6.1 Créer mon annonce 🔐👤👑

```
POST /api/v1/my-announcements
```

**Headers :**

```
Authorization: Bearer <customer_or_admin_token>
```

**Body (JSON) :**

```json
{
  "title": "Villa moderne 3 chambres",
  "description": "Belle villa avec piscine et jardin",
  "price": 50000000,
  "address": "Cocody, Abidjan",
  "propertyType": "Villa",
  "images": ["url1", "url2", "url3"]
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Annonce créée avec succès",
  "data": {
    "_id": "67600abc...",
    "title": "Villa moderne 3 chambres",
    ...
  }
}
```

---

### 6.2 Mes annonces 🔐👤👑

```
GET /api/v1/my-announcements
```

**Headers :**

```
Authorization: Bearer <customer_or_admin_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

---

### 6.3 Modifier mon annonce 🔐👤👑

```
PUT /api/v1/my-announcements/:id
```

**Headers :**

```
Authorization: Bearer <customer_or_admin_token>
```

**Body (JSON) :**

```json
{
  "title": "Villa moderne 4 chambres",
  "price": 55000000
}
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Annonce modifiée avec succès",
  "data": {...}
}
```

---

### 6.4 Supprimer mon annonce 🔐👤👑

```
DELETE /api/v1/my-announcements/:id
```

**Headers :**

```
Authorization: Bearer <customer_or_admin_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Annonce supprimée avec succès"
}
```

---

## 7. PAIEMENTS (/payment)

### 7.1 Recharger le wallet 🔐👤👑

```
POST /api/v1/payment/wallet/recharge
```

**Headers :**

```
Authorization: Bearer <customer_token>
```

**Body (JSON) :**

```json
{
  "amount": 10000,
  "paymentMethod": "orange_money",
  "amountPaid": 10000
}
```

**Réponse (200) :**

```json
{
  "message": "Wallet rechargé avec succès",
  "newBalance": 10000,
  "paymentMethod": "orange_money"
}
```

**Note Admin :** L'admin reçoit une erreur 403 (pas de wallet)

---

### 7.2 Consulter le solde 🔐👤👑

```
GET /api/v1/payment/wallet
```

**Headers :**

```
Authorization: Bearer <customer_token>
```

**Réponse (200) :**

```json
{
  "balance": 10000
}
```

**Réponse Admin :**

```json
{
  "success": true,
  "message": "Les administrateurs n'ont pas de wallet. Toutes vos actions sont gratuites.",
  "balance": "Illimité"
}
```

---

### 7.3 Payer visite virtuelle 🔐👤👑

```
POST /api/v1/payment/virtual-visit
```

**Prix :** 1000 FCFA (0 pour admin)

**Headers :**

```
Authorization: Bearer <customer_token>
```

**Body (JSON) :**

```json
{
  "announcementId": "67600abc..."
}
```

**Réponse (200) :**

```json
{
  "message": "Paiement effectué avec succès",
  "visitUrl": "https://..."
}
```

**Réponse Admin :**

```json
{
  "message": "Accès gratuit pour administrateur",
  "visitUrl": "https://..."
}
```

---

### 7.4 Demander visite sur site 🔐👤👑

```
POST /api/v1/payment/on-site-visit
```

**Prix :** 2000 FCFA (0 pour admin)

**Headers :**

```
Authorization: Bearer <customer_token>
```

**Body (JSON) :**

```json
{
  "announcementId": "67600abc..."
}
```

**Réponse (200) :**

```json
{
  "message": "Demande envoyée. En attente de confirmation"
}
```

**Action :** Notification envoyée à tous les agents validés

---

### 7.5 Commander création visite virtuelle 🔐👤👑

```
POST /api/v1/payment/create-virtual-tour
```

**Prix :** 10000 FCFA (0 pour admin)

**Headers :**

```
Authorization: Bearer <customer_token>
```

**Body (JSON) :**

```json
{
  "announcementId": "67600abc..."
}
```

**Réponse (200) :**

```json
{
  "message": "Paiement effectué. Visite virtuelle disponible dans un instant"
}
```

---

### 7.6 Payer publication annonce 🔐👤👑

```
POST /api/v1/payment/publish-announcement
```

**Prix :** 5000 FCFA (0 pour admin)

**Headers :**

```
Authorization: Bearer <customer_token>
```

**Body :** Aucun

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Paiement effectué avec succès. Vous pouvez maintenant publier votre annonce.",
  "data": {
    "newBalance": 5000,
    "amountPaid": 5000
  }
}
```

**Réponse Admin :**

```json
{
  "success": true,
  "message": "Publication gratuite pour les administrateurs.",
  "data": {
    "balance": "Illimité",
    "amountPaid": 0
  }
}
```

---

## 8. NOTIFICATIONS (/notifications)

### 8.1 Mes notifications 🔐

```
GET /api/v1/notifications
```

**Headers :**

```
Authorization: Bearer <token>
```

**Accessible à :** Customer, Agent, Admin

**Réponse (200) :**

```json
{
  "success": true,
  "data": [
    {
      "_id": "67700abc...",
      "user": "67123abc...",
      "title": "Demande de visite acceptée",
      "message": "Votre demande de visite a été acceptée par un agent",
      "action": "visite",
      "announcement": {
        "_id": "67600abc...",
        "title": "Villa moderne 3 chambres"
      },
      "isRead": false,
      "createdAt": "2025-10-27T10:00:00.000Z"
    }
  ]
}
```

---

### 8.2 Compter non lues 🔐

```
GET /api/v1/notifications/unread/count
```

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": {
    "unreadCount": 3
  }
}
```

---

### 8.3 Marquer comme lue 🔐

```
PUT /api/v1/notifications/:notificationId/read
```

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Notification marquée comme lue",
  "data": {...}
}
```

---

### 8.4 Tout marquer comme lu 🔐

```
PUT /api/v1/notifications/read-all
```

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "5 notification(s) marquée(s) comme lue(s)",
  "data": {
    "modifiedCount": 5
  }
}
```

---

### 8.5 Supprimer une notification 🔐

```
DELETE /api/v1/notifications/:notificationId
```

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Notification supprimée avec succès"
}
```

---

## 9. TYPES DE PROPRIÉTÉ (/property)

### 9.1 Tous les types 🌍

```
GET /api/v1/property
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": [
    {
      "_id": "67800abc...",
      "name": "Villa",
      "description": "Maison individuelle avec terrain"
    },
    {
      "_id": "67800def...",
      "name": "Appartement",
      "description": "Logement dans un immeuble"
    }
  ]
}
```

---

### 9.2 Type par ID 🌍

```
GET /api/v1/property/:id
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": {
    "_id": "67800abc...",
    "name": "Villa",
    "description": "Maison individuelle avec terrain"
  }
}
```

---

### 9.3 Créer un type 🔐👑

```
POST /api/v1/property
```

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Body (JSON) :**

```json
{
  "name": "Studio",
  "description": "Petit appartement une pièce"
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Type de propriété créé avec succès",
  "data": {...}
}
```

---

### 9.4 Modifier un type 🔐👑

```
PUT /api/v1/property/:id
```

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Body (JSON) :**

```json
{
  "name": "Studio moderne",
  "description": "Petit appartement une pièce avec équipements"
}
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Type de propriété modifié avec succès"
}
```

---

### 9.5 Supprimer un type 🔐👑

```
DELETE /api/v1/property/:id
```

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Type de propriété supprimé avec succès"
}
```

---

## 10. CLÉS DE PRÉFÉRENCES (/preferences)

### 10.1 Toutes les clés 🌍

```
GET /api/v1/preferences
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": [
    {
      "_id": "67900abc...",
      "name": "Type de propriété",
      "key": "propertyType",
      "possibleValues": ["Villa", "Appartement", "Studio"]
    }
  ]
}
```

---

### 10.2 Créer une clé 🔐👑

```
POST /api/v1/preferences
```

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Body (JSON) :**

```json
{
  "name": "Nombre de chambres",
  "key": "bedrooms",
  "possibleValues": ["1", "2", "3", "4", "5+"]
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Clé de préférence créée avec succès",
  "data": {...}
}
```

---

### 10.3 Modifier une clé 🔐👑

```
PUT /api/v1/preferences/:id
```

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Body (JSON) :**

```json
{
  "name": "Chambres",
  "possibleValues": ["1", "2", "3", "4", "5", "6+"]
}
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Clé de préférence modifiée avec succès"
}
```

---

### 10.4 Supprimer une clé 🔐👑

```
DELETE /api/v1/preferences/:id
```

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Clé de préférence supprimée avec succès"
}
```

---

## 📊 RÉCAPITULATIF DES ROUTES

| Catégorie              | Routes | Publiques | Authentifiées |
| ---------------------- | ------ | --------- | ------------- |
| **Authentification**   | 3      | 3         | 0             |
| **Agents**             | 10     | 1         | 9             |
| **Visites Agents**     | 6      | 0         | 6             |
| **Customers**          | 6      | 0         | 6             |
| **Annonces Publiques** | 3      | 3         | 0             |
| **Mes Annonces**       | 4      | 0         | 4             |
| **Paiements**          | 6      | 0         | 6             |
| **Notifications**      | 5      | 0         | 5             |
| **Types Propriété**    | 5      | 2         | 3             |
| **Clés Préférences**   | 4      | 1         | 3             |
| **TOTAL**              | **52** | **10**    | **42**        |

---

## 🧪 SCÉNARIOS DE TEST COMPLETS

### Scénario 1 : Customer complet

```bash
# 1. Inscription
POST /api/v1/auth/register
Body: { firstName, lastName, email, password }
→ Copier le token

# 2. Recharger wallet
POST /api/v1/payment/wallet/recharge
Authorization: Bearer <token>
Body: { amount: 20000, paymentMethod: "orange_money", amountPaid: 20000 }

# 3. Payer publication
POST /api/v1/payment/publish-announcement
Authorization: Bearer <token>

# 4. Créer annonce
POST /api/v1/my-announcements
Authorization: Bearer <token>
Body: { title, description, price, address, propertyType, images }

# 5. Demander visite sur site d'une autre annonce
POST /api/v1/payment/on-site-visit
Authorization: Bearer <token>
Body: { announcementId: "..." }

# 6. Voir mes notifications
GET /api/v1/notifications
Authorization: Bearer <token>
```

---

### Scénario 2 : Agent complet

```bash
# 1. Inscription agent
POST /api/v1/agent/register
Body: { firstName, lastName, email, password, phoneNumber }

# 2. Admin valide l'agent
PUT /api/v1/agent/validate/:agentId
Authorization: Bearer <admin_token>

# 3. Agent se connecte
POST /api/v1/auth/login
Body: { email, password }
→ Copier le token agent

# 4. Voir demandes en attente
GET /api/v1/agent/visits/pending
Authorization: Bearer <agent_token>

# 5. Accepter une demande
PUT /api/v1/agent/visits/:visitId/accept
Authorization: Bearer <agent_token>

# 6. Confirmer la visite
PUT /api/v1/agent/visits/:visitId/confirm
Authorization: Bearer <agent_token>
Body: { visitTime: "14h30", meetingPlace: "Devant l'immeuble" }

# 7. Consulter wallet
GET /api/v1/agent/wallet
Authorization: Bearer <agent_token>

# 8. Demander retrait
POST /api/v1/agent/wallet/withdraw
Authorization: Bearer <agent_token>
Body: { amount: 10000, paymentMethod: "orange_money", phoneNumber: "+..." }
```

---

### Scénario 3 : Admin complet

```bash
# 1. Connexion admin
POST /api/v1/auth/login
Body: { email: "admin@...", password: "..." }
→ Copier le token admin

# 2. Voir agents en attente
GET /api/v1/agent/pending
Authorization: Bearer <admin_token>

# 3. Valider un agent
PUT /api/v1/agent/validate/:agentId
Authorization: Bearer <admin_token>

# 4. Créer annonce (gratuit)
POST /api/v1/my-announcements
Authorization: Bearer <admin_token>
Body: { ... }

# 5. Créer type de propriété
POST /api/v1/property
Authorization: Bearer <admin_token>
Body: { name: "Studio", description: "..." }

# 6. Consulter solde (Illimité)
GET /api/v1/payment/wallet
Authorization: Bearer <admin_token>
```

---

## ⚠️ ERREURS COMMUNES

### 401 Unauthorized

```json
{
  "message": "Token manquant ou invalide"
}
```

**Solution :** Vérifier le header `Authorization: Bearer <token>`

---

### 403 Forbidden

```json
{
  "success": false,
  "message": "Accès refusé. Cette action est réservée aux..."
}
```

**Solution :** Vérifier que vous utilisez le bon rôle

---

### 400 Bad Request

```json
{
  "message": "Solde insuffisant",
  "required": 5000,
  "current": 2000
}
```

**Solution :** Recharger le wallet

---

## 📌 NOTES IMPORTANTES

1. **Token JWT** : Valable 7 jours
2. **Password** : Min 8 caractères, maj+min+chiffre+spécial
3. **Admin gratuit** : Toutes les actions customer sont gratuites
4. **Agent wallet** : Peut recevoir et retirer uniquement
5. **Customer wallet** : Peut recharger et payer uniquement

---

✅ **Guide complet créé !** Utilisez ce document pour tester toutes les APIs dans Postman.

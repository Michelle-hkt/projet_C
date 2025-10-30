# 📋 LISTE COMPLÈTE DES API - PLATEFORME IMMOBILIÈRE

**Date :** 26 octobre 2025  
**Version :** 2.0  
**Base URL :** `http://localhost:3000/api/v1`

---

## 📖 TABLE DES MATIÈRES

1. [Authentification (3 routes)](#1-authentification)
2. [Agents (8 routes)](#2-agents)
3. [Customer - Préférences (3 routes)](#3-customer---préférences)
4. [Customer - Favoris (3 routes)](#4-customer---favoris)
5. [Customer - Notifications (2 routes)](#5-customer---notifications)
6. [Annonces publiques (3 routes)](#6-annonces-publiques)
7. [Mes annonces (4 routes)](#7-mes-annonces)
8. [Paiements (5 routes)](#8-paiements)
9. [Types de propriété (5 routes)](#9-types-de-propriété)
10. [Préférences système (4 routes)](#10-préférences-système)

**Total : 40 routes API**

---

## 🔐 Légende

| Icône | Signification                           |
| ----- | --------------------------------------- |
| 🌐    | Route publique (pas d'authentification) |
| 🔒    | Authentification requise                |
| 👥    | Rôle Customer requis                    |
| 🏢    | Rôle Agent requis                       |
| 👑    | Rôle Admin requis                       |

---

## 1. AUTHENTIFICATION

### 1.1 Inscription Customer 🌐

**Route :** `POST /auth/register`  
**Protection :** Aucune

**Body :**

```json
{
  "firstName": "Marie",
  "lastName": "Dupont",
  "email": "marie@example.com",
  "password": "MotDePasse123!",
  "phoneNumber": "0600000001",
  "whatsappNumber": "0600000001"
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "firstName": "Marie",
      "lastName": "Dupont",
      "email": "marie@example.com",
      "role": "customer",
      "isActive": true
    },
    "customer": { ... },
    "wallet": { "balance": 0 }
  }
}
```

---

### 1.2 Connexion 🌐

**Route :** `POST /auth/login`  
**Protection :** Aucune

**Body :**

```json
{
  "email": "marie@example.com",
  "password": "MotDePasse123!"
}
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "firstName": "Marie",
      "lastName": "Dupont",
      "email": "marie@example.com",
      "role": "customer"
    }
  }
}
```

---

### 1.3 Déconnexion 🌐

**Route :** `POST /auth/logout`  
**Protection :** Aucune

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

## 2. AGENTS

### 2.1 Inscription Agent 🌐

**Route :** `POST /agent/register`  
**Protection :** Aucune

**Body :**

```json
{
  "firstName": "Pierre",
  "lastName": "Martin",
  "email": "pierre.martin@example.com",
  "password": "MotDePasse123!",
  "phoneNumber": "0612345678"
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Inscription réussie. Votre compte est en attente de validation par un administrateur.",
  "data": {
    "user": {
      "id": "...",
      "firstName": "Pierre",
      "lastName": "Martin",
      "email": "pierre.martin@example.com",
      "role": "agent",
      "isActive": false
    },
    "agent": {
      "id": "...",
      "phoneNumber": "0612345678",
      "isValide": false
    }
  }
}
```

⚠️ **Note :** L'agent ne peut pas se connecter tant qu'un admin ne l'a pas validé.

---

### 2.2 Profil de l'agent 🔒 🏢

**Route :** `GET /agent/profile`  
**Protection :** Agent uniquement

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": {
    "id": "...",
    "user": {
      "_id": "...",
      "firstName": "Pierre",
      "lastName": "Martin",
      "email": "pierre.martin@example.com",
      "isActive": true
    },
    "phoneNumber": "0612345678",
    "isValide": true,
    "createdAt": "2025-10-20T10:30:00.000Z",
    "updatedAt": "2025-10-26T15:45:00.000Z"
  }
}
```

---

### 2.3 Liste de tous les agents 🔒 👑

**Route :** `GET /agent/all`  
**Protection :** Admin uniquement

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "userId": {
        "_id": "...",
        "firstName": "Pierre",
        "lastName": "Martin",
        "email": "pierre.martin@example.com",
        "isActive": true
      },
      "phoneNumber": "0612345678",
      "isValide": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 2.4 Agents en attente de validation 🔒 👑

**Route :** `GET /agent/pending`  
**Protection :** Admin uniquement

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 2,
  "message": "2 inscription(s) en attente de validation",
  "data": [
    {
      "_id": "...",
      "userId": {
        "firstName": "Sophie",
        "lastName": "Durand",
        "email": "sophie.durand@example.com",
        "isActive": false,
        "createdAt": "2025-10-21T14:15:00.000Z"
      },
      "phoneNumber": "0698765432",
      "isValide": false,
      "createdAt": "2025-10-21T14:15:00.000Z"
    }
  ]
}
```

---

### 2.5 Agents validés 🔒 👑

**Route :** `GET /agent/validated`  
**Protection :** Admin uniquement

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 3,
  "data": [ ... ]
}
```

---

### 2.6 Valider un agent 🔒 👑

**Route :** `PUT /agent/validate/:agentId`  
**Protection :** Admin uniquement

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Exemple :**

```
PUT /agent/validate/65f4a1b2c3d4e5f6a7b8c9d0
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Agent validé avec succès. Une notification a été envoyée à l'utilisateur.",
  "data": {
    "agent": { ... },
    "user": {
      "id": "...",
      "firstName": "Pierre",
      "lastName": "Martin",
      "email": "pierre.martin@example.com",
      "isActive": true
    }
  }
}
```

✅ **Action :** L'agent peut maintenant se connecter et une notification lui est envoyée.

---

### 2.7 Rejeter une inscription 🔒 👑

**Route :** `DELETE /agent/reject/:agentId`  
**Protection :** Admin uniquement

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Exemple :**

```
DELETE /agent/reject/65f4a1b2c3d4e5f6a7b8c9d1
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Inscription de l'agent Sophie Durand rejetée et supprimée avec succès. Une notification a été envoyée à l'utilisateur.",
  "data": {
    "firstName": "Sophie",
    "lastName": "Durand",
    "email": "sophie.durand@example.com"
  }
}
```

⚠️ **Action irréversible :** L'agent et l'utilisateur sont supprimés de la base de données.

---

### 2.8 Invalider un agent 🔒 👑

**Route :** `PUT /agent/invalidate/:agentId`  
**Protection :** Admin uniquement

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Exemple :**

```
PUT /agent/invalidate/65f4a1b2c3d4e5f6a7b8c9d0
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Agent invalidé avec succès",
  "data": {
    "_id": "...",
    "isValide": false
  }
}
```

⚠️ **Action :** L'agent ne peut plus se connecter mais son compte est conservé.

---

## 3. CUSTOMER - PRÉFÉRENCES

### 3.1 Ajouter une préférence 🔒 👥

**Route :** `POST /customer/preferences`  
**Protection :** Customer uniquement

**Headers :**

```
Authorization: Bearer <token>
```

**Body :**

```json
{
  "preferenceKey": "65f4a1b2c3d4e5f6a7b8c9d0"
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Préférence ajoutée avec succès",
  "data": {
    "customer": { ... }
  }
}
```

---

### 3.2 Supprimer une préférence 🔒 👥

**Route :** `DELETE /customer/preferences/:preferenceKeyId`  
**Protection :** Customer uniquement

**Headers :**

```
Authorization: Bearer <token>
```

**Exemple :**

```
DELETE /customer/preferences/65f4a1b2c3d4e5f6a7b8c9d0
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Préférence supprimée avec succès"
}
```

---

### 3.3 Voir mes préférences 🔒 👥

**Route :** `GET /customer/preferences`  
**Protection :** Customer uniquement

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": {
    "preferences": [
      {
        "_id": "...",
        "name": "Proximité écoles",
        "description": "..."
      }
    ]
  }
}
```

---

## 4. CUSTOMER - FAVORIS

### 4.1 Ajouter aux favoris 🔒 👥

**Route :** `POST /customer/favorites`  
**Protection :** Customer uniquement

**Headers :**

```
Authorization: Bearer <token>
```

**Body :**

```json
{
  "announcement": "65f4a1b2c3d4e5f6a7b8c9d0"
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Annonce ajoutée aux favoris",
  "data": {
    "favorite": {
      "_id": "...",
      "customer": "...",
      "announcement": "...",
      "createdAt": "..."
    }
  }
}
```

---

### 4.2 Retirer des favoris 🔒 👥

**Route :** `DELETE /customer/favorites/:announcementId`  
**Protection :** Customer uniquement

**Headers :**

```
Authorization: Bearer <token>
```

**Exemple :**

```
DELETE /customer/favorites/65f4a1b2c3d4e5f6a7b8c9d0
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Annonce retirée des favoris"
}
```

---

### 4.3 Voir mes favoris 🔒 👥

**Route :** `GET /customer/favorites`  
**Protection :** Customer uniquement

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "announcement": {
        "_id": "...",
        "title": "Villa 4 pièces",
        "price": 150000,
        "images": [ ... ]
      },
      "createdAt": "..."
    }
  ]
}
```

---

## 5. CUSTOMER - NOTIFICATIONS

### 5.1 Voir mes notifications 🔒

**Route :** `GET /customer/notifications`  
**Protection :** Authentification requise

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 5,
  "unread": 2,
  "data": [
    {
      "_id": "...",
      "title": "Paiement confirmé",
      "message": "Votre paiement de 5000 FCFA a été confirmé.",
      "action": "paiement",
      "isRead": false,
      "emailSent": false,
      "createdAt": "2025-10-26T10:00:00.000Z"
    }
  ]
}
```

---

### 5.2 Marquer comme lue 🔒

**Route :** `PUT /customer/notifications/:notificationId/read`  
**Protection :** Authentification requise

**Headers :**

```
Authorization: Bearer <token>
```

**Exemple :**

```
PUT /customer/notifications/65f4a1b2c3d4e5f6a7b8c9d0/read
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Notification marquée comme lue",
  "data": {
    "_id": "...",
    "isRead": true
  }
}
```

---

## 6. ANNONCES PUBLIQUES

### 6.1 Rechercher des annonces 🌐

**Route :** `GET /announcements/search`  
**Protection :** Aucune

**Query Parameters :**

```
?keyword=villa
&minPrice=50000
&maxPrice=200000
&propertyType=65f4a1b2c3d4e5f6a7b8c9d0
&location=Abidjan
```

**Exemple :**

```
GET /announcements/search?keyword=villa&minPrice=100000&location=Cocody
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "...",
      "title": "Belle villa à Cocody",
      "description": "...",
      "price": 150000,
      "location": "Cocody, Abidjan",
      "propertyType": {
        "name": "Villa"
      },
      "images": [ ... ]
    }
  ]
}
```

---

### 6.2 Toutes les annonces 🌐

**Route :** `GET /announcements`  
**Protection :** Aucune

**Réponse (200) :**

```json
{
  "success": true,
  "count": 45,
  "data": [ ... ]
}
```

---

### 6.3 Détails d'une annonce 🌐

**Route :** `GET /announcements/:id`  
**Protection :** Aucune

**Exemple :**

```
GET /announcements/65f4a1b2c3d4e5f6a7b8c9d0
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Villa 4 pièces",
    "description": "Description complète...",
    "price": 150000,
    "location": "Cocody, Abidjan",
    "propertyType": { ... },
    "images": [ ... ],
    "agent": {
      "firstName": "Pierre",
      "lastName": "Martin",
      "phoneNumber": "0612345678"
    }
  }
}
```

---

## 7. MES ANNONCES

### 7.1 Créer mon annonce 🔒

**Route :** `POST /my-announcements`  
**Protection :** Authentification requise (Agent ou Customer)

**Headers :**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body :**

```json
{
  "title": "Villa moderne 4 pièces",
  "description": "Belle villa située dans un quartier calme...",
  "price": 150000,
  "location": "Cocody, Abidjan",
  "propertyType": "65f4a1b2c3d4e5f6a7b8c9d0",
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Annonce créée avec succès",
  "data": {
    "_id": "...",
    "title": "Villa moderne 4 pièces",
    "price": 150000,
    "createdAt": "..."
  }
}
```

---

### 7.2 Voir mes annonces 🔒

**Route :** `GET /my-announcements`  
**Protection :** Authentification requise

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "title": "Villa moderne 4 pièces",
      "price": 150000,
      "location": "Cocody, Abidjan",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 7.3 Modifier mon annonce 🔒

**Route :** `PUT /my-announcements/:id`  
**Protection :** Authentification requise (propriétaire uniquement)

**Headers :**

```
Authorization: Bearer <token>
```

**Body :**

```json
{
  "title": "Villa moderne 4 pièces - PRIX RÉDUIT",
  "price": 140000
}
```

**Exemple :**

```
PUT /my-announcements/65f4a1b2c3d4e5f6a7b8c9d0
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Annonce modifiée avec succès",
  "data": { ... }
}
```

---

### 7.4 Supprimer mon annonce 🔒

**Route :** `DELETE /my-announcements/:id`  
**Protection :** Authentification requise (propriétaire uniquement)

**Headers :**

```
Authorization: Bearer <token>
```

**Exemple :**

```
DELETE /my-announcements/65f4a1b2c3d4e5f6a7b8c9d0
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Annonce supprimée avec succès"
}
```

---

## 8. PAIEMENTS

### 8.1 Payer une visite virtuelle 🔒 👥

**Route :** `POST /payment/virtual-visit`  
**Protection :** Customer uniquement

**Headers :**

```
Authorization: Bearer <token>
```

**Body :**

```json
{
  "announcement": "65f4a1b2c3d4e5f6a7b8c9d0",
  "amount": 5000
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Paiement effectué avec succès",
  "data": {
    "transaction": {
      "_id": "...",
      "type": "visite_virtuelle",
      "amount": 5000,
      "status": "completed"
    },
    "newBalance": 45000
  }
}
```

---

### 8.2 Payer une visite sur site 🔒 👥

**Route :** `POST /payment/on-site-visit`  
**Protection :** Customer uniquement

**Headers :**

```
Authorization: Bearer <token>
```

**Body :**

```json
{
  "announcement": "65f4a1b2c3d4e5f6a7b8c9d0",
  "amount": 3000,
  "visitDate": "2025-10-28T10:00:00.000Z"
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Paiement effectué avec succès",
  "data": {
    "transaction": { ... },
    "visit": {
      "visitDate": "2025-10-28T10:00:00.000Z",
      "status": "pending"
    },
    "newBalance": 42000
  }
}
```

---

### 8.3 Payer création visite virtuelle 🔒 🏢

**Route :** `POST /payment/create-virtual-tour`  
**Protection :** Agent uniquement

**Headers :**

```
Authorization: Bearer <token>
```

**Body :**

```json
{
  "announcement": "65f4a1b2c3d4e5f6a7b8c9d0",
  "amount": 10000
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Paiement effectué avec succès. La création de la visite virtuelle sera traitée.",
  "data": {
    "transaction": { ... },
    "newBalance": 40000
  }
}
```

---

### 8.4 Recharger le wallet 🔒

**Route :** `POST /payment/wallet/recharge`  
**Protection :** Authentification requise

**Headers :**

```
Authorization: Bearer <token>
```

**Body :**

```json
{
  "amount": 50000,
  "paymentMethod": "orange_money",
  "phoneNumber": "0600000001"
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Demande de recharge initiée avec succès",
  "data": {
    "payment": {
      "_id": "...",
      "amount": 50000,
      "status": "pending",
      "paymentMethod": "orange_money"
    },
    "message": "La recharge sera traitée par l'agrégateur de paiement"
  }
}
```

⚠️ **Note :** L'intégration avec l'agrégateur de paiement (Orange Money, MTN, Wave) sera faite ultérieurement.

---

### 8.5 Consulter mon solde 🔒

**Route :** `GET /payment/wallet`  
**Protection :** Authentification requise

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": {
    "balance": 45000,
    "currency": "FCFA"
  }
}
```

---

## 9. TYPES DE PROPRIÉTÉ

### 9.1 Liste des types 🌐

**Route :** `GET /property`  
**Protection :** Aucune

**Réponse (200) :**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "name": "Villa",
      "description": "Maison individuelle spacieuse"
    },
    {
      "_id": "...",
      "name": "Appartement",
      "description": "Logement dans un immeuble"
    }
  ]
}
```

---

### 9.2 Détails d'un type 🌐

**Route :** `GET /property/:id`  
**Protection :** Aucune

**Exemple :**

```
GET /property/65f4a1b2c3d4e5f6a7b8c9d0
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Villa",
    "description": "Maison individuelle spacieuse"
  }
}
```

---

### 9.3 Créer un type 🔒 👑

**Route :** `POST /property`  
**Protection :** Admin uniquement

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Body :**

```json
{
  "name": "Studio",
  "description": "Petit logement une pièce"
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Type de propriété créé avec succès",
  "data": {
    "_id": "...",
    "name": "Studio",
    "description": "Petit logement une pièce"
  }
}
```

---

### 9.4 Modifier un type 🔒 👑

**Route :** `PUT /property/:id`  
**Protection :** Admin uniquement

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Body :**

```json
{
  "description": "Petit logement tout équipé"
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

### 9.5 Supprimer un type 🔒 👑

**Route :** `DELETE /property/:id`  
**Protection :** Admin uniquement

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

## 10. PRÉFÉRENCES SYSTÈME

### 10.1 Liste des préférences 🌐

**Route :** `GET /preferences`  
**Protection :** Aucune

**Réponse (200) :**

```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "...",
      "name": "Proximité écoles",
      "description": "Proche des établissements scolaires"
    },
    {
      "_id": "...",
      "name": "Quartier calme",
      "description": "Zone résidentielle tranquille"
    }
  ]
}
```

---

### 10.2 Créer une préférence 🔒 👑

**Route :** `POST /preferences`  
**Protection :** Admin uniquement

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Body :**

```json
{
  "name": "Piscine",
  "description": "Propriété avec piscine"
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Préférence créée avec succès",
  "data": {
    "_id": "...",
    "name": "Piscine",
    "description": "Propriété avec piscine"
  }
}
```

---

### 10.3 Modifier une préférence 🔒 👑

**Route :** `PUT /preferences/:id`  
**Protection :** Admin uniquement

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Body :**

```json
{
  "description": "Propriété avec piscine privée"
}
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Préférence modifiée avec succès"
}
```

---

### 10.4 Supprimer une préférence 🔒 👑

**Route :** `DELETE /preferences/:id`  
**Protection :** Admin uniquement

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Préférence supprimée avec succès"
}
```

---

## 🧪 GUIDE DE TEST DANS POSTMAN

### **Étape 1 : Configuration de l'environnement**

1. Créez un environnement "Immo Dev" dans Postman
2. Ajoutez les variables suivantes :

| Variable        | Initial Value                  | Current Value                  |
| --------------- | ------------------------------ | ------------------------------ |
| `baseUrl`       | `http://localhost:3000/api/v1` | `http://localhost:3000/api/v1` |
| `customerToken` | (vide)                         | (vide)                         |
| `agentToken`    | (vide)                         | (vide)                         |
| `adminToken`    | (vide)                         | (vide)                         |

---

### **Étape 2 : Créer des scripts de sauvegarde automatique**

#### **Pour POST /auth/register (Customer)**

Onglet **Tests** :

```javascript
if (pm.response.code === 201) {
  var jsonData = pm.response.json();
  pm.environment.set("customerToken", jsonData.data.token);
  console.log("✅ Token customer sauvegardé");
}
```

#### **Pour POST /auth/login**

Onglet **Tests** :

```javascript
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  var role = jsonData.data.user.role;

  if (role === "customer") {
    pm.environment.set("customerToken", jsonData.data.token);
    console.log("✅ Token customer sauvegardé");
  } else if (role === "agent") {
    pm.environment.set("agentToken", jsonData.data.token);
    console.log("✅ Token agent sauvegardé");
  } else if (role === "admin") {
    pm.environment.set("adminToken", jsonData.data.token);
    console.log("✅ Token admin sauvegardé");
  }
}
```

---

### **Étape 3 : Utiliser les variables dans vos requêtes**

#### **URL de base**

```
{{baseUrl}}/customer/favorites
```

#### **Authorization**

Type : **Bearer Token**

- Pour Customer : `{{customerToken}}`
- Pour Agent : `{{agentToken}}`
- Pour Admin : `{{adminToken}}`

---

### **Scénario de test complet : Customer**

#### **1. Inscription**

```
POST {{baseUrl}}/auth/register

Body:
{
  "firstName": "Marie",
  "lastName": "Dupont",
  "email": "marie@example.com",
  "password": "MotDePasse123!",
  "phoneNumber": "0600000001",
  "whatsappNumber": "0600000001"
}
```

#### **2. Voir les annonces (pas besoin de token)**

```
GET {{baseUrl}}/announcements
```

#### **3. Rechercher une villa**

```
GET {{baseUrl}}/announcements/search?keyword=villa&location=Cocody
```

#### **4. Ajouter aux favoris (avec token)**

```
POST {{baseUrl}}/customer/favorites
Authorization: Bearer {{customerToken}}

Body:
{
  "announcement": "ANNOUNCEMENT_ID"
}
```

#### **5. Voir mes favoris**

```
GET {{baseUrl}}/customer/favorites
Authorization: Bearer {{customerToken}}
```

#### **6. Consulter mon solde**

```
GET {{baseUrl}}/payment/wallet
Authorization: Bearer {{customerToken}}
```

#### **7. Recharger mon wallet**

```
POST {{baseUrl}}/payment/wallet/recharge
Authorization: Bearer {{customerToken}}

Body:
{
  "amount": 50000,
  "paymentMethod": "orange_money",
  "phoneNumber": "0600000001"
}
```

#### **8. Payer une visite virtuelle**

```
POST {{baseUrl}}/payment/virtual-visit
Authorization: Bearer {{customerToken}}

Body:
{
  "announcement": "ANNOUNCEMENT_ID",
  "amount": 5000
}
```

---

### **Scénario de test complet : Agent**

#### **1. Inscription agent**

```
POST {{baseUrl}}/agent/register

Body:
{
  "firstName": "Pierre",
  "lastName": "Martin",
  "email": "pierre.martin@example.com",
  "password": "MotDePasse123!",
  "phoneNumber": "0612345678"
}
```

⚠️ **À ce stade, l'agent NE PEUT PAS se connecter**

#### **2. Admin valide l'agent**

```
PUT {{baseUrl}}/agent/validate/AGENT_ID
Authorization: Bearer {{adminToken}}
```

#### **3. Connexion agent**

```
POST {{baseUrl}}/auth/login

Body:
{
  "email": "pierre.martin@example.com",
  "password": "MotDePasse123!"
}
```

#### **4. Voir mon profil agent**

```
GET {{baseUrl}}/agent/profile
Authorization: Bearer {{agentToken}}
```

#### **5. Créer une annonce**

```
POST {{baseUrl}}/my-announcements
Authorization: Bearer {{agentToken}}

Body:
{
  "title": "Villa moderne 4 pièces",
  "description": "Belle villa située dans un quartier calme...",
  "price": 150000,
  "location": "Cocody, Abidjan",
  "propertyType": "PROPERTY_TYPE_ID",
  "images": [
    "https://example.com/image1.jpg"
  ]
}
```

#### **6. Voir mes annonces**

```
GET {{baseUrl}}/my-announcements
Authorization: Bearer {{agentToken}}
```

---

### **Scénario de test complet : Admin**

#### **1. Connexion admin**

```
POST {{baseUrl}}/auth/login

Body:
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

#### **2. Voir les inscriptions en attente**

```
GET {{baseUrl}}/agent/pending
Authorization: Bearer {{adminToken}}
```

#### **3. Valider un agent**

```
PUT {{baseUrl}}/agent/validate/AGENT_ID
Authorization: Bearer {{adminToken}}
```

#### **4. Voir tous les agents**

```
GET {{baseUrl}}/agent/all
Authorization: Bearer {{adminToken}}
```

#### **5. Créer un type de propriété**

```
POST {{baseUrl}}/property
Authorization: Bearer {{adminToken}}

Body:
{
  "name": "Studio",
  "description": "Petit logement une pièce"
}
```

#### **6. Créer une préférence**

```
POST {{baseUrl}}/preferences
Authorization: Bearer {{adminToken}}

Body:
{
  "name": "Piscine",
  "description": "Propriété avec piscine"
}
```

---

## ⚠️ POINTS IMPORTANTS

### **Validation des mots de passe**

Le mot de passe doit contenir :

- ✅ Au moins 8 caractères
- ✅ Au moins une minuscule (a-z)
- ✅ Au moins une MAJUSCULE (A-Z)
- ✅ Au moins un chiffre (0-9)
- ✅ Au moins un caractère spécial (!@#$%^&\*...)

**Exemples valides :** `MotDePasse123!`, `Password@123`, `Test123!abc`

---

### **Format des requêtes JSON**

Dans Postman :

1. Onglet **Body** → Sélectionnez **raw**
2. Dans le menu déroulant → Sélectionnez **JSON**
3. Le header `Content-Type: application/json` sera ajouté automatiquement

---

### **Gestion des tokens**

- Les tokens JWT expirent après **7 jours**
- Si vous obtenez "Token invalide ou expiré", reconnectez-vous
- Un token est unique par utilisateur et par session

---

### **Messages d'erreur courants**

| Code | Message                      | Solution                                               |
| ---- | ---------------------------- | ------------------------------------------------------ |
| 401  | `"Unauthorized"`             | Token manquant → Ajoutez le header Authorization       |
| 401  | `"Token invalide ou expiré"` | Token expiré → Reconnectez-vous                        |
| 403  | `"Accès refusé"`             | Rôle insuffisant → Utilisez un compte avec le bon rôle |
| 403  | `"Compte désactivé"`         | Compte inactif → Contactez un admin                    |
| 403  | `"Agent non validé"`         | Agent pas validé → Attendez la validation admin        |
| 404  | `"Ressource introuvable"`    | ID incorrect → Vérifiez l'ID utilisé                   |

---

## 📊 RÉCAPITULATIF PAR RÔLE

### **Routes accessibles par Customer (👥)**

- ✅ Toutes les routes publiques (🌐)
- ✅ Préférences (3 routes)
- ✅ Favoris (3 routes)
- ✅ Notifications (2 routes)
- ✅ Mes annonces (4 routes)
- ✅ Paiements visites (2 routes)
- ✅ Wallet (2 routes)

**Total : 16 routes + routes publiques**

---

### **Routes accessibles par Agent (🏢)**

- ✅ Toutes les routes publiques (🌐)
- ✅ Profil agent (1 route)
- ✅ Mes annonces (4 routes)
- ✅ Paiement création visite virtuelle (1 route)
- ✅ Wallet (2 routes)

**Total : 8 routes + routes publiques**

---

### **Routes accessibles par Admin (👑)**

- ✅ Toutes les routes publiques (🌐)
- ✅ Gestion agents (5 routes)
- ✅ Types de propriété (3 routes)
- ✅ Préférences système (3 routes)
- ✅ Toutes les autres routes

**Total : Accès complet**

---

## ✅ CHECKLIST AVANT DE TESTER

- [ ] Le serveur Node.js est démarré (`npm start`)
- [ ] MongoDB est lancé et accessible
- [ ] Les rôles sont initialisés dans la base de données
- [ ] Postman est configuré avec l'environnement
- [ ] Les variables d'environnement sont créées
- [ ] La base URL est correcte : `http://localhost:3000/api/v1`

---

**🎉 Vous avez maintenant la liste complète des 40 routes API avec leurs tests !**

Pour plus de détails sur la validation des agents par l'admin, consultez le fichier `ADMIN_AGENT_VALIDATION.md`.

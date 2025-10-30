# 📋 LISTE COMPLÈTE DES API À TESTER

**Date :** 26 octobre 2025  
**Total :** 37 API endpoints

---

## 📖 SOMMAIRE

1. [API Authentification (3)](#1-api-authentification)
2. [API Agent (7)](#2-api-agent)
3. [API Customer - Préférences (3)](#3-api-customer---préférences)
4. [API Customer - Favoris (3)](#4-api-customer---favoris)
5. [API Customer - Notifications (2)](#5-api-customer---notifications)
6. [API Annonces Customer (4)](#6-api-annonces-customer)
7. [API Annonces Publiques (3)](#7-api-annonces-publiques)
8. [API Paiements (5)](#8-api-paiements)
9. [API Types de Propriété (5)](#9-api-types-de-propriété)
10. [API Préférences (4)](#10-api-préférences)

---

## 1. API AUTHENTIFICATION

### 1.1 Inscription Customer

**Route :** `POST /api/v1/auth/register`  
**Protection :** Aucune (publique)  
**Ce que ça fait :**

- Crée un nouveau compte customer
- Attribue automatiquement le rôle "customer"
- Crée un wallet avec solde 0
- Crée un profil customer
- Génère et retourne un token JWT

**Body (JSON) :**

```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "password": "MotDePasse123",
  "phoneNumber": "0600000001",
  "whatsappNumber": "0600000001"
}
```

**Réponse succès (201) :**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f4a1b2c3d4e5f6a7b8c9d0",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "role": "customer",
    "isActive": true
  },
  "customer": {
    "id": "65f4a1b2c3d4e5f6a7b8c9d1",
    "phoneNumber": "0600000001",
    "whatsappNumber": "0600000001"
  },
  "wallet": {
    "id": "65f4a1b2c3d4e5f6a7b8c9d2",
    "balance": 0
  }
}
```

**Réponse erreur (400) :**

```json
{
  "success": false,
  "message": "Cet email est déjà utilisé"
}
```

---

### 1.2 Connexion

**Route :** `POST /api/v1/auth/login`  
**Protection :** Aucune (publique)  
**Ce que ça fait :**

- Vérifie l'email et le mot de passe
- Vérifie que le compte est actif
- Pour les agents : vérifie que isValide=true
- Génère et retourne un token JWT

**Body (JSON) :**

```json
{
  "email": "jean.dupont@example.com",
  "password": "MotDePasse123"
}
```

**Réponse succès (200) :**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f4a1b2c3d4e5f6a7b8c9d0",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "role": "customer",
    "isActive": true
  }
}
```

**Réponse erreur (401) :**

```json
{
  "success": false,
  "message": "Email ou mot de passe incorrect"
}
```

**Réponse erreur agent non validé (403) :**

```json
{
  "success": false,
  "message": "Votre compte agent est en attente de validation par un administrateur. Vous ne pouvez pas vous connecter pour le moment."
}
```

---

### 1.3 Déconnexion

**Route :** `POST /api/v1/auth/logout`  
**Protection :** Aucune (publique)  
**Ce que ça fait :**

- Endpoint symbolique pour déconnexion côté client
- Le client doit supprimer le token JWT

**Body :** Aucun

**Réponse succès (200) :**

```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

## 2. API AGENT

### 2.1 Inscription Agent (Demande)

**Route :** `POST /api/v1/agent/register`  
**Protection :** Aucune (publique)  
**Ce que ça fait :**

- Crée un compte avec le rôle "agent"
- Crée un profil agent avec isValide=false
- Ne génère PAS de token (l'agent ne peut pas se connecter)
- L'agent doit attendre validation admin

**Body (JSON) :**

```json
{
  "firstName": "Marie",
  "lastName": "Martin",
  "email": "marie.martin@example.com",
  "password": "MotDePasse789",
  "phoneNumber": "0600000003"
}
```

**Réponse succès (201) :**

```json
{
  "success": true,
  "message": "Inscription réussie. Votre compte est en attente de validation par un administrateur. Vous pourrez vous connecter une fois votre compte validé.",
  "data": {
    "user": {
      "id": "65f4a1b2c3d4e5f6a7b8c9d3",
      "firstName": "Marie",
      "lastName": "Martin",
      "email": "marie.martin@example.com",
      "role": "agent",
      "isActive": true
    },
    "agent": {
      "id": "65f4a1b2c3d4e5f6a7b8c9d4",
      "phoneNumber": "0600000003",
      "isValide": false
    }
  }
}
```

**Réponse erreur (400) :**

```json
{
  "success": false,
  "message": "Cet email est déjà associé à un compte client. Vous ne pouvez pas créer un compte agent avec le même email. Veuillez utiliser une autre adresse email."
}
```

---

### 2.2 Voir Mon Profil Agent

**Route :** `GET /api/v1/agent/profile`  
**Protection :** `auth` + `isAgent`  
**Ce que ça fait :**

- Retourne le profil de l'agent connecté
- Affiche les infos utilisateur + téléphone + statut de validation

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse succès (200) :**

```json
{
  "success": true,
  "data": {
    "id": "65f4a1b2c3d4e5f6a7b8c9d4",
    "user": {
      "_id": "65f4a1b2c3d4e5f6a7b8c9d3",
      "firstName": "Marie",
      "lastName": "Martin",
      "email": "marie.martin@example.com",
      "isActive": true
    },
    "phoneNumber": "0600000003",
    "isValide": true,
    "createdAt": "2025-10-26T10:30:00.000Z",
    "updatedAt": "2025-10-26T11:00:00.000Z"
  }
}
```

---

### 2.3 Voir Tous Les Agents (Admin)

**Route :** `GET /api/v1/agent/all`  
**Protection :** `auth` + `isAdmin`  
**Ce que ça fait :**

- Retourne la liste de TOUS les agents (validés et non validés)
- Triés par date de création (plus récents en premier)

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse succès (200) :**

```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "65f4a1b2c3d4e5f6a7b8c9d4",
      "userId": {
        "_id": "65f4a1b2c3d4e5f6a7b8c9d3",
        "firstName": "Marie",
        "lastName": "Martin",
        "email": "marie.martin@example.com",
        "isActive": true
      },
      "phoneNumber": "0600000003",
      "isValide": true,
      "createdAt": "2025-10-26T10:30:00.000Z",
      "updatedAt": "2025-10-26T11:00:00.000Z"
    }
  ]
}
```

---

### 2.4 Voir Agents En Attente (Admin)

**Route :** `GET /api/v1/agent/pending`  
**Protection :** `auth` + `isAdmin`  
**Ce que ça fait :**

- Retourne uniquement les agents avec isValide=false
- Ce sont les agents qui attendent validation

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse succès (200) :**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "65f4a1b2c3d4e5f6a7b8c9d5",
      "userId": {
        "firstName": "Pierre",
        "lastName": "Durand",
        "email": "pierre.durand@example.com"
      },
      "phoneNumber": "0600000004",
      "isValide": false,
      "createdAt": "2025-10-26T12:00:00.000Z"
    }
  ]
}
```

---

### 2.5 Voir Agents Validés (Admin)

**Route :** `GET /api/v1/agent/validated`  
**Protection :** `auth` + `isAdmin`  
**Ce que ça fait :**

- Retourne uniquement les agents avec isValide=true
- Ce sont les agents qui peuvent se connecter

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse succès (200) :**

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "65f4a1b2c3d4e5f6a7b8c9d4",
      "userId": {
        "firstName": "Marie",
        "lastName": "Martin",
        "email": "marie.martin@example.com"
      },
      "phoneNumber": "0600000003",
      "isValide": true,
      "createdAt": "2025-10-26T10:30:00.000Z"
    }
  ]
}
```

---

### 2.6 Valider Un Agent (Admin)

**Route :** `PUT /api/v1/agent/validate/:agentId`  
**Protection :** `auth` + `isAdmin`  
**Ce que ça fait :**

- Change isValide de false à true
- L'agent peut maintenant se connecter
- L'agent peut utiliser les fonctionnalités agent

**Headers :**

```
Authorization: Bearer <token>
```

**Params URL :**

- `agentId` : ID du profil agent (pas l'ID user)

**Exemple :**

```
PUT /api/v1/agent/validate/65f4a1b2c3d4e5f6a7b8c9d5
```

**Réponse succès (200) :**

```json
{
  "success": true,
  "message": "Agent validé avec succès",
  "data": {
    "_id": "65f4a1b2c3d4e5f6a7b8c9d5",
    "userId": "65f4a1b2c3d4e5f6a7b8c9d6",
    "phoneNumber": "0600000004",
    "isValide": true,
    "createdAt": "2025-10-26T12:00:00.000Z",
    "updatedAt": "2025-10-26T13:00:00.000Z"
  }
}
```

**Réponse erreur (400) :**

```json
{
  "message": "Agent déjà validé"
}
```

---

### 2.7 Invalider Un Agent (Admin)

**Route :** `PUT /api/v1/agent/invalidate/:agentId`  
**Protection :** `auth` + `isAdmin`  
**Ce que ça fait :**

- Change isValide de true à false
- L'agent ne peut plus se connecter
- Utile en cas de non-respect des règles

**Headers :**

```
Authorization: Bearer <token>
```

**Params URL :**

- `agentId` : ID du profil agent

**Exemple :**

```
PUT /api/v1/agent/invalidate/65f4a1b2c3d4e5f6a7b8c9d5
```

**Réponse succès (200) :**

```json
{
  "success": true,
  "message": "Agent invalidé avec succès",
  "data": {
    "_id": "65f4a1b2c3d4e5f6a7b8c9d5",
    "isValide": false
  }
}
```

---

## 3. API CUSTOMER - PRÉFÉRENCES

### 3.1 Ajouter Une Préférence

**Route :** `POST /api/v1/customer/preferences`  
**Protection :** `auth`  
**Ce que ça fait :**

- Ajoute une préférence au profil du customer
- Vérifie que la préférence n'est pas déjà ajoutée

**Headers :**

```
Authorization: Bearer <token>
```

**Body (JSON) :**

```json
{
  "preferenceKeyId": "65f4a1b2c3d4e5f6a7b8c9d7"
}
```

**Réponse succès (200) :**

```json
{
  "message": "Préférence ajoutée",
  "data": {
    "_id": "65f4a1b2c3d4e5f6a7b8c9d8",
    "preferenceKey": ["65f4a1b2c3d4e5f6a7b8c9d7"]
  }
}
```

**Réponse erreur (400) :**

```json
{
  "message": "Préférence déjà ajoutée"
}
```

---

### 3.2 Retirer Une Préférence

**Route :** `DELETE /api/v1/customer/preferences/:preferenceKeyId`  
**Protection :** `auth`  
**Ce que ça fait :**

- Retire une préférence du profil du customer

**Headers :**

```
Authorization: Bearer <token>
```

**Params URL :**

- `preferenceKeyId` : ID de la préférence à retirer

**Exemple :**

```
DELETE /api/v1/customer/preferences/65f4a1b2c3d4e5f6a7b8c9d7
```

**Réponse succès (200) :**

```json
{
  "message": "Préférence retirée",
  "data": {
    "_id": "65f4a1b2c3d4e5f6a7b8c9d8",
    "preferenceKey": []
  }
}
```

---

### 3.3 Voir Mes Préférences

**Route :** `GET /api/v1/customer/preferences`  
**Protection :** `auth`  
**Ce que ça fait :**

- Retourne la liste des préférences du customer connecté
- Avec populate pour avoir les détails de chaque préférence

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse succès (200) :**

```json
[
  {
    "_id": "65f4a1b2c3d4e5f6a7b8c9d7",
    "name": "Piscine"
  },
  {
    "_id": "65f4a1b2c3d4e5f6a7b8c9d9",
    "name": "Jardin"
  }
]
```

---

## 4. API CUSTOMER - FAVORIS

### 4.1 Ajouter Un Favori

**Route :** `POST /api/v1/customer/favorites`  
**Protection :** `auth`  
**Ce que ça fait :**

- Ajoute une annonce aux favoris du customer
- Vérifie que l'annonce n'est pas déjà dans les favoris

**Headers :**

```
Authorization: Bearer <token>
```

**Body (JSON) :**

```json
{
  "announcementId": "65f4a1b2c3d4e5f6a7b8c9da"
}
```

**Réponse succès (201) :**

```json
{
  "message": "Ajouté aux favoris",
  "data": {
    "_id": "65f4a1b2c3d4e5f6a7b8c9db",
    "user": "65f4a1b2c3d4e5f6a7b8c9d0",
    "announcement": "65f4a1b2c3d4e5f6a7b8c9da",
    "createdAt": "2025-10-26T14:00:00.000Z"
  }
}
```

**Réponse erreur (400) :**

```json
{
  "message": "Déjà dans les favoris"
}
```

---

### 4.2 Retirer Un Favori

**Route :** `DELETE /api/v1/customer/favorites/:announcementId`  
**Protection :** `auth`  
**Ce que ça fait :**

- Retire une annonce des favoris du customer

**Headers :**

```
Authorization: Bearer <token>
```

**Params URL :**

- `announcementId` : ID de l'annonce à retirer

**Exemple :**

```
DELETE /api/v1/customer/favorites/65f4a1b2c3d4e5f6a7b8c9da
```

**Réponse succès (200) :**

```json
{
  "message": "Retiré des favoris"
}
```

---

### 4.3 Voir Mes Favoris

**Route :** `GET /api/v1/customer/favorites`  
**Protection :** `auth`  
**Ce que ça fait :**

- Retourne la liste des favoris du customer
- Avec populate pour avoir les détails de chaque annonce

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse succès (200) :**

```json
[
  {
    "_id": "65f4a1b2c3d4e5f6a7b8c9db",
    "user": "65f4a1b2c3d4e5f6a7b8c9d0",
    "announcement": {
      "_id": "65f4a1b2c3d4e5f6a7b8c9da",
      "title": "Belle villa avec piscine",
      "description": "Villa de 200m² avec piscine...",
      "price": 150000000,
      "district": "Cocody",
      "address": "Cocody Angré",
      "images": ["url1.jpg", "url2.jpg"]
    },
    "createdAt": "2025-10-26T14:00:00.000Z"
  }
]
```

---

## 5. API CUSTOMER - NOTIFICATIONS

### 5.1 Voir Mes Notifications

**Route :** `GET /api/v1/customer/notifications`  
**Protection :** `auth`  
**Ce que ça fait :**

- Retourne toutes les notifications du customer
- Triées par date (plus récentes en premier)
- Avec populate pour les détails de l'annonce

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse succès (200) :**

```json
[
  {
    "_id": "65f4a1b2c3d4e5f6a7b8c9dc",
    "user": "65f4a1b2c3d4e5f6a7b8c9d0",
    "title": "Visite virtuelle disponible",
    "message": "La visite virtuelle de 'Belle villa' est maintenant disponible",
    "action": "visite_virtuelle",
    "announcement": {
      "_id": "65f4a1b2c3d4e5f6a7b8c9da",
      "title": "Belle villa avec piscine"
    },
    "isRead": false,
    "emailSent": true,
    "createdAt": "2025-10-26T15:00:00.000Z"
  }
]
```

---

### 5.2 Marquer Notification Comme Lue

**Route :** `PUT /api/v1/customer/notifications/:notificationId/read`  
**Protection :** `auth`  
**Ce que ça fait :**

- Marque une notification comme lue (isRead=true)
- Vérifie que la notification appartient au customer connecté

**Headers :**

```
Authorization: Bearer <token>
```

**Params URL :**

- `notificationId` : ID de la notification

**Exemple :**

```
PUT /api/v1/customer/notifications/65f4a1b2c3d4e5f6a7b8c9dc/read
```

**Réponse succès (200) :**

```json
{
  "message": "Notification marquée comme lue"
}
```

**Réponse erreur (404) :**

```json
{
  "message": "Notification introuvable"
}
```

---

## 6. API ANNONCES CUSTOMER

### 6.1 Créer Une Annonce

**Route :** `POST /api/v1/my-announcements`  
**Protection :** `auth`  
**Ce que ça fait :**

- Débite 5000 du wallet du customer
- Crée une transaction wallet
- Crée l'annonce avec isValid=true
- L'annonce est publiée immédiatement

**Headers :**

```
Authorization: Bearer <token>
```

**Body (JSON) :**

```json
{
  "title": "Belle villa avec piscine",
  "description": "Villa de 200m² avec piscine dans un quartier calme...",
  "price": 150000000,
  "propertyType": "65f4a1b2c3d4e5f6a7b8c9dd",
  "district": "Cocody",
  "address": "Cocody Angré, près de la pharmacie",
  "numberOfRooms": 5,
  "numberOfBathrooms": 3,
  "surface": 200,
  "status": "à vendre",
  "images": ["image1.jpg", "image2.jpg", "image3.jpg"],
  "visitUrl": "N/A"
}
```

**Réponse succès (201) :**

```json
{
  "message": "Annonce créée avec succès",
  "data": {
    "_id": "65f4a1b2c3d4e5f6a7b8c9da",
    "title": "Belle villa avec piscine",
    "description": "Villa de 200m²...",
    "price": 150000000,
    "user": "65f4a1b2c3d4e5f6a7b8c9d0",
    "isValid": true,
    "createdAt": "2025-10-26T16:00:00.000Z"
  }
}
```

**Réponse erreur (400) :**

```json
{
  "message": "Solde insuffisant pour publier une annonce"
}
```

---

### 6.2 Voir Mes Annonces

**Route :** `GET /api/v1/my-announcements`  
**Protection :** `auth`  
**Ce que ça fait :**

- Retourne toutes les annonces du customer connecté

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse succès (200) :**

```json
[
  {
    "_id": "65f4a1b2c3d4e5f6a7b8c9da",
    "title": "Belle villa avec piscine",
    "description": "Villa de 200m²...",
    "price": 150000000,
    "district": "Cocody",
    "status": "à vendre",
    "images": ["image1.jpg"],
    "createdAt": "2025-10-26T16:00:00.000Z"
  }
]
```

---

### 6.3 Modifier Mon Annonce

**Route :** `PUT /api/v1/my-announcements/:id`  
**Protection :** `auth`  
**Ce que ça fait :**

- Modifie une annonce du customer
- Vérifie que l'annonce appartient au customer connecté

**Headers :**

```
Authorization: Bearer <token>
```

**Params URL :**

- `id` : ID de l'annonce à modifier

**Body (JSON) :**

```json
{
  "title": "Magnifique villa avec piscine",
  "price": 160000000
}
```

**Exemple :**

```
PUT /api/v1/my-announcements/65f4a1b2c3d4e5f6a7b8c9da
```

**Réponse succès (200) :**

```json
{
  "message": "Annonce modifiée avec succès"
}
```

**Réponse erreur (404) :**

```json
{
  "message": "Annonce introuvable"
}
```

---

### 6.4 Supprimer Mon Annonce

**Route :** `DELETE /api/v1/my-announcements/:id`  
**Protection :** `auth`  
**Ce que ça fait :**

- Supprime une annonce du customer
- Vérifie que l'annonce appartient au customer connecté

**Headers :**

```
Authorization: Bearer <token>
```

**Params URL :**

- `id` : ID de l'annonce à supprimer

**Exemple :**

```
DELETE /api/v1/my-announcements/65f4a1b2c3d4e5f6a7b8c9da
```

**Réponse succès (200) :**

```json
{
  "message": "Annonce supprimée avec succès"
}
```

---

## 7. API ANNONCES PUBLIQUES

### 7.1 Rechercher Des Annonces

**Route :** `GET /api/v1/announcements/search`  
**Protection :** Aucune (publique)  
**Ce que ça fait :**

- Recherche des annonces selon des critères
- Retourne uniquement les annonces valides (isValid=true)

**Query Params :**

- `district` (optionnel) : Quartier recherché
- `status` (optionnel) : "à vendre" ou "à louer"
- `price` (optionnel) : Prix maximum

**Exemple :**

```
GET /api/v1/announcements/search?district=Cocody&status=à vendre&price=200000000
```

**Réponse succès (200) :**

```json
[
  {
    "_id": "65f4a1b2c3d4e5f6a7b8c9da",
    "title": "Belle villa avec piscine",
    "description": "Villa de 200m²...",
    "price": 150000000,
    "district": "Cocody",
    "status": "à vendre",
    "images": ["image1.jpg"],
    "numberOfRooms": 5,
    "surface": 200
  }
]
```

---

### 7.2 Voir Toutes Les Annonces

**Route :** `GET /api/v1/announcements`  
**Protection :** Aucune (publique)  
**Ce que ça fait :**

- Retourne toutes les annonces valides
- Sans filtre

**Réponse succès (200) :**

```json
[
  {
    "_id": "65f4a1b2c3d4e5f6a7b8c9da",
    "title": "Belle villa avec piscine",
    "price": 150000000,
    "district": "Cocody",
    "images": ["image1.jpg"]
  }
]
```

---

### 7.3 Voir Détails D'Une Annonce

**Route :** `GET /api/v1/announcements/:id`  
**Protection :** Aucune (publique)  
**Ce que ça fait :**

- Retourne tous les détails d'une annonce spécifique

**Params URL :**

- `id` : ID de l'annonce

**Exemple :**

```
GET /api/v1/announcements/65f4a1b2c3d4e5f6a7b8c9da
```

**Réponse succès (200) :**

```json
{
  "_id": "65f4a1b2c3d4e5f6a7b8c9da",
  "title": "Belle villa avec piscine",
  "description": "Villa de 200m² avec piscine dans un quartier calme...",
  "price": 150000000,
  "propertyType": "65f4a1b2c3d4e5f6a7b8c9dd",
  "district": "Cocody",
  "address": "Cocody Angré, près de la pharmacie",
  "numberOfRooms": 5,
  "numberOfBathrooms": 3,
  "surface": 200,
  "status": "à vendre",
  "images": ["image1.jpg", "image2.jpg", "image3.jpg"],
  "visitUrl": "N/A",
  "isValid": true,
  "createdAt": "2025-10-26T16:00:00.000Z"
}
```

---

## 8. API PAIEMENTS

### 8.1 Payer Visite Virtuelle

**Route :** `POST /api/v1/payment/virtual-visit`  
**Protection :** `auth`  
**Ce que ça fait :**

- Vérifie que la visite virtuelle existe
- Vérifie le solde du wallet (2000 requis)
- Débite 2000 du wallet
- Crée une transaction wallet
- Retourne l'URL de la visite virtuelle

**Headers :**

```
Authorization: Bearer <token>
```

**Body (JSON) :**

```json
{
  "announcementId": "65f4a1b2c3d4e5f6a7b8c9da"
}
```

**Réponse succès (200) :**

```json
{
  "message": "Paiement effectué avec succès",
  "visitUrl": "https://matterport.com/show/?m=ABC123"
}
```

**Réponse erreur (400) :**

```json
{
  "message": "Solde insuffisant pour accéder à la visite virtuelle",
  "required": 2000,
  "current": 1500
}
```

---

### 8.2 Payer Visite Sur Site

**Route :** `POST /api/v1/payment/on-site-visit`  
**Protection :** `auth`  
**Ce que ça fait :**

- Vérifie le solde du wallet (1000 requis)
- Débite 1000 du wallet
- Crée une transaction wallet
- Enregistre la demande de visite (status: en attente)
- Récupère tous les agents validés
- Envoie une notification à chaque agent
- Retourne un message de confirmation

**Headers :**

```
Authorization: Bearer <token>
```

**Body (JSON) :**

```json
{
  "announcementId": "65f4a1b2c3d4e5f6a7b8c9da"
}
```

**Réponse succès (200) :**

```json
{
  "message": "Demande envoyée. En attente de confirmation"
}
```

---

### 8.3 Payer Création Visite Virtuelle

**Route :** `POST /api/v1/payment/create-virtual-tour`  
**Protection :** `auth`  
**Ce que ça fait :**

- Vérifie que l'annonce appartient au customer
- Vérifie le solde du wallet (10000 requis)
- Débite 10000 du wallet
- Crée une transaction wallet
- Crée une notification admin (API externe à intégrer)

**Headers :**

```
Authorization: Bearer <token>
```

**Body (JSON) :**

```json
{
  "announcementId": "65f4a1b2c3d4e5f6a7b8c9da"
}
```

**Réponse succès (200) :**

```json
{
  "message": "Paiement effectué. La visite virtuelle sera créée prochainement"
}
```

---

### 8.4 Recharger Wallet

**Route :** `POST /api/v1/payment/wallet/recharge`  
**Protection :** `auth`  
**Ce que ça fait :**

- Crée une demande de paiement externe (Orange Money, MTN, Wave)
- Enregistre le paiement dans la table Payment
- Note : L'intégration avec les agrégateurs est à faire plus tard

**Headers :**

```
Authorization: Bearer <token>
```

**Body (JSON) :**

```json
{
  "amount": 50000,
  "paymentMethod": "Orange Money",
  "amountPaid": 50000
}
```

**Réponse succès (200) :**

```json
{
  "message": "Demande de recharge enregistrée. Votre wallet sera crédité après validation du paiement."
}
```

---

### 8.5 Consulter Solde Wallet

**Route :** `GET /api/v1/payment/wallet`  
**Protection :** `auth`  
**Ce que ça fait :**

- Retourne le solde actuel du wallet du customer

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse succès (200) :**

```json
{
  "wallet": {
    "_id": "65f4a1b2c3d4e5f6a7b8c9d2",
    "balance": 45000
  }
}
```

---

## 9. API TYPES DE PROPRIÉTÉ

### 9.1 Voir Tous Les Types

**Route :** `GET /api/v1/property`  
**Protection :** Aucune (publique)  
**Ce que ça fait :**

- Retourne la liste de tous les types de propriété

**Réponse succès (200) :**

```json
[
  {
    "_id": "65f4a1b2c3d4e5f6a7b8c9dd",
    "name": "Villa",
    "createdAt": "2025-10-20T10:00:00.000Z"
  },
  {
    "_id": "65f4a1b2c3d4e5f6a7b8c9de",
    "name": "Appartement",
    "createdAt": "2025-10-20T10:05:00.000Z"
  }
]
```

---

### 9.2 Voir Un Type

**Route :** `GET /api/v1/property/:id`  
**Protection :** Aucune (publique)  
**Ce que ça fait :**

- Retourne les détails d'un type de propriété

**Params URL :**

- `id` : ID du type de propriété

**Exemple :**

```
GET /api/v1/property/65f4a1b2c3d4e5f6a7b8c9dd
```

**Réponse succès (200) :**

```json
{
  "_id": "65f4a1b2c3d4e5f6a7b8c9dd",
  "name": "Villa",
  "createdAt": "2025-10-20T10:00:00.000Z",
  "updatedAt": "2025-10-20T10:00:00.000Z"
}
```

---

### 9.3 Créer Un Type (Admin)

**Route :** `POST /api/v1/property`  
**Protection :** `auth` + `isAdmin`  
**Ce que ça fait :**

- Crée un nouveau type de propriété
- Vérifie que le nom n'existe pas déjà

**Headers :**

```
Authorization: Bearer <token>
```

**Body (JSON) :**

```json
{
  "name": "Studio"
}
```

**Réponse succès (201) :**

```json
{
  "_id": "65f4a1b2c3d4e5f6a7b8c9df",
  "name": "Studio",
  "createdAt": "2025-10-26T17:00:00.000Z"
}
```

**Réponse erreur (400) :**

```json
{
  "message": "Ce type de bien existe déjà"
}
```

---

### 9.4 Modifier Un Type (Admin)

**Route :** `PUT /api/v1/property/:id`  
**Protection :** `auth` + `isAdmin`  
**Ce que ça fait :**

- Modifie un type de propriété existant

**Headers :**

```
Authorization: Bearer <token>
```

**Params URL :**

- `id` : ID du type de propriété

**Body (JSON) :**

```json
{
  "name": "Studio meublé"
}
```

**Exemple :**

```
PUT /api/v1/property/65f4a1b2c3d4e5f6a7b8c9df
```

**Réponse succès (200) :**

```json
{
  "message": "Type de bien modifié avec succès"
}
```

---

### 9.5 Supprimer Un Type (Admin)

**Route :** `DELETE /api/v1/property/:id`  
**Protection :** `auth` + `isAdmin`  
**Ce que ça fait :**

- Supprime un type de propriété

**Headers :**

```
Authorization: Bearer <token>
```

**Params URL :**

- `id` : ID du type de propriété

**Exemple :**

```
DELETE /api/v1/property/65f4a1b2c3d4e5f6a7b8c9df
```

**Réponse succès (200) :**

```json
{
  "message": "Type de propriété supprimé"
}
```

---

## 10. API PRÉFÉRENCES

### 10.1 Voir Toutes Les Préférences

**Route :** `GET /api/v1/preferences`  
**Protection :** Aucune (publique)  
**Ce que ça fait :**

- Retourne la liste de toutes les préférences disponibles

**Réponse succès (200) :**

```json
[
  {
    "_id": "65f4a1b2c3d4e5f6a7b8c9d7",
    "name": "Piscine"
  },
  {
    "_id": "65f4a1b2c3d4e5f6a7b8c9d9",
    "name": "Jardin"
  },
  {
    "_id": "65f4a1b2c3d4e5f6a7b8c9e0",
    "name": "Garage"
  }
]
```

---

### 10.2 Créer Une Préférence (Admin)

**Route :** `POST /api/v1/preferences`  
**Protection :** `auth` + `isAdmin`  
**Ce que ça fait :**

- Crée une nouvelle préférence

**Headers :**

```
Authorization: Bearer <token>
```

**Body (JSON) :**

```json
{
  "name": "Terrasse"
}
```

**Réponse succès (201) :**

```json
{
  "message": "Préférence créée",
  "data": {
    "_id": "65f4a1b2c3d4e5f6a7b8c9e1",
    "name": "Terrasse",
    "createdAt": "2025-10-26T18:00:00.000Z"
  }
}
```

---

### 10.3 Modifier Une Préférence (Admin)

**Route :** `PUT /api/v1/preferences/:id`  
**Protection :** `auth` + `isAdmin`  
**Ce que ça fait :**

- Modifie une préférence existante

**Headers :**

```
Authorization: Bearer <token>
```

**Params URL :**

- `id` : ID de la préférence

**Body (JSON) :**

```json
{
  "name": "Grande terrasse"
}
```

**Exemple :**

```
PUT /api/v1/preferences/65f4a1b2c3d4e5f6a7b8c9e1
```

**Réponse succès (200) :**

```json
{
  "message": "Préférence modifiée avec succès"
}
```

---

### 10.4 Supprimer Une Préférence (Admin)

**Route :** `DELETE /api/v1/preferences/:id`  
**Protection :** `auth` + `isAdmin`  
**Ce que ça fait :**

- Supprime une préférence

**Headers :**

```
Authorization: Bearer <token>
```

**Params URL :**

- `id` : ID de la préférence

**Exemple :**

```
DELETE /api/v1/preferences/65f4a1b2c3d4e5f6a7b8c9e1
```

**Réponse succès (200) :**

```json
{
  "message": "Préférence supprimée avec succès"
}
```

---

## 📊 RÉCAPITULATIF

### Par Catégorie

| Catégorie                | Nombre d'API | Public | Protégé | Admin Only |
| ------------------------ | ------------ | ------ | ------- | ---------- |
| Authentification         | 3            | 3      | 0       | 0          |
| Agent                    | 7            | 1      | 1       | 5          |
| Customer - Préférences   | 3            | 0      | 3       | 0          |
| Customer - Favoris       | 3            | 0      | 3       | 0          |
| Customer - Notifications | 2            | 0      | 2       | 0          |
| Annonces Customer        | 4            | 0      | 4       | 0          |
| Annonces Publiques       | 3            | 3      | 0       | 0          |
| Paiements                | 5            | 0      | 5       | 0          |
| Types de Propriété       | 5            | 2      | 0       | 3          |
| Préférences              | 4            | 1      | 0       | 3          |
| **TOTAL**                | **37**       | **10** | **16**  | **11**     |

---

## 🧪 CONSEILS POUR LES TESTS

### 1. Ordre des tests recommandé

1. **Authentification**

   - Inscription customer
   - Connexion customer
   - Inscription agent
   - Tentative connexion agent non validé (doit échouer)

2. **Admin**

   - Créer types de propriété
   - Créer préférences
   - Valider un agent

3. **Customer**

   - Ajouter préférences
   - Créer annonce (vérifie wallet)
   - Rechercher annonces
   - Ajouter favoris
   - Payer visite virtuelle
   - Payer visite sur site

4. **Agent**
   - Connexion agent (maintenant validé)
   - Voir profil
   - Recevoir notifications (après demandes de visite)

### 2. Variables d'environnement nécessaires

```env
TOKEN_SECRET=your_secret_key_here
MONGODB_URI=mongodb://localhost:27017/immo_db
PORT=3000
```

### 3. Outils recommandés

- **Postman** ou **Insomnia** : Pour tester les API
- **MongoDB Compass** : Pour voir la base de données
- **Thunder Client** (VS Code) : Extension pour tests rapides

---

**Document généré le 26 octobre 2025**

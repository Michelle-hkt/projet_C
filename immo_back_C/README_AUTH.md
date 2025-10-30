# 🔐 Système d'Authentification

## 📋 Vue d'ensemble

Système d'authentification complet pour la plateforme immobilière avec inscription, connexion et gestion des rôles.

---

## ⚙️ Variables d'environnement

Ajoutez dans votre fichier `.env` :

```env
JWT_SECRET=votre_secret_jwt_tres_long_et_securise
JWT_EXPIRES_IN=7d
DB_URI=mongodb://localhost:27017
DB_NAME=immo_platform
PORT=3000
```

---

## 🚀 Routes disponibles

### 1. Inscription (Register)

**Endpoint :** `POST /api/v1/auth/register`

**Body :**

```json
{
  "firstName": "Marie",
  "lastName": "Dupont",
  "email": "marie@example.com",
  "password": "password123",
  "phoneNumber": "0712345678",
  "whatsappNumber": "0598765432"
}
```

**Réponse (201) :**

```json
{
  "success": true,
  "message": "Inscription réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "...",
      "firstName": "Marie",
      "lastName": "Dupont",
      "email": "marie@example.com",
      "role": "customer"
    },
    "customer": { ... },
    "wallet": { ... }
  }
}
```

---

### 2. Connexion (Login)

**Endpoint :** `POST /api/v1/auth/login`

**Body :**

```json
{
  "email": "marie@example.com",
  "password": "password123"
}
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "firstName": "Marie",
    "lastName": "Dupont",
    "email": "marie@example.com",
    "role": "customer"
  }
}
```

---

### 3. Déconnexion (Logout)

**Endpoint :** `POST /api/v1/auth/logout`

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

## 🛡️ Protection des routes

### Utilisation du middleware `protect`

```javascript
import { protect } from "../middlewares/auth.middleware.js";

// Route protégée (nécessite d'être connecté)
router.get("/profile", protect, getProfile);
```

### Utilisation du middleware `authorize`

```javascript
import { protect, authorize } from "../middlewares/auth.middleware.js";

// Route admin uniquement
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

// Route agent et admin
router.post(
  "/announcements",
  protect,
  authorize("agent", "admin"),
  createAnnouncement
);
```

---

## 📝 Structure des fichiers

```
src/API/
├── utils/
│   └── jwt.util.js              # Génération et vérification JWT
├── services/
│   └── auth.service.js          # Fonctions simples (hash, find, create)
├── controllers/
│   └── auth.controller.js       # Logique métier complète
├── middlewares/
│   ├── validate.middleware.js   # Validation des données
│   └── auth.middleware.js       # Protection des routes
├── validations/
│   └── auth.validation.js       # Schémas de validation Joi
└── routers/
    ├── auth.router.js           # Routes d'authentification
    └── index.js                 # Routeur principal
```

---

## 🧪 Tester avec Postman

### 1. Inscription

```
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "password123",
  "phoneNumber": "0712345678"
}
```

### 2. Connexion

```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Route protégée

```
GET http://localhost:3000/api/v1/votre-route
Authorization: Bearer <votre_token>
```

---

## ✅ Fonctionnalités

- ✅ Inscription automatique (User + Customer + Wallet)
- ✅ Connexion sécurisée avec JWT
- ✅ Hashage bcrypt (10 rounds)
- ✅ Validation des données avec Joi
- ✅ Protection des routes
- ✅ Gestion des rôles (customer, agent, admin)
- ✅ Middleware d'autorisation
- ✅ Messages d'erreur clairs

---

## 🎯 Rôles par défaut

- **customer** : Utilisateur standard (inscription directe)
- **agent** : Agent immobilier (validé par admin)
- **admin** : Administrateur (tous les droits)

Le système d'authentification est prêt à l'emploi ! 🎉

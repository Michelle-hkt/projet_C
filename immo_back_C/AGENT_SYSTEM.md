# SYSTÈME DES AGENTS IMMOBILIERS

## Vue d'ensemble

Le système d'agents permet aux professionnels de l'immobilier de s'inscrire sur la plateforme et d'accéder aux fonctionnalités réservées aux agents après validation par un administrateur.

## Différences avec les Customers

| Caractéristique | Customer                | Agent                       |
| --------------- | ----------------------- | --------------------------- |
| Inscription     | Directe et automatique  | Nécessite validation admin  |
| Accès immédiat  | ✅ Oui                  | ❌ Non (attente validation) |
| Wallet          | ✅ Créé automatiquement | ❌ Pas de wallet            |
| Processus       | Simple                  | Validation en 2 étapes      |

## Architecture

### 1. Modèle Agent (`agent.model.js`)

```javascript
{
  userId: ObjectId,      // Référence vers User
  phoneNumber: String,   // Numéro de téléphone
  isValide: Boolean,     // État de validation (défaut: false)
  timestamps: true       // createdAt, updatedAt
}
```

### 2. Flux d'inscription

```
1. Agent soumet formulaire d'inscription
   ↓
2. Création User + Agent (isValide=false)
   ↓
3. Agent NE PEUT PAS se connecter (connexion bloquée)
   ↓
4. Admin valide l'agent (isValide=true)
   ↓
5. Agent peut maintenant se connecter et accéder aux fonctionnalités
```

**⚠️ IMPORTANT** : Contrairement aux customers, les agents non validés ne peuvent **PAS du tout se connecter**. La connexion est bloquée au niveau du `loginService`.

## API Routes

### Routes Publiques

#### 1. Inscription Agent

```http
POST /api/v1/agent/register
Content-Type: application/json

{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@agence.com",
  "password": "motdepasse123",
  "phoneNumber": "+33612345678"
}
```

**Réponse (201):**

```json
{
  "success": true,
  "message": "Inscription réussie. Votre compte est en attente de validation par un administrateur. Vous pourrez vous connecter une fois votre compte validé.",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@agence.com",
      "role": "agent",
      "isActive": true
    },
    "agent": {
      "id": "507f1f77bcf86cd799439012",
      "phoneNumber": "+33612345678",
      "isValide": false
    }
  }
}
```

**⚠️ Note importante** : Pas de token retourné car l'agent ne peut pas se connecter avant validation.

### Routes Agent (Authentification requise)

#### 2. Voir son profil

```http
GET /api/v1/agent/profile
Authorization: Bearer <token>
```

**Réponse (200):**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@agence.com",
      "isActive": true
    },
    "phoneNumber": "+33612345678",
    "isValide": false,
    "createdAt": "2025-10-26T10:00:00.000Z",
    "updatedAt": "2025-10-26T10:00:00.000Z"
  }
}
```

### Routes Admin (Admin uniquement)

#### 3. Liste de tous les agents

```http
GET /api/v1/agent/all
Authorization: Bearer <admin_token>
```

#### 4. Liste des agents en attente

```http
GET /api/v1/agent/pending
Authorization: Bearer <admin_token>
```

#### 5. Liste des agents validés

```http
GET /api/v1/agent/validated
Authorization: Bearer <admin_token>
```

#### 6. Valider un agent

```http
PUT /api/v1/agent/validate/:agentId
Authorization: Bearer <admin_token>
```

**Réponse (200):**

```json
{
  "success": true,
  "message": "Agent validé avec succès",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "phoneNumber": "+33612345678",
    "isValide": true,
    "createdAt": "2025-10-26T10:00:00.000Z",
    "updatedAt": "2025-10-26T10:30:00.000Z"
  }
}
```

#### 7. Invalider un agent

```http
PUT /api/v1/agent/invalidate/:agentId
Authorization: Bearer <admin_token>
```

## Middlewares

### 1. `isAgent`

Vérifie que l'utilisateur a le rôle "agent"

```javascript
router.get("/profile", auth, isAgent, getMyProfile);
```

### 2. `isValidAgent`

Vérifie que l'agent est validé (isValide=true)

```javascript
router.post("/announcement", auth, isAgent, isValidAgent, createAnnouncement);
```

**⚠️ Important:** Ce middleware doit être utilisé sur TOUTES les routes réservées aux agents validés.

### 3. `isAdmin`

Vérifie que l'utilisateur a le rôle "admin"

```javascript
router.put("/validate/:id", auth, isAdmin, validateAgent);
```

## Gestion des erreurs

### Tentative de connexion - Agent non validé

**Route concernée** : `POST /api/v1/auth/login`

Lorsqu'un agent non validé tente de se connecter, la connexion est **bloquée** au niveau du `loginService` :

```json
{
  "success": false,
  "message": "Votre compte agent est en attente de validation par un administrateur. Vous ne pouvez pas vous connecter pour le moment."
}
```

### Agent non validé tentant d'accéder à une fonctionnalité

**Note** : Cette erreur ne devrait jamais apparaître car l'agent ne peut pas se connecter. Mais si le middleware `isValidAgent` détecte un problème :

```json
{
  "success": false,
  "message": "Accès refusé. Votre compte agent est en attente de validation par un administrateur."
}
```

### Email déjà utilisé

```json
{
  "success": false,
  "message": "Cet email est déjà utilisé"
}
```

### Accès admin requis

```json
{
  "success": false,
  "message": "Accès refusé. Cette action est réservée aux administrateurs."
}
```

## Utilisation pratique

### Pour protéger une route agent

```javascript
// Route accessible uniquement aux agents VALIDÉS
router.post(
  "/create-announcement",
  auth, // 1. Vérifier l'authentification
  isAgent, // 2. Vérifier le rôle agent
  isValidAgent, // 3. Vérifier la validation
  createAnnouncement // 4. Exécuter l'action
);

// Route accessible à tous les agents (validés ou non)
router.get(
  "/profile",
  auth, // 1. Vérifier l'authentification
  isAgent, // 2. Vérifier le rôle agent
  getMyProfile // 3. Exécuter l'action
);
```

### Pour protéger une route admin

```javascript
router.put(
  "/validate/:agentId",
  auth, // 1. Vérifier l'authentification
  isAdmin, // 2. Vérifier le rôle admin
  validateAgent // 3. Exécuter l'action
);
```

## Fichiers créés

```
src/API/
├── models/
│   └── agent.model.js                  # Modèle Agent
├── services/
│   └── agent.service.js                # Service d'inscription
├── controllers/
│   └── agent.controller.js             # Contrôleur des agents
├── middlewares/
│   └── role.middleware.js              # Middlewares de rôles
├── routers/
│   └── agent.router.js                 # Routes des agents
└── validations/
    └── agent.validation.js             # Validation inscription
```

## Scénarios d'utilisation

### Scénario 1: Inscription d'un nouvel agent

1. Agent remplit le formulaire d'inscription
2. Backend crée User + Agent avec `isValide=false`
3. Agent reçoit un message de confirmation (pas de token)
4. Agent tente de se connecter → **Connexion refusée**
5. Message: "Votre compte est en attente de validation..."

### Scénario 2: Validation par admin

1. Admin se connecte avec ses identifiants
2. Admin accède à `/agent/pending`
3. Admin voit la liste des agents en attente
4. Admin valide un agent via `/agent/validate/:agentId`
5. Agent reçoit une notification (à implémenter)
6. **Agent peut maintenant se connecter** via `/auth/login`
7. Agent accède à toutes les fonctionnalités

### Scénario 3: Invalidation d'un agent

1. Admin détecte un comportement inapproprié
2. Admin invalide l'agent via `/agent/invalidate/:agentId`
3. Agent perd l'accès immédiatement
4. Si l'agent tente de se connecter à nouveau → **Connexion refusée**
5. Message: "Votre compte est en attente de validation..."

## Mémoire: [[memory:10343022]]

Les opérations utilisent la syntaxe `.then()` et `.catch()` conformément aux préférences du projet.

## Prochaines étapes

1. ✅ Modèle Agent créé
2. ✅ Service d'inscription créé
3. ✅ Contrôleur créé
4. ✅ Middlewares créés
5. ✅ Routes créées
6. 🔲 Intégrer le middleware `isValidAgent` dans les routes des annonces
7. 🔲 Créer le tableau de bord admin pour la gestion des agents
8. 🔲 Ajouter des notifications pour informer les agents de leur validation

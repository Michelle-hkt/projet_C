# BLOCAGE DE CONNEXION DES AGENTS NON VALIDÉS

## Contexte

Les agents immobiliers doivent être validés par un administrateur avant de pouvoir utiliser la plateforme. Pour renforcer la sécurité, les agents non validés **ne peuvent pas du tout se connecter** à la plateforme.

## Différence avec les Customers

| Aspect | Customer | Agent |
|--------|----------|-------|
| Inscription | Automatique et immédiate | Requiert validation admin |
| Connexion après inscription | ✅ Immédiate | ❌ Bloquée jusqu'à validation |
| Token lors de l'inscription | ✅ Retourné | ❌ Non retourné |
| Accès aux fonctionnalités | ✅ Immédiat | ❌ Après validation uniquement |

## Architecture de sécurité

### Niveau 1 : Blocage à l'inscription

**Fichier** : `agent.service.js`

```javascript
export const registerAgentService = async (agentData) => {
  // ... création User et Agent avec isValide=false ...
  
  // NE PAS générer de token car l'agent ne peut pas se connecter avant validation
  
  return {
    // Pas de token dans la réponse
    user: { ... },
    agent: { isValide: false },
    message: "Inscription réussie. Votre compte est en attente de validation par un administrateur. Vous pourrez vous connecter une fois votre compte validé."
  };
};
```

**Impact** :
- ❌ Pas de token retourné
- ❌ Agent ne peut pas se connecter automatiquement après inscription
- ✅ Message clair sur l'attente de validation

### Niveau 2 : Blocage à la connexion

**Fichier** : `auth.service.js` - fonction `loginService`

```javascript
export const loginService = async (userInfos) => {
  const { email, password } = userInfos;

  const user = await User.findOne({ email }).populate("role");
  // ... vérifications standard ...

  // VÉRIFICATION SPÉCIALE POUR LES AGENTS
  if (user.role.name === "agent") {
    const agent = await Agent.findOne({ userId: user._id });
    
    if (!agent) {
      throw new Error("Profil agent introuvable");
    }

    // BLOQUER LA CONNEXION SI NON VALIDÉ
    if (!agent.isValide) {
      throw new Error(
        "Votre compte agent est en attente de validation par un administrateur. Vous ne pouvez pas vous connecter pour le moment."
      );
    }
  }

  // Si on arrive ici, l'agent est validé ou c'est un customer/admin
  const token = generateToken(user._id);
  return { token, user: { ... } };
};
```

**Impact** :
- ✅ Vérification automatique à chaque tentative de connexion
- ✅ Message d'erreur explicite
- ✅ Aucun token généré pour les agents non validés
- ✅ Sécurité renforcée

### Niveau 3 : Protection des routes (redondant mais sécurisé)

**Fichier** : `role.middleware.js` - middleware `isValidAgent`

```javascript
export const isValidAgent = async (req, res, next) => {
  const userId = req.auth.userId;
  const agent = await Agent.findOne({ userId });

  if (!agent || !agent.isValide) {
    return res.status(403).json({
      success: false,
      message: "Accès refusé. Votre compte agent est en attente de validation par un administrateur."
    });
  }

  next();
};
```

**Impact** :
- ✅ Protection supplémentaire au niveau des routes
- ✅ Ne devrait jamais être déclenché si Niveau 2 fonctionne
- ✅ Sécurité en profondeur (defense in depth)

## Flux de connexion

### Flux Agent NON validé (isValide=false)

```
1. Agent tente de se connecter avec email/password
   ↓
2. Vérification email/password → ✅ OK
   ↓
3. Vérification isActive → ✅ OK
   ↓
4. Détection rôle "agent" → Vérification supplémentaire
   ↓
5. Recherche dans table Agent
   ↓
6. Vérification isValide → ❌ FALSE
   ↓
7. BLOCAGE : Erreur 401
   Message: "Votre compte agent est en attente de validation..."
   ↓
8. Pas de token généré ❌
```

### Flux Agent VALIDÉ (isValide=true)

```
1. Agent tente de se connecter avec email/password
   ↓
2. Vérification email/password → ✅ OK
   ↓
3. Vérification isActive → ✅ OK
   ↓
4. Détection rôle "agent" → Vérification supplémentaire
   ↓
5. Recherche dans table Agent
   ↓
6. Vérification isValide → ✅ TRUE
   ↓
7. SUCCÈS : Génération du token
   ↓
8. Agent connecté ✅
```

## Cas d'usage

### Cas 1 : Inscription d'un nouvel agent

**Requête** :
```http
POST /api/v1/agent/register
{
  "firstName": "Marie",
  "lastName": "Dupont",
  "email": "marie@agence.com",
  "password": "motdepasse123",
  "phoneNumber": "0612345678"
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Inscription réussie. Votre compte est en attente de validation par un administrateur. Vous pourrez vous connecter une fois votre compte validé.",
  "data": {
    "user": { ... },
    "agent": { "isValide": false }
  }
}
```

**⚠️ Note** : Pas de token dans la réponse !

### Cas 2 : Tentative de connexion - Agent non validé

**Requête** :
```http
POST /api/v1/auth/login
{
  "email": "marie@agence.com",
  "password": "motdepasse123"
}
```

**Réponse (401)** :
```json
{
  "success": false,
  "message": "Votre compte agent est en attente de validation par un administrateur. Vous ne pouvez pas vous connecter pour le moment."
}
```

### Cas 3 : Admin valide l'agent

**Requête** :
```http
PUT /api/v1/agent/validate/507f1f77bcf86cd799439012
Authorization: Bearer <admin_token>
```

**Réponse** :
```json
{
  "success": true,
  "message": "Agent validé avec succès",
  "data": {
    "isValide": true
  }
}
```

### Cas 4 : Connexion réussie - Agent validé

**Requête** :
```http
POST /api/v1/auth/login
{
  "email": "marie@agence.com",
  "password": "motdepasse123"
}
```

**Réponse (200)** :
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "Marie",
      "lastName": "Dupont",
      "email": "marie@agence.com",
      "role": "agent",
      "isActive": true
    }
  }
}
```

### Cas 5 : Admin invalide un agent

**Requête** :
```http
PUT /api/v1/agent/invalidate/507f1f77bcf86cd799439012
Authorization: Bearer <admin_token>
```

**Impact** :
- Agent déconnecté (si connecté)
- Ne peut plus se reconnecter jusqu'à revalidation

## Tests recommandés

### Test 1 : Inscription agent
```
1. S'inscrire comme agent
2. Vérifier qu'aucun token n'est retourné
3. Vérifier le message d'attente de validation
```

### Test 2 : Connexion agent non validé
```
1. Créer un agent avec isValide=false
2. Tenter de se connecter
3. Vérifier l'erreur 401
4. Vérifier le message explicite
```

### Test 3 : Validation puis connexion
```
1. Créer un agent avec isValide=false
2. Admin valide l'agent
3. Agent se connecte
4. Vérifier la connexion réussie et le token
```

### Test 4 : Invalidation puis tentative de connexion
```
1. Créer un agent validé (isValide=true)
2. Admin invalide l'agent
3. Agent tente de se connecter
4. Vérifier l'erreur 401
```

## Avantages de cette approche

✅ **Sécurité renforcée** : Triple niveau de protection

✅ **Expérience claire** : Messages explicites pour l'agent

✅ **Contrôle admin** : Validation obligatoire avant tout accès

✅ **Prévention d'abus** : Impossible de contourner la validation

✅ **Auditabilité** : Historique complet dans la table Agent

## Fichiers modifiés

```
src/API/
├── services/
│   ├── auth.service.js        ← Ajout vérification agent validé
│   └── agent.service.js       ← Suppression du token à l'inscription
├── controllers/
│   └── agent.controller.js    ← Mise à jour réponse inscription
└── middlewares/
    └── role.middleware.js     ← Protection supplémentaire (existant)
```

## Comparaison avant/après

### AVANT (❌ Moins sécurisé)

1. Agent s'inscrit
2. Agent reçoit un token
3. Agent peut se connecter
4. Agent accède au profil mais pas aux fonctionnalités
5. Middleware bloque l'accès aux fonctionnalités

**Problème** : Agent peut se connecter et explorer l'interface même sans validation

### APRÈS (✅ Plus sécurisé)

1. Agent s'inscrit
2. Agent ne reçoit PAS de token
3. Agent ne peut PAS se connecter
4. Admin valide l'agent
5. Agent peut maintenant se connecter
6. Agent accède à tout

**Avantage** : Aucun accès possible avant validation admin

## Notifications à implémenter

### À l'inscription
- Email à l'agent : "Compte créé, en attente de validation"
- Notification aux admins : "Nouvelle demande d'agent"

### Après validation
- Email à l'agent : "Compte validé, vous pouvez vous connecter"
- Notification à l'agent dans l'app (s'il se connecte)

### Après invalidation
- Email à l'agent : "Compte suspendu"

## Prochaines étapes

1. ✅ Blocage de connexion implémenté
2. 🔲 Ajouter système de notifications par email
3. 🔲 Créer dashboard admin pour gestion des validations
4. 🔲 Ajouter logs d'audit pour les validations/invalidations
5. 🔲 Tests unitaires et d'intégration


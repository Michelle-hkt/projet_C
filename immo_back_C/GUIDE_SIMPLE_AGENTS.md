# GUIDE SIMPLE - SYSTÈME D'AGENTS

## 📚 Comprendre le système

### Qu'est-ce qu'un agent ?

Un **agent immobilier** est un utilisateur qui peut accepter des missions de visite sur site. Contrairement aux customers qui s'inscrivent et se connectent directement, les agents doivent être **validés par un admin** avant de pouvoir se connecter.

### Le flux simple

```
1. Agent s'inscrit (formulaire)
   → Compte créé avec isValide=false
   → Agent ne peut PAS se connecter

2. Admin valide l'agent
   → isValide passe à true

3. Agent peut maintenant se connecter
   → Accès à toutes les fonctionnalités
   → Peut accepter des missions
```

## 📁 Les fichiers créés

### 1. Le modèle (`agent.model.js`)

C'est la table dans la base de données qui stocke les agents.

```javascript
{
  userId: ObjectId,        // Lien vers la table User
  phoneNumber: String,     // Numéro de téléphone de l'agent
  isValide: Boolean,       // true = validé, false = en attente
}
```

**Exemple** :

```
- Agent 1 : Marie Dupont, isValide=false (en attente)
- Agent 2 : Jean Martin, isValide=true (validé)
```

### 2. Le service (`agent.service.js`)

Ce fichier contient une fonction pour créer un compte agent.

**Ce qu'elle fait** :

1. Vérifie que l'email n'existe pas déjà
2. Hashe le mot de passe (sécurité)
3. Crée l'utilisateur dans la table User
4. Crée le profil agent dans la table Agent avec isValide=false
5. Retourne les infos (sans token car il ne peut pas se connecter)

### 3. Le contrôleur (`agent.controller.js`)

Ce fichier contient **7 fonctions** :

#### Pour tout le monde :

- `registerAgent` : Inscription d'un agent

#### Pour les agents :

- `getMyProfile` : Voir son profil

#### Pour les admins :

- `validateAgent` : Valider un agent (isValide → true)
- `invalidateAgent` : Retirer la validation (isValide → false)
- `getAllAgents` : Voir tous les agents
- `getPendingAgents` : Voir les agents en attente (isValide=false)
- `getValidatedAgents` : Voir les agents validés (isValide=true)

### 4. Les middlewares (`role.middleware.js`)

Les middlewares sont des "gardiens" qui vérifient les permissions.

**4 middlewares créés** :

```javascript
// Vérifier que c'est un admin
isAdmin → Laisse passer seulement les admins

// Vérifier que c'est un agent
isAgent → Laisse passer seulement les agents

// Vérifier que l'agent est validé
isValidAgent → Laisse passer seulement les agents avec isValide=true

// Vérifier que c'est un customer
isCustomer → Laisse passer seulement les customers
```

**Exemple d'utilisation** :

```javascript
// Route accessible uniquement aux admins
router.put("/validate/:id", auth, isAdmin, validateAgent);

// Route accessible uniquement aux agents validés
router.post("/mission", auth, isAgent, isValidAgent, acceptMission);
```

### 5. Les routes (`agent.router.js`)

Les routes sont les URL de l'API.

```
POST   /api/v1/agent/register           → Inscription
GET    /api/v1/agent/profile             → Mon profil
GET    /api/v1/agent/all                 → Tous les agents (admin)
GET    /api/v1/agent/pending             → Agents en attente (admin)
GET    /api/v1/agent/validated           → Agents validés (admin)
PUT    /api/v1/agent/validate/:id        → Valider (admin)
PUT    /api/v1/agent/invalidate/:id      → Invalider (admin)
```

## 🔒 Blocage de connexion

### Où ça se passe ?

Dans le fichier `auth.service.js`, fonction `loginService`.

### Comment ça marche ?

Quand quelqu'un essaie de se connecter :

```javascript
1. Vérifier email et mot de passe ✅
2. Vérifier que le compte est actif ✅
3. SI c'est un agent :
   → Chercher son profil dans la table Agent
   → Vérifier isValide
   → SI isValide=false : BLOQUER ❌
   → SI isValide=true : LAISSER PASSER ✅
4. Générer le token
```

**Résultat** :

- Agent non validé : "Votre compte est en attente de validation..."
- Agent validé : Connexion réussie avec token

## 🔔 Notifications de visite

### Qui reçoit les notifications ?

Dans `payment.controller.js`, fonction `payForOnSiteVisit` :

**Avant** (❌ incorrect) :

```javascript
// Cherchait tous les utilisateurs avec rôle "agent"
User.find({ role: agentRole._id });
```

**Maintenant** (✅ correct) :

```javascript
// Cherche seulement les agents VALIDÉS
Agent.find({ isValide: true }).populate({
  path: "userId",
  match: { isActive: true },
});
```

**Résultat** : Seuls les agents validés ET actifs reçoivent les notifications de demande de visite.

## 📝 Exemples pratiques

### Exemple 1 : Inscription d'un agent

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
  "message": "Inscription réussie. Votre compte est en attente de validation...",
  "data": {
    "user": { "id": "123...", "role": "agent" },
    "agent": { "id": "456...", "isValide": false }
  }
}
```

**Note** : Pas de token ! L'agent ne peut pas se connecter.

### Exemple 2 : Agent essaie de se connecter (non validé)

**Requête** :

```http
POST /api/v1/auth/login
{
  "email": "marie@agence.com",
  "password": "motdepasse123"
}
```

**Réponse (Erreur 401)** :

```json
{
  "success": false,
  "message": "Votre compte agent est en attente de validation par un administrateur. Vous ne pouvez pas vous connecter pour le moment."
}
```

### Exemple 3 : Admin valide l'agent

**Requête** :

```http
PUT /api/v1/agent/validate/456...
Authorization: Bearer <token_admin>
```

**Réponse** :

```json
{
  "success": true,
  "message": "Agent validé avec succès",
  "data": { "isValide": true }
}
```

### Exemple 4 : Agent se connecte (validé)

**Requête** :

```http
POST /api/v1/auth/login
{
  "email": "marie@agence.com",
  "password": "motdepasse123"
}
```

**Réponse (Succès 200)** :

```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123...",
      "firstName": "Marie",
      "lastName": "Dupont",
      "email": "marie@agence.com",
      "role": "agent"
    }
  }
}
```

## 🎯 Points importants

### 1. Table Agent = Tous les agents

La table Agent contient **tous les agents** (validés et non validés). C'est le champ `isValide` qui fait la différence :

```
Table Agent :
- Agent A : isValide=false → Ne peut pas se connecter
- Agent B : isValide=true  → Peut se connecter
- Agent C : isValide=false → Ne peut pas se connecter
```

### 2. Triple sécurité

Le système a 3 niveaux de sécurité :

**Niveau 1** : Pas de token à l'inscription
**Niveau 2** : Blocage à la connexion (principal)
**Niveau 3** : Middleware sur les routes (sécurité supplémentaire)

### 3. Style de code simple

Tout le code utilise le style `.then()` et `.catch()` comme dans `customer.controller.js` :

```javascript
// Style utilisé
Agent.find({ isValide: true })
  .then((agents) => {
    // Traiter les agents
  })
  .catch((error) => {
    // Gérer l'erreur
  });
```

### 4. Commentaires détaillés

Chaque fonction a :

- Une description claire de ce qu'elle fait
- Des commentaires sur chaque étape
- Des exemples d'utilisation

## ✅ Résumé

| Qui                  | Peut faire quoi                                       |
| -------------------- | ----------------------------------------------------- |
| **Tout le monde**    | S'inscrire comme agent                                |
| **Agent non validé** | Rien (ne peut même pas se connecter)                  |
| **Agent validé**     | Se connecter, voir son profil, accepter missions      |
| **Admin**            | Valider/invalider des agents, voir toutes les listes  |
| **Customer**         | Demander des visites (notifications → agents validés) |

## 🚀 Pour tester

1. Inscrire un agent → Vérifier qu'il ne peut pas se connecter
2. Admin valide l'agent → Vérifier isValide=true
3. Agent se connecte → Vérifier qu'il reçoit un token
4. Customer demande visite → Vérifier que seul l'agent validé reçoit la notification

C'est tout ! Le système est simple et sécurisé. 🎉

# 🔐 Système de Rôles - Documentation

## 📋 Vue d'ensemble

Ce document explique comment fonctionne le système de rôles dans la plateforme immobilière.

## 🎭 Les trois types de rôles

### 1. **Customer** (Client)

- Utilisateur standard qui s'inscrit directement sur la plateforme
- Peut consulter les annonces immobilières
- Peut contacter des agents
- Pas besoin de validation

### 2. **Agent** (Agent immobilier)

- Utilisateur dont la candidature doit être validée par un administrateur
- Peut créer et gérer des annonces
- Peut gérer ses clients
- Nécessite une validation préalable

### 3. **Admin** (Administrateur)

- Utilisateur avec tous les droits
- Peut valider les candidatures d'agents
- Peut gérer tous les utilisateurs et contenus
- Accès complet à la plateforme

---

## 📂 Structure des fichiers créés

```
src/API/
├── models/
│   └── role.model.js          # Modèle Mongoose pour les rôles
├── services/
│   └── initRoles.service.js   # Service d'initialisation automatique
└── configs/
    └── database.js            # Connexion DB avec initialisation des rôles
```

---

## 🔧 Comment ça fonctionne ?

### 1. **Modèle Role** (`role.model.js`)

Le modèle définit la structure d'un rôle dans MongoDB :

```javascript
{
  name: String,        // "customer", "agent" ou "admin"
  createdAt: Date,     // Date de création (auto)
  updatedAt: Date      // Date de modification (auto)
}
```

**Caractéristiques :**

- Le champ `name` est **obligatoire**
- Le champ `name` est **unique** (pas de doublons)
- Conversion automatique en **minuscules**
- Validation avec enum (seulement 3 valeurs possibles)

### 2. **Service d'initialisation** (`initRoles.service.js`)

Ce service s'exécute automatiquement au démarrage du serveur :

1. ✅ Vérifie si les rôles existent déjà
2. ✅ Crée uniquement les rôles manquants
3. ✅ Affiche un résumé dans la console

**Fonctions disponibles :**

```javascript
// Initialiser les rôles (appelée automatiquement)
await initializeRoles();

// Récupérer un rôle par son nom
const customerRole = await getRoleByName("customer");

// Récupérer tous les rôles
const allRoles = await getAllRoles();
```

### 3. **Connexion à la base de données** (`database.js`)

La fonction `connectDB()` a été améliorée pour :

- Se connecter à MongoDB
- Initialiser automatiquement les rôles
- Gérer les erreurs de connexion
- Surveiller les événements (déconnexion, reconnexion, etc.)

---

## 🚀 Utilisation

### Démarrage du serveur

Lorsque vous démarrez le serveur avec `npm run dev`, vous verrez :

```
✅ Base de données connectée avec succès
📦 Base de données : immo_platform
🔄 Vérification des rôles dans la base de données...
   ✅ Rôle "customer" créé avec succès
   ✅ Rôle "agent" créé avec succès
   ✅ Rôle "admin" créé avec succès

📊 Résumé de l'initialisation des rôles :
   - Rôles créés : 3
   - Rôles existants : 0
   - Total de rôles : 3
✅ Initialisation des rôles terminée avec succès

🚀 Serveur démarré sur le port 3000
📍 URL : http://localhost:3000/api/v1
```

Au prochain démarrage, vous verrez :

```
✅ Base de données connectée avec succès
📦 Base de données : immo_platform
🔄 Vérification des rôles dans la base de données...
   ✓ Le rôle "customer" existe déjà
   ✓ Le rôle "agent" existe déjà
   ✓ Le rôle "admin" existe déjà

📊 Résumé de l'initialisation des rôles :
   - Rôles créés : 0
   - Rôles existants : 3
   - Total de rôles : 3
✅ Initialisation des rôles terminée avec succès
```

---

## 💡 Exemples d'utilisation dans votre code

### Assigner un rôle à un nouvel utilisateur

```javascript
import { getRoleByName } from "../services/initRoles.service.js";
import User from "../models/user.model.js";

// Lors de l'inscription d'un customer
const customerRole = await getRoleByName("customer");
const newUser = new User({
  email: "user@example.com",
  password: "hashedPassword",
  role: customerRole._id, // Référence au rôle
});
await newUser.save();
```

### Vérifier le rôle d'un utilisateur

```javascript
// Dans un middleware d'authentification
const user = await User.findById(userId).populate("role");

if (user.role.name === "admin") {
  // Autoriser l'accès admin
}

if (user.role.name === "agent") {
  // Autoriser l'accès agent
}
```

### Middleware de vérification de rôle

```javascript
// Exemple de middleware pour protéger les routes
export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    const user = await User.findById(req.userId).populate("role");

    if (!allowedRoles.includes(user.role.name)) {
      return res.status(403).json({
        message: "Vous n'avez pas les permissions nécessaires",
      });
    }

    next();
  };
};

// Utilisation dans les routes
router.post("/annonces", requireRole(["agent", "admin"]), createAnnonce);
```

---

## ⚙️ Variables d'environnement requises

Créez un fichier `.env` à la racine du projet avec :

```env
# Port du serveur
PORT=3000

# MongoDB
DB_URI=mongodb://localhost:27017
DB_NAME=immo_platform

# Environnement
NODE_ENV=development
```

---

## 🔍 Vérification dans MongoDB

Pour vérifier que les rôles ont bien été créés, utilisez MongoDB Compass ou le shell :

```bash
# Dans le shell MongoDB
use immo_platform
db.roles.find().pretty()
```

Résultat attendu :

```json
[
  {
    "_id": "...",
    "name": "customer",
    "createdAt": "2025-10-25T...",
    "updatedAt": "2025-10-25T..."
  },
  {
    "_id": "...",
    "name": "agent",
    "createdAt": "2025-10-25T...",
    "updatedAt": "2025-10-25T..."
  },
  {
    "_id": "...",
    "name": "admin",
    "createdAt": "2025-10-25T...",
    "updatedAt": "2025-10-25T..."
  }
]
```

---

## 🎯 Prochaines étapes

Maintenant que les rôles sont en place, vous pouvez :

1. ✅ Créer le modèle `User` avec une référence au rôle
2. ✅ Créer les routes d'inscription/connexion
3. ✅ Créer les middlewares de vérification des permissions
4. ✅ Créer le système de candidature pour les agents
5. ✅ Créer le système de validation par l'admin

---

## 📞 Support

Si vous avez des questions, n'hésitez pas à demander de l'aide !

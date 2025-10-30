# 🔐 GUIDE ADMIN : Validation des inscriptions d'agents

**Date :** 26 octobre 2025  
**Version :** 1.0

---

## 📋 Vue d'ensemble

Ce système permet aux administrateurs de gérer les inscriptions des agents immobiliers. Chaque inscription d'agent doit être validée ou rejetée manuellement par un admin.

### **Workflow d'inscription d'un agent**

```
1. Agent s'inscrit via POST /agent/register
   └─> Compte créé avec isActive=false et isValide=false
   └─> L'agent NE PEUT PAS se connecter

2. Admin consulte les inscriptions en attente
   └─> GET /agent/pending

3. Admin prend une décision :

   Option A : VALIDER l'inscription
   └─> PUT /agent/validate/:agentId
   └─> isActive=true et isValide=true
   └─> Notification envoyée à l'agent
   └─> L'agent PEUT maintenant se connecter

   Option B : REJETER l'inscription
   └─> DELETE /agent/reject/:agentId
   └─> Agent et User supprimés de la DB
   └─> Notification envoyée avant suppression
   └─> Compte complètement effacé
```

---

## 🚀 API pour les administrateurs

### **1. Voir toutes les inscriptions en attente**

**Route :** `GET /api/v1/agent/pending`  
**Protection :** Admin uniquement  
**Ce que ça fait :** Retourne la liste des agents qui attendent validation

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
      "_id": "65f4a1b2c3d4e5f6a7b8c9d0",
      "userId": {
        "_id": "65f4a1b2c3d4e5f6a7b8c9cf",
        "firstName": "Pierre",
        "lastName": "Martin",
        "email": "pierre.martin@example.com",
        "isActive": false,
        "createdAt": "2025-10-20T10:30:00.000Z"
      },
      "phoneNumber": "0612345678",
      "isValide": false,
      "createdAt": "2025-10-20T10:30:00.000Z",
      "updatedAt": "2025-10-20T10:30:00.000Z"
    },
    {
      "_id": "65f4a1b2c3d4e5f6a7b8c9d1",
      "userId": {
        "_id": "65f4a1b2c3d4e5f6a7b8c9ce",
        "firstName": "Sophie",
        "lastName": "Durand",
        "email": "sophie.durand@example.com",
        "isActive": false,
        "createdAt": "2025-10-21T14:15:00.000Z"
      },
      "phoneNumber": "0698765432",
      "isValide": false,
      "createdAt": "2025-10-21T14:15:00.000Z",
      "updatedAt": "2025-10-21T14:15:00.000Z"
    }
  ]
}
```

**Si aucune inscription en attente :**

```json
{
  "success": true,
  "count": 0,
  "message": "Aucune inscription en attente",
  "data": []
}
```

---

### **2. VALIDER une inscription d'agent**

**Route :** `PUT /api/v1/agent/validate/:agentId`  
**Protection :** Admin uniquement  
**Ce que ça fait :**

- Passe `isValide` à `true` dans la collection Agent
- Passe `isActive` à `true` dans la collection User
- Crée une notification pour l'agent validé
- L'agent peut maintenant se connecter

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Paramètres URL :**

- `agentId` : ID de l'agent (celui dans la collection Agent, pas userId)

**Exemple :**

```
PUT http://localhost:3000/api/v1/agent/validate/65f4a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer <admin_token>
```

**Réponse succès (200) :**

```json
{
  "success": true,
  "message": "Agent validé avec succès. Une notification a été envoyée à l'utilisateur.",
  "data": {
    "agent": {
      "_id": "65f4a1b2c3d4e5f6a7b8c9d0",
      "userId": "65f4a1b2c3d4e5f6a7b8c9cf",
      "phoneNumber": "0612345678",
      "isValide": true,
      "createdAt": "2025-10-20T10:30:00.000Z",
      "updatedAt": "2025-10-26T15:45:00.000Z"
    },
    "user": {
      "id": "65f4a1b2c3d4e5f6a7b8c9cf",
      "firstName": "Pierre",
      "lastName": "Martin",
      "email": "pierre.martin@example.com",
      "isActive": true
    }
  }
}
```

**Erreurs possibles :**

| Code | Message               | Cause                         |
| ---- | --------------------- | ----------------------------- |
| 404  | `"Agent introuvable"` | L'ID d'agent n'existe pas     |
| 400  | `"Agent déjà validé"` | L'agent a déjà été validé     |
| 403  | `"Accès refusé"`      | L'utilisateur n'est pas admin |

---

### **3. REJETER une inscription d'agent**

**Route :** `DELETE /api/v1/agent/reject/:agentId`  
**Protection :** Admin uniquement  
**Ce que ça fait :**

- Crée une notification informant l'agent du rejet
- Supprime l'agent de la collection Agent
- Supprime l'utilisateur de la collection User
- ⚠️ **Action irréversible !**

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Paramètres URL :**

- `agentId` : ID de l'agent à rejeter

**Exemple :**

```
DELETE http://localhost:3000/api/v1/agent/reject/65f4a1b2c3d4e5f6a7b8c9d1
Authorization: Bearer <admin_token>
```

**Réponse succès (200) :**

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

**Erreurs possibles :**

| Code | Message                                        | Cause                                                  |
| ---- | ---------------------------------------------- | ------------------------------------------------------ |
| 404  | `"Agent introuvable"`                          | L'ID d'agent n'existe pas                              |
| 400  | `"Impossible de rejeter un agent déjà validé"` | L'agent a déjà été validé, il faut d'abord l'invalider |
| 403  | `"Accès refusé"`                               | L'utilisateur n'est pas admin                          |

⚠️ **Important :** On ne peut rejeter QUE les agents non validés (isValide=false). Pour supprimer un agent validé, il faut d'abord l'invalider avec `/invalidate/:agentId`.

---

### **4. Voir tous les agents (validés + en attente)**

**Route :** `GET /api/v1/agent/all`  
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
      "userId": { ... },
      "phoneNumber": "0612345678",
      "isValide": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    ...
  ]
}
```

---

### **5. Voir uniquement les agents validés**

**Route :** `GET /api/v1/agent/validated`  
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

### **6. INVALIDER un agent validé**

**Route :** `PUT /api/v1/agent/invalidate/:agentId`  
**Protection :** Admin uniquement  
**Ce que ça fait :**

- Passe `isValide` à `false`
- L'agent ne peut plus se connecter
- ⚠️ Ne supprime PAS le compte, juste le désactive

**Headers :**

```
Authorization: Bearer <admin_token>
```

**Exemple :**

```
PUT http://localhost:3000/api/v1/agent/invalidate/65f4a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer <admin_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Agent invalidé avec succès",
  "data": {
    "_id": "65f4a1b2c3d4e5f6a7b8c9d0",
    "userId": "65f4a1b2c3d4e5f6a7b8c9cf",
    "phoneNumber": "0612345678",
    "isValide": false,
    "updatedAt": "2025-10-26T16:00:00.000Z"
  }
}
```

---

## 📊 Tableau récapitulatif des statuts

| isActive (User) | isValide (Agent) | État                                      | Peut se connecter ? |
| --------------- | ---------------- | ----------------------------------------- | ------------------- |
| false           | false            | Inscription en attente                    | ❌ Non              |
| true            | true             | Agent validé et actif                     | ✅ Oui              |
| true            | false            | Agent invalidé par admin                  | ❌ Non              |
| false           | true             | (État incohérent, ne devrait pas exister) | ❌ Non              |

---

## 🔔 Notifications envoyées automatiquement

### **Lors de la validation**

**Titre :** `"Compte agent validé"`  
**Message :** `"Félicitations Pierre ! Votre compte agent a été validé par l'administrateur. Vous pouvez maintenant vous connecter et utiliser toutes les fonctionnalités agent."`  
**Action :** `"validation_compte"`  
**Destinataire :** L'agent validé

### **Lors du rejet**

**Titre :** `"Inscription agent rejetée"`  
**Message :** `"Bonjour Sophie, nous sommes désolés de vous informer que votre demande d'inscription en tant qu'agent a été rejetée par l'administrateur. Pour plus d'informations, veuillez nous contacter."`  
**Action :** `"validation_compte"`  
**Destinataire :** L'agent rejeté (avant suppression)

---

## 🧪 Tester dans Postman

### **Scénario complet : Validation d'un agent**

#### **Étape 1 : Inscription d'un agent (route publique)**

```
POST http://localhost:3000/api/v1/agent/register
Content-Type: application/json

Body:
{
  "firstName": "Pierre",
  "lastName": "Martin",
  "email": "pierre.martin@example.com",
  "password": "MotDePasse123!",
  "phoneNumber": "0612345678"
}
```

→ Vous recevez l'`agentId` dans la réponse

#### **Étape 2 : Se connecter en tant qu'admin**

```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

Body:
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

→ Copiez le token admin

#### **Étape 3 : Voir les inscriptions en attente**

```
GET http://localhost:3000/api/v1/agent/pending
Authorization: Bearer <admin_token>
```

#### **Étape 4A : Valider l'inscription**

```
PUT http://localhost:3000/api/v1/agent/validate/65f4a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer <admin_token>
```

#### **OU Étape 4B : Rejeter l'inscription**

```
DELETE http://localhost:3000/api/v1/agent/reject/65f4a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer <admin_token>
```

#### **Étape 5 : Vérifier que l'agent peut se connecter (si validé)**

```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

Body:
{
  "email": "pierre.martin@example.com",
  "password": "MotDePasse123!"
}
```

---

## ⚠️ Points importants

### **1. Différence entre Invalider et Rejeter**

| Action        | Route               | Quand l'utiliser ?                        | Conséquences                                                                                             |
| ------------- | ------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **INVALIDER** | PUT /invalidate/:id | Désactiver temporairement un agent validé | • isValide passe à false<br>• Compte conservé<br>• Peut être réactivé plus tard<br>• Aucune notification |
| **REJETER**   | DELETE /reject/:id  | Refuser une inscription en attente        | • Agent supprimé de la DB<br>• User supprimé de la DB<br>• Notification envoyée<br>• ⚠️ Irréversible     |

### **2. Workflow recommandé**

1. **Consulter régulièrement** `/agent/pending` pour voir les nouvelles inscriptions
2. **Vérifier les informations** de l'agent (nom, email, téléphone)
3. **Prendre une décision rapide** pour ne pas faire attendre les agents
4. **Valider** si tout est en ordre → `/validate/:id`
5. **Rejeter** si l'inscription est suspecte → `/reject/:id`

### **3. Sécurité**

- ✅ Toutes ces routes sont protégées par le middleware `auth` + `isAdmin`
- ✅ Seuls les utilisateurs avec le rôle "admin" peuvent y accéder
- ✅ Un token JWT valide est requis
- ✅ Les notifications sont créées automatiquement

---

## 📝 Créer un compte admin (si besoin)

Les comptes admin ne peuvent pas être créés via l'API. Ils doivent être créés directement en base de données.

**Méthode 1 : Via MongoDB Compass ou mongosh**

```javascript
// 1. Trouver l'ID du rôle admin
db.roles.findOne({ name: "admin" });
// Copier le _id

// 2. Créer le hash du mot de passe
// Utiliser bcrypt avec 10 rounds pour "Admin123!"
// Hash : $2b$10$... (à générer avec bcrypt)

// 3. Créer l'utilisateur admin
db.users.insertOne({
  firstName: "Admin",
  lastName: "Principal",
  email: "admin@example.com",
  password: "$2b$10$...", // Hash du mot de passe
  role: ObjectId("..."), // ID du rôle admin
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

**Méthode 2 : Script Node.js**

Créez un fichier `create-admin.js` :

```javascript
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "./src/API/models/user.model.js";
import Role from "./src/API/models/role.model.js";

const createAdmin = async () => {
  await mongoose.connect("mongodb://localhost:27017/immo_platform");

  const adminRole = await Role.findOne({ name: "admin" });
  const hashedPassword = await bcrypt.hash("Admin123!", 10);

  await User.create({
    firstName: "Admin",
    lastName: "Principal",
    email: "admin@example.com",
    password: hashedPassword,
    role: adminRole._id,
    isActive: true,
  });

  console.log("✅ Admin créé avec succès !");
  process.exit(0);
};

createAdmin();
```

Puis exécutez :

```bash
node create-admin.js
```

---

## ✅ Fonctionnalités du système

- ✅ Liste des inscriptions en attente avec date de création
- ✅ Validation d'agent avec activation du compte (isActive=true)
- ✅ Rejet d'inscription avec suppression complète
- ✅ Notifications automatiques aux agents
- ✅ Protection admin sur toutes les routes
- ✅ Gestion des erreurs avec messages clairs
- ✅ Historique via timestamps (createdAt, updatedAt)

---

**Le système de validation des agents est maintenant opérationnel ! 🎉**

Si vous avez des questions ou besoin d'aide, consultez ce guide ou contactez le développeur.


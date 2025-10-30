# 🔔 SYSTÈME DE NOTIFICATIONS COMPLET

## 📋 VUE D'ENSEMBLE

Tous les utilisateurs (Customer, Agent, Admin) peuvent désormais accéder à leurs notifications via des routes dédiées.

---

## 🎯 ACCESSIBILITÉ

| Utilisateur  | Accès notifications | Route de base           |
| ------------ | ------------------- | ----------------------- |
| **Customer** | ✅ Oui              | `/api/v1/notifications` |
| **Agent**    | ✅ Oui              | `/api/v1/notifications` |
| **Admin**    | ✅ Oui              | `/api/v1/notifications` |

**Protection** : Toutes les routes nécessitent une authentification (`auth` middleware), mais **aucune restriction de rôle**.

---

## 📡 ROUTES DISPONIBLES

### 1️⃣ **RÉCUPÉRER MES NOTIFICATIONS**

```http
GET /api/v1/notifications
```

**Headers :**

```
Authorization: Bearer <token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": [
    {
      "_id": "67123abc...",
      "user": "67001def...",
      "title": "Demande de visite acceptée",
      "message": "Votre demande de visite a été acceptée par un agent",
      "action": "visite",
      "announcement": {
        "_id": "67002abc...",
        "title": "Villa moderne 3 chambres"
      },
      "isRead": false,
      "emailSent": false,
      "createdAt": "2025-10-27T10:30:00.000Z",
      "updatedAt": "2025-10-27T10:30:00.000Z"
    },
    {
      "_id": "67123def...",
      "user": "67001def...",
      "title": "Paiement confirmé",
      "message": "Votre paiement de 5000 FCFA a été confirmé",
      "action": "paiement",
      "isRead": true,
      "emailSent": false,
      "createdAt": "2025-10-26T14:20:00.000Z",
      "updatedAt": "2025-10-26T15:00:00.000Z"
    }
  ]
}
```

**Notes :**

- Les notifications sont triées par ordre **décroissant** (les plus récentes en premier)
- Le champ `announcement` est populé avec le titre de l'annonce (si applicable)

---

### 2️⃣ **COMPTER LES NOTIFICATIONS NON LUES**

```http
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

**Utilité :** Afficher un badge avec le nombre de notifications non lues dans l'interface utilisateur.

---

### 3️⃣ **MARQUER UNE NOTIFICATION COMME LUE**

```http
PUT /api/v1/notifications/:notificationId/read
```

**Headers :**

```
Authorization: Bearer <token>
```

**Paramètres :**

- `notificationId` : ID de la notification à marquer comme lue

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Notification marquée comme lue",
  "data": {
    "_id": "67123abc...",
    "user": "67001def...",
    "title": "Demande de visite acceptée",
    "message": "Votre demande de visite a été acceptée par un agent",
    "action": "visite",
    "isRead": true,
    "emailSent": false,
    "createdAt": "2025-10-27T10:30:00.000Z",
    "updatedAt": "2025-10-27T10:35:00.000Z"
  }
}
```

**Erreurs :**

- `404` : Notification introuvable
- `403` : Vous n'avez pas accès à cette notification (appartient à un autre utilisateur)

---

### 4️⃣ **MARQUER TOUTES MES NOTIFICATIONS COMME LUES**

```http
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

**Utilité :** Bouton "Tout marquer comme lu" dans l'interface utilisateur.

---

### 5️⃣ **SUPPRIMER UNE NOTIFICATION**

```http
DELETE /api/v1/notifications/:notificationId
```

**Headers :**

```
Authorization: Bearer <token>
```

**Paramètres :**

- `notificationId` : ID de la notification à supprimer

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Notification supprimée avec succès"
}
```

**Erreurs :**

- `404` : Notification introuvable
- `403` : Vous n'avez pas accès à cette notification

---

## 🔔 TYPES DE NOTIFICATIONS

| Action              | Description                                    | Exemple                                          |
| ------------------- | ---------------------------------------------- | ------------------------------------------------ |
| `paiement`          | Confirmation de paiement                       | "Votre paiement de 5000 FCFA a été confirmé"     |
| `visite`            | Notification de visite                         | "Votre demande de visite a été acceptée"         |
| `visite_virtuelle`  | Visite virtuelle disponible                    | "La visite virtuelle est maintenant disponible"  |
| `preference`        | Nouvelle annonce correspondant aux préférences | "Une nouvelle annonce correspond à vos critères" |
| `validation_compte` | Validation ou rejet de compte agent            | "Votre compte agent a été validé"                |

---

## 📊 EXEMPLES D'UTILISATION PAR RÔLE

### 👤 **CUSTOMER**

**Notifications reçues :**

- ✅ Paiement confirmé (recharge wallet, publication annonce, visite virtuelle)
- ✅ Demande de visite acceptée par un agent
- ✅ Visite confirmée avec date/heure/lieu
- ✅ Nouvelle annonce correspondant aux préférences

**Exemple :**

```bash
curl -X GET http://localhost:3000/api/v1/notifications \
  -H "Authorization: Bearer <customer_token>"
```

---

### 🏢 **AGENT**

**Notifications reçues :**

- ✅ Nouvelle demande de visite sur site
- ✅ Validation ou rejet de compte agent
- ✅ Paiement reçu après visite effectuée
- ✅ Demande de retrait enregistrée

**Exemple :**

```bash
curl -X GET http://localhost:3000/api/v1/notifications/unread/count \
  -H "Authorization: Bearer <agent_token>"
```

---

### 👑 **ADMIN**

**Notifications reçues :**

- ✅ Nouvelles inscriptions d'agents en attente de validation
- ✅ Toutes les notifications système

**Exemple :**

```bash
curl -X PUT http://localhost:3000/api/v1/notifications/read-all \
  -H "Authorization: Bearer <admin_token>"
```

---

## 🔐 SÉCURITÉ

### Vérifications implémentées :

1. **Authentication obligatoire** : Toutes les routes nécessitent un token JWT valide
2. **Isolation des données** : Un utilisateur ne peut voir que **ses propres** notifications
3. **Protection contre l'accès croisé** : Impossible de marquer comme lue ou supprimer une notification d'un autre utilisateur (erreur 403)

---

## 📁 FICHIERS CRÉÉS/MODIFIÉS

| Fichier                                          | Action         | Description                                      |
| ------------------------------------------------ | -------------- | ------------------------------------------------ |
| `src/API/controllers/notification.controller.js` | ✅ **CRÉÉ**    | Contrôleur pour gérer les notifications          |
| `src/API/routers/notification.router.js`         | ✅ **CRÉÉ**    | Routes des notifications (accessible à tous)     |
| `src/API/routers/index.js`                       | ✏️ **MODIFIÉ** | Ajout du router notifications                    |
| `src/API/routers/customer.router.js`             | ✏️ **MODIFIÉ** | Suppression des routes notifications (déplacées) |

---

## 🆚 AVANT vs APRÈS

### ❌ **AVANT** (Problème)

```
❌ Notifications accessibles uniquement via /api/v1/customer/notifications
❌ Agents ne pouvaient PAS voir leurs notifications
❌ Admin ne pouvait PAS voir ses notifications
❌ Fonctionnalités limitées (uniquement GET et PUT read)
```

### ✅ **APRÈS** (Résolu)

```
✅ Notifications accessibles via /api/v1/notifications (pour tous)
✅ Agents peuvent voir leurs notifications
✅ Admin peut voir ses notifications
✅ Fonctionnalités complètes :
   - GET (récupérer)
   - PUT read (marquer une comme lue)
   - PUT read-all (marquer toutes comme lues)
   - DELETE (supprimer)
   - GET unread/count (compter non lues)
```

---

## 🧪 TESTS POSTMAN

### Test 1 : Récupérer notifications (Customer)

1. Connexion en tant que customer
2. Copier le token
3. GET `http://localhost:3000/api/v1/notifications`
4. Header : `Authorization: Bearer <customer_token>`

### Test 2 : Notifications non lues (Agent)

1. Connexion en tant qu'agent
2. Copier le token
3. GET `http://localhost:3000/api/v1/notifications/unread/count`
4. Header : `Authorization: Bearer <agent_token>`

### Test 3 : Marquer toutes comme lues (Admin)

1. Connexion en tant qu'admin
2. Copier le token
3. PUT `http://localhost:3000/api/v1/notifications/read-all`
4. Header : `Authorization: Bearer <admin_token>`

---

## ✅ RÉSUMÉ

**Problème résolu :**

- ✅ Tous les utilisateurs (Customer, Agent, Admin) peuvent maintenant accéder à leurs notifications
- ✅ Routes dédiées et sécurisées
- ✅ Fonctionnalités complètes (lire, marquer, supprimer, compter)

**Routes créées :**

- `GET /api/v1/notifications` - Récupérer mes notifications
- `GET /api/v1/notifications/unread/count` - Compter non lues
- `PUT /api/v1/notifications/:id/read` - Marquer une comme lue
- `PUT /api/v1/notifications/read-all` - Marquer toutes comme lues
- `DELETE /api/v1/notifications/:id` - Supprimer une notification

**Protection :** `auth` middleware uniquement (pas de restriction de rôle)

---

📌 **Note importante :** Les anciennes routes dans `/api/v1/customer/notifications` ont été supprimées pour éviter la duplication et la confusion.

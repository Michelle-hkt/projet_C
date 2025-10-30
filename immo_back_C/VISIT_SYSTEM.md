# 🏠 SYSTÈME DE VISITES SUR SITE

Documentation complète du système de demandes de visites sur site pour les annonces immobilières.

---

## 📋 MODÈLE VISIT

### Structure de la table `Visit`

```javascript
{
  userId: ObjectId,          // Customer qui demande la visite
  announcementId: ObjectId,  // Annonce concernée
  visitDate: Date,           // Date souhaitée pour la visite
  status: String,            // Statut de la demande
  agentId: ObjectId,         // Agent assigné (null au début)
  createdAt: Date,           // Date de création
  updatedAt: Date            // Date de dernière modification
}
```

### Statuts possibles

| Statut       | Description                                     |
| ------------ | ----------------------------------------------- |
| `en_attente` | Visite demandée, en attente qu'un agent accepte |
| `confirmee`  | Un agent a accepté la demande                   |
| `effectuee`  | La visite a été réalisée                        |
| `annulee`    | La visite a été annulée                         |

---

## 🔄 WORKFLOW COMPLET

### **Étape 1 : Demande de visite (Customer)**

```
Customer clique sur "Demander une visite"
  ↓
Paiement de 1000 via wallet
  ↓
Création d'une entrée Visit avec status "en_attente"
  ↓
Notification envoyée à TOUS les agents actifs
```

### **Étape 2 : Notification des agents**

```
Recherche de tous les utilisateurs avec rôle "agent" et isActive: true
  ↓
Création d'une notification pour CHAQUE agent
  ↓
Titre : "Nouvelle demande de visite sur site"
Message : "Une demande de visite a été faite pour [Titre] le [Date]. Acceptez-vous cette mission ?"
```

### **Étape 3 : Acceptation par un agent (À implémenter)**

```
Un agent accepte la mission
  ↓
status passe à "confirmee"
  ↓
agentId est défini avec l'ID de l'agent
  ↓
Notification envoyée au customer
```

### **Étape 4 : Visite effectuée (À implémenter)**

```
La visite a lieu
  ↓
status passe à "effectuee"
  ↓
Notification envoyée au customer et à l'agent
```

---

## 🎯 ROUTE API

### **POST /api/v1/payment/on-site-visit**

Permet à un customer de demander une visite sur site pour une annonce.

#### Headers

```json
{
  "Authorization": "Bearer <token>"
}
```

#### Body

```json
{
  "announcementId": "60d5ec49f1b2c72b8c8e4f1a",
  "visitDate": "2025-11-15"
}
```

#### Réponse succès (200)

```json
{
  "message": "Visite demandée avec succès. 3 agent(s) ont été notifié(s).",
  "visit": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "userId": "60d5ec49f1b2c72b8c8e4f1b",
    "announcementId": "60d5ec49f1b2c72b8c8e4f1c",
    "visitDate": "2025-11-15T00:00:00.000Z",
    "status": "en_attente",
    "agentId": null,
    "createdAt": "2025-10-26T10:00:00.000Z",
    "updatedAt": "2025-10-26T10:00:00.000Z"
  },
  "newBalance": 4000
}
```

#### Erreurs possibles

| Code | Message                                               | Cause                   |
| ---- | ----------------------------------------------------- | ----------------------- |
| 400  | "La date de visite est obligatoire"                   | visitDate manquant      |
| 400  | "Solde insuffisant pour réserver une visite sur site" | Balance < 1000          |
| 404  | "Annonce introuvable"                                 | AnnouncementId invalide |
| 404  | "Customer introuvable"                                | User non trouvé         |
| 404  | "Wallet introuvable"                                  | Wallet non trouvé       |

---

## 💰 TRANSACTIONS

### **Coût de la visite**

```javascript
const ON_SITE_VISIT_PRICE = 1000;
```

### **WalletTransaction créée**

```javascript
{
  wallet: walletId,
  serviceType: "Visite sur site",
  transactionType: "payment",
  amount: 1000,
  description: "Demande visite sur site: [Titre] le [Date]"
}
```

---

## 📧 NOTIFICATIONS

### **Notification pour les agents**

Chaque agent actif reçoit une notification :

```javascript
{
  user: agentId,
  title: "Nouvelle demande de visite sur site",
  message: "Une demande de visite a été faite pour \"Villa 4 pièces\" le 2025-11-15. Acceptez-vous cette mission ?",
  action: "visite",
  announcement: announcementId,
  emailSent: false
}
```

---

## 🔧 FONCTIONNALITÉS À IMPLÉMENTER

### 1. **Route pour accepter une visite (Agent)**

```javascript
// PUT /api/v1/agent/visits/:visitId/accept
// - Vérifier que le statut est "en_attente"
// - Mettre à jour status → "confirmee"
// - Définir agentId avec l'agent connecté
// - Envoyer notification au customer
```

### 2. **Route pour marquer une visite comme effectuée**

```javascript
// PUT /api/v1/agent/visits/:visitId/complete
// - Vérifier que le statut est "confirmee"
// - Mettre à jour status → "effectuee"
// - Envoyer notification au customer et à l'agent
```

### 3. **Route pour annuler une visite**

```javascript
// PUT /api/v1/visits/:visitId/cancel
// - Mettre à jour status → "annulee"
// - Éventuellement rembourser le customer
// - Envoyer notification
```

### 4. **Routes de consultation**

```javascript
// GET /api/v1/customer/visits - Mes demandes de visites
// GET /api/v1/agent/visits/pending - Visites en attente (pour agents)
// GET /api/v1/agent/visits/my-visits - Mes visites acceptées (pour agents)
```

---

## 📊 EXEMPLE DE WORKFLOW COMPLET

### Scénario : Alice demande une visite

```
1. Alice (Customer) voit l'annonce "Villa 4 pièces"
   → Elle clique sur "Demander une visite"
   → Elle choisit la date : 15/11/2025

2. Backend vérifie :
   ✓ Annonce existe
   ✓ Wallet d'Alice a au moins 1000
   ✓ Débite 1000 du wallet

3. Backend crée :
   ✓ WalletTransaction (paiement)
   ✓ Visit (status: "en_attente", agentId: null)

4. Backend notifie :
   ✓ Trouve 3 agents actifs (Bob, Claire, David)
   ✓ Crée 3 notifications identiques
   ✓ Chaque agent reçoit : "Nouvelle demande de visite..."

5. Bob (Agent) accepte :
   ✓ status → "confirmee"
   ✓ agentId → Bob's ID
   ✓ Alice reçoit une notification : "Votre visite a été confirmée par Bob"

6. Le 15/11/2025, la visite a lieu :
   ✓ Bob marque la visite comme "effectuee"
   ✓ Alice et Bob reçoivent une notification de confirmation
```

---

## 🎯 POINTS CLÉS

### ✅ Ce qui est fait

- ✅ Modèle `Visit` créé
- ✅ Fonction `payForOnSiteVisit` implémentée
- ✅ Paiement via wallet
- ✅ Création de la demande avec status "en_attente"
- ✅ Notification envoyée à TOUS les agents actifs

### 🚧 Ce qui reste à faire

- 🚧 Route pour que les agents acceptent une visite
- 🚧 Route pour marquer une visite comme effectuée
- 🚧 Route pour annuler une visite
- 🚧 Routes de consultation des visites
- 🚧 Système de notification par email (via MailDev)
- 🚧 Validation des dates (pas de visite dans le passé)

---

## 🔐 SÉCURITÉ

- ✅ Authentification requise (middleware `auth`)
- ✅ Vérification du solde avant paiement
- ✅ Statut "en_attente" par défaut (pas de manipulation)
- ✅ agentId null tant qu'aucun agent n'accepte
- ⚠️ À ajouter : Validation de la date (pas de date passée)
- ⚠️ À ajouter : Seul l'agent assigné peut marquer la visite comme effectuée

---

## 📝 RÉSUMÉ

Le système de visites sur site permet aux customers de demander des visites physiques pour les annonces immobilières. Une fois la demande payée, tous les agents actifs sont notifiés, et le premier à accepter sera assigné à la visite. Ce système garantit une réactivité maximale et une bonne distribution des missions entre les agents.



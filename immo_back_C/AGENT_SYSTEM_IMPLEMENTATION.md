# 🏗️ Système d'Agents Immobiliers - Documentation Complète

## 📋 Vue d'ensemble

Cette documentation décrit toutes les modifications apportées au backend pour implémenter le système avancé d'agents immobiliers avec assignation automatique, rotation, parrainage et gestion des commissions.

---

## ✅ Modifications des Modèles

### 1. **Modèle Agent** (`agent.model.js`)

**Nouveaux attributs ajoutés :**

```javascript
{
  address: String (required) - Adresse/localisation de l'agent
  description: String (required) - Brève description de l'agent
  cipImage: String (required) - URL de l'image CIP de l'agent
  referralCode: String (unique, généré automatiquement) - Code de parrainage unique
  lastAssignedAt: Date - Date de dernière assignation (pour la rotation)
}
```

**Middleware :**

- Génération automatique du `referralCode` lors de la validation de l'agent (format: `AGT-XXXXXXXX`)

---

### 2. **Modèle Announcement** (`announcement.model.js`)

**Nouveaux attributs ajoutés :**

```javascript
{
  commission: Number (required) - Commission de la plateforme
  assignedAgents: [ObjectId] - Liste des agents assignés (max 3)
}
```

**Calcul de la commission :**

- **À vendre** : 5% du prix de vente
- **À louer** : 10% du montant de la location

---

### 3. **Modèle Customer** (`customer.model.js`)

**Nouvel attribut ajouté :**

```javascript
{
  referredBy: ObjectId (ref: Agent) - Agent parrain (si applicable)
}
```

---

### 4. **Modèle Visit** (`visit.model.js`)

**Nouveaux attributs ajoutés :**

```javascript
{
  referralAgentId: ObjectId (ref: Agent) - Agent parrain du customer
  commissionPaid: Boolean - Indique si la commission a été versée
}
```

---

## 🔄 Services Créés

### 1. **Service d'Assignation** (`agentAssignment.service.js`)

#### **Fonctionnalités :**

**a) `assignAgentsToAnnouncement(announcementDistrict)`**

- Assigne automatiquement **3 agents** à chaque nouvelle annonce
- Utilise un système de **rotation** basé sur `lastAssignedAt`
- Filtrage par **compatibilité géographique** :
  - Régions définies : Sud (Cotonou, Porto-Novo...), Centre (Bohicon, Abomey...), Nord (Parakou, Natitingou...)
  - Le Centre est compatible avec Sud et Nord
  - Sud et Nord ne sont pas compatibles entre eux

**b) `calculateCommission(status, price)`**

- Calcule la commission selon le type de bien
- Retourne le montant en FCFA

---

### 2. **Service de Commission** (`commission.service.js`)

#### **Fonctionnalités :**

**a) `distributeOnSiteVisitCommission(visit, customer, acceptingAgent)`**

Distribution des **1000 FCFA** de commission pour visite sur site :

- **Cas 1 : Customer parrainé + Agent différent du parrain**

  - Plateforme : 40% (400 FCFA)
  - Agent parrain : 30% (300 FCFA)
  - Agent de la visite : 30% (300 FCFA)

- **Cas 2 : Pas de parrain OU Agent = Parrain**
  - Plateforme : 40% (400 FCFA)
  - Agent : 60% (600 FCFA)

**b) `distributeVirtualVisitCommission(customer)`**

Distribution des **2000 FCFA** de commission pour visite virtuelle :

- **Si customer parrainé :**

  - Plateforme : 50% (1000 FCFA)
  - Agent parrain : 50% (1000 FCFA)

- **Si pas de parrain :**
  - Plateforme : 100% (2000 FCFA)

**Actions automatiques :**

- Crédite les wallets des agents
- Crée des `WalletTransaction` pour traçabilité
- Envoie des notifications aux agents

---

## 🔧 Modifications des Contrôleurs

### 1. **Agent Controller** (`agent.controller.js`)

#### **Nouvelles API :**

| Méthode | Route                     | Middleware      | Description                  |
| ------- | ------------------------- | --------------- | ---------------------------- |
| GET     | `/agent/my-announcements` | `auth, isAgent` | Annonces assignées à l'agent |
| GET     | `/agent/referral-link`    | `auth, isAgent` | Génère le lien de parrainage |
| GET     | `/agent/my-referrals`     | `auth, isAgent` | Liste des clients parrainés  |
| GET     | `/agent/commissions`      | `auth, isAgent` | Historique des commissions   |

---

### 2. **CustomerAnnouncement Controller** (`customerAnnouncement.controller.js`)

#### **Modifications de `createMyAnnouncement` :**

1. Calcule la commission selon le type de bien
2. Assigne automatiquement 3 agents via `assignAgentsToAnnouncement`
3. Crée l'annonce avec `commission` et `assignedAgents`
4. Notifie les agents assignés

**Exemple de réponse :**

```json
{
  "message": "Annonce créée avec succès",
  "data": { ... },
  "assignedAgents": 3,
  "commission": 50000
}
```

---

### 3. **AgentVisit Controller** (`agentVisit.controller.js`)

#### **Modifications de `acceptVisit` :**

1. Récupère le customer avec `referredBy`
2. Accepte la visite et associe `referralAgentId`
3. **Distribue automatiquement les commissions** via `distributeOnSiteVisitCommission`
4. Marque `commissionPaid = true`
5. Notifie le customer

---

### 4. **Payment Controller** (`payment.controller.js`)

#### **Modifications :**

**a) `payForOnSiteVisit` :**

- N'envoie les notifications **qu'aux agents assignés** à l'annonce
- Utilise `announcement.assignedAgents` au lieu de tous les agents validés

**b) `payForVirtualVisit` :**

- Distribue automatiquement les commissions via `distributeVirtualVisitCommission`
- Crédite l'agent parrain si applicable

---

## 🔐 Modifications de l'Authentification

### **Service Auth** (`auth.service.js`)

#### **Modifications de `registerService` :**

1. Accepte un paramètre optionnel `referralCode`
2. Vérifie la validité du code de parrainage
3. Associe le customer à l'agent parrain si le code est valide

**Exemple de body :**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "phoneNumber": "61234567",
  "whatsappNumber": "61234567",
  "referralCode": "AGT-A1B2C3D4"
}
```

---

### **Service Agent** (`agent.service.js`)

#### **Modifications de `registerAgentService` :**

Nouveaux champs requis lors de l'inscription :

- `address` : Localisation de l'agent
- `description` : Description professionnelle
- `cipImage` : URL de l'image CIP

---

## 📊 Validations

### **Agent Validation** (`agent.validation.js`)

Validation Joi ajoutée pour les nouveaux champs :

```javascript
{
  address: joi.string().min(5).max(200).required(),
  description: joi.string().min(20).max(500).required(),
  cipImage: joi.string().uri().required()
}
```

---

## 🔄 Flux Complets

### 1. **Création d'une Annonce**

```
Customer crée annonce
    ↓
Débite 5000 immo du wallet
    ↓
Calcule commission (5% vente / 10% location)
    ↓
Assigne 3 agents (rotation + géolocalisation)
    ↓
Notifie les 3 agents assignés
    ↓
Annonce créée avec succès
```

---

### 2. **Demande de Visite sur Site**

```
Customer demande visite (1000 immo débité)
    ↓
Notification envoyée UNIQUEMENT aux 3 agents assignés
    ↓
Un agent accepte
    ↓
Distribution automatique des commissions:
  - Si customer parrainé: 40% plateforme, 30% parrain, 30% agent visite
  - Sinon: 40% plateforme, 60% agent
    ↓
Customer notifié
```

---

### 3. **Visite Virtuelle**

```
Customer paie visite virtuelle (2000 immo)
    ↓
Distribution automatique des commissions:
  - Si customer parrainé: 50% plateforme, 50% agent parrain
  - Sinon: 100% plateforme
    ↓
Accès à l'URL de la visite virtuelle
```

---

### 4. **Parrainage**

```
Agent génère lien: /register?ref=AGT-XXXXXXXX
    ↓
Customer s'inscrit via le lien
    ↓
Customer.referredBy = Agent._id
    ↓
L'agent reçoit des commissions sur:
  - Visites virtuelles du filleul (50%)
  - Visites sur site du filleul (30% si un autre agent gère)
```

---

## 📡 Résumé des Routes

### **Routes Agent**

| Méthode | Route                            | Description                                               |
| ------- | -------------------------------- | --------------------------------------------------------- |
| POST    | `/api/v1/agent/register`         | Inscription agent (address, description, cipImage requis) |
| GET     | `/api/v1/agent/profile`          | Profil de l'agent connecté                                |
| GET     | `/api/v1/agent/my-announcements` | Annonces assignées                                        |
| GET     | `/api/v1/agent/referral-link`    | Générer lien de parrainage                                |
| GET     | `/api/v1/agent/my-referrals`     | Clients parrainés                                         |
| GET     | `/api/v1/agent/commissions`      | Historique des commissions                                |
| GET     | `/api/v1/agent/wallet`           | Solde du wallet                                           |
| POST    | `/api/v1/agent/wallet/withdraw`  | Demande de retrait                                        |

### **Routes Customer**

| Méthode | Route                   | Description                               |
| ------- | ----------------------- | ----------------------------------------- |
| POST    | `/api/v1/auth/register` | Inscription (avec referralCode optionnel) |

### **Routes Annonce**

| Méthode | Route                            | Description                      |
| ------- | -------------------------------- | -------------------------------- |
| POST    | `/api/v1/customer/announcements` | Créer annonce (assignation auto) |
| GET     | `/api/v1/customer/announcements` | Mes annonces                     |

---

## 🧪 Tests Recommandés

### 1. **Inscription Agent**

```bash
POST /api/v1/agent/register
Body: {
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "password": "Password123!",
  "phoneNumber": "61234567",
  "address": "Cotonou, Cadjèhoun",
  "description": "Agent immobilier expérimenté spécialisé dans les biens résidentiels.",
  "cipImage": "https://example.com/cip-jean-dupont.jpg"
}
```

### 2. **Génération Lien de Parrainage**

```bash
GET /api/v1/agent/referral-link
Headers: { Authorization: "Bearer <agent_token>" }
```

### 3. **Inscription Customer avec Parrainage**

```bash
POST /api/v1/auth/register
Body: {
  "firstName": "Marie",
  "lastName": "Martin",
  "email": "marie@example.com",
  "password": "Password123!",
  "phoneNumber": "67890123",
  "whatsappNumber": "67890123",
  "referralCode": "AGT-A1B2C3D4"
}
```

### 4. **Création d'Annonce avec Assignation**

```bash
POST /api/v1/customer/announcements
Headers: { Authorization: "Bearer <customer_token>" }
Body: {
  "title": "Villa moderne",
  "description": "Belle villa...",
  "status": "a_vendre",
  "price": 50000000,
  "district": "Cotonou",
  ...
}
```

### 5. **Consulter Annonces Assignées**

```bash
GET /api/v1/agent/my-announcements
Headers: { Authorization: "Bearer <agent_token>" }
```

### 6. **Consulter Clients Parrainés**

```bash
GET /api/v1/agent/my-referrals
Headers: { Authorization: "Bearer <agent_token>" }
```

### 7. **Consulter Commissions**

```bash
GET /api/v1/agent/commissions
Headers: { Authorization: "Bearer <agent_token>" }
```

---

## ⚠️ Points Importants

1. **Crypto Module** : Le modèle Agent utilise `crypto` de Node.js (natif) pour générer les codes de parrainage

2. **Notifications** : Les agents ne reçoivent des notifications de visite **QUE** pour les annonces qui leur sont assignées

3. **Rotation** : Le système assigne toujours les agents les moins récemment utilisés en premier

4. **Géolocalisation** : Les agents sont assignés en fonction de leur proximité géographique avec le bien

5. **Commissions** : Toutes les commissions sont distribuées automatiquement lors de l'acceptation de visite ou du paiement de visite virtuelle

6. **Wallet** : Les agents peuvent retirer leurs commissions via l'API `/agent/wallet/withdraw`

---

## 📚 Dépendances

Aucune nouvelle dépendance n'a été ajoutée. Le système utilise uniquement :

- `mongoose` : Gestion des modèles
- `crypto` : Génération des codes de parrainage (module natif Node.js)

---

## 🎯 Résultat Final

✅ Assignation automatique de 3 agents par annonce
✅ Système de rotation intelligent
✅ Filtrage géographique
✅ Code de parrainage unique par agent
✅ Distribution automatique des commissions
✅ Notifications ciblées
✅ API complètes pour les agents
✅ Traçabilité complète (WalletTransaction)

---

**Date de mise en œuvre :** Octobre 2025
**Version Backend :** 1.0.0
**Développeur :** Assistant AI + Michelle



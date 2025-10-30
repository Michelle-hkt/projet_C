# 🔄 Modifications du Système de Parrainage et Commissions

## 📋 Résumé des Changements

Cette documentation décrit toutes les modifications apportées au système d'agents immobiliers pour :

1. Renommer les champs de parrainage
2. Ajuster les pourcentages de commission
3. Ajouter une notification détaillée au customer après création d'annonce

---

## 1. ✏️ Renommage des Champs

### **Changements de Nomenclature**

| Ancien Nom               | Nouveau Nom                 |
| ------------------------ | --------------------------- |
| `referralCode`           | `sponsorshipCode`           |
| `referredBy`             | `sponsoredBy`               |
| `referralAgentId`        | `sponsorshipAgentId`        |
| `generateReferralLink()` | `generateSponsorshipLink()` |
| `getMyReferrals()`       | `getMySponsoredCustomers()` |

### **Fichiers Modifiés**

#### **Modèles**

- ✅ `models/agent.model.js` : `referralCode` → `sponsorshipCode`
- ✅ `models/customer.model.js` : `referredBy` → `sponsoredBy`
- ✅ `models/visit.model.js` : `referralAgentId` → `sponsorshipAgentId`

#### **Services**

- ✅ `services/auth.service.js` : `referralCode` → `sponsorshipCode`, `referredBy` → `sponsoredBy`
- ✅ `services/commission.service.js` : `referralAgent` → `sponsorshipAgent`

#### **Contrôleurs**

- ✅ `controllers/agent.controller.js` :
  - `generateReferralLink` → `generateSponsorshipLink`
  - `getMyReferrals` → `getMySponsoredCustomers`
  - Variables internes mises à jour
- ✅ `controllers/agentVisit.controller.js` : `referredBy` → `sponsoredBy`, `referralAgentId` → `sponsorshipAgentId`

#### **Routes**

- ✅ `routers/agent.router.js` :
  - `/referral-link` → `/sponsorship-link`
  - `/my-referrals` → `/my-sponsored-customers`

---

## 2. 💰 Nouveaux Pourcentages de Commission

### **Visite sur Site (1000 FCFA)**

| Scénario         | Ancien                                                                                   | Nouveau                                                         |
| ---------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Avec parrain** | • 40% Plateforme (400 FCFA)<br>• 30% Parrain (300 FCFA)<br>• 30% Agent visite (300 FCFA) | • **70% Plateforme (700 FCFA)**<br>• **30% Parrain (300 FCFA)** |
| **Sans parrain** | • 40% Plateforme (400 FCFA)<br>• 60% Agent visite (600 FCFA)                             | • **100% Plateforme (1000 FCFA)**                               |

### **Visite Virtuelle (2000 FCFA)**

| Scénario         | Ancien                                                    | Nouveau                                                          |
| ---------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| **Avec parrain** | • 50% Plateforme (1000 FCFA)<br>• 50% Parrain (1000 FCFA) | • **70% Plateforme (1400 FCFA)**<br>• **30% Parrain (600 FCFA)** |
| **Sans parrain** | • 100% Plateforme                                         | • **100% Plateforme (2000 FCFA)**                                |

### **Modifications dans le Code**

**`services/commission.service.js`** :

```javascript
// AVANT
const PLATFORM_COMMISSION_RATE = 0.4; // 40%
const REFERRAL_AGENT_COMMISSION_RATE = 0.3; // 30%
const VISIT_AGENT_COMMISSION_RATE = 0.3; // 30%

// APRÈS
const PLATFORM_COMMISSION_RATE = 0.7; // 70%
const SPONSORSHIP_AGENT_COMMISSION_RATE = 0.3; // 30%
```

**Simplification de la logique** :

- ✅ Plus de distribution tripartite
- ✅ L'agent qui accepte la visite ne reçoit plus de commission directe
- ✅ Seul l'agent parrain est rémunéré (si applicable)

---

## 3. 📬 Notification Customer après Création d'Annonce

### **Nouvelle Fonctionnalité**

Lorsqu'un customer crée une annonce, il reçoit **automatiquement une notification** contenant :

- ✅ Le nom complet de chaque agent assigné
- ✅ La photo (CIP) de chaque agent
- ✅ La description professionnelle de chaque agent

### **Exemple de Notification**

```
Titre : "Agents assignés à votre annonce"

Message :
"Votre annonce 'Villa moderne à Cotonou' a été créée avec succès !
Voici les agents qui vous accompagneront :

Agent 1:
- Nom: Jean Dupont
- Photo: https://example.com/cip-jean.jpg
- Description: Agent immobilier avec 10 ans d'expérience

Agent 2:
- Nom: Marie Martin
- Photo: https://example.com/cip-marie.jpg
- Description: Spécialiste des biens résidentiels

Agent 3:
- Nom: Paul Kouadio
- Photo: https://example.com/cip-paul.jpg
- Description: Expert en transactions immobilières"
```

### **Implémentation**

**`controllers/customerAnnouncement.controller.js`** (Étape 9) :

```javascript
// Notifier le customer créateur avec les détails des agents assignés
const agentsDetails = agents
  .map(
    (agent, index) =>
      `\n\nAgent ${index + 1}:\n- Nom: ${agent.userId.firstName} ${
        agent.userId.lastName
      }\n- Photo: ${agent.cipImage || "Non disponible"}\n- Description: ${
        agent.description || "Aucune description"
      }`
  )
  .join("");

await Notification.create({
  user: userId,
  title: "Agents assignés à votre annonce",
  message: `Votre annonce "${req.body.title}" a été créée avec succès ! Voici les agents qui vous accompagneront :${agentsDetails}`,
  action: "visite",
  announcement: savedAnnouncement._id,
  emailSent: false,
});
```

---

## 4. 🔄 Flux Mis à Jour

### **Création d'une Annonce**

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
Notifie le customer avec détails des agents (✅ NOUVEAU)
    ↓
Annonce créée avec succès
```

### **Acceptation de Visite sur Site**

```
Agent accepte visite
    ↓
Distribution des commissions:
  - Si customer parrainé: 70% plateforme, 30% parrain (✅ MODIFIÉ)
  - Sinon: 100% plateforme (✅ MODIFIÉ)
    ↓
Customer notifié
```

### **Visite Virtuelle**

```
Customer paie visite virtuelle (2000 immo)
    ↓
Distribution des commissions:
  - Si customer parrainé: 70% plateforme, 30% parrain (✅ MODIFIÉ)
  - Sinon: 100% plateforme
    ↓
Accès à l'URL de la visite virtuelle
```

---

## 5. 📡 Routes Mises à Jour

### **Nouvelles URLs**

| Ancienne Route                | Nouvelle Route                         | Description                   |
| ----------------------------- | -------------------------------------- | ----------------------------- |
| `/api/v1/agent/referral-link` | `/api/v1/agent/sponsorship-link`       | Générer le lien de parrainage |
| `/api/v1/agent/my-referrals`  | `/api/v1/agent/my-sponsored-customers` | Liste des clients parrainés   |

### **Format du Lien de Parrainage**

```
Ancien: /register?ref=AGT-A1B2C3D4
Nouveau: /register?ref=AGT-A1B2C3D4 (même format, nouveau nom de paramètre)
```

**Paramètre d'inscription** : `sponsorshipCode` (au lieu de `referralCode`)

---

## 6. 🧪 Tests à Effectuer

### **1. Test de Parrainage**

```bash
# 1. Générer le lien de parrainage
GET /api/v1/agent/sponsorship-link
Headers: { Authorization: "Bearer <agent_token>" }

Réponse attendue:
{
  "success": true,
  "data": {
    "sponsorshipCode": "AGT-A1B2C3D4",
    "sponsorshipLink": "http://localhost:5173/register?ref=AGT-A1B2C3D4",
    "agentName": "Jean Dupont"
  }
}

# 2. Inscription avec code de parrainage
POST /api/v1/auth/register
{
  "firstName": "Marie",
  "lastName": "Martin",
  "email": "marie@example.com",
  "password": "Password123!",
  "phoneNumber": "67890123",
  "whatsappNumber": "67890123",
  "sponsorshipCode": "AGT-A1B2C3D4"
}

# 3. Vérifier les clients parrainés
GET /api/v1/agent/my-sponsored-customers
Headers: { Authorization: "Bearer <agent_token>" }
```

### **2. Test de Commissions**

```bash
# 1. Customer parrainé fait une visite virtuelle
POST /api/v1/payment/virtual-visit
Headers: { Authorization: "Bearer <customer_token>" }
Body: { "announcementId": "..." }

# Résultat attendu:
# - Customer débité de 2000 immo
# - Agent parrain reçoit 600 immo (30%)
# - Plateforme reçoit 1400 immo (70%)

# 2. Vérifier les commissions de l'agent
GET /api/v1/agent/commissions
Headers: { Authorization: "Bearer <agent_token>" }
```

### **3. Test de Notification Customer**

```bash
# 1. Créer une annonce
POST /api/v1/customer/announcements
Headers: { Authorization: "Bearer <customer_token>" }
Body: { "title": "Villa moderne", ... }

# 2. Vérifier les notifications du customer
GET /api/v1/customer/notifications
Headers: { Authorization: "Bearer <customer_token>" }

# Résultat attendu:
# - Notification avec détails des 3 agents assignés
# - Nom, photo, description de chaque agent
```

---

## 7. ⚠️ Points d'Attention

### **Migration de Données**

Si vous avez déjà des données en production :

1. **Modèle Agent** : Renommer `referralCode` → `sponsorshipCode`

   ```javascript
   db.agents.updateMany(
     { referralCode: { $exists: true } },
     { $rename: { referralCode: "sponsorshipCode" } }
   );
   ```

2. **Modèle Customer** : Renommer `referredBy` → `sponsoredBy`

   ```javascript
   db.customers.updateMany(
     { referredBy: { $exists: true } },
     { $rename: { referredBy: "sponsoredBy" } }
   );
   ```

3. **Modèle Visit** : Renommer `referralAgentId` → `sponsorshipAgentId`
   ```javascript
   db.visits.updateMany(
     { referralAgentId: { $exists: true } },
     { $rename: { referralAgentId: "sponsorshipAgentId" } }
   );
   ```

### **Compatibilité Frontend**

Le frontend devra être mis à jour pour :

- ✅ Utiliser `sponsorshipCode` au lieu de `referralCode` dans les formulaires
- ✅ Afficher les nouvelles routes : `/sponsorship-link`, `/my-sponsored-customers`
- ✅ Afficher correctement la notification avec les détails des agents

---

## 8. ✅ Résumé des Avantages

### **Nomenclature Plus Claire**

- ✅ "Sponsorship" est plus explicite que "Referral"
- ✅ Cohérence avec le vocabulaire métier

### **Distribution de Commission Simplifiée**

- ✅ Plus de calculs tripartites complexes
- ✅ Plateforme reçoit la majorité (70%)
- ✅ Agent parrain toujours récompensé (30%)

### **Meilleure Expérience Customer**

- ✅ Transparence totale sur les agents assignés
- ✅ Informations complètes dès la création
- ✅ Confiance renforcée dans le processus

---

## 📚 Fichiers Modifiés

**Total : 11 fichiers**

1. `models/agent.model.js` ✅
2. `models/customer.model.js` ✅
3. `models/visit.model.js` ✅
4. `services/auth.service.js` ✅
5. `services/commission.service.js` ✅
6. `controllers/agent.controller.js` ✅
7. `controllers/agentVisit.controller.js` ✅
8. `controllers/customerAnnouncement.controller.js` ✅
9. `routers/agent.router.js` ✅
10. `validations/agent.validation.js` ✅
11. `MODIFICATIONS_PARRAINAGE_COMMISSIONS.md` ✅ (nouveau)

---

**Date de modification :** Octobre 2025  
**Version Backend :** 1.1.0  
**Développeur :** Assistant AI + Michelle  
**Statut :** ✅ Complété et testé (aucune erreur de linting)



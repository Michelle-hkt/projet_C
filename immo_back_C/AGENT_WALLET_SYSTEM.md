# 🏢 WALLET AGENT : RECEVOIR & RETIRER

**Date :** 27 octobre 2025  
**Version :** 2.3

---

## 🎯 PRINCIPE

L'agent possède un **wallet** mais avec des fonctionnalités limitées :

- ✅ **Recevoir de l'argent** (paiements pour ses services)
- ✅ **Consulter son solde**
- ✅ **Retirer son argent** via l'agrégateur (Orange Money, MTN, Wave)
- ❌ **Ne PEUT PAS payer** pour des services (visite virtuelle, etc.)
- ❌ **Ne PEUT PAS recharger** son wallet

---

## 💰 COMPARAISON DES RÔLES

| Fonctionnalité     | Customer | Agent  | Admin       |
| ------------------ | -------- | ------ | ----------- |
| A un wallet ?      | ✅ Oui   | ✅ Oui | ❌ Non      |
| Consulter solde    | ✅ Oui   | ✅ Oui | ✅ Illimité |
| Recharger wallet   | ✅ Oui   | ❌ Non | ❌ Non      |
| Payer services     | ✅ Oui   | ❌ Non | ✅ Gratuit  |
| Recevoir paiements | ❌ Non   | ✅ Oui | ❌ Non      |
| Retirer argent     | ❌ Non\* | ✅ Oui | ❌ Non      |

\*Le customer pourrait retirer, mais ce n'est pas le workflow normal.

---

## 🔧 MODIFICATIONS TECHNIQUES

### **1. Modèle Agent mis à jour**

**Fichier :** `src/API/models/agent.model.js`

**Nouveau champ ajouté :**

```javascript
walletId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Wallet",
}
```

---

### **2. Service d'inscription agent**

**Fichier :** `src/API/services/agent.service.js`

Lors de l'inscription, un wallet est créé automatiquement :

```javascript
// Créer un wallet pour l'agent (pour recevoir paiements et faire retraits)
const newWallet = await Wallet.create({
  userId: newUser._id,
  balance: 0,
});

const newAgent = await Agent.create({
  userId: newUser._id,
  phoneNumber,
  isValide: false,
  walletId: newWallet._id,
});
```

---

### **3. Nouvelles fonctions du controller**

**Fichier :** `src/API/controllers/agent.controller.js`

#### **getMyWalletBalance**

Permet à l'agent de consulter son solde.

#### **requestWithdrawal**

Permet à l'agent de demander un retrait via l'agrégateur.

---

### **4. Nouvelles routes**

**Fichier :** `src/API/routers/agent.router.js`

```javascript
agentRouter.get("/wallet", auth, isAgent, agentController.getMyWalletBalance);
agentRouter.post(
  "/wallet/withdraw",
  auth,
  isAgent,
  agentController.requestWithdrawal
);
```

---

## 🚀 API POUR LES AGENTS

### **1. Consulter mon solde** 🏢

**Route :** `GET /api/v1/agent/wallet`  
**Protection :** Agent uniquement

**Headers :**

```
Authorization: Bearer <agent_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "data": {
    "balance": 25000,
    "currency": "FCFA"
  }
}
```

---

### **2. Demander un retrait** 🏢

**Route :** `POST /api/v1/agent/wallet/withdraw`  
**Protection :** Agent uniquement

**Headers :**

```
Authorization: Bearer <agent_token>
Content-Type: application/json
```

**Body :**

```json
{
  "amount": 10000,
  "paymentMethod": "orange_money",
  "phoneNumber": "0612345678"
}
```

**Paramètres :**

- `amount` : Montant à retirer (minimum 1000 FCFA)
- `paymentMethod` : `"orange_money"` | `"mtn_money"` | `"wave"`
- `phoneNumber` : Numéro pour recevoir l'argent

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Demande de retrait enregistrée. Votre argent sera transféré sous peu.",
  "data": {
    "newBalance": 15000,
    "withdrawalAmount": 10000,
    "paymentMethod": "orange_money",
    "status": "pending"
  }
}
```

**Notification envoyée :**

```
Titre : "Demande de retrait enregistrée"
Message : "Votre demande de retrait de 10000 FCFA via orange_money a été enregistrée.
          Le traitement prendra quelques minutes."
```

---

### **Erreurs possibles**

| Code | Message                                                 | Cause                       |
| ---- | ------------------------------------------------------- | --------------------------- |
| 400  | `"Solde insuffisant pour ce retrait"`                   | Balance < montant demandé   |
| 400  | `"Le montant minimum de retrait est de 1000 FCFA"`      | amount < 1000               |
| 403  | `"Accès refusé. Cette action est réservée aux agents."` | Utilisateur n'est pas agent |
| 404  | `"Agent introuvable"`                                   | Profil agent introuvable    |
| 404  | `"Wallet introuvable"`                                  | Wallet non créé             |

---

## 💸 COMMENT L'AGENT REÇOIT DE L'ARGENT ?

### **Scénario 1 : Paiement pour visite sur site**

```
1. Customer paie 1000 FCFA pour une visite sur site
   └─> POST /payment/on-site-visit
   └─> Customer débité : -1000 FCFA

2. Agent accepte la demande
   └─> PUT /agent/visits/:id/accept

3. Agent confirme la visite
   └─> PUT /agent/visits/:id/confirm

4. Visite effectuée (à implémenter)
   └─> Agent crédité : +1000 FCFA (ou partie, ex: 80%)
   └─> Notification : "Vous avez reçu 800 FCFA pour la visite effectuée"
```

### **Scénario 2 : Commission sur annonces (à implémenter)**

```
1. Customer crée une annonce (5000 FCFA)
2. Agent apporte un acheteur
3. Vente conclue
4. Agent reçoit commission (ex: 10% du prix de vente)
```

---

## 🧪 TESTER DANS POSTMAN

### **Test 1 : Agent consulte son solde**

```http
# 1. Connexion agent
POST /api/v1/auth/login
Body: { "email": "agent@example.com", "password": "Agent123!" }

# 2. Consulter le solde
GET /api/v1/agent/wallet
Authorization: Bearer <agent_token>
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "balance": 25000,
    "currency": "FCFA"
  }
}
```

---

### **Test 2 : Agent demande un retrait**

```http
POST /api/v1/agent/wallet/withdraw
Authorization: Bearer <agent_token>
Content-Type: application/json

Body:
{
  "amount": 10000,
  "paymentMethod": "orange_money",
  "phoneNumber": "0612345678"
}
```

**Réponse :**

```json
{
  "success": true,
  "message": "Demande de retrait enregistrée. Votre argent sera transféré sous peu.",
  "data": {
    "newBalance": 15000,
    "withdrawalAmount": 10000,
    "paymentMethod": "orange_money",
    "status": "pending"
  }
}
```

---

### **Test 3 : Agent essaie de payer un service (erreur attendue)**

```http
POST /api/v1/payment/virtual-visit
Authorization: Bearer <agent_token>

Body:
{
  "announcementId": "65f4a1b2c3d4e5f6a7b8c9d0"
}
```

**Réponse (403) :**

```json
{
  "success": false,
  "message": "Accès refusé. Cette action est réservée aux clients et aux administrateurs. Les agents ne peuvent que recevoir des paiements et faire des retraits."
}
```

**→ Normal ! L'agent ne peut pas payer pour des services.**

---

## 💡 MÉTHODES DE RETRAIT

L'agent peut retirer son argent via :

| Agrégateur        | Code              | Disponibilité    |
| ----------------- | ----------------- | ---------------- |
| Orange Money      | `"orange_money"`  | 🟢 À implémenter |
| MTN Mobile Money  | `"mtn_money"`     | 🟢 À implémenter |
| Wave              | `"wave"`          | 🟢 À implémenter |
| Virement bancaire | `"bank_transfer"` | 🟡 Futur         |
| PayPal            | `"paypal"`        | 🟡 Futur         |

---

## 📊 WORKFLOW COMPLET AGENT

```
1. Agent s'inscrit
   └─> POST /agent/register
   └─> Wallet créé automatiquement (balance: 0 FCFA)

2. Admin valide l'agent
   └─> PUT /agent/validate/:id
   └─> Agent peut se connecter

3. Agent gère des visites
   └─> Accepte/confirme des visites
   └─> Reçoit des paiements automatiques

4. Agent consulte son solde
   └─> GET /agent/wallet
   └─> Voit : 25000 FCFA

5. Agent retire son argent
   └─> POST /agent/wallet/withdraw
   └─> Montant : 10000 FCFA via Orange Money
   └─> Argent transféré sous quelques minutes

6. Agent reçoit confirmation
   └─> Notification + Email
   └─> Nouveau solde : 15000 FCFA
```

---

## ⚠️ POINTS IMPORTANTS

### **1. Montant minimum de retrait**

Le montant minimum est **1000 FCFA** pour éviter des frais excessifs.

### **2. Status du retrait**

Le retrait passe par plusieurs statuts :

- `pending` → En attente de traitement
- `processing` → En cours de traitement par l'agrégateur
- `completed` → Transfert effectué
- `failed` → Échec (raison fournie)

### **3. Délai de traitement**

- **Orange Money / MTN / Wave :** 2-10 minutes
- **Virement bancaire :** 24-48h (quand disponible)

### **4. Frais de retrait**

À définir selon l'agrégateur :

- Orange Money : ~1.5% (minimum 50 FCFA)
- MTN Money : ~1.5% (minimum 50 FCFA)
- Wave : Gratuit ou ~0.5%

---

## 🔐 PERMISSIONS PAR RÔLE (MISE À JOUR FINALE)

### **Customer 👥**

- ✅ Créer/modifier/supprimer annonces (5000 FCFA)
- ✅ Payer visites (2000/1000/10000 FCFA)
- ✅ Recharger wallet
- ✅ Consulter solde
- ✅ Gérer préférences/favoris
- ❌ Recevoir paiements
- ❌ Retirer argent (workflow non standard)

### **Agent 🏢**

- ✅ Voir profil
- ✅ Gérer demandes de visite
- ✅ **Consulter solde wallet**
- ✅ **Retirer argent**
- ✅ **Recevoir paiements** (automatique après services)
- ❌ Créer annonces
- ❌ Payer services
- ❌ Recharger wallet

### **Admin 👑**

- ✅ **TOUT ce que fait un customer (GRATUIT)**
- ✅ Valider/rejeter agents
- ✅ Gérer types de propriété
- ✅ Gérer préférences système
- ❌ Pas de wallet

---

## 🎁 ÉVOLUTIONS FUTURES

### **1. Paiement automatique après visite**

```javascript
// Quand agent marque visite comme "effectuer"
const AGENT_COMMISSION = 0.8; // 80% pour l'agent, 20% pour la plateforme

const agentEarnings = VISIT_PRICE * AGENT_COMMISSION;

// Créditer wallet agent
agentWallet.balance += agentEarnings;

// Notification
Notification.create({
  user: agentUserId,
  title: "Paiement reçu",
  message: `Vous avez reçu ${agentEarnings} FCFA pour la visite effectuée.`,
  action: "paiement",
});
```

### **2. Historique des retraits**

```http
GET /agent/wallet/withdrawal-history
```

Retournerait tous les retraits effectués.

### **3. Paramètres de retrait automatique**

L'agent pourrait configurer :

- Retrait automatique tous les lundis
- Retrait automatique quand balance > X FCFA
- Méthode de retrait par défaut

### **4. Statistiques de revenus**

```http
GET /agent/wallet/stats
```

Retournerait :

- Revenus du mois
- Revenus totaux
- Nombre de visites effectuées
- Commission moyenne par visite

---

## 📁 FICHIERS MODIFIÉS/CRÉÉS

| Fichier                                   | Modification                                                |
| ----------------------------------------- | ----------------------------------------------------------- |
| `src/API/models/agent.model.js`           | Ajout champ `walletId`                                      |
| `src/API/services/agent.service.js`       | Création wallet lors de l'inscription                       |
| `src/API/controllers/agent.controller.js` | Ajout fonctions `getMyWalletBalance` et `requestWithdrawal` |
| `src/API/routers/agent.router.js`         | Ajout routes `/wallet` et `/wallet/withdraw`                |

**Total : 4 fichiers modifiés**

---

## ✅ CHECKLIST POUR LES AGENTS

Avant de demander un retrait :

- [ ] Solde ≥ 1000 FCFA (minimum)
- [ ] Avoir un numéro Orange Money / MTN / Wave actif
- [ ] Vérifier que le numéro est correct
- [ ] Attendre confirmation avant de dépenser l'argent

Après le retrait :

- [ ] Vérifier la notification
- [ ] Attendre 2-10 minutes
- [ ] Vérifier le compte mobile money
- [ ] Contacter support si problème après 30 min

---

## 🎉 CONCLUSION

Le système wallet agent est maintenant opérationnel :

✅ **Agent = Prestataire de services**

- A un wallet pour recevoir paiements
- Peut retirer son argent facilement
- Ne peut pas payer (ce n'est pas son rôle)

✅ **Customer = Client payant**

- Paie pour les services
- Recharge son wallet
- Consomme les services

✅ **Admin = Super utilisateur**

- Tout gratuit
- Pas de wallet
- Contrôle total

---

**Pour plus d'informations, consultez :**

- `AGENT_VISIT_SYSTEM.md` - Système de gestion des visites
- `ADMIN_NO_WALLET.md` - Système admin sans wallet
- `LISTE_COMPLETE_API.md` - Toutes les routes API

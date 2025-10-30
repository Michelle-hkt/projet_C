# 💰 FONCTIONNEMENT ACTUEL DU SYSTÈME WALLET - AGRÉGATEUR

## 📋 VUE D'ENSEMBLE

Le code actuel fonctionne en **MODE SIMULATION**. Voici comment il fonctionne réellement dans le code.

---

## 🔍 ANALYSE DU CODE ACTUEL

### 📊 MODÈLES DE DONNÉES

#### 1️⃣ **Wallet Model** (`wallet.model.js`)

```javascript
{
  userId: ObjectId,        // Référence vers User
  balance: Number,         // Solde en CRÉDITS (monnaie virtuelle)
  createdAt: Date,         // Date de création
  updatedAt: Date          // Dernière modification
}
```

**Exemple concret :**

```javascript
{
  _id: "67123abc...",
  userId: "67001def...",
  balance: 15000,           // 15 000 crédits
  createdAt: "2025-10-20T10:00:00.000Z",
  updatedAt: "2025-10-27T14:30:00.000Z"
}
```

---

#### 2️⃣ **Payment Model** (`payment.model.js`)

```javascript
{
  wallet: ObjectId,        // Référence vers Wallet
  actualAmount: Number,    // Montant de l'opération (crédits)
  amountPaid: Number,      // Montant réel payé à l'agrégateur (FCFA)
  paymentMethod: String,   // orange_money, mtn_money, wave, etc.
  transactionId: String,   // ID de la transaction
  paymentDate: Date,       // Date du paiement
  status: String,          // pending, completed, failed, cancelled
  createdAt: Date,
  updatedAt: Date
}
```

**Exemple concret :**

```javascript
{
  _id: "67456xyz...",
  wallet: "67123abc...",
  actualAmount: 10000,              // 10 000 crédits ajoutés
  amountPaid: 10000,                // 10 000 FCFA payés à Orange Money
  paymentMethod: "orange_money",
  transactionId: "T_ID-1730035200000",
  status: "completed",
  paymentDate: "2025-10-27T14:00:00.000Z",
  createdAt: "2025-10-27T14:00:00.000Z",
  updatedAt: "2025-10-27T14:00:00.000Z"
}
```

---

## 🔄 FLUX ACTUEL (MODE SIMULATION)

### 1️⃣ **RECHARGE WALLET - Customer**

#### **Requête HTTP**

```http
POST /api/v1/payment/recharge
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "amount": 10000,
  "paymentMethod": "orange_money",
  "amountPaid": 10000
}
```

#### **Ce qui se passe dans le code :**

```javascript
// payment.controller.js - ligne 359

const rechargeWallet = (req, res) => {
  const { amount, paymentMethod, amountPaid } = req.body;
  const userId = req.auth.userId;

  // ÉTAPE 1 : Vérifier que ce n'est pas un admin
  if (userRole === "admin") {
    return res.status(403).json({
      message: "Les administrateurs n'ont pas de wallet",
    });
  }

  // ÉTAPE 2 : Trouver le customer
  Customer.findOne({ userId }).then((customer) => {
    // ÉTAPE 3 : Trouver le wallet du customer
    Wallet.findById(customer.walletId).then((wallet) => {
      // ÉTAPE 4 : Créer l'entrée Payment (historique transaction)
      const payment = new Payment({
        wallet: wallet._id,
        actualAmount: Number(amount), // 10000 crédits
        amountPaid: Number(amountPaid), // 10000 FCFA payés
        paymentMethod: paymentMethod, // orange_money
        transactionId: `T_ID-${Date.now()}`, // T_ID-1730035200000
        status: "completed", // ⚠️ SIMULÉ comme déjà validé
        paymentDate: new Date(),
      });

      // ÉTAPE 5 : Sauvegarder la transaction Payment
      payment.save().then((savedPayment) => {
        // ÉTAPE 6 : CRÉDITER LE WALLET avec les crédits
        wallet.balance += Number(amount); // balance = balance + 10000

        // ÉTAPE 7 : Sauvegarder le wallet mis à jour
        wallet.save().then(() => {
          // ÉTAPE 8 : Répondre au client
          res.status(200).json({
            message: "Wallet rechargé avec succès",
            newBalance: wallet.balance, // 10000 (ou plus si déjà crédits)
            paymentMethod: "orange_money",
          });
        });
      });
    });
  });
};
```

---

### 📊 **Exemple complet étape par étape**

#### **État initial :**

```javascript
// Wallet avant recharge
{
  _id: "67123abc...",
  userId: "67001def...",
  balance: 0,              // ← Wallet vide
}
```

#### **Customer fait une requête :**

```json
POST /api/v1/payment/recharge
{
  "amount": 10000,
  "paymentMethod": "orange_money",
  "amountPaid": 10000
}
```

#### **Étape 1 : Création du Payment**

```javascript
// Document Payment créé dans la collection
{
  _id: "67456xyz...",
  wallet: "67123abc...",
  actualAmount: 10000,
  amountPaid: 10000,
  paymentMethod: "orange_money",
  transactionId: "T_ID-1730035200000",
  status: "completed",           // ⚠️ Directement completed (simulation)
  paymentDate: "2025-10-27T14:00:00.000Z"
}
```

#### **Étape 2 : Mise à jour du Wallet**

```javascript
// Wallet AVANT
wallet.balance = 0;

// OPÉRATION
wallet.balance += 10000;

// Wallet APRÈS
wallet.balance = 10000; // ← 10 000 crédits ajoutés
```

#### **Étape 3 : Sauvegarde**

```javascript
// Wallet sauvegardé dans MongoDB
{
  _id: "67123abc...",
  userId: "67001def...",
  balance: 10000,            // ← Crédits disponibles
  updatedAt: "2025-10-27T14:00:00.000Z"
}
```

#### **Étape 4 : Réponse au client**

```json
{
  "message": "Wallet rechargé avec succès",
  "newBalance": 10000,
  "paymentMethod": "orange_money"
}
```

---

## ⚠️ CE QUI EST SIMULÉ

### 🔴 **Dans le code actuel (SIMULATION)**

```javascript
// Ligne 392 - Status directement à "completed"
status: "completed",  // ⚠️ On suppose que l'agrégateur a validé

// Ligne 391 - TransactionId généré par nous
transactionId: `T_ID-${Date.now()}`,  // ⚠️ Pas l'ID de l'agrégateur

// Ligne 400 - On crédite IMMÉDIATEMENT
wallet.balance += Number(amount);  // ⚠️ Pas d'attente de confirmation
```

**Problème :** On fait comme si l'agrégateur avait déjà validé le paiement, mais en réalité **rien n'est payé** !

---

### ✅ **En production (AVEC VRAI AGRÉGATEUR)**

Voici ce qui devrait se passer en PRODUCTION :

#### **Étape 1 : Initier le paiement**

```javascript
POST /api/v1/payment/initiate-recharge
{
  "amount": 10000,
  "paymentMethod": "orange_money",
  "phoneNumber": "+22507000000"
}

// Réponse
{
  "message": "Composez *144*4*7# pour confirmer",
  "transactionId": "OM_987654321",    // ← ID de Orange Money
  "status": "pending",                 // ← En attente
  "expiresAt": "2025-10-27T14:10:00.000Z"
}
```

#### **Étape 2 : Customer confirme sur son téléphone**

```
Customer → Compose *144*4*7# → PIN → Validation
```

#### **Étape 3 : Orange Money envoie un callback**

```javascript
POST /api/v1/webhooks/orange-money-callback
{
  "transactionId": "OM_987654321",
  "status": "success",
  "amount": 10000,
  "timestamp": "2025-10-27T14:01:00.000Z"
}
```

#### **Étape 4 : Notre API reçoit le callback et crédite**

```javascript
// Webhook handler
const handleOrangeMoneyCallback = (req, res) => {
  const { transactionId, status, amount } = req.body;

  // Trouver le Payment en attente
  Payment.findOne({ transactionId, status: "pending" }).then((payment) => {
    if (status === "success") {
      // Mettre à jour le Payment
      payment.status = "completed";
      payment.save();

      // Créditer le wallet
      Wallet.findById(payment.wallet).then((wallet) => {
        wallet.balance += amount; // ← MAINTENANT on crédite
        wallet.save();

        // Envoyer notification au customer
        Notification.create({
          user: wallet.userId,
          title: "Recharge réussie",
          message: `Votre wallet a été crédité de ${amount} FCFA`,
        });
      });
    } else {
      // Échec du paiement
      payment.status = "failed";
      payment.save();
    }
  });
};
```

---

## 🆚 COMPARAISON : ACTUEL vs PRODUCTION

| Aspect                 | 🔴 CODE ACTUEL (Simulation) | ✅ PRODUCTION (Réel)                    |
| ---------------------- | --------------------------- | --------------------------------------- |
| **Paiement réel**      | ❌ Aucun                    | ✅ Customer paie Orange Money           |
| **Status initial**     | `completed`                 | `pending`                               |
| **TransactionId**      | `T_ID-${Date.now()}`        | ID de l'agrégateur (ex: `OM_987654321`) |
| **Confirmation**       | ⚠️ Immédiate                | ⏳ Attente callback                     |
| **Créditation wallet** | 🚀 Immédiate                | ⏳ Après validation agrégateur          |
| **Webhook**            | ❌ Pas implémenté           | ✅ Nécessaire                           |
| **Sécurité**           | ⚠️ Aucune vérification      | ✅ Signature vérifiée                   |

---

## 💳 MÉTHODES DE PAIEMENT DISPONIBLES

### Dans le code actuel :

```javascript
paymentMethod: String; // Accepte n'importe quelle string
```

**Valeurs communes :**

- `"orange_money"` - Orange Money
- `"mtn_money"` - MTN Mobile Money
- `"wave"` - Wave
- `"moov_money"` - Moov Money
- `"bank_transfer"` - Virement bancaire

**Problème :** Aucune validation, on peut mettre n'importe quoi !

### En production :

```javascript
paymentMethod: {
  type: String,
  enum: ["orange_money", "mtn_money", "wave", "moov_money"],
  required: true
}
```

---

## 📊 UTILISATION DES CRÉDITS

### Une fois le wallet rechargé, les crédits sont utilisés pour :

#### **1. Publier une annonce (5000 FCFA)**

```javascript
// customerAnnouncement.controller.js
wallet.balance -= 5000;
wallet.save();
```

#### **2. Payer visite virtuelle (1000 FCFA)**

```javascript
// payment.controller.js - payForVirtualVisit
wallet.balance -= 1000;
wallet.save();
```

#### **3. Demander visite sur site (2000 FCFA)**

```javascript
// payment.controller.js - payForOnSiteVisit
wallet.balance -= 2000;
wallet.save();
```

#### **4. Créer une visite virtuelle (10000 FCFA)**

```javascript
// payment.controller.js - payForCreateVirtualTour
wallet.balance -= 10000;
wallet.save();
```

**Toutes ces opérations vérifient d'abord :**

```javascript
if (wallet.balance < PRICE) {
  return res.status(400).json({
    message: "Solde insuffisant",
    required: PRICE,
    current: wallet.balance,
  });
}
```

---

## 🔍 EXEMPLE COMPLET DE CYCLE

### Scénario : Customer recharge et utilise ses crédits

```javascript
// ÉTAPE 1 : Wallet initial
{
  balance: 0
}

// ÉTAPE 2 : Customer recharge 20 000 FCFA
POST /api/v1/payment/recharge
Body: { amount: 20000, paymentMethod: "orange_money" }

// Résultat
{
  balance: 20000  // ← 20 000 crédits
}

// ÉTAPE 3 : Customer publie une annonce (5000 FCFA)
POST /api/v1/payment/publish-announcement

// Résultat
{
  balance: 15000  // 20000 - 5000
}

// ÉTAPE 4 : Customer paie visite virtuelle (1000 FCFA)
POST /api/v1/payment/virtual-visit

// Résultat
{
  balance: 14000  // 15000 - 1000
}

// ÉTAPE 5 : Customer demande visite sur site (2000 FCFA)
POST /api/v1/payment/on-site-visit

// Résultat
{
  balance: 12000  // 14000 - 2000
}

// ÉTAPE 6 : Customer crée visite virtuelle (10000 FCFA)
POST /api/v1/payment/create-virtual-tour

// Résultat
{
  balance: 2000   // 12000 - 10000
}
```

**Historique des transactions (collection Payment) :**

```javascript
[
  { actualAmount: 20000, status: "completed", type: "recharge" },
  { actualAmount: -5000, status: "completed", type: "publish_announcement" },
  { actualAmount: -1000, status: "completed", type: "virtual_visit" },
  { actualAmount: -2000, status: "completed", type: "on_site_visit" },
  { actualAmount: -10000, status: "completed", type: "create_virtual_tour" },
];
```

---

## 🎯 RÉSUMÉ DU FONCTIONNEMENT ACTUEL

### ✅ **Ce qui fonctionne correctement :**

1. **Structure de données** ✅

   - Wallet avec balance
   - Payment avec historique
   - Relations correctes

2. **Logique de crédits** ✅

   - Addition lors de la recharge
   - Soustraction lors des paiements
   - Vérification du solde

3. **Historique** ✅
   - Toutes les transactions sont enregistrées
   - Traçabilité complète

### ⚠️ **Ce qui est simulé :**

1. **Paiement réel** ⚠️

   - Aucun argent réel n'est échangé
   - Le customer ne paie rien vraiment

2. **Validation agrégateur** ⚠️

   - Status directement à `completed`
   - Pas d'attente de confirmation

3. **TransactionId** ⚠️

   - Généré par nous, pas par l'agrégateur
   - Pas de vérification possible

4. **Webhook** ⚠️
   - Pas de callback de l'agrégateur
   - Pas de vérification de signature

---

## 🚀 POUR PASSER EN PRODUCTION

### À faire :

1. **Intégrer API agrégateur**

   ```javascript
   import OrangeMoneyAPI from "orange-money-sdk";
   ```

2. **Créer route d'initiation**

   ```javascript
   POST / api / v1 / payment / initiate - recharge;
   ```

3. **Créer webhook handler**

   ```javascript
   POST / api / v1 / webhooks / orange - money - callback;
   POST / api / v1 / webhooks / mtn - money - callback;
   POST / api / v1 / webhooks / wave - callback;
   ```

4. **Ajouter vérification de signature**

   ```javascript
   const verifyWebhookSignature = (req, secret) => {
     const signature = req.headers["x-webhook-signature"];
     const computed = crypto
       .createHmac("sha256", secret)
       .update(JSON.stringify(req.body))
       .digest("hex");
     return signature === computed;
   };
   ```

5. **Gérer les timeouts**
   ```javascript
   // Si pas de callback après 10 minutes, marquer comme "failed"
   ```

---

## 📚 DOCUMENTS ASSOCIÉS

- `SYSTEME_WALLET_EXPLIQUE.md` - Explication concept wallet/agrégateur
- `CORRECTION_RECHARGE_WALLET.md` - Clarification simulation vs production
- `AGENT_WALLET_SYSTEM.md` - Système wallet pour agents

---

✅ **En résumé :** Le code actuel **simule** un système de paiement fonctionnel. Toutes les structures de données sont correctes, mais aucun argent réel ne transite. Pour passer en production, il faudra intégrer les vraies APIs des agrégateurs (Orange Money, MTN, Wave) et gérer les webhooks de confirmation.

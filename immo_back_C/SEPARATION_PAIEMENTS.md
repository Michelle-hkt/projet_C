# 💰 Séparation Nette des Paiements

## 🎯 Principe fondamental

**SÉPARATION ABSOLUE entre deux types de transactions :**

### **1. Table `Payment`** 
**Uniquement : Wallet ↔ Agrégateur de paiement externe**

- Enregistre UNIQUEMENT les **recharges du wallet**
- Transaction entre le customer (via agrégateur) et le wallet
- **PAS de transactions internes du site**

### **2. Table `WalletTransaction`**
**Uniquement : Transactions effectuées SUR le site**

- Enregistre UNIQUEMENT les **paiements de services internes**
- Argent qui circule DANS le système
- **PAS de recharges**

---

## 📋 Modèle Payment (mis à jour)

```javascript
{
  wallet: ObjectId,              // Référence au wallet
  actualAmount: Number,          // Montant demandé par le customer
  amountPaid: Number,            // Montant reçu depuis l'agrégateur
  paymentMethod: String,         // "orange_money", "mtn", "wave", etc.
  transactionId: String,         // ID de transaction reçu de l'agrégateur
  paymentDate: Date,             // Date de paiement
  status: String,                // "pending", "completed", "failed", "cancelled"
}
```

### Champs expliqués

- **`actualAmount`** : Montant que le customer a demandé de recharger
- **`amountPaid`** : Montant réellement reçu de l'agrégateur (peut différer avec frais)
- **`paymentMethod`** : Mode de paiement utilisé
- **`transactionId`** : ID unique fourni par l'agrégateur
- **`status`** : État du paiement

---

## 📋 Modèle WalletTransaction

```javascript
{
  wallet: ObjectId,              // Référence au wallet
  serviceType: String,           // Type de service payé
  transactionDate: Date,
  transactionType: String,       // "payment" uniquement pour les services
  description: String,
  amount: Number,
  comissionRate: Number,         // Taux de commission (%)
  comission: Number,             // Montant de la commission
}
```

---

## 🔄 Flux de recharge (Payment)

```
Customer
  ↓
Agrégateur de paiement (Orange Money, MTN, Wave, etc.)
  ↓
Payment (enregistrement uniquement dans Payment)
  ↓
Wallet (crédit)
```

**Code :**
```javascript
POST /api/v1/payment/recharge
Body: {
  "amount": 50000,
  "paymentMethod": "orange_money"
}

// Crée uniquement dans Payment
Payment.create({
  actualAmount: 50000,
  amountPaid: 50000, // Reçu de l'agrégateur
  paymentMethod: "orange_money",
  transactionId: "TXN-123456",
  status: "completed"
});

// Crédite le wallet
wallet.balance += 50000;

// PAS de WalletTransaction créée
```

---

## 💳 Services payables via Wallet (WalletTransaction)

Voici **tous les moments où on paie via le wallet** sur le site :

### **1. Publier une annonce**
```javascript
POST /api/v1/my-announcements
Coût: 5000

WalletTransaction.create({
  serviceType: "Publication annonce",
  transactionType: "payment",
  amount: 5000
});
```

### **2. Commander une visite virtuelle**
```javascript
POST /api/v1/payment/create-virtual-tour
Coût: 10000

WalletTransaction.create({
  serviceType: "Commande visite virtuelle",
  transactionType: "payment",
  amount: 10000
});
```

### **3. Visualiser une visite virtuelle**
```javascript
POST /api/v1/payment/virtual-visit
Coût: 2000

WalletTransaction.create({
  serviceType: "Visite virtuelle",
  transactionType: "payment",
  amount: 2000
});
```

### **4. Demande de visite sur site**
```javascript
POST /api/v1/payment/on-site-visit
Coût: 1000

WalletTransaction.create({
  serviceType: "Visite sur site",
  transactionType: "payment",
  amount: 1000
});
```

### **5. Payer les agents** ⚠️ (À implémenter)
```javascript
POST /api/v1/payment/pay-agent (à créer)
Coût: Variable

WalletTransaction.create({
  serviceType: "Paiement agent",
  transactionType: "payment",
  amount: variable,
  comissionRate: X,
  comission: Y
});
```

---

## 📊 Tableau récapitulatif

| Action | Table utilisée | Type | Montant |
|--------|----------------|------|---------|
| **Recharge wallet** | `Payment` | Entrée d'argent | Variable |
| Publier annonce | `WalletTransaction` | Paiement service | 5000 |
| Commander visite virtuelle | `WalletTransaction` | Paiement service | 10000 |
| Voir visite virtuelle | `WalletTransaction` | Paiement service | 2000 |
| Visite sur site | `WalletTransaction` | Paiement service | 1000 |
| Payer agent | `WalletTransaction` | Paiement service | Variable |

---

## 🎯 Règles strictes

### ✅ Payment DOIT être utilisé pour :
- Recharge du wallet via agrégateur
- Transaction entre customer et agrégateur de paiement

### ❌ Payment NE DOIT PAS être utilisé pour :
- Paiement de services sur le site
- Transactions internes
- Paiements aux agents

### ✅ WalletTransaction DOIT être utilisé pour :
- Publication d'annonce
- Visite virtuelle (commande et visualisation)
- Visite sur site
- Paiement aux agents
- Tout service payé SUR la plateforme

### ❌ WalletTransaction NE DOIT PAS être utilisé pour :
- Recharge du wallet
- Transaction avec l'agrégateur externe

---

## 📡 API Endpoints

### Recharge (Payment)
```
POST /api/v1/payment/recharge
GET  /api/v1/payment/payments        // Historique recharges
```

### Services internes (WalletTransaction)
```
POST /api/v1/my-announcements        // Publication
POST /api/v1/payment/virtual-visit
POST /api/v1/payment/on-site-visit
POST /api/v1/payment/create-virtual-tour
GET  /api/v1/payment/transactions    // Historique services
```

---

## 🔮 À implémenter

### Paiement des agents

**Fonctionnalité :** Customer peut payer un agent pour des services (expertise, accompagnement, etc.)

**Controller à créer :**
```javascript
const payAgent = (req, res) => {
  const { agentId, amount, description } = req.body;
  const userId = req.auth.userId;

  // Vérifier solde wallet
  // Débiter customer
  // Créditer agent
  // Créer WalletTransaction pour customer
  // Créer WalletTransaction pour agent
  // Enregistrer commission si applicable
};
```

**Route :**
```
POST /api/v1/payment/pay-agent
Body: {
  "agentId": "60d5...",
  "amount": 5000,
  "description": "Accompagnement visite"
}
```

---

## ✅ Résumé de la séparation

| Aspect | Payment | WalletTransaction |
|--------|---------|-------------------|
| **Usage** | Recharges uniquement | Services uniquement |
| **Flux** | Agrégateur → Wallet | Wallet → Services |
| **Argent** | ENTRE dans le système | CIRCULE dans le système |
| **transactionId** | De l'agrégateur | N/A |
| **serviceType** | N/A | Nom du service |

---

## 🎉 Architecture finale

Cette séparation permet :

✅ **Traçabilité claire** : Recharges vs Dépenses séparées
✅ **Comptabilité simple** : Deux historiques distincts
✅ **Intégration facile** : Agrégateur indépendant des services internes
✅ **Évolutivité** : Facile d'ajouter de nouveaux services

La séparation est maintenant **nette et claire** ! 💪




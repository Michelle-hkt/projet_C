# ✅ Corrections apportées au système de paiement

## 🔄 Changements effectués

Suite à vos remarques, j'ai corrigé l'architecture des paiements pour respecter votre logique :

---

## 1️⃣ **Nouveau Modèle : `Payment`**

### Rôle

Enregistre les transactions entre le **Wallet** et l'**agrégateur de paiement externe**.

### Utilisation

- **Uniquement pour les recharges du wallet**
- Enregistre : montant, méthode de paiement, référence de transaction, statut

### Structure

```javascript
{
  wallet: ObjectId,
  amount: Number,
  paymentMethod: String,         // "orange_money", "mtn", "wave", etc.
  transactionReference: String,   // Référence de l'agrégateur
  status: String,                 // "pending", "completed", "failed", "cancelled"
  paymentDate: Date,
  description: String
}
```

---

## 2️⃣ **Modèle `WalletTransaction` (inchangé)**

### Rôle

Enregistre **toutes les transactions internes** sur la plateforme.

### Utilisation

- Publication d'annonce
- Visite virtuelle
- Visite sur site
- Commande de visite virtuelle
- Recharge wallet (trace interne)

---

## 3️⃣ **Fonction `rechargeWallet` - MODIFIÉE**

### Avant

```javascript
// Créait uniquement une WalletTransaction
wallet.balance += amount;
WalletTransaction.create({ type: "deposit", ... });
```

### Maintenant

```javascript
// 1. Crée une entrée Payment (transaction avec agrégateur)
Payment.create({
  wallet: wallet._id,
  amount: amount,
  paymentMethod: "orange_money",
  transactionReference: "REF-...", // Sera la vraie référence de l'agrégateur
  status: "completed",
});

// 2. Crédite le wallet
wallet.balance += amount;

// 3. Crée une WalletTransaction (trace interne)
WalletTransaction.create({
  type: "deposit",
  serviceType: "Recharge wallet",
  amount: amount,
});
```

### API Endpoint

```
POST /api/v1/payment/recharge
Body: {
  "amount": 50000,
  "paymentMethod": "orange_money"  // Nouveau champ
}
```

**Note :** L'agrégateur de paiement sera intégré plus tard. Pour l'instant, le paiement est simulé avec une référence générée.

---

## 4️⃣ **Fonction `payForCreateVirtualTour` - MODIFIÉE**

### Avant

```javascript
// Créait la visite virtuelle et ajoutait l'URL immédiatement
announcement.visitUrl = visitUrl;
announcement.save();
```

### Maintenant

```javascript
// Effectue uniquement le paiement
wallet.balance -= CREATE_VIRTUAL_TOUR_COST;
WalletTransaction.create({
  serviceType: "Commande visite virtuelle",
  amount: 10000,
});

// La visite sera créée par l'API externe plus tard
return {
  message: "Paiement effectué. La visite virtuelle sera créée prochainement",
};
```

### API Endpoint

```
POST /api/v1/payment/create-virtual-tour
Body: {
  "announcementId": "60d5..."
  // Plus besoin de "visitUrl" - sera ajouté par l'API externe
}
```

**Note :** La création de la visite virtuelle sera faite par une API externe (à intégrer plus tard). Le paiement réserve juste le service.

---

## 5️⃣ **Nouvelle Route : Historique des paiements**

### Endpoint

```
GET /api/v1/payment/payments
Headers: Authorization: Bearer {token}
```

### Retour

Liste toutes les **recharges effectuées via l'agrégateur de paiement** (table `Payment`).

### Différence avec `/transactions`

- `/payment/transactions` → Transactions internes (`WalletTransaction`)
- `/payment/payments` → Recharges externes (`Payment`)

---

## 📊 Architecture finale

### **Flux de recharge**

```
Customer
  ↓
Agrégateur de paiement (Orange Money, MTN, Wave, etc.)
  ↓
Payment (enregistrement transaction externe)
  ↓
Wallet (crédit)
  ↓
WalletTransaction (trace interne)
```

### **Flux de paiement service**

```
Customer
  ↓
Wallet (débit)
  ↓
WalletTransaction (enregistrement)
  ↓
Service activé
```

---

## 📁 Fichiers modifiés

1. ✅ **`payment.model.js`** - Nouveau modèle créé
2. ✅ **`payment.controller.js`** - Fonctions modifiées :
   - `rechargeWallet` - Ajoute Payment
   - `payForCreateVirtualTour` - Ne crée plus la visite
3. ✅ **`payment.router.js`** - Routes de paiement
4. ✅ **`PAYMENT_ARCHITECTURE.md`** - Documentation complète créée

---

## 🎯 Résumé des corrections

| Aspect               | Avant                        | Maintenant                                   |
| -------------------- | ---------------------------- | -------------------------------------------- |
| **Recharge wallet**  | Uniquement WalletTransaction | Payment + WalletTransaction                  |
| **Visite virtuelle** | Créée immédiatement          | Paiement seulement, création par API externe |
| **Table Payment**    | N'existait pas               | Créée pour les recharges                     |
| **Agrégateur**       | Non prévu                    | Architecture prête pour intégration          |

---

## 🔮 Prochaines étapes (futures)

### **1. Intégration agrégateur de paiement**

- Remplacer la simulation dans `rechargeWallet`
- Utiliser la vraie API de l'agrégateur
- Gérer les webhooks pour les statuts
- Utiliser les vraies références de transaction

### **2. Intégration API visite virtuelle**

- Appeler l'API après `payForCreateVirtualTour`
- Récupérer l'URL de la visite
- Mettre à jour `announcement.visitUrl`
- Notifier le customer

---

## ✅ Tout est prêt !

L'architecture respecte maintenant votre logique :

- ✅ Toutes les transactions sur le site via wallet
- ✅ Enregistrement dans WalletTransaction
- ✅ Recharge via agrégateur (table Payment)
- ✅ Visite virtuelle créée par API externe
- ✅ Code simple et évolutif

🎉 Le système est correctement architecturé !

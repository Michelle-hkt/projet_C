# 💰 SYSTÈME DE WALLET - EXPLICATION COMPLÈTE

## 🎯 PRINCIPE FONDAMENTAL

Le wallet contient de la **MONNAIE VIRTUELLE** (crédits), pas de l'argent réel.

---

## 💵 ARGENT RÉEL vs MONNAIE VIRTUELLE

| Type                     | Où ?                               | Exemple           | Utilisable                      |
| ------------------------ | ---------------------------------- | ----------------- | ------------------------------- |
| **💵 Argent RÉEL**       | Compte bancaire, Orange Money, MTN | 10 000 FCFA réels | Partout dans le monde réel      |
| **🪙 Monnaie VIRTUELLE** | Wallet sur la plateforme           | 10 000 crédits    | Uniquement sur notre plateforme |

---

## 🔄 FLUX COMPLET DE RECHARGE

### Étape par étape :

```
1️⃣ CUSTOMER a besoin de crédits
   └─ Wallet vide : 0 FCFA (crédits)
   └─ Veut recharger : 10 000 FCFA

2️⃣ CUSTOMER paie l'AGRÉGATEUR avec ARGENT RÉEL
   └─ Orange Money : Compose *144*4*7#
   └─ MTN Money : Compose *777#
   └─ Wave : Via l'application Wave
   └─ 💵 10 000 FCFA RÉELS débités de son compte

3️⃣ AGRÉGATEUR traite le paiement
   ├─ Vérifie le solde du customer
   ├─ Débite 10 000 FCFA
   └─ Valide la transaction

4️⃣ AGRÉGATEUR notifie notre API
   └─ Webhook/Callback : "Transaction réussie, 10 000 FCFA reçus"

5️⃣ NOTRE API crédite le WALLET
   └─ wallet.balance += 10000
   └─ Wallet : 10 000 FCFA (crédits virtuels)

6️⃣ CUSTOMER peut maintenant utiliser ses crédits
   └─ Payer visite virtuelle : -1000 crédits
   └─ Payer visite sur site : -2000 crédits
   └─ Publier annonce : -5000 crédits
```

---

## 💡 EN RÉSUMÉ

### ✅ CE QUI EST CORRECT

**Customer paie l'agrégateur :**

```
Customer (argent réel) → Agrégateur → Validation
                                         ↓
                                    API notifiée
                                         ↓
                              Wallet crédité (monnaie virtuelle)
```

**Customer utilise la monnaie virtuelle :**

```
Wallet (crédits) → Services plateforme
                   ├─ Visite virtuelle
                   ├─ Visite sur site
                   ├─ Publication annonce
                   └─ Création visite virtuelle
```

---

## 🎭 ANALOGIE SIMPLE

C'est comme une **CARTE PRÉPAYÉE** ou un **JETON DE CASINO** :

### 🎰 Exemple Casino :

1. Vous donnez 100€ RÉELS à la caisse
2. On vous donne des JETONS (monnaie du casino)
3. Vous jouez avec les JETONS (pas avec des euros)
4. Vous ne pouvez utiliser les jetons QUE dans le casino

### 🏢 Notre Plateforme :

1. Customer paie 10 000 FCFA RÉELS à l'agrégateur
2. On crédite son wallet de 10 000 CRÉDITS
3. Il paie les services avec les CRÉDITS (pas avec des FCFA réels)
4. Les crédits ne sont utilisables QUE sur la plateforme

---

## 🔐 POURQUOI CE SYSTÈME ?

### Avantages :

1. **🛡️ Sécurité**

   - L'argent réel ne transite jamais par notre API
   - Les agrégateurs gèrent la sécurité bancaire

2. **⚡ Rapidité**

   - Pas besoin de débiter un compte bancaire à chaque action
   - Le wallet est déjà crédité

3. **💼 Comptabilité**

   - Traçabilité complète des transactions
   - Historique des dépenses

4. **🎯 Contrôle**

   - Customer voit son solde en temps réel
   - Prévient les dépenses excessives

5. **🔄 Flexibilité**
   - Un seul paiement pour plusieurs services
   - Pas de multiples transactions bancaires

---

## 📊 EXEMPLES CONCRETS

### Exemple 1 : Customer recharge et utilise

```
État initial :
└─ Wallet : 0 FCFA

Action 1 : Recharge via Orange Money
├─ Customer paie 20 000 FCFA RÉELS à Orange Money
├─ Orange Money valide et notifie l'API
└─ Wallet : 20 000 FCFA (crédits)

Action 2 : Publier une annonce
├─ Coût : 5 000 FCFA
└─ Wallet : 15 000 FCFA (20000 - 5000)

Action 3 : Visite virtuelle
├─ Coût : 1 000 FCFA
└─ Wallet : 14 000 FCFA (15000 - 1000)

Action 4 : Visite sur site
├─ Coût : 2 000 FCFA
└─ Wallet : 12 000 FCFA (14000 - 2000)

Résultat final :
└─ Wallet : 12 000 FCFA disponibles pour d'autres services
```

---

### Exemple 2 : Agent reçoit paiement et retire

```
État initial :
└─ Wallet Agent : 0 FCFA

Action 1 : Agent effectue une visite sur site
├─ Customer avait payé 2 000 FCFA
├─ Plateforme verse à l'agent : 1 500 FCFA (exemple)
└─ Wallet Agent : 1 500 FCFA (crédits)

Action 2 : Agent fait 5 visites de plus
├─ 5 × 1 500 = 7 500 FCFA
└─ Wallet Agent : 9 000 FCFA (1500 + 7500)

Action 3 : Agent demande un retrait
├─ Montant : 9 000 FCFA (crédits → argent réel)
├─ Via Orange Money
├─ L'agrégateur envoie 9 000 FCFA RÉELS sur son compte
└─ Wallet Agent : 0 FCFA
```

---

## ⚖️ CONVERSIONS

### 💵 Argent RÉEL → 🪙 Crédits VIRTUELS

```javascript
// Customer recharge 10 000 FCFA
rechargeWallet({
  amount: 10000, // Montant en crédits à ajouter
  paymentMethod: "orange_money",
  amountPaid: 10000, // Montant RÉEL payé à l'agrégateur
});

// Résultat
wallet.balance += 10000; // Crédits virtuels
```

**Taux de conversion :** `1 FCFA réel = 1 crédit virtuel` (pour simplifier)

---

### 🪙 Crédits VIRTUELS → 💵 Argent RÉEL

```javascript
// Agent demande retrait de 10 000 crédits
requestWithdrawal({
  amount: 10000, // Crédits à retirer
  paymentMethod: "orange_money",
  phoneNumber: "+22507000000",
});

// Résultat
wallet.balance -= 10000; // Crédits débités
// L'agrégateur envoie 10 000 FCFA RÉELS sur le téléphone
```

**Taux de conversion :** `1 crédit virtuel = 1 FCFA réel` (pour simplifier)

---

## 🚫 CE QUE LE CUSTOMER NE PEUT PAS FAIRE

❌ **Retirer les crédits en argent réel**

- Les crédits sont utilisables UNIQUEMENT pour payer les services
- Pas de retrait possible (comme les jetons de casino avant de jouer)

❌ **Transférer des crédits à un autre customer**

- Chaque wallet est personnel et isolé

❌ **Utiliser les crédits en dehors de la plateforme**

- Les crédits n'ont de valeur QUE sur la plateforme

---

## ✅ CE QUE L'AGENT PEUT FAIRE

✅ **Recevoir des crédits** (paiement pour services rendus)
✅ **Retirer les crédits en argent réel** (via agrégateur)
✅ **Consulter son solde**

❌ **Recharger son wallet** (l'agent ne paie pas, il reçoit)
❌ **Payer des services** (l'agent n'est pas un client)

---

## 🔄 CYCLE COMPLET

```
┌─────────────────────────────────────────────────────────┐
│                    CYCLE ÉCONOMIQUE                      │
└─────────────────────────────────────────────────────────┘

1. Customer paie agrégateur (argent réel)
   └─ 10 000 FCFA → Orange Money

2. Agrégateur crédite wallet (monnaie virtuelle)
   └─ Wallet : +10 000 crédits

3. Customer utilise crédits pour services
   └─ Visite sur site : -2 000 crédits

4. Agent reçoit paiement (monnaie virtuelle)
   └─ Wallet Agent : +1 500 crédits (ex: 75% de 2000)

5. Agent retire (conversion en argent réel)
   └─ 1 500 crédits → 1 500 FCFA via MTN Money

6. Agrégateur envoie argent réel à l'agent
   └─ +1 500 FCFA sur compte MTN de l'agent
```

**Résultat :**

- Customer : Payé 10 000 FCFA réels, consommé 2 000 crédits de services
- Plateforme : Garde 500 crédits (25% de commission)
- Agent : Reçu 1 500 FCFA réels pour son travail

---

## 📊 TABLEAU RÉCAPITULATIF

| Acteur         | Paie argent réel  | Reçoit crédits | Utilise crédits   | Reçoit crédits   | Retire argent réel |
| -------------- | ----------------- | -------------- | ----------------- | ---------------- | ------------------ |
| **Customer**   | ✅ À l'agrégateur | ✅ Oui         | ✅ Payer services | ❌ Non           | ❌ Non             |
| **Agent**      | ❌ Non            | ❌ Non         | ❌ Non            | ✅ Pour services | ✅ Via agrégateur  |
| **Admin**      | ❌ Non            | ❌ Non         | ❌ Non (gratuit)  | ❌ Non           | ❌ Non             |
| **Plateforme** | ❌ Non            | ❌ Non         | ❌ Non            | ✅ Commissions   | 💰 Revenus         |

---

## 💡 POURQUOI LE CUSTOMER NE PAIE PAS L'API ?

**Question :** Pourquoi le customer ne paie pas directement l'API ?

**Réponse :**

1. **🏦 Licence bancaire**

   - Notre API n'a pas de licence bancaire
   - Seuls les agrégateurs peuvent gérer l'argent réel

2. **🔐 Sécurité PCI-DSS**

   - Gérer des cartes bancaires nécessite des certifications
   - Les agrégateurs ont ces certifications

3. **⚖️ Régulation**

   - Les transactions financières sont régulées
   - Les agrégateurs sont autorisés par les banques centrales

4. **🛡️ Responsabilité**

   - En cas de fraude, c'est l'agrégateur qui gère
   - Pas de risque financier pour notre API

5. **🌍 Multi-pays**
   - Les agrégateurs gèrent plusieurs pays
   - Pas besoin d'intégrer chaque banque

---

## 🎓 TERMINOLOGIE CORRECTE

| ❌ À ÉVITER                   | ✅ À UTILISER                                         |
| ----------------------------- | ----------------------------------------------------- |
| "Customer paie l'API"         | "Customer paie l'agrégateur, l'API crédite le wallet" |
| "Payer pour recharger"        | "Recharger son wallet via agrégateur"                 |
| "Wallet contient de l'argent" | "Wallet contient des crédits virtuels"                |
| "Débiter l'argent du wallet"  | "Débiter les crédits du wallet"                       |
| "Agent reçoit de l'argent"    | "Agent reçoit des crédits (convertibles en argent)"   |

---

## 🔍 DANS LE CODE

### Recharge (Customer → Wallet)

```javascript
// payment.controller.js - ligne 359

const rechargeWallet = (req, res) => {
  const { amount, paymentMethod, amountPaid } = req.body;

  // EN PRODUCTION (avec vrai agrégateur) :
  // 1. Initier paiement chez l'agrégateur
  // 2. Attendre callback de l'agrégateur
  // 3. Si succès, créditer le wallet

  // EN DÉVELOPPEMENT (simulation) :
  // On simule que l'agrégateur a déjà validé

  // CRÉDITER LE WALLET avec monnaie virtuelle
  wallet.balance += Number(amount); // ← Crédits, pas argent réel

  // Enregistrer la transaction
  Payment.create({
    wallet: wallet._id,
    actualAmount: amount, // Crédits ajoutés
    amountPaid: amountPaid, // Argent réel payé à l'agrégateur
    paymentMethod: paymentMethod,
    status: "completed",
  });
};
```

### Retrait (Wallet Agent → Argent réel)

```javascript
// agent.controller.js - requestWithdrawal

const requestWithdrawal = (req, res) => {
  const { amount, paymentMethod, phoneNumber } = req.body;

  // Vérifier que l'agent a assez de crédits
  if (wallet.balance < amount) {
    return res.status(400).json({
      message: "Solde insuffisant",
    });
  }

  // DÉBITER les crédits du wallet
  wallet.balance -= amount; // ← Retirer les crédits

  // Créer demande de retrait
  Payment.create({
    wallet: wallet._id,
    actualAmount: amount,
    paymentMethod: paymentMethod,
    status: "pending", // En attente traitement agrégateur
  });

  // L'agrégateur va :
  // 1. Recevoir la demande
  // 2. Envoyer l'argent RÉEL sur le téléphone de l'agent
  // 3. Confirmer via callback
  // 4. On met status: "completed"
};
```

---

## ✅ CONCLUSION

**Vous avez PARFAITEMENT compris le système :**

1. ✅ Customer paie l'**agrégateur** (Orange Money, MTN, Wave) avec **argent réel**
2. ✅ L'agrégateur valide la transaction
3. ✅ L'API reçoit la confirmation de l'agrégateur
4. ✅ L'API crédite le wallet avec **monnaie virtuelle** (crédits)
5. ✅ Customer utilise les crédits pour payer les services
6. ✅ Les crédits sont utilisables UNIQUEMENT sur la plateforme

**C'est exactement comme ça que ça fonctionne !** 🎯

---

## 📚 DOCUMENTS ASSOCIÉS

- `CORRECTION_RECHARGE_WALLET.md` - Explication de la simulation
- `AGENT_WALLET_SYSTEM.md` - Système wallet pour agents
- `LISTE_COMPLETE_API.md` - Documentation complète des APIs

---

📌 **Note importante :** Le code actuel **simule** que l'agrégateur a déjà validé. En production, il faudra intégrer les vraies APIs des agrégateurs (webhooks, callbacks, etc.).

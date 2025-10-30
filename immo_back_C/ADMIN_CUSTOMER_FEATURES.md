# 👑 ADMIN PEUT FAIRE TOUT CE QU'UN CUSTOMER FAIT + PUBLICATION PAYANTE

**Date :** 27 octobre 2025  
**Version :** 2.1

---

## 📋 NOUVEAUTÉS

### **1. Admin = Super Customer** 👑

L'administrateur peut maintenant faire **TOUTES** les actions d'un customer :

- ✅ Créer, modifier, supprimer des annonces
- ✅ Payer pour les visites virtuelles
- ✅ Payer pour les visites sur site
- ✅ Payer pour créer une visite virtuelle
- ✅ Recharger son wallet
- ✅ Consulter son solde
- ✅ **+ Payer pour publier une annonce (nouveau)**

### **2. Publication d'annonce payante** 💰

La publication d'une annonce coûte maintenant **5000 FCFA**.

---

## 🔧 MODIFICATIONS TECHNIQUES

### **1. Nouveau middleware `isCustomerOrAdmin`**

**Fichier :** `src/API/middlewares/role.middleware.js`

```javascript
export const isCustomerOrAdmin = (req, res, next) => {
  if (req.auth.role !== "customer" && req.auth.role !== "admin") {
    return res.status(403).json({
      success: false,
      message:
        "Accès refusé. Cette action est réservée aux clients et aux administrateurs.",
    });
  }

  next();
};
```

### **2. Routers mis à jour**

**Fichiers modifiés :**

- `src/API/routers/customerAnnouncement.router.js` - `isCustomer` → `isCustomerOrAdmin`
- `src/API/routers/payment.router.js` - `isCustomer` → `isCustomerOrAdmin`

**Routes concernées :**

- ✅ `POST /my-announcements` - Customer OU Admin
- ✅ `GET /my-announcements` - Customer OU Admin
- ✅ `PUT /my-announcements/:id` - Customer OU Admin
- ✅ `DELETE /my-announcements/:id` - Customer OU Admin
- ✅ `POST /payment/virtual-visit` - Customer OU Admin
- ✅ `POST /payment/on-site-visit` - Customer OU Admin
- ✅ `POST /payment/create-virtual-tour` - Customer OU Admin
- ✅ `POST /payment/wallet/recharge` - Customer OU Admin
- ✅ `GET /payment/wallet` - Customer OU Admin
- ✨ `POST /payment/publish-announcement` - **NOUVELLE ROUTE**

### **3. Nouveau contrôleur : Payer publication**

**Fichier :** `src/API/controllers/payment.controller.js`

**Nouvelle fonction :**

```javascript
const payForPublishAnnouncement = (req, res) => {
  // Prix : 5000 FCFA
  // Débite le wallet
  // Crée une transaction
  // Envoie une notification
};
```

---

## 🚀 NOUVELLE API : PAYER POUR PUBLIER

### **POST /payment/publish-announcement** 👥 👑

**Protection :** Customer OU Admin

**Prix :** 5000 FCFA

**Headers :**

```
Authorization: Bearer <customer_ou_admin_token>
```

**Body :** Aucun (vide)

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Paiement effectué avec succès. Vous pouvez maintenant publier votre annonce.",
  "data": {
    "newBalance": 45000,
    "amountPaid": 5000
  }
}
```

**Erreur - Solde insuffisant (400) :**

```json
{
  "message": "Solde insuffisant pour publier une annonce",
  "required": 5000,
  "current": 2000
}
```

---

## 💰 TARIFS DES SERVICES

| Service                   | Prix (FCFA) |
| ------------------------- | ----------- |
| **Publication d'annonce** | **5000**    |
| Visite virtuelle          | 2000        |
| Visite sur site           | 1000        |
| Création visite virtuelle | 10000       |

---

## 🔄 WORKFLOW : PUBLIER UNE ANNONCE

### **Avant (gratuit) :**

```
1. Customer se connecte
2. POST /my-announcements
3. Annonce publiée ✅
```

### **Maintenant (payant - 5000 FCFA) :**

```
1. Customer/Admin se connecte
2. POST /payment/publish-announcement
   └─> Paye 5000 FCFA
   └─> Reçoit confirmation
3. POST /my-announcements
   └─> Crée l'annonce
   └─> Annonce publiée ✅
```

---

## 🧪 TESTER DANS POSTMAN

### **Scénario 1 : Customer publie une annonce**

#### **Étape 1 : Connexion**

```http
POST /api/v1/auth/login

Body:
{
  "email": "customer@example.com",
  "password": "Customer123!"
}
```

#### **Étape 2 : Vérifier le solde**

```http
GET /api/v1/payment/wallet
Authorization: Bearer <customer_token>
```

#### **Étape 3 : Recharger si nécessaire**

```http
POST /api/v1/payment/wallet/recharge
Authorization: Bearer <customer_token>

Body:
{
  "amount": 10000,
  "paymentMethod": "orange_money",
  "amountPaid": 10000
}
```

#### **Étape 4 : Payer la publication**

```http
POST /api/v1/payment/publish-announcement
Authorization: Bearer <customer_token>
```

**→ Coûte 5000 FCFA**

#### **Étape 5 : Créer l'annonce**

```http
POST /api/v1/my-announcements
Authorization: Bearer <customer_token>

Body:
{
  "title": "Villa moderne 4 pièces",
  "description": "Belle villa...",
  "price": 150000,
  "location": "Cocody, Abidjan",
  "propertyType": "65f4a1b2c3d4e5f6a7b8c9d0",
  "images": ["https://example.com/image1.jpg"]
}
```

---

### **Scénario 2 : Admin publie une annonce**

**Même processus que le customer**, mais avec un token admin :

```http
POST /api/v1/auth/login

Body:
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

Puis utiliser le token admin pour :

- ✅ Recharger le wallet
- ✅ Payer la publication
- ✅ Créer l'annonce

---

## ⚠️ NOTES IMPORTANTES

### **1. Admin et Wallet**

Pour que l'admin puisse payer, il doit avoir :

- ✅ Un profil Customer lié
- ✅ Un Wallet

**Solution temporaire :** Créer manuellement ces entités pour l'admin en base de données.

**Solution future :** Modifier le système pour que l'admin n'ait pas besoin de wallet (frais gratuits pour admin).

---

### **2. Validation du paiement**

**Question :** Faut-il vérifier qu'un utilisateur a payé avant de créer une annonce ?

**Actuellement :** Non, le paiement et la création sont deux actions séparées.

**Recommandation future :**

- Ajouter un champ `publishmentPaid: Boolean` dans l'utilisateur ou générer un token de publication unique
- Vérifier ce champ/token lors de la création d'annonce
- Expirer le droit de publication après X temps

---

### **3. Notifications**

Lors du paiement de publication, l'utilisateur reçoit :

```
Titre : "Paiement confirmé"
Message : "Votre paiement de 5000 FCFA pour la publication d'annonce a été confirmé.
          Vous pouvez maintenant créer votre annonce."
Action : "paiement"
```

---

## 📊 COMPARAISON AVANT/APRÈS

| Action                 | Avant       | Maintenant              |
| ---------------------- | ----------- | ----------------------- |
| Customer créer annonce | ✅ Gratuit  | 💰 5000 FCFA            |
| Admin créer annonce    | ❌ Interdit | ✅ Possible (5000 FCFA) |
| Admin payer visite     | ❌ Interdit | ✅ Possible             |
| Admin recharger wallet | ❌ Interdit | ✅ Possible             |

---

## 🔐 PERMISSIONS PAR RÔLE (MISE À JOUR)

### **Customer 👥**

- ✅ Gérer ses annonces (payant : 5000 FCFA)
- ✅ Payer visites
- ✅ Recharger wallet
- ✅ Voir ses préférences/favoris

### **Agent 🏢**

- ✅ Voir son profil
- ✅ Gérer les demandes de visite
- ❌ Créer des annonces
- ❌ Payer des services

### **Admin 👑**

- ✅ **Tout ce que fait un customer**
- ✅ Valider/rejeter agents
- ✅ Gérer types de propriété
- ✅ Gérer préférences système
- ✅ Accès à toutes les routes admin

---

## 💡 RECOMMANDATIONS

### **1. Simplifier pour l'admin**

Modifier le système pour que l'admin ne paie pas :

```javascript
const payForPublishAnnouncement = (req, res) => {
  const userId = req.auth.userId;
  const userRole = req.auth.role;

  // Admin gratuit
  if (userRole === "admin") {
    return res.status(200).json({
      success: true,
      message: "Publication gratuite pour les administrateurs.",
      data: { amountPaid: 0 },
    });
  }

  // Customer paie 5000 FCFA
  // ... code existant ...
};
```

### **2. Système de crédit de publication**

Au lieu de payer à chaque fois, proposer des packs :

- **Pack Basic** : 5 publications = 20000 FCFA (au lieu de 25000)
- **Pack Pro** : 15 publications = 50000 FCFA (au lieu de 75000)
- **Pack Premium** : Publications illimitées/mois = 100000 FCFA

### **3. Vérification avant création**

Ajouter dans `customerAnnouncement.controller.js` :

```javascript
const createMyAnnouncement = (req, res) => {
  // Vérifier que l'utilisateur a payé récemment
  WalletTransaction.findOne({
    wallet: customer.walletId,
    serviceType: "Publication d'annonce",
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // 24h
  }).then((transaction) => {
    if (!transaction && userRole !== "admin") {
      return res.status(403).json({
        message: "Vous devez payer pour publier une annonce",
      });
    }
    // ... créer l'annonce ...
  });
};
```

---

## ✅ FICHIERS MODIFIÉS

| Fichier                                          | Modification                                                                        |
| ------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `src/API/middlewares/role.middleware.js`         | Ajout middleware `isCustomerOrAdmin`                                                |
| `src/API/routers/customerAnnouncement.router.js` | `isCustomer` → `isCustomerOrAdmin`                                                  |
| `src/API/routers/payment.router.js`              | `isCustomer` → `isCustomerOrAdmin` + route `/publish-announcement`                  |
| `src/API/controllers/payment.controller.js`      | Ajout fonction `payForPublishAnnouncement` + constante `PUBLISH_ANNOUNCEMENT_PRICE` |

**Total : 4 fichiers modifiés**

---

## 🎉 CONCLUSION

Le système est maintenant configuré pour :

- ✅ Permettre à l'admin de faire toutes les actions customer
- ✅ Rendre la publication d'annonce payante (5000 FCFA)
- ✅ Maintenir la séparation des rôles pour les autres fonctionnalités

**Prochaines étapes suggérées :**

1. Créer un Customer + Wallet pour l'admin en base de données
2. Ajouter une vérification du paiement avant création d'annonce
3. Implémenter le système de packs/crédits de publication
4. Rendre la publication gratuite pour l'admin

---

**Pour plus d'informations, consultez :**

- `AGENT_VISIT_SYSTEM.md` - Système de visites agent
- `LISTE_COMPLETE_API.md` - Toutes les routes API
- `ADMIN_AGENT_VALIDATION.md` - Validation des agents

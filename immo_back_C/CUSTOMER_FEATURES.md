# 🏠 Fonctionnalités Customer - Documentation Complète

## 📋 Vue d'ensemble

Toutes les fonctionnalités pour que les customers puissent utiliser la plateforme immobilière : préférences, recherche, favoris, paiements, annonces, notifications.

---

## 🎯 Fonctionnalités implémentées

✅ **1. Gestion des préférences**
✅ **2. Recherche et consultation de biens**
✅ **3. Gestion des favoris**
✅ **4. Paiements via wallet**
✅ **5. Publication et gestion d'annonces**
✅ **6. Notifications et alertes**

---

## 📁 Architecture mise en place

### **Modèles créés**

1. **`notification.model.js`** - Système de notifications
   - Champs : user, title, message, type, isRead, relatedAnnouncement

### **Controllers créés**

1. **`customer.controller.js`** - Préférences, favoris, notifications
2. **`announcement.controller.js`** - Recherche et consultation
3. **`customerAnnouncement.controller.js`** - CRUD des annonces du customer
4. **`payment.controller.js`** - Tous les paiements wallet

### **Routes créées**

1. **`/customer`** - Routes customer (préférences, favoris, notifications)
2. **`/announcements`** - Routes publiques des annonces
3. **`/my-announcements`** - Routes privées des annonces du customer
4. **`/payment`** - Routes de paiement

---

## 🚀 API Endpoints

### **1. PRÉFÉRENCES** (`/api/v1/customer/preferences`)

#### Ajouter une préférence

```
POST /api/v1/customer/preferences
Headers: Authorization: Bearer {token}
Body: {
  "preferenceKeyId": "60d5ec49f1b2c72b8c8e4f1a"
}
```

#### Retirer une préférence

```
DELETE /api/v1/customer/preferences/:preferenceKeyId
Headers: Authorization: Bearer {token}
```

#### Voir mes préférences

```
GET /api/v1/customer/preferences
Headers: Authorization: Bearer {token}
```

**Comment ça fonctionne :**

- Le customer peut ajouter des préférences (types de biens qu'il recherche)
- Vérification qu'il n'ajoute pas deux fois la même préférence
- Les préférences sont stockées dans son profil Customer

---

### **2. RECHERCHE DE BIENS** (`/api/v1/announcements`)

#### Rechercher des annonces avec filtres

```
GET /api/v1/announcements/search?district=Cocody&propertyType=60d5...&minPrice=50000&maxPrice=200000&numberOfBedrooms=3
```

#### Toutes les annonces validées

```
GET /api/v1/announcements
```

#### Détails d'une annonce

```
GET /api/v1/announcements/:id
```

**Comment ça fonctionne :**

- Recherche par district, type de propriété, prix, nombre de chambres
- Seules les annonces validées (`isValid: true`) sont retournées
- Inclut les infos du propriétaire et du type de propriété
- Pas besoin d'authentification (public)

---

### **3. FAVORIS** (`/api/v1/customer/favorites`)

#### Ajouter aux favoris

```
POST /api/v1/customer/favorites
Headers: Authorization: Bearer {token}
Body: {
  "announcementId": "60d5ec49f1b2c72b8c8e4f1a"
}
```

#### Retirer des favoris

```
DELETE /api/v1/customer/favorites/:announcementId
Headers: Authorization: Bearer {token}
```

#### Voir mes favoris

```
GET /api/v1/customer/favorites
Headers: Authorization: Bearer {token}
```

**Comment ça fonctionne :**

- Vérification qu'on n'ajoute pas deux fois le même favori
- Les favoris incluent toutes les infos de l'annonce (populate)
- Seul le propriétaire peut gérer ses favoris

---

### **4. PAIEMENTS WALLET** (`/api/v1/payment`)

#### Consulter son solde

```
GET /api/v1/payment/wallet
Headers: Authorization: Bearer {token}
```

#### Recharger son wallet

```
POST /api/v1/payment/recharge
Headers: Authorization: Bearer {token}
Body: {
  "amount": 50000
}
```

#### Historique des transactions

```
GET /api/v1/payment/transactions
Headers: Authorization: Bearer {token}
```

#### Payer pour voir une visite virtuelle

```
POST /api/v1/payment/virtual-visit
Headers: Authorization: Bearer {token}
Body: {
  "announcementId": "60d5ec49f1b2c72b8c8e4f1a"
}
Coût: 2000 (défini dans le controller)
```

#### Payer pour une visite sur site

```
POST /api/v1/payment/on-site-visit
Headers: Authorization: Bearer {token}
Body: {
  "announcementId": "60d5ec49f1b2c72b8c8e4f1a",
  "visitDate": "2025-11-15"
}
Coût: 1000 (défini dans le controller)
```

#### Payer pour créer une visite virtuelle

```
POST /api/v1/payment/create-virtual-tour
Headers: Authorization: Bearer {token}
Body: {
  "announcementId": "60d5ec49f1b2c72b8c8e4f1a",
  "visitUrl": "https://example.com/virtual-tour"
}
Coût: 10000 (défini dans le controller)
```

**Comment ça fonctionne :**

- Vérification du solde avant chaque paiement
- Déduction automatique du montant
- Création d'une transaction dans l'historique
- Retour d'erreur si solde insuffisant

**Coûts des services :**

- Publication annonce : 5000
- Visite virtuelle : 2000
- Visite sur site : 1000
- Création visite virtuelle : 10000

---

### **5. GESTION DES ANNONCES** (`/api/v1/my-announcements`)

#### Publier une annonce (avec paiement)

```
POST /api/v1/my-announcements
Headers: Authorization: Bearer {token}
Body: {
  "title": "Belle villa 4 pièces",
  "description": "...",
  "propertyType": "60d5...",
  "price": 150000,
  ... (tous les champs de l'annonce)
}
Coût: 5000
```

#### Voir mes annonces

```
GET /api/v1/my-announcements
Headers: Authorization: Bearer {token}
```

#### Modifier mon annonce

```
PUT /api/v1/my-announcements/:id
Headers: Authorization: Bearer {token}
Body: {
  "title": "Nouveau titre",
  "price": 160000
}
```

#### Supprimer mon annonce

```
DELETE /api/v1/my-announcements/:id
Headers: Authorization: Bearer {token}
```

**Comment ça fonctionne :**

- **Création :** Paiement de 5000 requis, wallet déduit, transaction créée
- L'annonce est créée avec `isValid: false` (en attente validation admin)
- Le user ne peut modifier/supprimer que SES propres annonces
- Vérification du propriétaire avant chaque opération

---

### **6. NOTIFICATIONS** (`/api/v1/customer/notifications`)

#### Voir mes notifications

```
GET /api/v1/customer/notifications
Headers: Authorization: Bearer {token}
```

#### Marquer comme lue

```
PUT /api/v1/customer/notifications/:notificationId/read
Headers: Authorization: Bearer {token}
```

**Comment ça fonctionne :**

- Types de notifications : new_announcement, price_change, favorite_update, payment
- Triées par date (plus récentes en premier)
- Peuvent être liées à une annonce spécifique
- Marquage individuel comme "lue"

---

## 💡 Logique de code appliquée

### **Style promises avec .then/.catch**

```javascript
Model.find()
  .then((data) => res.status(200).json(data))
  .catch((error) => res.status(500).json(error));
```

### **Vérifications avant création**

```javascript
Model.findOne({ name: req.body.name }).then((existing) => {
  if (existing) {
    return res.status(400).json({ message: "Déjà existe" });
  }
  // Créer...
});
```

### **Authentification requise**

```javascript
const userId = req.auth.userId; // Vient du middleware auth
```

### **Paiements avec vérification du solde**

```javascript
if (wallet.balance < COST) {
  return res.status(400).json({ message: "Solde insuffisant" });
}
wallet.balance -= COST;
// Créer transaction...
```

---

## 🔐 Sécurité

- **Routes protégées** : Toutes les routes customer nécessitent le middleware `auth`
- **Vérification du propriétaire** : On ne peut modifier/supprimer que ses propres ressources
- **Vérifications solde** : Impossible de payer si solde insuffisant
- **Validation annonces** : Les annonces sont en attente jusqu'à validation admin

---

## 🎨 Points importants

### **Modèles utilisés**

- User, Customer, Wallet, WalletTransaction
- Announcement, PropertyType, Favorite
- PreferenceKey, Notification

### **Pas de code compliqué**

- Pas d'async/await, juste .then/.catch
- Logique simple et directe
- Vérifications explicites

### **Organisation claire**

- 1 controller par fonctionnalité
- Routes logiquement groupées
- Commentaires explicites

---

## 📊 Exemple de flux complet

### **Scénario : Customer veut publier une annonce**

1. **Vérifier son solde**

   ```
   GET /api/v1/payment/wallet
   → Retourne : { balance: 10000 }
   ```

2. **Recharger si nécessaire**

   ```
   POST /api/v1/payment/recharge
   Body: { amount: 50000 }
   → Nouveau solde : 60000
   ```

3. **Publier l'annonce**

   ```
   POST /api/v1/my-announcements
   Body: { ...détails annonce }
   → Coût déduit : 5000
   → Nouveau solde : 55000
   → Annonce créée (en attente validation)
   ```

4. **Ajouter une visite virtuelle**

   ```
   POST /api/v1/payment/create-virtual-tour
   Body: { announcementId: "...", visitUrl: "..." }
   → Coût déduit : 10000
   → Nouveau solde : 45000
   → visitUrl ajouté à l'annonce
   ```

5. **Voir l'historique**
   ```
   GET /api/v1/payment/transactions
   → Liste toutes les transactions
   ```

---

## ✅ Ce qui est prêt

✅ Tous les modèles nécessaires
✅ Tous les controllers avec logique simple
✅ Toutes les routes configurées
✅ Authentification intégrée
✅ Système de paiement wallet complet
✅ CRUD annonces avec paiement
✅ Favoris et préférences
✅ Notifications
✅ Recherche avec filtres

Le système customer est complet et fonctionnel ! 🎉


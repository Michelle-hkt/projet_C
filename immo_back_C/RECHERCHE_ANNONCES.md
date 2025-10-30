# 🔍 Recherche d'Annonces - Documentation

## 🎯 Critères de recherche

La recherche des annonces se fait selon **3 critères principaux** :

1. **District** - Localisation du bien
2. **Status** - À vendre ou à louer
3. **Price** - Fourchette de prix (min et max)

---

## 📡 API Endpoint

### Rechercher des annonces

```
GET /api/v1/announcements/search
```

### Paramètres (Query)

| Paramètre  | Type   | Description                                  | Valeurs possibles       | Obligatoire |
| ---------- | ------ | -------------------------------------------- | ----------------------- | ----------- |
| `district` | String | Quartier/District                            | Ex: "Cocody", "Marcory" | Non         |
| `status`   | String | Type d'annonce                               | `a_vendre` ou `a_louer` | Non         |
| `price`    | Number | Prix maximum (affiche ce prix et en dessous) | Ex: 150000              | Non         |

---

## 💡 Exemples d'utilisation

### 1. Recherche par district uniquement

```
GET /api/v1/announcements/search?district=Cocody
```

### 2. Recherche de biens à vendre

```
GET /api/v1/announcements/search?status=a_vendre
```

### 3. Recherche de biens à louer dans un district

```
GET /api/v1/announcements/search?district=Marcory&status=a_louer
```

### 4. Recherche avec prix maximum

```
GET /api/v1/announcements/search?price=150000
// Retourne tous les biens à 150000 et en dessous
```

### 5. Recherche complète (tous les critères)

```
GET /api/v1/announcements/search?district=Cocody&status=a_vendre&price=300000
// Retourne tous les biens à vendre à Cocody jusqu'à 300000
```

### 6. Biens à louer avec budget limité

```
GET /api/v1/announcements/search?status=a_louer&price=100000
// Retourne tous les biens à louer jusqu'à 100000
```

---

## 📋 Modèle Announcement - Champ status

### Définition

```javascript
status: {
  type: String,
  enum: ["a_vendre", "a_louer"],
}
```

### Valeurs possibles

- **`a_vendre`** : Le bien est proposé à la vente
- **`a_louer`** : Le bien est proposé à la location

---

## 🔍 Logique de recherche

### Filtre de base

Seules les annonces **validées** sont retournées :

```javascript
{
  isValid: true;
}
```

### Filtres optionnels

Les filtres sont ajoutés dynamiquement selon les paramètres fournis :

```javascript
const filter = { isValid: true };

// District
if (district) filter.district = district;

// Status (à vendre ou à louer)
if (status) filter.status = status;

// Prix (affiche ce prix et en dessous)
if (price) filter.price = { $lte: Number(price) };
```

---

## 📊 Réponse API

### Format de réponse

```json
[
  {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "title": "Villa moderne 4 pièces",
    "description": "Belle villa...",
    "status": "a_vendre",
    "price": 150000,
    "district": "Cocody",
    "isValid": true,
    "user": {
      "_id": "60d5...",
      "firstName": "Jean",
      "lastName": "Kouassi",
      "email": "jean@example.com"
    },
    "propertyType": {
      "_id": "60d5...",
      "name": "Villa"
    },
    "numberOfBedrooms": 4,
    "numberOfBathrooms": 3,
    ...
  }
]
```

---

## ✅ Fonctionnalités

- ✅ Recherche par district
- ✅ Recherche par status (à vendre/à louer)
- ✅ Recherche par fourchette de prix
- ✅ Combinaison de plusieurs critères
- ✅ Seules les annonces validées sont retournées
- ✅ Populate des informations du propriétaire et du type de propriété

---

## 🎨 Cas d'usage

### Customer cherche à acheter à Cocody

```
GET /api/v1/announcements/search?district=Cocody&status=a_vendre
```

### Customer cherche à louer avec budget limité

```
GET /api/v1/announcements/search?status=a_louer&price=80000
// Affiche tous les biens à louer jusqu'à 80000
```

### Customer cherche avec un budget spécifique

```
GET /api/v1/announcements/search?price=200000
// Affiche tous les biens jusqu'à 200000
```

### Customer cherche tous les biens à vendre

```
GET /api/v1/announcements/search?status=a_vendre
```

---

## 🚀 Controller

**Fichier :** `src/API/controllers/announcement.controller.js`

```javascript
const searchAnnouncements = (req, res) => {
  const { district, status, price } = req.query;

  let filter = { isValid: true };

  if (district) filter.district = district;
  if (status) filter.status = status;
  if (price) filter.price = { $lte: Number(price) }; // Prix <= au prix indiqué

  Announcement.find(filter)
    .populate("user", "firstName lastName email")
    .populate("propertyType")
    .then((announcements) => res.status(200).json(announcements))
    .catch((error) => res.status(500).json(error));
};
```

---

## 🎯 Résumé

**3 critères de recherche :**

1. 📍 **District** - Où se trouve le bien
2. 🏷️ **Status** - À vendre ou à louer
3. 💰 **Price** - Budget maximum (affiche ce prix et en dessous)

**Flexibilité totale :**

- Recherche par 1, 2 ou 3 critères
- Tous les paramètres sont optionnels
- Combinaison libre des critères

La recherche est simple, efficace et flexible ! 🎉

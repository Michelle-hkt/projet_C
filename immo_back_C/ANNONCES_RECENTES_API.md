# 🆕 API ANNONCES RÉCENTES

**Date de création :** 27 octobre 2025

---

## 📋 NOUVELLE ROUTE AJOUTÉE

### **Récupérer les annonces les plus récentes** 🌍

```
GET /api/v1/announcements/recent
```

**Accès :** Route publique (pas d'authentification requise)

---

## 🎯 FONCTIONNALITÉ

Cette route permet d'afficher les annonces par ordre de publication, **les plus récentes en premier**.

**Tri :** Par `createdAt` en ordre décroissant (DESC)

---

## 📡 REQUÊTE

### URL complète

```
GET http://localhost:3000/api/v1/announcements/recent
```

### Paramètres de query (optionnels)

| Paramètre | Type   | Défaut | Description                           |
| --------- | ------ | ------ | ------------------------------------- |
| `limit`   | Number | 10     | Nombre maximum d'annonces à retourner |

### Exemples

**Récupérer les 10 annonces les plus récentes (par défaut) :**

```
GET http://localhost:3000/api/v1/announcements/recent
```

**Récupérer les 5 annonces les plus récentes :**

```
GET http://localhost:3000/api/v1/announcements/recent?limit=5
```

**Récupérer les 20 annonces les plus récentes :**

```
GET http://localhost:3000/api/v1/announcements/recent?limit=20
```

---

## ✅ RÉPONSE (200 OK)

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "67600abc...",
      "title": "Villa moderne 3 chambres",
      "description": "Belle villa avec piscine et jardin",
      "price": 50000000,
      "address": "Cocody, Abidjan",
      "district": "Cocody",
      "status": "a_vendre",
      "isValid": true,
      "numberOfBedrooms": 3,
      "numberOfBathrooms": 2,
      "numberOfLivingRooms": 1,
      "numberOfKitchen": 1,
      "landArea": 500,
      "generalCondition": "Excellent",
      "garage": true,
      "internalToilet": true,
      "externalToilet": false,
      "deposit": 10000000,
      "advance": 5000000,
      "landTitle": "Titre foncier disponible",
      "visitUrl": "https://...",
      "gallery": [{ "imageUrl": "url1" }, { "imageUrl": "url2" }],
      "user": {
        "_id": "67123abc...",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com"
      },
      "propertyType": {
        "_id": "67800abc...",
        "name": "Villa"
      },
      "createdAt": "2025-10-27T14:30:00.000Z",
      "updatedAt": "2025-10-27T14:30:00.000Z"
    },
    {
      "_id": "67600def...",
      "title": "Appartement 2 chambres",
      "description": "Appartement meublé au 3ème étage",
      "price": 25000000,
      "address": "Plateau, Abidjan",
      "district": "Plateau",
      "status": "a_louer",
      "isValid": true,
      "numberOfBedrooms": 2,
      "numberOfBathrooms": 1,
      "numberOfLivingRooms": 1,
      "numberOfKitchen": 1,
      "landArea": 0,
      "generalCondition": "Bon",
      "garage": false,
      "internalToilet": true,
      "externalToilet": false,
      "deposit": 5000000,
      "advance": 2000000,
      "visitUrl": "N/A",
      "gallery": [{ "imageUrl": "url3" }],
      "user": {
        "_id": "67124xyz...",
        "firstName": "Marie",
        "lastName": "Dupont",
        "email": "marie.dupont@example.com"
      },
      "propertyType": {
        "_id": "67800def...",
        "name": "Appartement"
      },
      "createdAt": "2025-10-27T12:15:00.000Z",
      "updatedAt": "2025-10-27T12:15:00.000Z"
    }
  ]
}
```

---

## 🔍 DÉTAILS DE LA RÉPONSE

### Structure

```json
{
  "success": Boolean,     // Statut de la requête
  "count": Number,        // Nombre d'annonces retournées
  "data": Array           // Liste des annonces
}
```

### Champs populés

Les champs suivants sont automatiquement populés (jointure) :

1. **`user`** : Informations du propriétaire

   - `firstName`
   - `lastName`
   - `email`

2. **`propertyType`** : Type de propriété
   - `name` (Villa, Appartement, Studio, etc.)

---

## 🎯 ORDRE DE TRI

Les annonces sont triées par **`createdAt`** en ordre **décroissant** :

```javascript
.sort({ createdAt: -1 })
```

**Résultat :**

- La **1ère annonce** = La plus récemment créée
- La **dernière annonce** = La plus ancienne (dans la limite du `limit`)

---

## 📊 EXEMPLES D'UTILISATION

### Exemple 1 : Section "Dernières annonces" (10 annonces)

```javascript
// Frontend
fetch("http://localhost:3000/api/v1/announcements/recent")
  .then((response) => response.json())
  .then((data) => {
    console.log(`${data.count} annonces récentes`);
    data.data.forEach((announcement) => {
      console.log(`${announcement.title} - ${announcement.createdAt}`);
    });
  });
```

---

### Exemple 2 : Carrousel "Nouveautés" (5 annonces)

```javascript
// Frontend
fetch("http://localhost:3000/api/v1/announcements/recent?limit=5")
  .then((response) => response.json())
  .then((data) => {
    // Afficher dans un carrousel
    const carousel = data.data.map((announcement) => ({
      id: announcement._id,
      title: announcement.title,
      price: announcement.price,
      image: announcement.gallery[0]?.imageUrl,
      createdAt: announcement.createdAt,
    }));
  });
```

---

### Exemple 3 : Page dédiée "Toutes les nouveautés" (20 annonces)

```javascript
// Frontend
fetch("http://localhost:3000/api/v1/announcements/recent?limit=20")
  .then((response) => response.json())
  .then((data) => {
    // Afficher une grille de 20 annonces récentes
  });
```

---

## 🧪 TESTS POSTMAN

### Test 1 : Par défaut (10 annonces)

```
GET http://localhost:3000/api/v1/announcements/recent
```

**Réponse attendue :**

- `success: true`
- `count: 10` (ou moins si moins de 10 annonces dans la DB)
- Les annonces sont triées par date décroissante

---

### Test 2 : Avec limite personnalisée (5 annonces)

```
GET http://localhost:3000/api/v1/announcements/recent?limit=5
```

**Réponse attendue :**

- `success: true`
- `count: 5` (ou moins)

---

### Test 3 : Grande limite (50 annonces)

```
GET http://localhost:3000/api/v1/announcements/recent?limit=50
```

**Réponse attendue :**

- `success: true`
- `count: N` (où N ≤ 50)

---

## 🆚 COMPARAISON AVEC LES AUTRES ROUTES

| Route                       | Tri                 | Limite      | Filtres         | Accès     |
| --------------------------- | ------------------- | ----------- | --------------- | --------- |
| `GET /announcements`        | Aucun               | Aucune      | `isValid: true` | 🌍 Public |
| `GET /announcements/search` | Aucun               | Aucune      | Query params    | 🌍 Public |
| `GET /announcements/recent` | ✅ `createdAt` DESC | Oui (query) | `isValid: true` | 🌍 Public |
| `GET /announcements/:id`    | N/A                 | 1           | Par ID          | 🌍 Public |

---

## 💡 AVANTAGES

1. **Performance** : Utilisation d'un index sur `createdAt` (automatique avec timestamps)
2. **Simplicité** : Route dédiée facile à utiliser
3. **Flexibilité** : Paramètre `limit` personnalisable
4. **Population** : Données `user` et `propertyType` déjà incluses
5. **UX** : Affiche les annonces les plus fraîches en premier

---

## 🔧 IMPLÉMENTATION TECHNIQUE

### Controller (`announcement.controller.js`)

```javascript
const getRecentAnnouncements = (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  Announcement.find({ isValid: true })
    .sort({ createdAt: -1 }) // Tri décroissant
    .limit(limit) // Limite personnalisable
    .populate("user", "firstName lastName email")
    .populate("propertyType", "name")
    .then((announcements) => {
      res.status(200).json({
        success: true,
        count: announcements.length,
        data: announcements,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    });
};
```

### Router (`announcement.router.js`)

```javascript
announcementRouter.get(
  "/recent",
  announcementController.getRecentAnnouncements
);
```

**⚠️ Important :** La route `/recent` est placée **AVANT** la route `/:id` pour éviter que "recent" soit interprété comme un ID.

---

## 🎨 EXEMPLES FRONTEND

### React

```jsx
import { useState, useEffect } from "react";

function RecentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/announcements/recent?limit=10")
      .then((res) => res.json())
      .then((data) => {
        setAnnouncements(data.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="recent-announcements">
      <h2>Dernières annonces</h2>
      <div className="grid">
        {announcements.map((announcement) => (
          <div key={announcement._id} className="card">
            <h3>{announcement.title}</h3>
            <p>{announcement.price} FCFA</p>
            <p>
              Par {announcement.user.firstName} {announcement.user.lastName}
            </p>
            <small>
              Publié le {new Date(announcement.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Vue.js

```vue
<template>
  <div class="recent-announcements">
    <h2>Dernières annonces</h2>
    <div v-if="loading">Chargement...</div>
    <div v-else class="grid">
      <div
        v-for="announcement in announcements"
        :key="announcement._id"
        class="card"
      >
        <h3>{{ announcement.title }}</h3>
        <p>{{ announcement.price }} FCFA</p>
        <p>
          Par {{ announcement.user.firstName }} {{ announcement.user.lastName }}
        </p>
        <small>Publié le {{ formatDate(announcement.createdAt) }}</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      announcements: [],
      loading: true,
    };
  },
  mounted() {
    fetch("http://localhost:3000/api/v1/announcements/recent?limit=10")
      .then((res) => res.json())
      .then((data) => {
        this.announcements = data.data;
        this.loading = false;
      });
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
};
</script>
```

---

## 📌 NOTES IMPORTANTES

1. **Filtrage automatique** : Seules les annonces avec `isValid: true` sont retournées
2. **Limite par défaut** : 10 annonces si aucun paramètre `limit` n'est fourni
3. **Timestamps** : Le champ `createdAt` est automatiquement géré par Mongoose (option `timestamps: true`)
4. **Performance** : MongoDB crée automatiquement un index sur `createdAt`

---

## 🚀 MISE À JOUR DU GUIDE

Cette nouvelle route a été ajoutée au **GUIDE_API_POSTMAN.md** dans la section **5. ANNONCES PUBLIQUES**.

---

## ✅ RÉSUMÉ

| Élément               | Valeur                             |
| --------------------- | ---------------------------------- |
| **Route**             | `GET /api/v1/announcements/recent` |
| **Accès**             | 🌍 Public                          |
| **Tri**               | `createdAt` DESC                   |
| **Limite**            | Configurable (défaut : 10)         |
| **Fichiers modifiés** | 2 (controller + router)            |
| **Fichiers créés**    | 1 (documentation)                  |

---

✅ **Nouvelle fonctionnalité ajoutée avec succès !**

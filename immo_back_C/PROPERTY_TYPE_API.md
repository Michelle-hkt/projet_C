# 🏠 API PropertyType - Documentation

## 📋 Vue d'ensemble

CRUD complet pour gérer les types de propriétés immobilières (Maison, Appartement, Villa, etc.).

---

## 🚀 Routes disponibles

### 1. Créer un type de propriété

**Endpoint :** `POST /api/v1/property`

**Body :**

```json
{
  "name": "Villa"
}
```

**Réponse (201 Created) :**

```json
{
  "success": true,
  "message": "Type de propriété créé avec succès",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "Villa",
    "createdAt": "2025-10-26T...",
    "updatedAt": "2025-10-26T..."
  }
}
```

**Erreurs possibles :**

- 400 : Le nom est obligatoire ou déjà existant
- 500 : Erreur serveur

---

### 2. Récupérer tous les types de propriété

**Endpoint :** `GET /api/v1/property`

**Réponse (200 OK) :**

```json
{
  "success": true,
  "message": "Types de propriété récupérés avec succès",
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "name": "Appartement",
      "createdAt": "2025-10-26T...",
      "updatedAt": "2025-10-26T..."
    },
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "name": "Maison",
      "createdAt": "2025-10-26T...",
      "updatedAt": "2025-10-26T..."
    }
  ],
  "count": 2
}
```

---

### 3. Récupérer un type de propriété par ID

**Endpoint :** `GET /api/v1/property/:id`

**Exemple :** `GET /api/v1/property/60d5ec49f1b2c72b8c8e4f1a`

**Réponse (200 OK) :**

```json
{
  "success": true,
  "message": "Type de propriété récupéré avec succès",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "Villa",
    "createdAt": "2025-10-26T...",
    "updatedAt": "2025-10-26T..."
  }
}
```

**Erreurs possibles :**

- 404 : Type de propriété introuvable
- 500 : Erreur serveur

---

### 4. Mettre à jour un type de propriété

**Endpoint :** `PUT /api/v1/property/:id`

**Body :**

```json
{
  "name": "Villa de luxe"
}
```

**Réponse (200 OK) :**

```json
{
  "success": true,
  "message": "Type de propriété mis à jour avec succès",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "Villa de luxe",
    "createdAt": "2025-10-26T...",
    "updatedAt": "2025-10-26T..."
  }
}
```

**Erreurs possibles :**

- 400 : Le nom est obligatoire ou déjà utilisé par un autre type
- 404 : Type de propriété introuvable
- 500 : Erreur serveur

---

### 5. Supprimer un type de propriété

**Endpoint :** `DELETE /api/v1/property/:id`

**Exemple :** `DELETE /api/v1/property/60d5ec49f1b2c72b8c8e4f1a`

**Réponse (200 OK) :**

```json
{
  "success": true,
  "message": "Type de propriété supprimé avec succès",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "Villa",
    "createdAt": "2025-10-26T...",
    "updatedAt": "2025-10-26T..."
  }
}
```

**Erreurs possibles :**

- 404 : Type de propriété introuvable
- 500 : Erreur serveur

---

## 🧪 Tester avec Postman / Thunder Client

### 1. Créer un type

```
POST http://localhost:3000/api/v1/property
Content-Type: application/json

{
  "name": "Appartement"
}
```

### 2. Récupérer tous les types

```
GET http://localhost:3000/api/v1/property
```

### 3. Récupérer un type par ID

```
GET http://localhost:3000/api/v1/property/60d5ec49f1b2c72b8c8e4f1a
```

### 4. Mettre à jour un type

```
PUT http://localhost:3000/api/v1/property/60d5ec49f1b2c72b8c8e4f1a
Content-Type: application/json

{
  "name": "Studio"
}
```

### 5. Supprimer un type

```
DELETE http://localhost:3000/api/v1/property/60d5ec49f1b2c72b8c8e4f1a
```

---

## ✅ Fonctionnalités

- ✅ Création avec vérification des doublons
- ✅ Récupération de tous les types (triés alphabétiquement)
- ✅ Récupération d'un type par ID
- ✅ Mise à jour avec vérification des doublons
- ✅ Suppression
- ✅ Gestion complète des erreurs
- ✅ Réponses JSON structurées
- ✅ Codes HTTP appropriés

---

## 📝 Exemples de types courants

- Appartement
- Maison
- Villa
- Studio
- Duplex
- Triplex
- Loft
- Penthouse
- Terrain
- Bureau
- Commerce
- Entrepôt

Le CRUD PropertyType est prêt à l'emploi ! 🎉

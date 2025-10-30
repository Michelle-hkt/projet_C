# 🏢 SYSTÈME DE GESTION DES VISITES PAR LES AGENTS

**Date :** 27 octobre 2025  
**Version :** 2.0

---

## 📋 CHANGEMENTS MAJEURS

### ✅ **Nouveau système de rôles**

| Fonctionnalité                   | Customer uniquement | Agent uniquement |
| -------------------------------- | ------------------- | ---------------- |
| Créer une annonce                | ✅                  | ❌               |
| Modifier une annonce             | ✅                  | ❌               |
| Supprimer une annonce            | ✅                  | ❌               |
| Payer visite virtuelle           | ✅                  | ❌               |
| Payer visite sur site            | ✅                  | ❌               |
| Payer création visite virtuelle  | ✅                  | ❌               |
| Recharger le wallet              | ✅                  | ❌               |
| **Gérer les demandes de visite** | ❌                  | ✅               |
| **Accepter une demande**         | ❌                  | ✅               |
| **Confirmer une visite**         | ❌                  | ✅               |
| **Annuler une visite**           | ❌                  | ✅               |

---

## 🔄 WORKFLOW COMPLET : VISITE SUR SITE

```
1. CUSTOMER DEMANDE UNE VISITE
   └─> POST /payment/on-site-visit
   └─> Paie 1000 FCFA depuis son wallet
   └─> Visite créée avec status "en_attente"
   └─> Tous les agents validés reçoivent une notification

2. AGENT VOIT LES DEMANDES
   └─> GET /agent/visits/pending
   └─> Liste de toutes les demandes en attente

3. AGENT ACCEPTE UNE DEMANDE
   └─> PUT /agent/visits/:visitId/accept
   └─> Status passe à "accepter"
   └─> Agent a accès aux infos du customer ET du propriétaire
   └─> Customer reçoit notification : "Votre demande a été prise en charge"

4. AGENT CONFIRME LA VISITE
   └─> PUT /agent/visits/:visitId/confirm
   └─> Agent fournit : date + heure + lieu de rencontre
   └─> Status passe à "confirmer"
   └─> Customer reçoit notification avec tous les détails

5. VISITE EFFECTUÉE
   └─> (À implémenter) Agent marque la visite comme "effectuer"
```

---

## 🚀 API POUR LES AGENTS

### **1. Voir toutes les demandes en attente** 🏢

**Route :** `GET /api/v1/agent/visits/pending`  
**Protection :** Agent uniquement

**Headers :**

```
Authorization: Bearer <agent_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 3,
  "message": "3 demande(s) de visite en attente",
  "data": [
    {
      "_id": "65f4a1b2c3d4e5f6a7b8c9d0",
      "userId": {
        "_id": "...",
        "firstName": "Marie",
        "lastName": "Dupont",
        "email": "marie@example.com"
      },
      "announcementId": {
        "_id": "...",
        "title": "Villa 4 pièces à Cocody",
        "location": "Cocody, Abidjan",
        "price": 150000,
        "images": ["..."],
        "user": {
          "_id": "...",
          "firstName": "Jean",
          "lastName": "Propriétaire",
          "email": "proprietaire@example.com"
        }
      },
      "status": "en_attente",
      "agentId": null,
      "createdAt": "2025-10-27T10:00:00.000Z"
    }
  ]
}
```

---

### **2. Voir mes visites acceptées** 🏢

**Route :** `GET /api/v1/agent/visits/accepted`  
**Protection :** Agent uniquement

**Headers :**

```
Authorization: Bearer <agent_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "userId": { ... },
      "announcementId": { ... },
      "status": "accepter",
      "agentId": "...",
      "createdAt": "..."
    }
  ]
}
```

---

### **3. Voir mes visites confirmées** 🏢

**Route :** `GET /api/v1/agent/visits/confirmed`  
**Protection :** Agent uniquement

**Headers :**

```
Authorization: Bearer <agent_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "userId": { ... },
      "announcementId": { ... },
      "visitDate": "2025-10-30T10:00:00.000Z",
      "visitTime": "10h00",
      "meetingPlace": "Devant la pharmacie du quartier",
      "status": "confirmer",
      "agentId": "...",
      "createdAt": "..."
    }
  ]
}
```

---

### **4. Accepter une demande de visite** 🏢

**Route :** `PUT /api/v1/agent/visits/:visitId/accept`  
**Protection :** Agent uniquement

**Headers :**

```
Authorization: Bearer <agent_token>
```

**Exemple :**

```
PUT http://localhost:3000/api/v1/agent/visits/65f4a1b2c3d4e5f6a7b8c9d0/accept
Authorization: Bearer <agent_token>
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Demande acceptée avec succès. Le customer a été notifié.",
  "data": {
    "visit": {
      "_id": "65f4a1b2c3d4e5f6a7b8c9d0",
      "status": "accepter",
      "agentId": "..."
    },
    "customerInfo": {
      "firstName": "Marie",
      "lastName": "Dupont",
      "email": "marie@example.com",
      "phoneNumber": "0600000001",
      "whatsappNumber": "0600000001"
    },
    "propertyOwnerInfo": {
      "firstName": "Jean",
      "lastName": "Propriétaire",
      "email": "proprietaire@example.com"
    }
  }
}
```

✅ **Avantages :**

- L'agent reçoit les coordonnées du customer (téléphone, WhatsApp, email)
- L'agent reçoit les infos du propriétaire de l'annonce
- Le customer est notifié que sa demande a été prise en charge

---

### **5. Confirmer une visite avec date/heure/lieu** 🏢

**Route :** `PUT /api/v1/agent/visits/:visitId/confirm`  
**Protection :** Agent uniquement (doit avoir accepté la visite)

**Headers :**

```
Authorization: Bearer <agent_token>
Content-Type: application/json
```

**Body :**

```json
{
  "visitDate": "2025-10-30T10:00:00.000Z",
  "visitTime": "10h00",
  "meetingPlace": "Devant la pharmacie du quartier Cocody"
}
```

**Exemple :**

```
PUT http://localhost:3000/api/v1/agent/visits/65f4a1b2c3d4e5f6a7b8c9d0/confirm
Authorization: Bearer <agent_token>

Body:
{
  "visitDate": "2025-10-30T10:00:00.000Z",
  "visitTime": "10h00",
  "meetingPlace": "Devant la pharmacie du quartier Cocody"
}
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Visite confirmée avec succès. Le customer a été notifié avec tous les détails.",
  "data": {
    "_id": "65f4a1b2c3d4e5f6a7b8c9d0",
    "userId": "...",
    "announcementId": "...",
    "visitDate": "2025-10-30T10:00:00.000Z",
    "visitTime": "10h00",
    "meetingPlace": "Devant la pharmacie du quartier Cocody",
    "status": "confirmer",
    "agentId": "..."
  }
}
```

✅ **Notification envoyée au customer :**

```
Titre : "Visite confirmée"

Message :
"Votre visite pour "Villa 4 pièces à Cocody" est confirmée !

Date : mercredi 30 octobre 2025
Heure : 10h00
Lieu de rencontre : Devant la pharmacie du quartier Cocody

Soyez à l'heure !"
```

---

### **6. Annuler une visite** 🏢

**Route :** `PUT /api/v1/agent/visits/:visitId/cancel`  
**Protection :** Agent uniquement (doit avoir accepté la visite)

**Headers :**

```
Authorization: Bearer <agent_token>
Content-Type: application/json
```

**Body (optionnel) :**

```json
{
  "reason": "Propriétaire indisponible"
}
```

**Exemple :**

```
PUT http://localhost:3000/api/v1/agent/visits/65f4a1b2c3d4e5f6a7b8c9d0/cancel
Authorization: Bearer <agent_token>

Body:
{
  "reason": "Propriétaire indisponible à cette date"
}
```

**Réponse (200) :**

```json
{
  "success": true,
  "message": "Visite annulée. Le customer a été notifié.",
  "data": {
    "_id": "65f4a1b2c3d4e5f6a7b8c9d0",
    "status": "annuler"
  }
}
```

---

## 📊 STATUTS DES VISITES

| Statut       | Description                           | Qui peut le définir ?        |
| ------------ | ------------------------------------- | ---------------------------- |
| `en_attente` | Demande créée par le customer         | Automatique lors du paiement |
| `accepter`   | Demande prise en charge par un agent  | Agent (via /accept)          |
| `confirmer`  | Visite confirmée avec date/heure/lieu | Agent (via /confirm)         |
| `effectuer`  | Visite réalisée                       | (À implémenter)              |
| `annuler`    | Visite annulée                        | Agent (via /cancel)          |

---

## 🔔 NOTIFICATIONS AUTOMATIQUES

### **1. Après paiement customer (status: en_attente)**

**Destinataires :** Tous les agents validés

```json
{
  "title": "Nouvelle demande de visite sur site",
  "message": "Une demande de visite a été faite pour \"Villa 4 pièces à Cocody\"",
  "action": "visite"
}
```

### **2. Après acceptation agent (status: accepter)**

**Destinataire :** Le customer

```json
{
  "title": "Demande de visite acceptée",
  "message": "Votre demande de visite pour \"Villa 4 pièces à Cocody\" a été prise en charge par un agent. Vous serez contacté prochainement pour confirmer la date et l'heure.",
  "action": "visite"
}
```

### **3. Après confirmation agent (status: confirmer)**

**Destinataire :** Le customer

```json
{
  "title": "Visite confirmée",
  "message": "Votre visite pour \"Villa 4 pièces à Cocody\" est confirmée !\n\nDate : mercredi 30 octobre 2025\nHeure : 10h00\nLieu de rencontre : Devant la pharmacie du quartier Cocody\n\nSoyez à l'heure !",
  "action": "visite"
}
```

### **4. Après annulation agent (status: annuler)**

**Destinataire :** Le customer

```json
{
  "title": "Visite annulée",
  "message": "Votre visite pour \"Villa 4 pièces à Cocody\" a été annulée par l'agent. Raison : Propriétaire indisponible à cette date",
  "action": "visite"
}
```

---

## 🧪 SCÉNARIO DE TEST COMPLET

### **Étape 1 : Customer demande une visite**

```http
POST http://localhost:3000/api/v1/payment/on-site-visit
Authorization: Bearer <customer_token>
Content-Type: application/json

Body:
{
  "announcementId": "65f4a1b2c3d4e5f6a7b8c9d0"
}
```

→ Copier l'ID de la visite créée (si retourné) ou utiliser GET pour le récupérer

---

### **Étape 2 : Agent voit les demandes**

```http
GET http://localhost:3000/api/v1/agent/visits/pending
Authorization: Bearer <agent_token>
```

→ Copier l'ID de la visite (\_id) depuis la réponse

---

### **Étape 3 : Agent accepte la demande**

```http
PUT http://localhost:3000/api/v1/agent/visits/VISIT_ID/accept
Authorization: Bearer <agent_token>
```

→ L'agent reçoit les infos du customer et du propriétaire

---

### **Étape 4 : Agent confirme la visite**

```http
PUT http://localhost:3000/api/v1/agent/visits/VISIT_ID/confirm
Authorization: Bearer <agent_token>
Content-Type: application/json

Body:
{
  "visitDate": "2025-10-30T10:00:00.000Z",
  "visitTime": "10h00",
  "meetingPlace": "Devant la pharmacie du quartier Cocody"
}
```

→ Customer reçoit une notification avec tous les détails

---

### **Étape 5 : Customer vérifie sa notification**

```http
GET http://localhost:3000/api/v1/customer/notifications
Authorization: Bearer <customer_token>
```

---

## ⚠️ MESSAGES D'ERREUR

| Code | Message                                                              | Cause                                                 | Solution                                  |
| ---- | -------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------- |
| 403  | `"Accès refusé. Cette action est réservée aux agents."`              | Utilisateur n'est pas agent                           | Se connecter avec un compte agent         |
| 403  | `"Vous ne pouvez confirmer que les visites que vous avez acceptées"` | Agent essaie de confirmer une visite d'un autre agent | Seul l'agent qui a accepté peut confirmer |
| 404  | `"Demande de visite introuvable"`                                    | ID de visite incorrect                                | Vérifier l'ID                             |
| 400  | `"Cette demande a déjà été acceptée"`                                | Visite déjà prise en charge                           | Consulter les autres demandes             |
| 400  | `"Cette visite ne peut pas être confirmée"`                          | Visite pas en status "accepter"                       | Accepter la visite d'abord                |

---

## 📝 MODÈLE VISIT (BASE DE DONNÉES)

```javascript
{
  userId: ObjectId,              // Référence au customer
  announcementId: ObjectId,      // Référence à l'annonce
  visitDate: Date,               // Date de la visite
  visitTime: String,             // Heure (format: "10h00")
  meetingPlace: String,          // Lieu de rencontre
  status: String,                // "en_attente" | "accepter" | "confirmer" | "effectuer" | "annuler"
  agentId: ObjectId,             // Référence à l'agent (null au départ)
  createdAt: Date,               // Date de création automatique
  updatedAt: Date                // Date de mise à jour automatique
}
```

---

## ✅ CHECKLIST POUR LES AGENTS

Avant d'accepter une demande :

- [ ] Vérifier la localisation de l'annonce
- [ ] Vérifier la disponibilité
- [ ] S'assurer de pouvoir contacter le propriétaire

Après avoir accepté :

- [ ] Contacter le customer (téléphone/WhatsApp)
- [ ] Contacter le propriétaire
- [ ] Convenir d'une date et heure
- [ ] Définir un lieu de rencontre clair

Avant de confirmer :

- [ ] Vérifier la date et l'heure avec les deux parties
- [ ] S'assurer que le lieu de rencontre est clair
- [ ] Vérifier sa propre disponibilité

---

## 🎯 AVANTAGES DU NOUVEAU SYSTÈME

### **Pour le Customer :**

✅ Paie une seule fois (1000 FCFA)  
✅ Reçoit des notifications à chaque étape  
✅ Connaît la date, l'heure et le lieu précis  
✅ Peut voir l'historique de ses visites

### **Pour l'Agent :**

✅ Voit toutes les demandes disponibles  
✅ Choisit les demandes qu'il veut traiter  
✅ Accès aux infos customer ET propriétaire  
✅ Gère son planning de visites  
✅ Peut annuler si nécessaire

### **Pour la Plateforme :**

✅ Système organisé et professionnel  
✅ Traçabilité complète des visites  
✅ Notifications automatiques  
✅ Meilleure expérience utilisateur

---

## 🔄 ÉVOLUTIONS FUTURES

- [ ] Ajouter un système de notation des agents
- [ ] Permettre au customer de choisir son agent
- [ ] Ajouter un chat entre agent et customer
- [ ] Géolocalisation du lieu de rencontre
- [ ] Rappels automatiques avant la visite
- [ ] Rapport de visite par l'agent

---

**🎉 Le système de gestion des visites par les agents est opérationnel !**

Pour plus d'informations, consultez :

- `LISTE_COMPLETE_API.md` - Documentation complète de toutes les API
- `ADMIN_AGENT_VALIDATION.md` - Validation des agents par l'admin

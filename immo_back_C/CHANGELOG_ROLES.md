# 📝 CHANGELOG - SÉPARATION DES RÔLES CUSTOMER/AGENT

**Date :** 27 octobre 2025  
**Version :** 2.0

---

## 🎯 OBJECTIF DES MODIFICATIONS

Clarifier la séparation des responsabilités entre **Customer** et **Agent** :

- **Customer** = Gère ses annonces et ses paiements
- **Agent** = Gère les demandes de visite sur site des customers

---

## ✅ MODIFICATIONS EFFECTUÉES

### **1. Routes Annonces → Customer uniquement**

**Fichier modifié :** `src/API/routers/customerAnnouncement.router.js`

**Avant :**

```javascript
// N'importe quel utilisateur authentifié pouvait créer/modifier/supprimer
auth, controller.createMyAnnouncement;
```

**Après :**

```javascript
// Uniquement les customers peuvent gérer les annonces
auth, isCustomer, controller.createMyAnnouncement;
```

**Routes concernées :**

- ✅ `POST /my-announcements` - Créer une annonce
- ✅ `GET /my-announcements` - Voir mes annonces
- ✅ `PUT /my-announcements/:id` - Modifier une annonce
- ✅ `DELETE /my-announcements/:id` - Supprimer une annonce

---

### **2. Routes Paiements → Customer uniquement**

**Fichier modifié :** `src/API/routers/payment.router.js`

**Routes concernées :**

- ✅ `POST /payment/virtual-visit` - Payer visite virtuelle
- ✅ `POST /payment/on-site-visit` - Payer visite sur site
- ✅ `POST /payment/create-virtual-tour` - Payer création visite virtuelle
- ✅ `POST /payment/wallet/recharge` - Recharger le wallet
- ✅ `GET /payment/wallet` - Consulter le solde

**Raison :** Seuls les customers ont un wallet et payent pour les services.

---

### **3. Modèle Visit enrichi**

**Fichier modifié :** `src/API/models/visit.model.js`

**Nouveaux champs ajoutés :**

```javascript
visitTime: String,        // Heure de la visite (ex: "10h00")
meetingPlace: String,     // Lieu de rencontre précis
```

**Nouveau statut ajouté :**

```javascript
"accepter"; // Entre "en_attente" et "confirmer"
```

**Statuts complets :**

1. `en_attente` → Customer a payé, en attente d'un agent
2. `accepter` → Agent a pris en charge la demande
3. `confirmer` → Agent a confirmé avec date/heure/lieu
4. `effectuer` → Visite réalisée (à implémenter)
5. `annuler` → Visite annulée

---

### **4. Nouveau Controller : Agent Visit**

**Fichier créé :** `src/API/controllers/agentVisit.controller.js`

**6 fonctions créées :**

| Fonction               | Description                               |
| ---------------------- | ----------------------------------------- |
| `getPendingVisits`     | Voir toutes les demandes en attente       |
| `getMyAcceptedVisits`  | Voir mes visites acceptées                |
| `getMyConfirmedVisits` | Voir mes visites confirmées               |
| `acceptVisit`          | Accepter une demande + notifier customer  |
| `confirmVisit`         | Confirmer avec date/heure/lieu + notifier |
| `cancelVisit`          | Annuler une visite + notifier             |

---

### **5. Nouveau Router : Agent Visits**

**Fichier créé :** `src/API/routers/agentVisit.router.js`

**6 routes créées :**

- ✅ `GET /agent/visits/pending` - Demandes en attente
- ✅ `GET /agent/visits/accepted` - Mes visites acceptées
- ✅ `GET /agent/visits/confirmed` - Mes visites confirmées
- ✅ `PUT /agent/visits/:visitId/accept` - Accepter une demande
- ✅ `PUT /agent/visits/:visitId/confirm` - Confirmer une visite
- ✅ `PUT /agent/visits/:visitId/cancel` - Annuler une visite

---

### **6. Router Index mis à jour**

**Fichier modifié :** `src/API/routers/index.js`

**Ajout :**

```javascript
import agentVisitRouter from "./agentVisit.router.js";
routers.use("/agent/visits", agentVisitRouter);
```

---

### **7. Fix status dans Payment Controller**

**Fichier modifié :** `src/API/controllers/payment.controller.js`

**Avant :**

```javascript
status: "en attente"; // ❌ Espace
```

**Après :**

```javascript
status: "en_attente"; // ✅ Underscore
```

---

## 📊 RÉCAPITULATIF DES FICHIERS MODIFIÉS/CRÉÉS

### **Fichiers modifiés (6) :**

1. `src/API/routers/customerAnnouncement.router.js` - Ajout middleware isCustomer
2. `src/API/routers/payment.router.js` - Ajout middleware isCustomer
3. `src/API/models/visit.model.js` - Ajout champs + status
4. `src/API/controllers/payment.controller.js` - Fix status
5. `src/API/routers/index.js` - Ajout nouvelle route
6. `LISTE_COMPLETE_API.md` - Documentation à jour

### **Fichiers créés (3) :**

1. `src/API/controllers/agentVisit.controller.js` - Controller visites agent
2. `src/API/routers/agentVisit.router.js` - Router visites agent
3. `AGENT_VISIT_SYSTEM.md` - Documentation système visites

**Total : 9 fichiers**

---

## 🔄 WORKFLOW AVANT/APRÈS

### **AVANT (Version 1.0)**

```
Customer paie visite sur site
  └─> Visite créée avec status "en attente"
  └─> Agents notifiés
  └─> ❌ Pas de système pour gérer après
```

### **APRÈS (Version 2.0)**

```
1. Customer paie visite sur site
   └─> POST /payment/on-site-visit
   └─> Status: "en_attente"
   └─> Agents notifiés

2. Agent voit les demandes
   └─> GET /agent/visits/pending
   └─> Liste complète disponible

3. Agent accepte
   └─> PUT /agent/visits/:id/accept
   └─> Status: "accepter"
   └─> Infos customer + propriétaire fournies
   └─> Customer notifié

4. Agent confirme
   └─> PUT /agent/visits/:id/confirm
   └─> Status: "confirmer"
   └─> Date + Heure + Lieu définis
   └─> Customer notifié avec détails

5. Visite effectuée
   └─> (À implémenter)
```

---

## 🎯 AVANTAGES DU NOUVEAU SYSTÈME

### **Clarté des rôles**

✅ Customer = Gère ses annonces et paie  
✅ Agent = Gère les visites sur site

### **Meilleure organisation**

✅ Workflow structuré en 4 étapes claires  
✅ Notifications automatiques à chaque étape  
✅ Traçabilité complète

### **Accès aux informations**

✅ Agent reçoit coordonnées customer (téléphone, WhatsApp)  
✅ Agent reçoit infos propriétaire  
✅ Customer reçoit date/heure/lieu précis

### **Flexibilité**

✅ Agent peut annuler si nécessaire  
✅ Plusieurs agents peuvent voir la même demande  
✅ Premier qui accepte la prend en charge

---

## 📝 COMPATIBILITÉ ASCENDANTE

### **Routes conservées (pas de breaking change) :**

- ✅ Toutes les routes publiques fonctionnent toujours
- ✅ Les routes existantes conservent leur comportement
- ✅ Seules les permissions ont changé

### **Ce qui peut casser :**

⚠️ Si un **agent** essayait de :

- Créer/modifier/supprimer une annonce → `403 Forbidden`
- Payer une visite → `403 Forbidden`
- Recharger un wallet → `403 Forbidden`

**Solution :** Les agents doivent maintenant utiliser `/agent/visits/*`

---

## 🧪 MIGRATION DES TESTS

### **Anciens tests à modifier :**

```javascript
// ❌ AVANT - N'importe quel user pouvait créer une annonce
POST /my-announcements
Authorization: Bearer <any_token>

// ✅ APRÈS - Uniquement customer
POST /my-announcements
Authorization: Bearer <customer_token>  // Doit être customer
```

### **Nouveaux tests à ajouter :**

```javascript
// Test 1 : Agent voit demandes
GET /agent/visits/pending
Authorization: Bearer <agent_token>

// Test 2 : Agent accepte
PUT /agent/visits/:id/accept
Authorization: Bearer <agent_token>

// Test 3 : Agent confirme
PUT /agent/visits/:id/confirm
Authorization: Bearer <agent_token>
Body: { visitDate, visitTime, meetingPlace }
```

---

## 📚 DOCUMENTATION MISE À JOUR

### **Fichiers de documentation :**

1. ✅ `AGENT_VISIT_SYSTEM.md` - Nouveau système complet
2. ✅ `CHANGELOG_ROLES.md` - Ce fichier (historique des changements)
3. 🔄 `LISTE_COMPLETE_API.md` - À mettre à jour avec nouvelles routes

### **Documentation existante (toujours valide) :**

- ✅ `ADMIN_AGENT_VALIDATION.md` - Validation agents par admin
- ✅ `CREATE_ADMIN_GUIDE.md` - Création compte admin
- ✅ `SEPARATION_PAIEMENTS.md` - Architecture paiements
- ✅ `NOTIFICATIONS_SYSTEM.md` - Système notifications

---

## 🚀 DÉPLOIEMENT

### **Checklist avant mise en production :**

- [ ] Tests unitaires des nouvelles routes
- [ ] Tests d'intégration du workflow complet
- [ ] Vérification des notifications
- [ ] Documentation à jour
- [ ] Migration des données existantes (si nécessaire)
- [ ] Tests de charge sur les routes agent

### **Commandes à exécuter :**

```bash
# 1. Installer les dépendances (si nouvelles)
npm install

# 2. Redémarrer le serveur
npm start

# 3. Tester les nouvelles routes
# Voir AGENT_VISIT_SYSTEM.md pour les tests complets
```

---

## ⚠️ POINTS D'ATTENTION

### **1. Données existantes**

Si des visites existent avec l'ancien système :

- Elles ont le status "en attente" ou "confirmer"
- Les nouveaux champs `visitTime` et `meetingPlace` seront `null`
- Le status "accepter" n'existe pas encore

**Solution :** Migration optionnelle ou laisser tel quel

### **2. Permissions**

Les agents ne peuvent plus :

- Créer des annonces
- Payer des services
- Recharger un wallet

**Impact :** Si un agent avait ces permissions, elles sont révoquées

### **3. Notifications**

Nouvelles notifications créées :

- "Demande de visite acceptée"
- "Visite confirmée" (avec détails)
- "Visite annulée"

**Impact :** Volume de notifications augmenté

---

## 🎉 CONCLUSION

Le système est maintenant **clairement séparé** entre Customer et Agent, avec un **workflow structuré** pour les visites sur site.

**Prochaines étapes suggérées :**

1. Implémenter "Marquer visite comme effectuée"
2. Ajouter historique des visites pour customer
3. Système de notation des agents
4. Chat agent-customer

---

**Pour toute question, consultez :**

- `AGENT_VISIT_SYSTEM.md` - Documentation complète du nouveau système
- `LISTE_COMPLETE_API.md` - Toutes les routes disponibles

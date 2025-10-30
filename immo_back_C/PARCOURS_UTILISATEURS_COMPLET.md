# 🏠 Système Complet de la Plateforme Immobilière

## 📋 Vue d'Ensemble

Cette plateforme met en relation :

- 👥 **Customers** : Utilisateurs recherchant ou proposant des biens immobiliers
- 🏢 **Agents** : Professionnels de l'immobilier accompagnant les transactions
- ⚙️ **Admin** : Gestionnaires de la plateforme

---

# 👥 PARCOURS CUSTOMER

## 1️⃣ **Inscription et Connexion**

### **Inscription (2 options)**

#### **Option A : Inscription Classique**

```
1. Customer accède à /register
2. Remplit le formulaire :
   - Prénom, nom
   - Email
   - Mot de passe (min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial)
   - Numéro de téléphone
   - Numéro WhatsApp (optionnel)
3. Accepte les conditions générales
4. Soumet le formulaire
```

**Actions automatiques :**

- ✅ Création du compte User (rôle: customer)
- ✅ Création du profil Customer
- ✅ Création d'un Wallet (solde initial: 0 immo)
- ✅ Génération d'un token JWT
- ✅ Connexion automatique

#### **Option B : Inscription via Parrainage**

```
1. Customer reçoit un lien de parrainage d'un agent :
   /register?ref=AGT-XXXXXXXX
2. Le champ sponsorshipCode est pré-rempli
3. Customer complète le formulaire
4. Soumet l'inscription
```

**Actions automatiques :**

- ✅ Tout ce qui précède +
- ✅ Liaison avec l'agent parrain (sponsoredBy)
- ✅ L'agent recevra des commissions sur les activités du customer

### **Connexion**

```
1. Customer accède à /login
2. Entre email et mot de passe
3. Se connecte
```

**Vérifications :**

- ✅ Compte actif (isActive: true)
- ✅ Identifiants corrects
- ✅ Token JWT généré

---

## 2️⃣ **Gestion du Wallet**

### **Consultation du Solde**

```
Customer → /user/wallet
Affichage : Solde actuel en "immo"
```

### **Recharge du Wallet**

```
1. Customer accède à /user/wallet
2. Sélectionne un pack d'immo :
   - Pack 1 : 10,000 immo = 5,000 FCFA
   - Pack 2 : 25,000 immo = 10,000 FCFA
   - Pack 3 : 50,000 immo = 20,000 FCFA
   (Exemples, à adapter selon les tarifs)
3. Clique sur "Recharger"
4. Paiement via agrégateur (Orange Money, MTN, Wave) [à intégrer]
5. Wallet crédité automatiquement
```

**Historique des Transactions**

- ✅ Affichage de toutes les transactions (recharges, paiements)
- ✅ Date, type, montant, description

---

## 3️⃣ **Création d'Annonce**

### **Étapes de Création**

```
1. Customer → /user/announcements
2. Clique sur "Créer une annonce"
3. Remplit le formulaire :
   - Titre
   - Description
   - Type de bien (Maison, Appartement, Terrain, etc.)
   - Statut (à vendre / à louer)
   - Prix
   - Localisation (district)
   - Superficie
   - Nombre de pièces (chambres, salles de bain, salons, cuisines)
   - État général
   - Équipements (garage, toilettes internes/externes)
   - Photos (galerie)
   - Titre foncier (optionnel)
4. Soumet l'annonce
```

**Coût : 5,000 immo**

### **Actions Automatiques du Système**

#### **Étape 1 : Vérification et Débit**

- ✅ Vérifie le solde du wallet (≥ 5,000 immo)
- ✅ Débite 5,000 immo du wallet
- ✅ Crée une transaction dans l'historique

#### **Étape 2 : Calcul de la Commission**

- ✅ **Si à vendre** : Commission = 5% du prix
- ✅ **Si à louer** : Commission = 10% du loyer
- ✅ Sauvegarde dans `announcement.commission`

#### **Étape 3 : Assignation Automatique de 3 Agents**

Le système assigne **intelligemment** 3 agents selon :

**Critères de sélection :**

1. **Rotation équitable** : Les agents les moins récemment assignés en premier
2. **Proximité géographique** :
   - Agents de la même région prioritaires
   - Régions du Bénin :
     - **Sud** : Cotonou, Porto-Novo, Abomey-Calavi, Ouidah, Sèmè-Kpodji
     - **Centre** : Bohicon, Abomey, Savalou, Dassa-Zoumé (compatible avec Sud et Nord)
     - **Nord** : Parakou, Natitingou, Kandi, Malanville

**Exemples :**

- Annonce à Cotonou → Agents du Sud ou du Centre
- Annonce à Parakou → Agents du Nord ou du Centre
- Annonce à Bohicon → Tous les agents compatibles

#### **Étape 4 : Notifications**

**Notification aux 3 Agents Assignés :**

```
Titre : "Nouvelle annonce assignée"
Message : "Une nouvelle annonce 'Villa moderne' vous a été assignée
           dans la région de Cotonou"
```

**Notification au Customer (✨ NOUVEAU) :**

```
Titre : "Agents assignés à votre annonce"
Message : "Votre annonce 'Villa moderne' a été créée avec succès !
           Voici les agents qui vous accompagneront :

Agent 1:
- Nom: Jean Dupont
- Photo: [URL de la CIP]
- Description: Agent immobilier avec 10 ans d'expérience

Agent 2:
- Nom: Marie Martin
- Photo: [URL de la CIP]
- Description: Spécialiste des biens résidentiels

Agent 3:
- Nom: Paul Kouadio
- Photo: [URL de la CIP]
- Description: Expert en transactions immobilières"
```

---

## 4️⃣ **Consultation d'Annonces**

### **Recherche d'Annonces**

```
Customer → /announcements
Filtres disponibles :
- Type de bien
- Localisation
- Prix maximum
- Catégorie (vente/location)
```

### **Détails d'une Annonce**

```
Customer → Clique sur une annonce
Affichage :
- Photos
- Description complète
- Prix
- Caractéristiques (superficie, pièces, etc.)
- Localisation
- Propriétaire
- Bouton "Ajouter aux favoris"
- Bouton "Visite virtuelle" (si disponible)
- Bouton "Demander une visite sur site"
```

---

## 5️⃣ **Visites**

### **A. Visite Virtuelle**

**Coût : 2,000 immo**

```
1. Customer clique sur "Visite virtuelle"
2. Système vérifie :
   - Customer = propriétaire → Gratuit
   - Admin → Gratuit
   - Autre customer → 2,000 immo débités
3. Accès à l'URL de la visite virtuelle
```

**Distribution des Commissions (si customer parrainé) :**

- ✅ **70% Plateforme** : 1,400 immo
- ✅ **30% Agent parrain** : 600 immo

**Actions automatiques :**

- ✅ Débit du wallet customer
- ✅ Crédit du wallet agent parrain (si applicable)
- ✅ Notification à l'agent parrain
- ✅ Transaction enregistrée

### **B. Visite sur Site**

**Coût : 1,000 immo**

#### **Étape 1 : Demande de Visite**

```
1. Customer clique sur "Demander une visite"
2. Wallet débité de 1,000 immo
3. Demande créée avec statut "en_attente"
4. Notification envoyée UNIQUEMENT aux 3 agents assignés à cette annonce
```

**Notification aux Agents Assignés :**

```
Titre : "Nouvelle demande de visite sur site"
Message : "Une demande de visite a été faite pour 'Villa moderne'
           (annonce qui vous est assignée)"
```

#### **Étape 2 : Acceptation par un Agent**

```
1. UN SEUL des 3 agents peut accepter
2. Premier agent qui accepte → Les autres ne peuvent plus
3. Statut passe à "accepter"
```

**Distribution des Commissions :**

- ✅ **Si customer parrainé** :
  - **70% Plateforme** : 700 immo
  - **30% Agent parrain** : 300 immo
- ✅ **Si customer non parrainé** :
  - **100% Plateforme** : 1,000 immo

**Notifications :**

- ✅ Customer : "Votre demande a été acceptée"
- ✅ Agent parrain : "Commission de 300 immo reçue" (si applicable)

#### **Étape 3 : Confirmation de la Visite**

```
1. Agent contacte le customer (téléphone/WhatsApp fournis)
2. Agent confirme dans le système :
   - Date de la visite
   - Heure de la visite
   - Lieu de rencontre
3. Statut passe à "confirmer"
```

**Notification au Customer :**

```
Titre : "Visite confirmée"
Message : "Votre visite pour 'Villa moderne' est confirmée !

Date : Lundi 28 octobre 2025
Heure : 10h00
Lieu de rencontre : Devant l'immeuble, Rue des Palmiers

Soyez à l'heure !"
```

#### **Étape 4 : Après la Visite**

```
Agent peut marquer la visite comme "effectuer" ou "annuler"
```

---

## 6️⃣ **Gestion du Profil**

### **Consultation du Profil**

```
Customer → /user/profile
Affichage :
- Informations personnelles
- Solde du wallet (en "immo")
- Préférences de biens
- Bouton "Modifier"
```

### **Modification du Profil**

```
Customer peut modifier :
- Prénom, nom
- Numéro de téléphone
- Numéro WhatsApp
- Adresse (optionnel)
```

### **Gestion des Préférences**

```
Customer peut :
- Ajouter des types de biens préférés (Maison, Appartement, etc.)
- Retirer des préférences
→ Notifications ciblées futures basées sur ces préférences
```

---

## 7️⃣ **Favoris**

### **Ajouter un Favori**

```
Customer → Clique sur "❤️" sur une annonce
→ Annonce ajoutée aux favoris
```

### **Consulter les Favoris**

```
Customer → /user/favorites
→ Liste de toutes les annonces favorites
→ Possibilité de retirer des favoris
```

---

## 8️⃣ **Notifications**

### **Consultation**

```
Customer → /user/notifications
Types de notifications :
- ✅ Agents assignés à son annonce (avec photos et descriptions)
- ✅ Demande de visite acceptée
- ✅ Visite confirmée (date, heure, lieu)
- ✅ Visite annulée
- ✅ Paiement effectué
- ✅ Wallet rechargé
```

### **Marquage comme Lu**

```
Customer clique sur une notification
→ isRead passe à true
```

---

## 9️⃣ **Mes Annonces**

### **Consultation**

```
Customer → /user/announcements
Liste de toutes les annonces créées :
- Titre, prix, localisation
- Statut (validée/en attente)
- Nombre de vues
- Boutons : "Modifier" / "Supprimer"
```

### **Modification d'une Annonce**

```
Customer peut modifier :
- Titre, description, prix
- Photos
- Caractéristiques
→ Aucun coût supplémentaire
```

### **Suppression d'une Annonce**

```
Customer clique sur "Supprimer"
→ Confirmation requise
→ Annonce supprimée définitivement
→ Aucun remboursement des 5,000 immo
```

---

## 🔄 **Résumé du Flux Customer**

```
Inscription (avec/sans parrainage)
    ↓
Recharge du wallet
    ↓
[OPTION 1] Créer une annonce
    ↓
    → 3 agents assignés automatiquement
    → Notification avec détails des agents
    ↓
[OPTION 2] Rechercher des annonces
    ↓
    → Consulter les détails
    → Ajouter aux favoris
    → Demander une visite virtuelle (2,000 immo)
    → Demander une visite sur site (1,000 immo)
    ↓
Agent accepte et confirme la visite
    ↓
Visite effectuée
    ↓
Transaction finalisée
```

---

# 🏢 PARCOURS AGENT

## 1️⃣ **Inscription**

### **Formulaire d'Inscription Agent**

```
Agent → /agent/register
Champs requis :
- Prénom, nom
- Email
- Mot de passe
- Numéro de téléphone
- Adresse (localisation de l'agent)
- Description professionnelle (min 20 caractères)
- Image CIP (Carte d'Identité Professionnelle)
```

**Actions automatiques :**

- ✅ Création du compte User (rôle: agent, isActive: false)
- ✅ Création du profil Agent (isValide: false)
- ✅ Création d'un Wallet (solde initial: 0 immo)
- ✅ Statut : **En attente de validation**

**Notification à l'Agent :**

```
Toast : "Inscription bien reçue. En attente de validation de la part de l'admin"
→ Redirection vers la page d'accueil après 3 secondes
```

⚠️ **L'agent ne peut PAS se connecter tant qu'il n'est pas validé par l'admin**

---

## 2️⃣ **Validation par l'Admin**

### **Processus de Validation**

```
Admin → /admin/agents/pending
→ Liste des agents en attente
→ Admin clique sur "Valider"
```

**Actions automatiques :**

- ✅ `isValide` passe à `true`
- ✅ `isActive` passe à `true`
- ✅ **Génération automatique du code de parrainage** : `AGT-XXXXXXXX`
- ✅ Agent peut maintenant se connecter

**Notification à l'Agent :**

```
Titre : "Compte agent validé"
Message : "Félicitations Jean ! Votre compte agent a été validé par
           l'administrateur. Vous pouvez maintenant vous connecter et
           utiliser toutes les fonctionnalités agent."
```

---

## 3️⃣ **Connexion et Dashboard**

### **Connexion**

```
Agent → /login
Entre email et mot de passe
→ Accès au tableau de bord agent
```

### **Dashboard Agent**

```
Vue d'ensemble :
- Nombre d'annonces assignées
- Nombre de demandes de visite en attente
- Solde du wallet (commissions)
- Nombre de clients parrainés
- Total des commissions perçues
```

---

## 4️⃣ **Consultation des Annonces Assignées**

### **Liste des Annonces**

```
Agent → /agent/my-announcements
Affichage :
- Toutes les annonces où l'agent est assigné (max 3 agents par annonce)
- Détails : titre, prix, localisation, propriétaire
- Statut des demandes de visite associées
```

**Système de Rotation :**

- ✅ Les agents sont assignés par rotation équitable
- ✅ Les moins récemment assignés sont prioritaires
- ✅ Compatibilité géographique respectée

---

## 5️⃣ **Gestion des Demandes de Visite**

### **Consultation des Demandes en Attente**

```
Agent → /agent/visits/pending
Liste :
- Uniquement les visites pour les annonces qui lui sont assignées
- Informations du customer (nom, téléphone, WhatsApp)
- Détails de l'annonce
- Bouton "Accepter"
```

### **Acceptation d'une Demande**

```
1. Agent clique sur "Accepter"
2. Système vérifie : premier arrivé, premier servi
3. Si déjà acceptée par un autre agent → Message d'erreur
4. Si disponible → Acceptation confirmée
```

**Informations fournies à l'Agent :**

- ✅ Nom complet du customer
- ✅ Email
- ✅ Numéro de téléphone
- ✅ Numéro WhatsApp
- ✅ Informations du propriétaire de l'annonce

**Distribution Automatique des Commissions :**

- ✅ Si customer parrainé : 30% (300 immo) pour l'agent parrain
- ✅ Wallet crédité automatiquement
- ✅ Transaction enregistrée

### **Confirmation de la Visite**

```
Agent → Contacte le customer
→ Convient d'une date, heure, lieu
→ Confirme dans le système :
   - Date de visite
   - Heure
   - Lieu de rencontre
```

**Notification automatique au Customer** avec tous les détails

### **Après la Visite**

```
Agent → Marque la visite comme :
- "effectuer" : Visite réalisée
- "annuler" : Visite annulée (avec motif optionnel)
```

---

## 6️⃣ **Système de Parrainage**

### **Génération du Lien de Parrainage**

```
Agent → /agent/sponsorship-link
Système génère :
- Code unique : AGT-XXXXXXXX
- Lien complet : http://localhost:5173/register?ref=AGT-XXXXXXXX
```

**Exemple de réponse :**

```json
{
  "success": true,
  "data": {
    "sponsorshipCode": "AGT-A1B2C3D4",
    "sponsorshipLink": "http://localhost:5173/register?ref=AGT-A1B2C3D4",
    "agentName": "Jean Dupont"
  }
}
```

### **Partage du Lien**

```
Agent partage le lien via :
- WhatsApp
- Email
- Réseaux sociaux
- SMS
```

### **Inscription d'un Customer Parrainé**

```
Customer clique sur le lien de parrainage
→ Code pré-rempli dans le formulaire
→ S'inscrit normalement
→ Liaison automatique avec l'agent parrain
```

### **Consultation des Clients Parrainés**

```
Agent → /agent/my-sponsored-customers
Liste :
- Nom complet
- Email
- Date d'inscription
- Nombre de transactions effectuées (futur)
```

---

## 7️⃣ **Commissions et Wallet**

### **Types de Commissions**

#### **A. Commission sur Visite Virtuelle**

```
Customer parrainé paie une visite virtuelle (2,000 immo)
→ Agent parrain reçoit : 600 immo (30%)
→ Plateforme reçoit : 1,400 immo (70%)
```

#### **B. Commission sur Visite sur Site**

```
Customer parrainé demande une visite (1,000 immo)
→ Agent parrain reçoit : 300 immo (30%)
→ Plateforme reçoit : 700 immo (70%)
```

**Notifications automatiques :**

```
Titre : "Commission de parrainage reçue"
Message : "Vous avez reçu 300 FCFA de commission pour le parrainage
           de Marie Martin"
```

### **Consultation du Wallet**

```
Agent → /agent/wallet
Affichage :
- Solde actuel (en immo)
- Historique des commissions
- Bouton "Demander un retrait"
```

### **Historique des Commissions**

```
Agent → /agent/commissions
Détails :
- Date
- Type (visite virtuelle / visite sur site)
- Montant
- Customer concerné
- Total des commissions
```

### **Demande de Retrait**

```
Agent → /agent/wallet/withdraw
Champs :
- Montant à retirer (min: 1,000 FCFA)
- Méthode de paiement (Orange Money, MTN, Wave)
- Numéro de téléphone

Système :
1. Vérifie le solde
2. Débite le wallet agent
3. Crée une demande de retrait (status: pending)
4. [À intégrer] Traitement via l'agrégateur de paiement
```

**Notification :**

```
Titre : "Demande de retrait enregistrée"
Message : "Votre demande de retrait de 5,000 FCFA via Orange Money
           a été enregistrée. Le traitement prendra quelques minutes."
```

---

## 8️⃣ **Profil Agent**

### **Consultation du Profil**

```
Agent → /agent/profile
Affichage :
- Informations personnelles
- Adresse
- Description professionnelle
- Image CIP
- Code de parrainage
- Statut (validé/non validé)
- Date d'inscription
```

### **Modification du Profil**

```
Agent peut modifier :
- Numéro de téléphone
- Adresse
- Description
- Image CIP
```

---

## 9️⃣ **Notifications Agent**

### **Types de Notifications**

```
1. Validation du compte
2. Nouvelle annonce assignée
3. Nouvelle demande de visite
4. Commission reçue
5. Retrait traité
6. Visite annulée par le customer
```

### **Consultation**

```
Agent → /agent/notifications
→ Liste chronologique
→ Filtrage par type
→ Marquage comme lu
```

---

## 🔄 **Résumé du Flux Agent**

```
Inscription avec documents requis
    ↓
Attente de validation admin
    ↓
Validation + Génération code de parrainage
    ↓
Connexion au dashboard
    ↓
[OPTION 1] Partage du lien de parrainage
    ↓
    → Customers s'inscrivent via le lien
    → Agent reçoit des commissions (30%)
    ↓
[OPTION 2] Annonces assignées automatiquement
    ↓
    → Notifications de nouvelles annonces
    → Réception de demandes de visite
    ↓
Agent accepte une demande
    ↓
    → Commission créditée (si customer parrainé)
    → Contact avec le customer
    ↓
Agent confirme la visite (date, heure, lieu)
    ↓
Visite effectuée
    ↓
Commission accumulée dans le wallet
    ↓
Agent demande un retrait
    ↓
Paiement via agrégateur
```

---

# 🔄 INTERACTIONS CUSTOMER ↔ AGENT

## Scénario 1 : Customer Non Parrainé + Visite sur Site

```
Customer crée une annonce
    ↓
3 agents assignés automatiquement (rotation + géolocalisation)
    ↓
Agents notifiés : "Nouvelle annonce assignée"
Customer notifié : "Voici vos 3 agents" (avec photos + descriptions)
    ↓
Customer recherche un bien et demande une visite (1,000 immo débité)
    ↓
Notification UNIQUEMENT aux 3 agents assignés à cette annonce
    ↓
Agent 1 accepte en premier
    ↓
Commission distribuée : 100% plateforme (1,000 immo)
    ↓
Agent contacte customer, confirme visite
    ↓
Visite effectuée
```

## Scénario 2 : Customer Parrainé + Visite Virtuelle

```
Agent génère lien : /register?ref=AGT-XXXXXXXX
    ↓
Customer s'inscrit via le lien
    ↓
Liaison customer ↔ agent parrain enregistrée
    ↓
Customer consulte une annonce et paie visite virtuelle (2,000 immo)
    ↓
Commission distribuée :
  - Agent parrain : +600 immo (30%)
  - Plateforme : +1,400 immo (70%)
    ↓
Agent parrain notifié : "Commission de 600 immo reçue"
    ↓
Customer accède à la visite virtuelle
```

## Scénario 3 : Customer Parrainé Crée une Annonce

```
Customer parrainé crée une annonce (5,000 immo débité)
    ↓
Commission calculée : 5% (vente) ou 10% (location) du prix
    ↓
3 agents assignés (dont l'agent parrain n'est PAS prioritaire)
    ↓
Customer notifié avec détails des 3 agents assignés
    ↓
Un autre customer (non parrainé) demande une visite (1,000 immo)
    ↓
Un des 3 agents accepte
    ↓
Commission : 100% plateforme (pas de parrain pour ce customer visiteur)
```

---

# 📊 TABLEAU RÉCAPITULATIF DES COÛTS ET COMMISSIONS

## Coûts pour le Customer

| Service                                  | Coût (immo) | Commentaire              |
| ---------------------------------------- | ----------- | ------------------------ |
| Inscription                              | Gratuit     | -                        |
| Création d'annonce                       | 5,000       | Débit immédiat           |
| Visite virtuelle                         | 2,000       | Par annonce              |
| Visite sur site                          | 1,000       | Par annonce              |
| Création visite virtuelle (propriétaire) | 10,000      | [À intégrer API externe] |

## Commissions pour les Agents

| Service            | Customer Parrainé | Customer Non Parrainé |
| ------------------ | ----------------- | --------------------- |
| Visite virtuelle   | 30% = 600 immo    | 0%                    |
| Visite sur site    | 30% = 300 immo    | 0%                    |
| Acceptation visite | 0%                | 0%                    |

## Revenus de la Plateforme

| Service          | Customer Parrainé | Customer Non Parrainé |
| ---------------- | ----------------- | --------------------- |
| Création annonce | 5,000 immo        | 5,000 immo            |
| Visite virtuelle | 70% = 1,400 immo  | 100% = 2,000 immo     |
| Visite sur site  | 70% = 700 immo    | 100% = 1,000 immo     |

---

# 🎯 AVANTAGES DU SYSTÈME

## Pour les Customers

✅ **Transparence totale**

- Connaît immédiatement les 3 agents assignés (photos + descriptions)
- Historique complet des transactions
- Notifications en temps réel

✅ **Choix et flexibilité**

- Recherche avancée d'annonces
- Visites virtuelles disponibles
- Favoris pour suivi facile

✅ **Accompagnement professionnel**

- 3 agents qualifiés par annonce
- Réponse rapide aux demandes de visite
- Agents géographiquement proches

## Pour les Agents

✅ **Flux d'annonces garanti**

- Assignation automatique et équitable
- Rotation pour égalité des chances
- Proximité géographique respectée

✅ **Revenus passifs via parrainage**

- 30% de commission sur chaque activité des filleuls
- Lien unique facile à partager
- Suivi des clients parrainés

✅ **Organisation facilitée**

- Dashboard complet
- Gestion des visites centralisée
- Notifications ciblées

## Pour la Plateforme

✅ **Qualité de service**

- Distribution équitable des agents
- Matching géographique intelligent
- Commissions automatisées

✅ **Monétisation efficace**

- Revenus sur chaque transaction
- Majorité des commissions (70%)
- Traçabilité complète

✅ **Croissance organique**

- Système de parrainage encourage le bouche-à-oreille
- Agents motivés à recruter
- Customers fidélisés

---

# 🔐 SÉCURITÉ ET VALIDATIONS

## Authentification

- ✅ JWT pour toutes les requêtes protégées
- ✅ Middleware d'authentification
- ✅ Vérification des rôles (customer, agent, admin)

## Validations

- ✅ Validation Joi pour tous les formulaires
- ✅ Vérification du solde avant chaque transaction
- ✅ Prévention des doublons (agent ne peut accepter 2 fois la même visite)

## Transactions

- ✅ Atomicité : Si échec, pas de débit
- ✅ Historique complet pour audit
- ✅ Notifications systématiques

---

# 📱 NOTIFICATIONS EMAIL (À INTÉGRER)

Chaque notification créée dans la DB a un champ `emailSent: false`.

**Développement futur avec MailDev :**

- ✅ Envoi d'email pour chaque notification importante
- ✅ Templates HTML personnalisés
- ✅ Marquage `emailSent: true` après envoi

---

# 🚀 TECHNOLOGIES UTILISÉES

## Backend

- **Node.js** + **Express** : API REST
- **MongoDB** + **Mongoose** : Base de données
- **JWT** : Authentification
- **Joi** : Validation des données
- **Bcrypt** : Hashing des mots de passe
- **Crypto** : Génération codes de parrainage

## Frontend (Vue.js)

- **Vue 3** + **Composition API**
- **Vue Router** : Navigation
- **Axios** : Requêtes API
- **LocalStorage** : Persistance session

---

**Date de création :** Octobre 2025  
**Version :** 1.1.0  
**Développeur :** Assistant AI + Michelle  
**Statut :** ✅ Système complet et opérationnel



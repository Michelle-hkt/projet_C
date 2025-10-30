# 📝 Mise à Jour du Formulaire d'Inscription Agent

## 📅 Date : 29 Octobre 2025

---

## ✅ MODIFICATIONS EFFECTUÉES

Le formulaire d'inscription des agents (`/agent/register`) a été mis à jour pour correspondre aux nouveaux attributs du modèle `Agent`.

---

## 🆕 NOUVEAUX CHAMPS AJOUTÉS

### 1. **Adresse / Localisation** (`address`)

```vue
<div class="form_item">
  <label>Adresse / Localisation</label>
  <input 
    v-model="address" 
    type="text" 
    placeholder="Ex: Cotonou, Cadjèhoun" 
    required 
  />
  <small class="form_hint">Votre zone d'activité principale</small>
</div>
```

**Validation :**

- ✅ Obligatoire
- ✅ Minimum 5 caractères
- ✅ Maximum 200 caractères

**Objectif :** Définir la zone géographique d'intervention de l'agent pour l'assignation intelligente aux annonces.

---

### 2. **Description Professionnelle** (`description`)

```vue
<div class="form_item">
  <label>Description professionnelle</label>
  <textarea 
    v-model="description" 
    placeholder="Décrivez votre expérience en tant qu'agent immobilier (minimum 20 caractères)..."
    rows="4"
    minlength="20"
    required
  ></textarea>
  <small class="form_hint">{{ description.length }}/20 caractères minimum</small>
</div>
```

**Validation :**

- ✅ Obligatoire
- ✅ Minimum 20 caractères
- ✅ Maximum 500 caractères
- ✅ Compteur de caractères en temps réel

**Objectif :** Permettre à l'agent de présenter son expérience et ses qualifications. Cette description sera affichée aux clients lorsque l'agent est assigné à une annonce.

---

### 3. **Image CIP** (`cipImage`)

```vue
<div class="form_item">
  <label>Image CIP (Carte d'Identité Professionnelle)</label>
  <input 
    v-model="cipImage" 
    type="text" 
    placeholder="URL de votre image CIP" 
    required 
  />
  <small class="form_hint">Entrez l'URL de votre carte professionnelle</small>
</div>
```

**Validation :**

- ✅ Obligatoire
- ✅ Format : URL de l'image

**Objectif :** Stocker l'image de la Carte d'Identité Professionnelle de l'agent pour vérification par l'admin et affichage aux clients.

---

## 📊 STRUCTURE DU FORMULAIRE (ORDRE DES CHAMPS)

1. **Nom** (`lastName`)
2. **Prénom** (`firstName`)
3. **Email** (`email`)
4. **Téléphone** (`phoneNumber`)
5. **✨ Adresse / Localisation** (`address`) - **NOUVEAU**
6. **✨ Description professionnelle** (`description`) - **NOUVEAU**
7. **✨ Image CIP** (`cipImage`) - **NOUVEAU**
8. **Mot de passe** (`password`)
9. **Acceptation des conditions** (`acceptTerms`)

---

## 🎨 AMÉLIORATIONS UI/UX

### 1. **Carte Plus Large**

```css
.card {
  width: 600px; /* Avant: 550px */
  max-width: 95%;
  border-radius: 15px;
  background-color: #fff;
}
```

### 2. **Scroll Activé**

```css
.box {
  min-height: 100vh; /* Avant: height: 100vh */
  padding: 40px 20px; /* Ajouté */
}
```

### 3. **Styles pour Textarea**

```css
.form_item textarea {
  width: 100%;
  padding: 12px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
}

.form_item textarea:focus {
  border-color: #274abb;
}
```

### 4. **Indications (Hints)**

```css
.form_hint {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  font-style: italic;
}
```

---

## 🔄 FLUX D'INSCRIPTION MIS À JOUR

### Frontend (`AgentRegisterView.vue`)

```javascript
const handleRegister = async () => {
  const response = await agentService.registerAgent({
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    phoneNumber: phoneNumber.value,
    address: address.value, // ✨ NOUVEAU
    description: description.value, // ✨ NOUVEAU
    cipImage: cipImage.value, // ✨ NOUVEAU
  });

  if (response.success) {
    // Afficher toast de confirmation
    showToast.value = true;

    // Redirection après 3 secondes
    setTimeout(() => {
      router.push("/home");
    }, 3000);
  }
};
```

### Backend (`agent.service.js`)

```javascript
export const registerAgentService = async (agentData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    address, // ✨ NOUVEAU
    description, // ✨ NOUVEAU
    cipImage, // ✨ NOUVEAU
  } = agentData;

  // Création du User
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "agent",
    isActive: false,
  });

  // Création de l'Agent
  const newAgent = new Agent({
    userId: savedUser._id,
    phoneNumber,
    address, // ✨ NOUVEAU
    description, // ✨ NOUVEAU
    cipImage, // ✨ NOUVEAU
    isValide: false,
  });

  return {
    success: true,
    message: "Inscription réussie. En attente de validation...",
    data: { user: savedUser, agent: savedAgent },
  };
};
```

---

## ✅ VALIDATIONS BACKEND

### Fichier : `agent.validation.js`

```javascript
export const registerAgentValidation = joi.object({
  // ... champs existants ...

  address: joi.string().min(5).max(200).required().messages({
    "string.empty": "L'adresse est obligatoire",
    "string.min": "L'adresse doit contenir au moins 5 caractères",
    "string.max": "L'adresse ne peut pas dépasser 200 caractères",
  }),

  description: joi.string().min(20).max(500).required().messages({
    "string.empty": "La description est obligatoire",
    "string.min": "La description doit contenir au moins 20 caractères",
    "string.max": "La description ne peut pas dépasser 500 caractères",
  }),

  cipImage: joi.string().required().messages({
    "string.empty": "L'image CIP est obligatoire",
  }),
});
```

---

## 🔄 APRÈS L'INSCRIPTION

### 1. **Notification Toast**

```
✓ Inscription bien reçue
En attente de validation de la part de l'admin
```

Affichée pendant 3 secondes en haut à droite.

### 2. **Redirection**

Retour automatique vers `/home` après 3 secondes.

### 3. **Validation Admin**

L'admin doit valider le compte agent depuis :

```
GET /api/v1/agent/pending
PUT /api/v1/agent/validate/:agentId
```

### 4. **Génération du Code de Parrainage**

Lors de la validation par l'admin, le code de parrainage unique est généré automatiquement :

```javascript
agentModel.pre("save", function (next) {
  if (this.isValide && !this.sponsorshipCode) {
    this.sponsorshipCode = `AGT-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;
  }
  next();
});
```

**Exemple :** `AGT-A1B2C3D4`

---

## 📱 RESPONSIVENESS

### Mobile (< 768px)

```css
@media (max-width: 768px) {
  .card {
    width: 90%;
  }

  .card_right {
    padding: 20px;
  }
}
```

---

## 🎯 POURQUOI CES CHAMPS ?

### **Adresse** (`address`)

- **Assignation géographique** : Le système utilise l'adresse pour assigner les agents aux annonces selon leur proximité géographique.
- **Exemple** : Un agent de Cotonou sera prioritaire pour les annonces de Cotonou.

### **Description** (`description`)

- **Transparence** : Les clients voient la description de l'agent assigné à leur annonce.
- **Confiance** : Une description détaillée augmente la confiance du client.
- **Différenciation** : Permet aux agents de se démarquer.

### **Image CIP** (`cipImage`)

- **Vérification** : L'admin peut vérifier l'identité professionnelle avant validation.
- **Professionnalisme** : Garantit que seuls les agents qualifiés sont acceptés.
- **Notification** : L'image est affichée au client lors de l'assignation.

---

## 📋 EXEMPLE DE NOTIFICATION AU CLIENT

Après création d'une annonce, le client reçoit :

```
📢 Titre : "Agents assignés à votre annonce"

Message : "Votre annonce 'Villa moderne' a été créée avec succès !
Voici les agents qui vous accompagneront :

Agent 1:
- Nom: Jean Dupont
- Photo: https://example.com/cip-jean.jpg
- Description: Agent immobilier avec 10 ans d'expérience dans
  la région de Cotonou. Spécialisé en vente de villas et
  appartements haut de gamme.

Agent 2:
- Nom: Marie Martin
- Photo: https://example.com/cip-marie.jpg
- Description: Experte en location résidentielle et commerciale...

Agent 3:
- Nom: Paul Dubois
- Photo: https://example.com/cip-paul.jpg
- Description: Agent certifié depuis 2018, spécialiste..."
```

---

## 🔒 SÉCURITÉ

1. **Validation Frontend** : Tous les champs sont `required`
2. **Validation Backend** : Joi valide tous les champs avec des règles strictes
3. **Validation Admin** : Le compte agent est inactif jusqu'à validation manuelle
4. **Image CIP** : Permet à l'admin de vérifier l'identité professionnelle

---

## 🧪 TESTS RECOMMANDÉS

### 1. **Test Frontend**

```bash
# Accéder au formulaire
http://localhost:5173/agent/register

# Essayer de soumettre sans remplir les nouveaux champs
# → Doit afficher "Ce champ est obligatoire"

# Essayer une description de moins de 20 caractères
# → Doit afficher le message de validation

# Remplir tous les champs correctement
# → Doit afficher la toast et rediriger vers /home
```

### 2. **Test Backend**

```bash
curl -X POST http://localhost:3000/api/v1/agent/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean@test.com",
    "password": "Password123!",
    "phoneNumber": "61234567",
    "address": "Cotonou, Cadjèhoun",
    "description": "Agent immobilier expérimenté avec 10 ans dans le domaine",
    "cipImage": "https://example.com/cip.jpg"
  }'
```

**Réponse attendue :**

```json
{
  "success": true,
  "message": "Inscription réussie. En attente de validation par l'administrateur",
  "data": {
    "user": { ... },
    "agent": {
      "address": "Cotonou, Cadjèhoun",
      "description": "Agent immobilier expérimenté...",
      "cipImage": "https://example.com/cip.jpg",
      "isValide": false,
      ...
    }
  }
}
```

---

## 📝 TODO (Améliorations Futures)

- [ ] **Upload d'image** : Remplacer le champ URL par un vrai upload d'image
- [ ] **Géolocalisation** : Sélection de l'adresse via une carte interactive
- [ ] **Preview** : Prévisualiser l'image CIP avant soumission
- [ ] **Validation en temps réel** : Vérifier le format de l'URL de l'image
- [ ] **Multiple régions** : Permettre à un agent de couvrir plusieurs régions

---

## ✅ RÉSUMÉ

| Élément              | Avant           | Après                                |
| -------------------- | --------------- | ------------------------------------ |
| Nombre de champs     | 5               | 8                                    |
| Largeur de la carte  | 550px           | 600px                                |
| Hauteur du conteneur | `height: 100vh` | `min-height: 100vh` (scroll)         |
| Nouveaux champs      | -               | `address`, `description`, `cipImage` |
| Validation backend   | 5 champs        | 8 champs                             |
| Notification client  | -               | ✅ Photo + description des agents    |

---

**Date de mise à jour :** 29 Octobre 2025  
**Version :** 1.2.0  
**Statut :** ✅ Formulaire opérationnel et prêt pour la production



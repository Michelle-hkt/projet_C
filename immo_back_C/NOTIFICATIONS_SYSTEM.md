# 📬 Système de Notifications - Documentation

## 🎯 Principe

**Pas de messagerie interne** - Tout fonctionne via notifications + emails

Chaque notification dans le système = **Un email envoyé** à l'utilisateur

---

## 📋 Modèle Notification

```javascript
{
  user: ObjectId,              // Destinataire de la notification
  title: String,               // Titre de la notification
  message: String,             // Message détaillé
  action: String,              // Action qui a déclenché la notification
  isRead: Boolean,             // Notification lue ou non
  emailSent: Boolean,          // Email envoyé ou non
  announcement: ObjectId,      // Annonce liée (optionnel)
  timestamps: true             // createdAt, updatedAt
}
```

---

## 🎬 Actions disponibles

Voici les 4 actions qui déclenchent une notification :

### **1. `paiement`**

Pour toutes les transactions financières

**Exemples d'utilisation :**

- Recharge du wallet
- Publication d'annonce
- Paiement d'une visite
- Paiement d'un agent
- Annonce validée/rejetée

**Exemple :**

```javascript
{
  user: customerId,
  title: "Paiement effectué",
  message: "Votre paiement de 5000 pour la publication d'annonce a été effectué",
  action: "paiement",
  announcement: announcementId
}
```

---

### **2. `visite`**

Pour tout ce qui concerne les visites sur site

**Exemples d'utilisation :**

- Demande de visite enregistrée
- Visite prise en charge par un agent
- Visite confirmée avec date/heure
- Visite annulée
- Rappel de visite

**Exemple :**

```javascript
{
  user: customerId,
  title: "Visite confirmée",
  message: "Votre visite est confirmée pour le 15/11/2025 à 14h00",
  action: "visite",
  announcement: announcementId
}
```

---

### **3. `visite_virtuelle`**

Pour tout ce qui concerne les visites virtuelles

**Exemples d'utilisation :**

- Commande de visite virtuelle
- Visite virtuelle prête
- Accès à une visite virtuelle payée
- Visite virtuelle mise à jour

**Exemple :**

```javascript
{
  user: customerId,
  title: "Visite virtuelle disponible",
  message: "La visite virtuelle de 'Villa 4 pièces' est maintenant disponible",
  action: "visite_virtuelle",
  announcement: announcementId
}
```

---

### **4. `preference`**

Pour tout ce qui concerne les préférences et les recommandations

**Exemples d'utilisation :**

- Nouveau bien correspondant aux préférences du customer
- Alerte sur un bien qui matche les critères
- Changement de prix sur un bien préféré
- Mise à jour d'un bien dans les favoris

**Exemple :**

```javascript
{
  user: customerId,
  title: "Nouveau bien disponible",
  message: "Un nouveau bien correspondant à vos préférences est disponible à Cocody",
  action: "preference",
  announcement: announcementId
}
```

---

## 📧 Système Email

### Principe

- **Chaque notification = Un email envoyé**
- L'email est envoyé à l'adresse email du user
- Le champ `emailSent` indique si l'email a été envoyé

### MailDev (pour le développement)

**MailDev** est un serveur SMTP pour tester les emails en développement.

#### Installation

```bash
npm install -g maildev
```

#### Lancement

```bash
maildev
```

#### Accès

- **Interface web** : http://localhost:1080
- **SMTP** : localhost:1025

#### Configuration Node.js (à intégrer)

```javascript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  ignoreTLS: true,
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: "noreply@immoplateforme.com",
    to,
    subject,
    text,
  });
};
```

---

## 🚀 Utilisation des notifications

### **API Endpoints**

#### Voir mes notifications

```
GET /api/v1/customer/notifications
Headers: Authorization: Bearer {token}
```

**Réponse :**

```json
[
  {
    "_id": "60d5...",
    "title": "Visite confirmée",
    "message": "Votre visite est confirmée pour le 15/11/2025",
    "action": "visite_confirmee",
    "isRead": false,
    "emailSent": true,
    "announcement": {
      "_id": "60d5...",
      "title": "Villa 4 pièces"
    },
    "createdAt": "2025-10-26T..."
  }
]
```

#### Marquer comme lue

```
PUT /api/v1/customer/notifications/:notificationId/read
Headers: Authorization: Bearer {token}
```

---

## 💡 Exemples de création de notifications

### Action : `paiement`

```javascript
// Après un paiement
const notification = new Notification({
  user: userId,
  title: "Paiement effectué",
  message: `Votre paiement de ${amount} a été effectué avec succès`,
  action: "paiement",
  isRead: false,
  emailSent: false,
});

await notification.save();

// Envoyer l'email
await sendEmail(user.email, notification.title, notification.message);

// Marquer l'email comme envoyé
notification.emailSent = true;
await notification.save();
```

---

### Action : `visite`

```javascript
// Visite confirmée
const notification = new Notification({
  user: customerId,
  title: "Visite confirmée",
  message: `Votre visite pour "${announcement.title}" est confirmée pour le 15/11/2025 à 14h00`,
  action: "visite",
  announcement: announcement._id,
  isRead: false,
  emailSent: false,
});

await notification.save();
await sendEmail(user.email, notification.title, notification.message);

notification.emailSent = true;
await notification.save();
```

---

### Action : `visite_virtuelle`

```javascript
// Visite virtuelle prête
const notification = new Notification({
  user: customerId,
  title: "Visite virtuelle disponible",
  message: `La visite virtuelle de "${announcement.title}" est maintenant disponible`,
  action: "visite_virtuelle",
  announcement: announcement._id,
  isRead: false,
  emailSent: false,
});

await notification.save();
await sendEmail(user.email, notification.title, notification.message);

notification.emailSent = true;
await notification.save();
```

---

### Action : `preference`

```javascript
// Nouveau bien correspondant aux préférences
const notification = new Notification({
  user: customerId,
  title: "Nouveau bien disponible",
  message: `Un nouveau ${propertyType.name} correspondant à vos préférences est disponible à ${announcement.district}`,
  action: "preference",
  announcement: announcement._id,
  isRead: false,
  emailSent: false,
});

await notification.save();
await sendEmail(user.email, notification.title, notification.message);

notification.emailSent = true;
await notification.save();
```

---

## 🔧 À intégrer plus tard

### **1. Service d'envoi d'emails**

Créer un service dédié : `src/API/services/email.service.js`

```javascript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || "localhost",
  port: process.env.SMTP_PORT || 1025,
  auth:
    process.env.NODE_ENV === "production"
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : null,
});

export const sendNotificationEmail = async (notification, user) => {
  await transporter.sendMail({
    from: "noreply@immoplateforme.com",
    to: user.email,
    subject: notification.title,
    text: notification.message,
    html: `
      <h2>${notification.title}</h2>
      <p>${notification.message}</p>
      <p>Action: ${notification.action}</p>
    `,
  });
};
```

---

### **2. Middleware de notification**

Créer un middleware pour envoyer automatiquement les emails :

```javascript
// src/API/middlewares/notification.middleware.js
import { sendNotificationEmail } from "../services/email.service.js";
import User from "../models/user.model.js";

export const createNotificationWithEmail = async (notificationData) => {
  const notification = new Notification(notificationData);
  await notification.save();

  const user = await User.findById(notification.user);

  try {
    await sendNotificationEmail(notification, user);
    notification.emailSent = true;
    await notification.save();
  } catch (error) {
    console.error("Erreur envoi email:", error);
    notification.emailSent = false;
    await notification.save();
  }

  return notification;
};
```

---

### **3. Template d'emails**

Créer des templates HTML pour les emails plus beaux :

```javascript
const emailTemplates = {
  paiement: (data) => `
    <h2>Paiement effectué</h2>
    <p>Votre paiement de <strong>${
      data.amount
    }</strong> a été effectué avec succès.</p>
    <p>Type : ${data.serviceType}</p>
    ${data.announcementTitle ? `<p>Bien : ${data.announcementTitle}</p>` : ""}
  `,

  visite: (data) => `
    <h2>Visite - ${data.statusTitle}</h2>
    <p>${data.message}</p>
    <p><strong>Bien :</strong> ${data.announcementTitle}</p>
    ${data.date ? `<p><strong>Date :</strong> ${data.date}</p>` : ""}
    ${data.time ? `<p><strong>Heure :</strong> ${data.time}</p>` : ""}
  `,

  visite_virtuelle: (data) => `
    <h2>Visite virtuelle - ${data.statusTitle}</h2>
    <p>${data.message}</p>
    <p><strong>Bien :</strong> ${data.announcementTitle}</p>
    ${
      data.url
        ? `<p><a href="${data.url}">Accéder à la visite virtuelle</a></p>`
        : ""
    }
  `,

  preference: (data) => `
    <h2>Nouveau bien pour vous !</h2>
    <p>${data.message}</p>
    <p><strong>Bien :</strong> ${data.announcementTitle}</p>
    <p><strong>District :</strong> ${data.district}</p>
    <p><strong>Prix :</strong> ${data.price}</p>
    <p><a href="${data.announcementUrl}">Voir le bien</a></p>
  `,
};
```

---

## 📊 Tableau récapitulatif des actions

| Action             | Utilisation                                            | Email |
| ------------------ | ------------------------------------------------------ | ----- |
| `paiement`         | Transactions, recharges, validations annonces          | ✅    |
| `visite`           | Demandes, confirmations, rappels de visites sur site   | ✅    |
| `visite_virtuelle` | Commandes, disponibilité, accès aux visites virtuelles | ✅    |
| `preference`       | Biens correspondant aux préférences, alertes, favoris  | ✅    |

---

## ✅ Avantages du système

✅ **Simple** - Pas de messagerie interne complexe
✅ **Traçable** - Historique complet des notifications
✅ **Double notification** - Dans l'app + par email
✅ **Testable** - MailDev pour le développement
✅ **Évolutif** - Facile d'ajouter de nouvelles actions

---

## 🎯 Résumé

**Principe :**

- 📬 Notification = Action + Email
- 🚫 Pas de messagerie interne
- ✉️ Chaque notification envoie un email

**Pour l'instant :**

- 🧪 Utiliser MailDev en développement
- 📝 Les notifications sont enregistrées en base
- 📧 Le système d'envoi d'emails sera intégré plus tard

Le système de notifications est prêt et flexible ! 🎉

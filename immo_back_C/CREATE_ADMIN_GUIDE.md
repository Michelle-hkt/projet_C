# 👑 GUIDE : CRÉER UN COMPTE ADMINISTRATEUR

Ce guide explique comment créer un compte administrateur pour votre plateforme immobilière.

---

## 🚀 MÉTHODE 1 : Utiliser le script automatique (RECOMMANDÉ)

### **Prérequis**

1. MongoDB doit être démarré et accessible
2. Les variables d'environnement doivent être configurées dans `.env`
3. Les rôles doivent être initialisés (démarrez le serveur une fois)

### **Étape 1 : Exécuter le script**

Depuis la racine du projet, exécutez :

```bash
node create-admin.js
```

### **Étape 2 : Suivre les instructions**

Le script vous demandera les informations suivantes :

```
👤 Prénom de l'admin : Admin
👤 Nom de l'admin : Principal
📧 Email de l'admin : admin@example.com
🔑 Mot de passe (min 8 caractères) : Admin123!
```

### **Étape 3 : Confirmation**

Si tout se passe bien, vous verrez :

```
✅ ✅ ✅ COMPTE ADMIN CRÉÉ AVEC SUCCÈS ! ✅ ✅ ✅

📋 Détails du compte :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ID       : 65f4a1b2c3d4e5f6a7b8c9d0
   Prénom   : Admin
   Nom      : Principal
   Email    : admin@example.com
   Rôle     : admin
   Actif    : Oui
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Vous pouvez maintenant vous connecter avec ces identifiants !

📝 Test de connexion dans Postman :
   POST http://localhost:3000/api/v1/auth/login
   Body (JSON) :
   {
     "email": "admin@example.com",
     "password": "Admin123!"
   }
```

### **Étape 4 : Tester la connexion**

Dans Postman, testez la connexion :

```http
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

Vous devriez recevoir un token JWT et les informations de l'utilisateur avec `"role": "admin"`.

---

## ⚠️ Messages d'erreur possibles

### **❌ "Le rôle 'admin' n'existe pas"**

**Cause :** Les rôles n'ont pas été initialisés dans la base de données.

**Solution :**

1. Démarrez le serveur une fois avec `npm start`
2. Le serveur initialisera automatiquement les rôles (customer, agent, admin)
3. Arrêtez le serveur avec `Ctrl+C`
4. Relancez le script `node create-admin.js`

---

### **❌ "Un utilisateur avec cet email existe déjà"**

**Cause :** L'email que vous avez saisi existe déjà dans la base de données.

**Solution :**

1. Utilisez un autre email, OU
2. Si vous voulez modifier l'utilisateur existant, supprimez-le d'abord depuis MongoDB Compass ou mongosh

---

### **❌ "Le mot de passe doit contenir au moins 8 caractères"**

**Cause :** Le mot de passe est trop court.

**Solution :** Utilisez un mot de passe d'au moins 8 caractères.

**Recommandation :** Utilisez un mot de passe fort avec :

- Au moins 8 caractères
- Majuscules et minuscules
- Chiffres
- Caractères spéciaux

**Exemples valides :**

- `Admin123!`
- `SecurePass@2025`
- `MyP@ssw0rd!`

---

### **❌ "Cannot connect to MongoDB"**

**Cause :** MongoDB n'est pas démarré ou les paramètres de connexion sont incorrects.

**Solution :**

1. Vérifiez que MongoDB est démarré :

   ```bash
   sudo systemctl status mongodb
   # ou
   sudo systemctl status mongod
   ```

2. Démarrez MongoDB si nécessaire :

   ```bash
   sudo systemctl start mongodb
   # ou
   sudo systemctl start mongod
   ```

3. Vérifiez vos variables d'environnement dans `.env` :
   ```env
   DB_URI=mongodb://localhost:27017
   DB_NAME=immo_platform
   ```

---

## 🔧 MÉTHODE 2 : Créer manuellement avec MongoDB Compass

### **Étape 1 : Ouvrir MongoDB Compass**

Connectez-vous à votre base de données `immo_platform`.

### **Étape 2 : Trouver l'ID du rôle admin**

1. Ouvrez la collection `roles`
2. Trouvez le document avec `"name": "admin"`
3. Copiez la valeur de `_id` (par exemple : `65f4a1b2c3d4e5f6a7b8c9d0`)

### **Étape 3 : Hasher le mot de passe**

Utilisez Node.js pour hasher le mot de passe :

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Admin123!', 10, (err, hash) => console.log(hash));"
```

Copiez le hash obtenu (commence par `$2b$10$...`)

### **Étape 4 : Créer l'utilisateur**

Dans la collection `users`, cliquez sur "Insert Document" et collez :

```json
{
  "firstName": "Admin",
  "lastName": "Principal",
  "email": "admin@example.com",
  "password": "$2b$10$...",
  "role": { "$oid": "65f4a1b2c3d4e5f6a7b8c9d0" },
  "isActive": true,
  "createdAt": { "$date": "2025-10-27T10:00:00.000Z" },
  "updatedAt": { "$date": "2025-10-27T10:00:00.000Z" }
}
```

⚠️ **Remplacez :**

- Le hash du mot de passe par celui obtenu à l'étape 3
- L'ID du rôle par celui obtenu à l'étape 2
- Les dates par la date actuelle

---

## 🔧 MÉTHODE 3 : Créer manuellement avec mongosh

### **Étape 1 : Se connecter à MongoDB**

```bash
mongosh
use immo_platform
```

### **Étape 2 : Trouver l'ID du rôle admin**

```javascript
const adminRole = db.roles.findOne({ name: "admin" });
print("ID du rôle admin : " + adminRole._id);
```

### **Étape 3 : Créer l'utilisateur**

```javascript
// Remplacez ces valeurs
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD_HASH = "$2b$10$..."; // Hash obtenu avec bcrypt
const ADMIN_ROLE_ID = adminRole._id;

db.users.insertOne({
  firstName: "Admin",
  lastName: "Principal",
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD_HASH,
  role: ADMIN_ROLE_ID,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

print("✅ Admin créé avec succès !");
```

Pour hasher le mot de passe, sortez de mongosh et utilisez :

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Admin123!', 10, (err, hash) => console.log(hash));"
```

---

## 📝 VÉRIFIER QUE L'ADMIN EST CRÉÉ

### **Avec MongoDB Compass**

1. Ouvrez la collection `users`
2. Cherchez l'utilisateur avec votre email
3. Vérifiez que le champ `role` pointe vers le rôle admin

### **Avec mongosh**

```javascript
use immo_platform
db.users.findOne({ email: "admin@example.com" })
```

### **Avec l'API (RECOMMANDÉ)**

Testez la connexion :

```http
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

Si vous recevez un token et `"role": "admin"`, c'est réussi ! ✅

---

## 🛡️ SÉCURITÉ

### **Mot de passe recommandé**

Pour un compte admin, utilisez un mot de passe très fort :

✅ **FORT** (recommandé pour production) :

- `MyV3ryS3cur3P@ssw0rd!2025`
- `@Dm1n!Str0ng#P4ss`
- `Sup3r$ecur3@Adm1n!`

⚠️ **MOYEN** (acceptable pour développement) :

- `Admin123!`
- `SecurePass@2025`
- `MyP@ssw0rd!`

❌ **FAIBLE** (à éviter) :

- `admin123`
- `password`
- `12345678`

### **Bonnes pratiques**

1. ✅ N'utilisez JAMAIS `admin@admin.com` ou `admin` comme email/mot de passe
2. ✅ Changez le mot de passe par défaut immédiatement après la création
3. ✅ Utilisez des emails professionnels pour les comptes admin
4. ✅ Activez l'authentification à deux facteurs (à implémenter)
5. ✅ Limitez le nombre de comptes admin (1 ou 2 maximum)

---

## 🎯 COMPTES ADMIN RECOMMANDÉS

### **Pour le développement**

```
Email    : dev.admin@example.com
Password : DevAdmin123!
```

### **Pour la production**

```
Email    : admin@votredomaine.com
Password : [Générez un mot de passe très fort]
```

---

## 🚨 DÉPANNAGE

### **Le script ne se lance pas**

**Vérifiez que les dépendances sont installées :**

```bash
npm install
```

**Vérifiez que le fichier `.env` existe et contient :**

```env
DB_URI=mongodb://localhost:27017
DB_NAME=immo_platform
TOKEN_SECRET=votre_secret_jwt_tres_long_et_securise
PORT=3000
```

---

### **"Cannot find module"**

Le projet utilise ES Modules. Vérifiez que `package.json` contient :

```json
{
  "type": "module"
}
```

---

### **Le script se bloque**

Appuyez sur `Ctrl+C` pour annuler et réessayer.

---

## ✅ CHECKLIST

Avant d'exécuter le script :

- [ ] MongoDB est démarré
- [ ] Le fichier `.env` est configuré
- [ ] Les dépendances sont installées (`npm install`)
- [ ] Les rôles sont initialisés (démarrez le serveur une fois)
- [ ] Vous êtes dans le dossier racine du projet

---

## 📞 BESOIN D'AIDE ?

Si vous rencontrez des problèmes :

1. Vérifiez les logs de MongoDB
2. Vérifiez les variables d'environnement
3. Assurez-vous que les rôles existent dans la collection `roles`
4. Consultez la documentation complète dans `LISTE_COMPLETE_API.md`

---

**🎉 Bonne création de votre compte administrateur !**

# CORRECTION : Système de visite sur site avec agents validés

## Problème identifié

Dans la fonction `payForOnSiteVisit`, l'ancienne logique cherchait tous les utilisateurs ayant le rôle "agent" sans vérifier s'ils étaient validés par un admin.

### Ancien code (❌ Incorrect)

```javascript
// Cherchait directement dans User avec le rôle agent
User.find({ role: agentRole._id, isActive: true }).then((agents) => {
  // Envoyait des notifications à TOUS les agents
  // même ceux non validés (isValide=false)
});
```

**Problèmes :**

- ❌ Les agents non validés recevaient des notifications
- ❌ Ne respectait pas le système de validation
- ❌ Accès aux missions avant validation admin

## Solution implémentée

Maintenant, la logique utilise la table `Agent` et vérifie le statut de validation.

### Nouveau code (✅ Correct)

```javascript
// Cherche uniquement les agents VALIDÉS (isValide=true)
Agent.find({ isValide: true })
  .populate({
    path: "userId",
    match: { isActive: true },
  })
  .then((agents) => {
    // Filtrer pour garder uniquement ceux avec userId actif
    const validAgents = agents.filter((agent) => agent.userId !== null);

    // Envoyer notifications uniquement aux agents validés ET actifs
  });
```

**Avantages :**

- ✅ Seuls les agents validés reçoivent les notifications
- ✅ Double vérification : `isValide=true` ET `isActive=true`
- ✅ Respect du workflow de validation
- ✅ Sécurité renforcée

## Flux corrigé

```
1. Customer paie pour une visite sur site
   ↓
2. Visite créée avec status "en_attente"
   ↓
3. Recherche des agents VALIDÉS (isValide=true)
   ↓
4. Vérification que l'utilisateur est ACTIF (isActive=true)
   ↓
5. Notifications envoyées UNIQUEMENT aux agents validés et actifs
   ↓
6. Agents peuvent accepter la mission
```

## Changements dans `payment.controller.js`

### 1. Import du modèle Agent

```javascript
import Agent from "../models/agent.model.js";
```

### 2. Modification de la recherche (ligne ~168)

**Avant :**

```javascript
User.find({ role: agentRole._id, isActive: true });
```

**Après :**

```javascript
Agent.find({ isValide: true }).populate({
  path: "userId",
  match: { isActive: true },
});
```

### 3. Filtrage des agents valides

```javascript
const validAgents = agents.filter((agent) => agent.userId !== null);
```

Cette ligne filtre les résultats pour ne garder que les agents dont l'utilisateur associé est actif (grâce au `match: { isActive: true }` dans le populate).

### 4. Message de réponse mis à jour

```javascript
message: `Visite demandée avec succès. ${validAgents.length} agent(s) validé(s) ont été notifié(s).`;
```

Le message précise maintenant qu'il s'agit d'agents **validés**.

## Cas d'usage

### Cas 1 : Agent non validé (isValide=false)

```
Situation : Un agent s'inscrit mais n'est pas encore validé par l'admin
Résultat : Il ne reçoit AUCUNE notification de visite
Message : "Aucun agent validé et actif trouvé"
```

### Cas 2 : Agent validé mais compte inactif

```
Situation : Un agent est validé (isValide=true) mais son compte User est désactivé (isActive=false)
Résultat : Il ne reçoit AUCUNE notification (filtré par populate match)
Message : "Aucun agent validé et actif trouvé"
```

### Cas 3 : Agent validé ET actif ✅

```
Situation : Agent validé (isValide=true) ET compte actif (isActive=true)
Résultat : Il reçoit la notification de demande de visite
Message : "Visite demandée avec succès. X agent(s) validé(s) ont été notifié(s)."
```

## Compatibilité avec le système de notifications

Le système respecte la mémoire [[memory:10345898]] :

- ✅ Notification créée avec `action: "visite"`
- ✅ Email sera envoyé via maildev (à intégrer)
- ✅ Champ `emailSent: false` pour tracking

```javascript
Notification.create({
  user: agent.userId._id,
  title: "Nouvelle demande de visite sur site",
  message: `Une demande de visite a été faite pour "${announcement.title}". Acceptez-vous cette mission ?`,
  action: "visite",
  announcement: announcement._id,
  emailSent: false,
});
```

## Points techniques importants

### 1. Utilisation du populate avec match

```javascript
.populate({
  path: "userId",
  match: { isActive: true },
})
```

Le `match` dans populate filtre les documents référencés. Si l'utilisateur ne match pas la condition, `userId` sera `null`.

### 2. Filtrage post-populate

```javascript
const validAgents = agents.filter((agent) => agent.userId !== null);
```

Nécessaire car le populate avec match peut retourner des documents avec `userId=null` au lieu de les exclure complètement.

### 3. Style .then()/.catch()

Conformément à [[memory:10343022]], le code utilise la syntaxe `.then()/.catch()` pour les opérations sans logique métier complexe.

## Impact sur les autres fonctions

Cette correction affecte uniquement `payForOnSiteVisit`. Les autres fonctions à vérifier :

- ✅ `payForVirtualVisit` : N'utilise pas d'agents
- ✅ `payForCreateVirtualTour` : À vérifier si elle utilise des agents
- 🔲 Autres fonctions de `Visit` : À vérifier si elles filtrent les agents validés

## Tests suggérés

### Test 1 : Agent non validé ne reçoit pas de notifications

```
1. Créer un agent avec isValide=false
2. Customer demande une visite
3. Vérifier que l'agent non validé ne reçoit pas de notification
```

### Test 2 : Agent validé reçoit les notifications

```
1. Créer un agent avec isValide=true
2. Customer demande une visite
3. Vérifier que l'agent validé reçoit la notification
```

### Test 3 : Agent validé mais inactif

```
1. Créer un agent avec isValide=true
2. Désactiver le User (isActive=false)
3. Customer demande une visite
4. Vérifier que l'agent ne reçoit pas de notification
```

## Prochaines étapes

1. ✅ Correction de `payForOnSiteVisit` effectuée
2. 🔲 Vérifier `payForCreateVirtualTour` si elle utilise des agents
3. 🔲 Vérifier le contrôleur `Visit` pour d'autres références aux agents
4. 🔲 Créer une route admin pour gérer les validations d'agents
5. 🔲 Ajouter des tests unitaires pour valider le comportement

## Résumé

✅ **Correction réussie** : La fonction `payForOnSiteVisit` n'envoie désormais des notifications qu'aux agents **validés** (isValide=true) ET **actifs** (isActive=true), respectant ainsi le workflow de validation du système d'agents.

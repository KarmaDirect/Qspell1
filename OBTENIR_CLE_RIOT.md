# 🔑 Guide : Obtenir votre clé API Riot Games

## 🎯 Quelle clé pour votre projet ?

Pour la **Plateforme LoL Amateur**, je vous recommande **PERSONAL API KEY** :

| Type | Expiration | Rate Limits | Utilisation | Recommandé ? |
|------|------------|-------------|-------------|--------------|
| **Development** | 24h | 20/sec, 100/2min | Tests quotidiens | ❌ Non (expire trop vite) |
| **Personal** | Jamais | 100/sec, 1000/2min | Communauté privée/moyenne | ✅ **OUI !** |
| **Production** | Jamais | Personnalisé | Grande échelle (50k+ users) | ⏳ Plus tard |

---

## 🚀 MÉTHODE RECOMMANDÉE : Personal API Key

### Étape 1 : Aller sur le portail développeur

👉 https://developer.riotgames.com/

### Étape 2 : Se connecter

Utilisez votre compte Riot Games (le même que pour jouer à LoL)

### Étape 3 : Cliquer sur "Register Product"

En haut de la page, cliquez sur le bouton **"Register Product"** ou **"Apps"**

### Étape 4 : Choisir "Personal"

Sélectionnez le type **"Personal API Key"**

### Étape 5 : Remplir le formulaire

Voici ce que vous devez écrire (copiez-collez et adaptez) :

---

**Product Name:**
```
LoL Amateur Platform
```

**Product Description:**
```
Plateforme communautaire francophone permettant aux joueurs League of Legends amateurs de :

1. TOURNOIS : Créer et participer à des tournois communautaires avec système de brackets automatiques (simple/double élimination, round robin, swiss)

2. LIGUES : Rejoindre des ligues saisonnières avec classements, promotions/relégations

3. PROFILS : Afficher leur profil avec statistiques Riot Games en temps réel (rank Solo/Duo et Flex, winrate, champion mastery)

4. MATCHMAKING : Trouver des coéquipiers avec algorithme de matching basé sur rank, rôle et disponibilités

5. COACHING : Accéder à des formations et sessions de coaching pour progresser

APIs Riot Games utilisées :
- ACCOUNT-V1 : Recherche et liaison de compte Riot (gameName#tagLine)
- SUMMONER-V4 : Récupération des informations d'invocateur
- LEAGUE-V4 : Statistiques ranked (Solo/Duo, Flex 5v5)
- MATCH-V5 : Historique de matchs (pour vérifications de résultats de tournois)

Technologie : Next.js 14 + Supabase + TypeScript
Audience cible : Communauté francophone/internationale LoL amateur
Utilisateurs prévus : 500-5000 joueurs actifs

La plateforme est actuellement en développement (MVP fonctionnel).
```

**Product URL (Development):**
```
http://localhost:8080
```

**Production URL (si vous en avez une):**
```
https://votre-domaine.com
(ou laissez vide si pas encore déployé)
```

**What APIs do you need?**
☑️ Standard APIs (cochez cette case)
☐ Tournament API (ne cochez PAS, on n'en a pas besoin)

---

### Étape 6 : Accepter les conditions

Lisez et acceptez les **Terms of Service** et la **Developer Policy**

### Étape 7 : Soumettre

Cliquez sur **"Submit"** ou **"Register"**

### Étape 8 : Récupérer votre clé

✨ **Votre Personal API Key apparaît IMMÉDIATEMENT !** ✨

Elle ressemble à :
```
RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Étape 9 : Configurer dans votre projet

1. **Copiez la clé**
2. **Ouvrez** `.env.local` dans votre projet
3. **Remplacez** :
```env
RIOT_API_KEY=RGAPI-votre-nouvelle-cle-personal
```
4. **Redémarrez** l'application :
```bash
npm run dev
```

✅ **C'est tout ! Votre clé ne expirera JAMAIS** 🎉

---

## 🔄 Alternative : Development Key (pour tester rapidement)

Si vous voulez juste tester aujourd'hui sans créer de Personal Key :

### Régénérer votre Development Key

1. Allez sur https://developer.riotgames.com/
2. Connectez-vous
3. Sur la page d'accueil, vous voyez votre clé expirée
4. Cliquez sur **"REGENERATE API KEY"**
5. Copiez la nouvelle clé
6. Mettez-la dans `.env.local`

⚠️ **Problème** : Vous devrez faire ça **CHAQUE JOUR** (expire après 24h)

---

## 📊 Comparaison des Rate Limits

### Development Key
- **20 requêtes/seconde**
- **100 requêtes/2 minutes**

**Suffisant pour :** 1-5 utilisateurs simultanés

**Exemple** : Avec 20 req/sec, vous pouvez gérer environ 5 joueurs qui consultent leur profil en même temps.

### Personal Key (RECOMMANDÉ)
- **100 requêtes/seconde** (5x plus)
- **1000 requêtes/2 minutes** (10x plus)

**Suffisant pour :** 50-100 utilisateurs simultanés

**Exemple** : Avec 100 req/sec, vous pouvez gérer un tournoi avec 50+ joueurs actifs simultanément.

### Production Key
- **Rate limits personnalisables**
- Possibilité d'augmentation sur demande

**Nécessaire pour :** 500+ utilisateurs simultanés

---

## 🎯 Pour votre projet "LoL Amateur Platform"

### Phase 1 (Maintenant) : Personal API Key ✅
- Parfaite pour développement et test avec amis
- Suffisante pour lancer avec 100-1000 utilisateurs
- Ne expire jamais
- **Recommandation : Obtenez-la dès maintenant !**

### Phase 2 (Si succès) : Personal API Key ✅
- Toujours suffisante jusqu'à 5000-10000 utilisateurs actifs
- Pas besoin de changer

### Phase 3 (Grande échelle) : Production API Key
- Seulement si vous dépassez 10k+ utilisateurs actifs
- Demandez une Production Key avec preuves de succès
- Riot sera plus enclin à approuver avec des statistiques d'usage

---

## 🚨 Important à retenir

1. **NE JAMAIS** exposer votre clé API côté client (frontend)
2. **TOUJOURS** faire les appels à l'API Riot depuis le backend (API Routes Next.js)
3. **UTILISER** le cache Redis pour réduire les appels
4. **RESPECTER** les rate limits

Dans notre projet, tout est déjà bien configuré :
- ✅ Appels API depuis `/app/api/` (backend)
- ✅ Cache Redis (1h pour comptes, 30min pour stats)
- ✅ Gestion des erreurs de rate limit
- ✅ Clé stockée dans `.env.local` (pas exposée)

---

## 📝 Checklist finale

- [ ] Obtenir une Personal API Key sur https://developer.riotgames.com/
- [ ] Copier la clé dans `.env.local` → `RIOT_API_KEY=...`
- [ ] Vérifier que la clé fonctionne :
```bash
npm run dev
# Puis tester dans l'app : Dashboard → Profile → Ajouter un compte Riot
```
- [ ] Sauvegarder votre clé dans un endroit sûr (gestionnaire de mots de passe)

---

## 🆘 Problèmes courants

**"403 Forbidden"**
- Votre clé est expirée (Development) → Régénérez ou utilisez Personal
- Votre clé est invalide → Vérifiez qu'elle est bien copiée

**"429 Too Many Requests"**
- Vous avez dépassé les rate limits
- Attendez 2 minutes
- Vérifiez que le cache Redis fonctionne

**"401 Unauthorized"**
- La clé n'est pas dans les headers
- Vérifiez `.env.local` et redémarrez l'app

---

**✨ Avec une Personal API Key, vous êtes prêt pour lancer votre plateforme ! ✨**


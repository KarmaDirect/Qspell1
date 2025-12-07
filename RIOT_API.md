# API Riot Games - Guide complet pour la plateforme

## 🎯 APIs utilisées dans le projet

Pour cette plateforme LoL Amateur, voici **UNIQUEMENT les APIs Riot nécessaires** :

### 1. **ACCOUNT-V1** ⭐ (OBLIGATOIRE)
**Endpoint** : `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}`

**Utilisation** : Rechercher un compte Riot par son Riot ID (ex: Faker#EUW)

**Exemple** :
```
GET https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Faker/EUW
```

**Retour** :
```json
{
  "puuid": "abc123...",
  "gameName": "Faker",
  "tagLine": "EUW"
}
```

**Implémenté dans** : `src/lib/riot-api/client.ts` → `getAccountByRiotId()`

---

### 2. **SUMMONER-V4** ⭐ (OBLIGATOIRE)
**Endpoint** : `/lol/summoner/v4/summoners/by-puuid/{puuid}`

**Utilisation** : Récupérer les infos d'invocateur avec le PUUID

**Exemple** :
```
GET https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/abc123...
```

**Retour** :
```json
{
  "id": "summoner_id_123",
  "accountId": "account_id_456",
  "puuid": "abc123...",
  "profileIconId": 4568,
  "summonerLevel": 387
}
```

**Implémenté dans** : `src/lib/riot-api/client.ts` → `getSummonerByPuuid()`

---

### 3. **LEAGUE-V4** ⭐ (OBLIGATOIRE)
**Endpoint** : `/lol/league/v4/entries/by-summoner/{summonerId}`

**Utilisation** : Récupérer le rank et les stats ranked d'un joueur

**Exemple** :
```
GET https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/summoner_id_123
```

**Retour** :
```json
[
  {
    "queueType": "RANKED_SOLO_5x5",
    "tier": "DIAMOND",
    "rank": "II",
    "leaguePoints": 47,
    "wins": 125,
    "losses": 98,
    "veteran": false,
    "hotStreak": true
  },
  {
    "queueType": "RANKED_FLEX_SR",
    "tier": "PLATINUM",
    "rank": "IV",
    "leaguePoints": 23,
    "wins": 45,
    "losses": 42
  }
]
```

**Implémenté dans** : `src/lib/riot-api/client.ts` → `getRankedStats()`

---

### 4. **MATCH-V5** 🌟 (IMPORTANT)
#### 4.1. Liste des matchs
**Endpoint** : `/lol/match/v5/matches/by-puuid/{puuid}/ids`

**Utilisation** : Récupérer l'historique de matchs d'un joueur

**Exemple** :
```
GET https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/abc123.../ids?count=20
```

**Retour** :
```json
[
  "EUW1_6234567890",
  "EUW1_6234567889",
  "EUW1_6234567888"
]
```

**Implémenté dans** : `src/lib/riot-api/client.ts` → `getMatchHistory()`

#### 4.2. Détails d'un match
**Endpoint** : `/lol/match/v5/matches/{matchId}`

**Utilisation** : Récupérer les détails complets d'un match (pour les tournois)

**Exemple** :
```
GET https://europe.api.riotgames.com/lol/match/v5/matches/EUW1_6234567890
```

**Retour** :
```json
{
  "metadata": {
    "matchId": "EUW1_6234567890",
    "participants": ["puuid1", "puuid2", ...]
  },
  "info": {
    "gameCreation": 1701234567890,
    "gameDuration": 1847,
    "gameMode": "CLASSIC",
    "queueId": 420,
    "participants": [
      {
        "puuid": "puuid1",
        "championName": "Yasuo",
        "kills": 12,
        "deaths": 5,
        "assists": 8,
        "win": true
      }
    ]
  }
}
```

**Implémenté dans** : `src/lib/riot-api/client.ts` → `getMatch()`

---

## 📊 APIs OPTIONNELLES (pour features avancées)

### 5. **CHAMPION-MASTERY-V4** (Pour les profils)
**Endpoint** : `/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}`

**Utilisation** : Afficher les champions les plus joués avec mastery

**Exemple** :
```
GET https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/abc123.../top?count=3
```

**Retour** :
```json
[
  {
    "championId": 157,
    "championLevel": 7,
    "championPoints": 234567
  }
]
```

**À implémenter** : Pour la page de profil (afficher top 3 champions)

---

### 6. **DATA DRAGON** (Assets statiques)
**URL** : `https://ddragon.leagueoflegends.com/`

**Utilisation** : Récupérer les images de champions, items, icônes

**Exemples** :
```
# Champion icons
https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Yasuo.png

# Summoner icons
https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/4568.png

# Items
https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3031.png

# Version actuelle
https://ddragon.leagueoflegends.com/api/versions.json
```

**Pas besoin de clé API !** C'est un CDN public.

---

## 🔑 Obtenir une clé API Riot

### Development Key (Gratuite) - Pour tester

1. Allez sur https://developer.riotgames.com/
2. Connectez-vous avec votre compte Riot
3. La clé s'affiche directement sur la page d'accueil
4. ⚠️ **Si expirée** : Cliquez sur "REGENERATE API KEY" sur la même page

**Limites** :
- ⏰ **Expire toutes les 24 heures** (doit être régénérée quotidiennement)
- 🚦 Rate limits : **20 requêtes/seconde, 100 requêtes/2 minutes**
- ✅ Parfait pour le développement et les tests
- ❌ **NE PAS utiliser en production publique**

**Comment régénérer** :
```bash
# Chaque jour, vous devez :
# 1. Aller sur https://developer.riotgames.com/
# 2. Cliquer sur "REGENERATE API KEY"
# 3. Copier la nouvelle clé
# 4. Mettre à jour .env.local
```

---

### 🎯 RECOMMANDÉ : Personal API Key (Gratuite, sans expiration)

**Pour votre plateforme LoL Amateur, utilisez une Personal Key !**

#### Pourquoi Personal Key ?
- ✅ **Ne expire JAMAIS**
- ✅ Pas de vérification complexe
- ✅ Suffisant pour une communauté privée/moyenne
- ✅ Rate limits : 100 req/sec, 1000 req/2 min (5x plus que Development)
- ✅ Parfait pour des centaines/milliers d'utilisateurs
- ❌ Pas de hausse de rate limits possible
- ❌ Pas d'accès à la Tournament API officielle (mais on n'en a pas besoin)

#### Comment l'obtenir :

1. **Allez sur** https://developer.riotgames.com/
2. **Cliquez sur** "Register Product" en haut
3. **Choisissez** "Personal"
4. **Remplissez le formulaire** :

```
Product Name: LoL Amateur Platform
Description: 
Plateforme communautaire francophone permettant aux joueurs League of Legends 
amateurs de participer à des tournois, rejoindre des ligues saisonnières, 
trouver des coéquipiers et suivre leurs statistiques.

Features principales :
- Système de tournois communautaires (brackets, matchs)
- Ligues amateurs avec classements
- Profils joueurs avec stats Riot Games en temps réel
- Matchmaking pour trouver des coéquipiers
- Coaching et formations

APIs utilisées :
- ACCOUNT-V1 : Lier compte Riot (gameName#tagLine)
- SUMMONER-V4 : Récupérer infos invocateur
- LEAGUE-V4 : Stats ranked (Solo/Duo, Flex)
- MATCH-V5 : Historique de matchs pour vérifications tournois

Audience : Communauté francophone LoL amateur (100-10k utilisateurs prévus)
Status : En développement (MVP fonctionnel)

Product URL: http://localhost:8080 (en dev)
Production URL: [votre domaine futur]
```

5. **Acceptez les termes**
6. **Soumettez**
7. **Votre clé Personal sera générée instantanément** (pas d'attente !)

**Temps d'approbation** : Immédiat ! ✨

---

### Production API Key (Pour très grandes applications)

**Vous n'en avez PAS besoin** sauf si vous prévoyez 50k+ utilisateurs actifs.

Pour demander une Production Key (processus long) :

1. Allez sur https://developer.riotgames.com/
2. Cliquez sur "Apps" → "Register Product" → "Production"
3. **Nécessite** :
   - Application complètement terminée et publique
   - URL de production fonctionnelle
   - Description détaillée avec captures d'écran
   - Preuve de l'utilisation responsable de l'API
   - Peut prendre plusieurs semaines d'approbation

**Limites** :
- ⏰ N'expire jamais
- 🚦 Rate limits personnalisables (hausse possible)
- ✅ Pour applications à très grande échelle
- ⚠️ Processus d'approbation strict

---

## 🌍 Régions et Routing

### Routing Values (pour Account et Match APIs)
- `europe` : EUW, EUNE, TR, RU
- `americas` : NA, BR, LAN, LAS
- `asia` : KR, JP, OCE

### Platform Values (pour Summoner et League APIs)
- `euw1` : Europe West
- `eune1` : Europe Nordic & East
- `na1` : North America
- `kr` : Korea
- `br1` : Brazil
- `la1` : Latin America North
- `la2` : Latin America South
- `jp1` : Japan
- `oc1` : Oceania
- `tr1` : Turkey
- `ru` : Russia

**Déjà implémenté** dans `src/lib/riot-api/client.ts` avec la fonction `getPlatformRouting()`

---

## 📝 Ce qui est DÉJÀ implémenté

✅ **ACCOUNT-V1** : Recherche par Riot ID
✅ **SUMMONER-V4** : Infos invocateur
✅ **LEAGUE-V4** : Stats ranked
✅ **MATCH-V5** : Historique et détails de match
✅ **Cache Redis** : 1h pour comptes, 30min pour stats, 24h pour matchs
✅ **Toutes les régions** : Support complet

---

## 🚀 Ce qu'il reste à ajouter (OPTIONNEL)

### Pour la V2 de la plateforme :

1. **CHAMPION-MASTERY-V4** :
```typescript
export async function getChampionMastery(puuid: string, region: RiotRegion, count = 5) {
  const baseUrl = RIOT_API_BASE_URLS[region]
  const url = `${baseUrl}/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`
  const cacheKey = `riot:mastery:${region}:${puuid}`
  
  return riotApiRequest(url, cacheKey, 3600)
}
```

2. **SPECTATOR-V5** (pour les matchs live) :
```typescript
export async function getCurrentMatch(puuid: string, region: RiotRegion) {
  const baseUrl = RIOT_API_BASE_URLS[region]
  const url = `${baseUrl}/lol/spectator/v5/active-games/by-summoner/${puuid}`
  // Pas de cache pour les matchs live
}
```

3. **TOURNAMENT-V4** (API privée pour tournois officiels) :
⚠️ **Nécessite une autorisation spéciale de Riot**
Pour notre plateforme amateur, on n'en a PAS besoin.

---

## 💡 Exemple d'utilisation complète

```typescript
// 1. Rechercher un joueur
const account = await getAccountByRiotId('Faker', 'EUW', 'europe')
// → puuid: "abc123..."

// 2. Récupérer l'invocateur
const summoner = await getSummonerByPuuid(account.puuid, 'euw1')
// → summonerId: "summoner_123"

// 3. Récupérer le rank
const ranked = await getRankedStats(summoner.id, 'euw1')
// → DIAMOND II, 47 LP

// 4. Historique de matchs
const matches = await getMatchHistory(account.puuid, 'europe', 10)
// → ["EUW1_123", "EUW1_124", ...]

// 5. Détails d'un match
const matchDetails = await getMatch(matches[0], 'europe')
// → Full match data
```

---

## 📚 Documentation officielle

- **API Docs** : https://developer.riotgames.com/apis
- **Data Dragon** : https://developer.riotgames.com/docs/lol#data-dragon
- **Rate Limits** : https://developer.riotgames.com/docs/portal#web-apis_rate-limiting

---

## ✅ Résumé : APIs NÉCESSAIRES pour le projet

| API | Priorité | Status | Utilisation |
|-----|----------|--------|-------------|
| **ACCOUNT-V1** | ⭐ CRITIQUE | ✅ Fait | Lier compte Riot |
| **SUMMONER-V4** | ⭐ CRITIQUE | ✅ Fait | Infos invocateur |
| **LEAGUE-V4** | ⭐ CRITIQUE | ✅ Fait | Rank & stats |
| **MATCH-V5** | 🌟 Important | ✅ Fait | Historique matchs |
| **CHAMPION-MASTERY** | 📊 Bonus | ⏳ À faire | Top champions |
| **DATA DRAGON** | 🎨 Assets | ⏳ À faire | Images |
| **SPECTATOR-V5** | 🔴 Live | ❌ Phase 2 | Match en cours |

**Conclusion** : Avec les 4 premières APIs (déjà implémentées), vous avez **tout ce qu'il faut** pour la version MVP ! 🎉


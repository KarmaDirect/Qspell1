# 🔑 Votre clé API Riot

## ✅ Clé actuelle

```
App Name: Stack Legends
App ID: 782453
Status: Approved
API Key: RGAPI-54e28094-9ec4-4bf6-a50c-bca37be9cb6d
URL: https://Qspell.gg
```

## ⚠️ IMPORTANT : Type de clé

**Vous avez une Development Key** avec ces limites :
- 20 requests every 1 second
- 100 requests every 2 minutes
- **Expire après 24 heures**

### 🎯 Recommandation : Obtenir une Personal Key

Pour éviter de régénérer votre clé chaque jour ET avoir de meilleurs rate limits :

1. Allez sur https://developer.riotgames.com/apps
2. Créez une nouvelle app de type **"Personal"**
3. Utilisez ces informations :

```
Product Name: QSPELL
Product Type: Personal API Key
Description:
  QSPELL est une plateforme communautaire pour tournois League of Legends amateurs.
  
  Fonctionnalités :
  - Système de tournois (brackets automatiques, matchs)
  - Ligues saisonnières avec classements
  - Profils joueurs avec stats Riot en temps réel
  - Recherche de coéquipiers (LFG)
  - Coaching et formations
  
  APIs utilisées :
  - ACCOUNT-V1 : Recherche et liaison compte Riot
  - SUMMONER-V4 : Infos invocateur
  - LEAGUE-V4 : Stats ranked
  - MATCH-V5 : Historique de matchs
  - CHAMPION-MASTERY-V4 : Top champions
  
  Audience : Communauté francophone/internationale (500-5000 joueurs)

Product URL: https://qspell.gg
APIs: Standard APIs (cocher)
```

**Résultat attendu** : 
- ✅ 100 requests/second (5x plus)
- ✅ 1000 requests/2 minutes (10x plus)
- ✅ Ne expire JAMAIS

---

## 📊 APIs disponibles avec votre clé

Vous avez accès à **40 méthodes** réparties dans ces catégories :

### 1. ACCOUNT-V1 (5 méthodes)
```typescript
✅ GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
   Rate: 1000/min ou 20000/10sec
   Usage: Rechercher un compte (UTILISÉ)

✅ GET /riot/account/v1/accounts/by-puuid/{puuid}
   Rate: 1000/min ou 20000/10sec
   Usage: Récupérer compte par PUUID

✅ GET /riot/account/v1/region/by-game/{game}/by-puuid/{puuid}
   Rate: 20000/10sec
   Usage: Trouver région d'un joueur
```

### 2. SUMMONER-V4 (1 méthode)
```typescript
✅ GET /lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}
   Rate: 1600/min
   Usage: Infos invocateur (UTILISÉ)
```

### 3. LEAGUE-V4 (7 méthodes)
```typescript
✅ GET /lol/league/v4/entries/by-puuid/{encryptedPUUID}
   Rate: 20000/10sec
   Usage: Stats ranked d'un joueur (UTILISÉ via deprecated endpoint)

✅ GET /lol/league/v4/challengerleagues/by-queue/{queue}
   Rate: 30/10sec
   Usage: Top Challenger pour leaderboards

✅ GET /lol/league/v4/grandmasterleagues/by-queue/{queue}
   Rate: 30/10sec
   Usage: Top Grandmaster

✅ GET /lol/league/v4/masterleagues/by-queue/{queue}
   Rate: 30/10sec
   Usage: Top Master

✅ GET /lol/league/v4/entries/{queue}/{tier}/{division}
   Rate: 50/10sec
   Usage: Liste joueurs par division (ex: tous les GOLD II)

✅ GET /lol/league/v4/leagues/{leagueId}
   Rate: 500/10sec
   Usage: Détails d'une league spécifique
```

### 4. MATCH-V5 (4 méthodes)
```typescript
✅ GET /lol/match/v5/matches/{matchId}
   Rate: 2000/10sec
   Usage: Détails d'un match (UTILISÉ)

✅ GET /lol/match/v5/matches/by-puuid/{puuid}/ids
   Rate: 2000/10sec
   Usage: Liste IDs de matchs d'un joueur (UTILISÉ)

✅ GET /lol/match/v5/matches/{matchId}/timeline
   Rate: 2000/10sec
   Usage: Timeline détaillée d'un match (événements minute par minute)

🆕 GET /lol/match/v5/matches/by-puuid/{puuid}/replays
   Rate: 20000/10sec
   Usage: Liens vers replays de matchs
```

### 5. CHAMPION-MASTERY-V4 (4 méthodes)
```typescript
🆕 GET /lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}
   Rate: 20000/10sec
   Usage: Tous les champions mastérisés

🆕 GET /lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}/top
   Rate: 20000/10sec
   Usage: Top N champions (recommandé pour profils)

🆕 GET /lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}/by-champion/{championId}
   Rate: 20000/10sec
   Usage: Mastery d'un champion spécifique

🆕 GET /lol/champion-mastery/v4/scores/by-puuid/{puuid}
   Rate: 20000/10sec
   Usage: Score total de mastery
```

### 6. SPECTATOR-V5 (1 méthode)
```typescript
🆕 GET /lol/spectator/v5/active-games/by-summoner/{encryptedPUUID}
   Rate: 20000/10sec
   Usage: Match en cours d'un joueur (LIVE)
   💡 Idée: Badge "🔴 En match" sur les profils
```

### 7. CLASH-V1 (5 méthodes)
```typescript
🆕 GET /lol/clash/v1/players/by-puuid/{puuid}
   Rate: 20000/10sec
   Usage: Infos Clash d'un joueur

🆕 GET /lol/clash/v1/teams/{teamId}
   Rate: 200/min
   Usage: Détails équipe Clash

🆕 GET /lol/clash/v1/tournaments
   Rate: 10/min
   Usage: Liste tournois Clash officiels

🆨 GET /lol/clash/v1/tournaments/{tournamentId}
   Rate: 10/min
   Usage: Détails tournoi Clash

🆕 GET /lol/clash/v1/tournaments/by-team/{teamId}
   Rate: 200/min
   Usage: Tournois d'une équipe
```

### 8. CHAMPION-V3 (1 méthode)
```typescript
🆕 GET /lol/platform/v3/champion-rotations
   Rate: 30/10sec
   Usage: Rotation hebdomadaire gratuite
   💡 Idée: Afficher les champions gratuits cette semaine
```

### 9. LOL-CHALLENGES-V1 (6 méthodes)
```typescript
🆕 GET /lol/challenges/v1/player-data/{puuid}
   Rate: 20000/10sec
   Usage: Challenges d'un joueur (nouveau système 2022)

🆕 GET /lol/challenges/v1/challenges/config
   Rate: 20000/10sec
   Usage: Liste tous les challenges

🆕 GET /lol/challenges/v1/challenges/{challengeId}/config
   Rate: 20000/10sec
   Usage: Config d'un challenge spécifique

🆕 GET /lol/challenges/v1/challenges/{challengeId}/leaderboards/by-level/{level}
   Rate: 20000/10sec
   Usage: Leaderboard d'un challenge

🆕 GET /lol/challenges/v1/challenges/{challengeId}/percentiles
   Rate: 20000/10sec
   Usage: Distribution percentile

🆕 GET /lol/challenges/v1/challenges/percentiles
   Rate: 20000/10sec
   Usage: Tous les percentiles
```

### 10. LOL-STATUS-V4 (1 méthode)
```typescript
🆕 GET /lol/status/v4/platform-data
   Rate: 20000/10sec
   Usage: Statut des serveurs Riot
   💡 Idée: Afficher "Serveurs EUW: ✅ Opérationnels"
```

### 11. TOURNAMENT-STUB-V5 (5 méthodes)
```typescript
⚠️ POST /lol/tournament-stub/v5/providers
   Usage: Création tournoi officiel (STUB = test)

⚠️ POST /lol/tournament-stub/v5/tournaments
   Usage: Tournoi officiel (nécessite approval)

⚠️ POST /lol/tournament-stub/v5/codes
   Usage: Codes tournoi officiels

⚠️ GET /lol/tournament-stub/v5/codes/{tournamentCode}
   Usage: Infos code tournoi

⚠️ GET /lol/tournament-stub/v5/lobby-events/by-code/{tournamentCode}
   Usage: Événements lobby tournoi

Note: Ces APIs nécessitent une approval spéciale de Riot
```

---

## 🎯 Recommandations pour QSPELL

### APIs à implémenter en priorité

#### 1. CHAMPION-MASTERY (Profils plus riches)
```typescript
// src/lib/riot-api/client.ts - Ajouter:

export async function getTopChampions(puuid: string, region: RiotRegion, count = 5) {
  const baseUrl = RIOT_API_BASE_URLS[region]
  const url = `${baseUrl}/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`
  const cacheKey = `riot:mastery:${region}:${puuid}:${count}`
  
  return riotApiRequest(url, cacheKey, 3600) // 1h cache
}
```

**Utilisation** : Afficher top 3-5 champions sur les profils

#### 2. SPECTATOR (Badge "En match")
```typescript
export async function getCurrentMatch(puuid: string, region: RiotRegion) {
  const baseUrl = RIOT_API_BASE_URLS[region]
  const url = `${baseUrl}/lol/spectator/v5/active-games/by-summoner/${puuid}`
  const cacheKey = `riot:live:${region}:${puuid}`
  
  return riotApiRequest(url, cacheKey, 60) // 1 min cache (match live change vite)
}
```

**Utilisation** : Badge 🔴 "En match" sur profils + voir le match live

#### 3. CHAMPION-ROTATIONS (Info communautaire)
```typescript
export async function getFreeChampionRotation(region: RiotRegion) {
  const baseUrl = RIOT_API_BASE_URLS[region]
  const url = `${baseUrl}/lol/platform/v3/champion-rotations`
  const cacheKey = `riot:rotation:${region}`
  
  return riotApiRequest(url, cacheKey, 86400) // 24h cache (change 1x/semaine)
}
```

**Utilisation** : Page d'accueil "Champions gratuits cette semaine"

---

## 📝 Configuration finale

### 1. Mettre la clé dans .env.local

```env
# Votre clé actuelle (Development - expire demain)
RIOT_API_KEY=RGAPI-54e28094-9ec4-4bf6-a50c-bca37be9cb6d

# TODO: Remplacer par Personal Key dès que possible
```

### 2. Tester la clé

```bash
npm run dev
# Aller sur http://localhost:8080
# Login → Profile → Ajouter compte Riot
```

### 3. Demain: Régénérer ou obtenir Personal Key

**Si vous gardez Development** :
- Allez sur https://developer.riotgames.com/
- Cliquez "REGENERATE API KEY"
- Copiez dans .env.local
- **À FAIRE CHAQUE JOUR** ⚠️

**Si vous obtenez Personal** :
- Une seule fois
- Ne expire jamais
- Meilleurs rate limits ✅

---

## 🎉 Félicitations !

Vous avez maintenant :
- ✅ Accès à 40 méthodes Riot API
- ✅ Clé fonctionnelle (24h)
- ✅ Toutes les APIs nécessaires pour QSPELL
- ✅ Bonus: APIs pour features avancées

**Prochaine étape** : Obtenir une Personal Key pour ne plus avoir à régénérer ! 🚀


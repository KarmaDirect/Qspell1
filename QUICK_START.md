# 🚀 Quick Start - Configuration QSPELL

Ce guide vous aide à configurer **rapidement** tous les services nécessaires pour lancer QSPELL.

---

## ⚡ Configuration en 10 minutes

### Prérequis

- **Node.js 18+** installé
- **Git** installé
- Un compte **Riot Games** (pour obtenir une API key)

---

## 1️⃣ Cloner et installer (1 minute)

```bash
# Cloner le projet
git clone https://github.com/KarmaDirect/Qspell.git
cd Qspell

# Installer les dépendances
npm install
```

---

## 2️⃣ Supabase (Base de données) - 3 minutes

### Créer le projet Supabase

1. Allez sur https://supabase.com et créez un compte
2. Cliquez sur **"New Project"**
3. Remplissez :
   - **Name** : qspell (ou votre choix)
   - **Database Password** : Créez un mot de passe sécurisé
   - **Region** : Choisissez la plus proche de vous
   - **Plan** : Free tier suffit pour démarrer
4. Attendez 2-3 minutes que le projet soit créé

### Exécuter les migrations SQL

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Cliquez sur **"New Query"**
3. Ouvrez le fichier `supabase/migrations/20240101000000_initial_schema.sql`
4. Copiez **tout le contenu** et collez dans l'éditeur
5. Cliquez sur **"Run"** (ou Ctrl+Entrée)
6. Répétez pour **TOUTES** les migrations dans l'ordre :
   - `20240101000000_initial_schema.sql`
   - `20240107000000_add_summoner_fields.sql`
   - `20240108000000_add_social_and_roles.sql`
   - `20240108000001_add_team_invitations.sql`
   - `20240109000000_coaching_system.sql`
   - `20240109000001_set_coach_default_price.sql`
   - `20240110000000_admin_system.sql`
   - `20240110000002_restrict_tournaments_to_admins.sql`

### Récupérer les clés API

1. Allez dans **Settings** → **API**
2. Copiez ces 3 valeurs :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (secret, ne pas exposer)

---

## 3️⃣ Riot Games API (Données LoL) - 2 minutes

### Obtenir une Personal API Key (RECOMMANDÉ)

**Ne expire jamais** + **meilleurs rate limits** (100 req/sec)

1. Allez sur https://developer.riotgames.com/
2. Connectez-vous avec votre compte Riot
3. Cliquez sur **"Register Product"**
4. Sélectionnez **"Personal"**
5. Remplissez :
   - **Product Name** : `QSPELL - LoL Amateur Platform`
   - **Description** : `Plateforme communautaire pour tournois LoL amateurs`
   - **Product URL** : `http://localhost:8080`
   - Cochez **"Standard APIs"**
6. Soumettez → **Clé générée instantanément !**

📚 **Guide détaillé** : [`docs/setup/riot-api-key.md`](docs/setup/riot-api-key.md)

### Alternative : Development Key (expire après 24h)

Si vous voulez juste tester rapidement :
1. Sur https://developer.riotgames.com/, votre Development Key est affichée
2. Cliquez sur **"REGENERATE API KEY"** si elle est expirée
3. ⚠️ À régénérer chaque jour

---

## 4️⃣ Upstash Redis (Cache - OPTIONNEL) - 2 minutes

**Recommandé** pour de meilleures performances, mais **l'app fonctionne sans**.

1. Créez un compte sur https://upstash.com
2. Cliquez sur **"Create Database"**
3. Configurez :
   - **Name** : `qspell-cache`
   - **Type** : Regional
   - **Region** : Même région que Supabase
   - **TLS** : Enabled
4. Dans **Details**, copiez :
   - **UPSTASH_REDIS_REST_URL** → `UPSTASH_REDIS_URL`
   - **UPSTASH_REDIS_REST_TOKEN** → `UPSTASH_REDIS_TOKEN`

---

## 5️⃣ Créer le fichier .env.local (1 minute)

À la racine du projet, créez `.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Riot Games API
RIOT_API_KEY=RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Upstash Redis (optionnel)
UPSTASH_REDIS_URL=https://xxxxxx.upstash.io
UPSTASH_REDIS_TOKEN=AXxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:8080
```

⚠️ **Important** : `.env.local` est dans `.gitignore` et ne sera jamais commité.

---

## 6️⃣ Lancer l'application (30 secondes)

```bash
npm run dev
```

**🎉 Votre app est accessible sur : http://localhost:8080**

---

## ✅ Vérification de l'installation

### Test rapide

1. **Ouvrez** http://localhost:8080
2. **Créez un compte** : Cliquez sur "Inscription"
3. **Connectez-vous** avec vos identifiants
4. **Allez dans Dashboard** → **Profil**
5. **Cliquez** sur "Ajouter un compte Riot"
6. **Entrez** votre Riot ID (ex: `Faker#EUW`)
7. **Vérifiez** que vos stats s'affichent !

✅ **Si ça marche → Installation réussie !**

---

## 🆘 Problèmes courants

### "Supabase error: relation does not exist"
**Cause** : Les tables ne sont pas créées

**Solution** :
1. Vérifiez que vous avez exécuté **toutes** les migrations SQL
2. Allez dans Supabase → **Table Editor** pour vérifier que les tables existent
3. Réexécutez les migrations si nécessaire

---

### "Riot API error: 403 Forbidden"
**Cause** : Clé API expirée ou invalide

**Solution** :
- Si Development Key : Régénérez-la sur https://developer.riotgames.com/
- Recommandé : Obtenez une Personal API Key (ne expire jamais)

---

### "Redis connection failed"
**Cause** : Redis non configuré ou identifiants incorrects

**Solution** :
- C'est normal si vous n'avez pas configuré Redis
- L'app fonctionne sans cache (performances légèrement réduites)
- Vérifiez les credentials Upstash si vous voulez activer le cache

---

### L'inscription ne fonctionne pas
**Cause** : Email confirmation activée

**Solution** :
1. Allez dans Supabase → **Authentication** → **Providers** → **Email**
2. Décochez **"Confirm email"** pour le développement
3. Réessayez de créer un compte

---

### "Port 8080 is already in use"
**Cause** : Un autre service utilise le port 8080

**Solution** :
```bash
# Changer le port dans package.json
"dev": "next dev --port 3000"  # Utilisez 3000 ou un autre port libre
```

---

## 📚 Documentation complète

- 🔑 **[Obtenir une clé Riot API](docs/setup/riot-api-key.md)** - Guide détaillé
- 🚀 **[Configuration GitHub](docs/setup/github.md)** - Git et push vers GitHub
- 👑 **[Guide Administrateur](docs/admin/admin-guide.md)** - Système de rôles et permissions
- 🎮 **[API Riot Games](RIOT_API.md)** - Documentation technique
- 🎨 **[Brand Identity](QSPELL_BRAND.md)** - Identité de marque

---

## 🎯 Prochaines étapes

Maintenant que votre environnement est configuré :

### 1. **Créer votre profil**
- Liez votre compte Riot Games
- Ajoutez vos réseaux sociaux
- Personnalisez votre profil

### 2. **Explorer la plateforme**
- Consultez les tournois disponibles
- Rejoignez ou créez une équipe
- Explorez le leaderboard

### 3. **Développer** (si vous êtes développeur)
- Consultez la structure du projet dans `README.md`
- Explorez le code dans `src/`
- Contribuez au projet

---

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev                    # Lancer l'app en mode dev

# Build & Production
npm run build                  # Build de production
npm start                      # Démarrer en production

# Supabase
npm run supabase:push         # Appliquer les migrations
npm run supabase:types        # Générer les types TypeScript
npm run supabase:reset        # Reset la base de données locale

# Linter
npm run lint                   # Vérifier le code
```

---

## 📊 Checklist complète

### Configuration obligatoire
- [ ] Node.js 18+ installé
- [ ] Projet cloné et `npm install` exécuté
- [ ] Projet Supabase créé
- [ ] Toutes les migrations SQL exécutées
- [ ] Clés Supabase copiées (3 clés)
- [ ] Riot API Key obtenue (Personal recommandée)
- [ ] Fichier `.env.local` créé avec toutes les variables
- [ ] `npm run dev` fonctionne sans erreur
- [ ] Inscription + connexion fonctionnent
- [ ] Liaison compte Riot fonctionne

### Configuration optionnelle
- [ ] Redis Upstash configuré
- [ ] CLI Supabase installé (`npm install supabase --save-dev`)
- [ ] Compte GitHub configuré
- [ ] Repository GitHub créé et lié

---

## 💡 Conseils

- **Sauvegardez vos clés** dans un gestionnaire de mots de passe
- **Ne commitez jamais** `.env.local` sur Git
- **Utilisez une Personal API Key** Riot pour éviter l'expiration quotidienne
- **Activez Redis** pour de meilleures performances en production
- **Testez régulièrement** votre configuration avec `npm run dev`

---

**🎮 Bon développement avec QSPELL ! ⚡**

*Master Your Q. Master Your Win.*


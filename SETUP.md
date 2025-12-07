# Configuration de la plateforme LoL Amateur

## Guide de démarrage rapide

### 1. Configuration Supabase

#### Créer un projet Supabase

1. Allez sur https://supabase.com et créez un compte
2. Cliquez sur "New Project"
3. Remplissez les informations :
   - **Name** : lol-platform (ou votre choix)
   - **Database Password** : Créez un mot de passe sécurisé
   - **Region** : Choisissez la région la plus proche
   - **Pricing Plan** : Free tier suffit pour démarrer

4. Attendez que le projet soit créé (2-3 minutes)

#### Récupérer les clés API

1. Dans votre projet Supabase, allez dans **Settings** > **API**
2. Copiez les valeurs suivantes :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ À ne JAMAIS exposer côté client)

#### Créer le schéma de base de données

1. Allez dans **SQL Editor** dans votre projet Supabase
2. Cliquez sur **New Query**
3. Ouvrez le fichier `supabase/migrations/20240101000000_initial_schema.sql`
4. Copiez tout le contenu et collez-le dans l'éditeur SQL
5. Cliquez sur **Run** (ou Ctrl+Entrée)
6. Vérifiez qu'il n'y a pas d'erreurs

#### Vérifier que tout fonctionne

1. Allez dans **Table Editor**
2. Vous devriez voir toutes les tables créées :
   - profiles
   - riot_accounts
   - player_stats
   - tournaments
   - teams
   - etc.

---

### 2. Configuration Riot Games API

#### Obtenir une clé API Development

1. Allez sur https://developer.riotgames.com/
2. Connectez-vous avec votre compte Riot Games
3. Acceptez les conditions d'utilisation
4. Votre **Development API Key** sera affichée
5. Copiez-la → `RIOT_API_KEY`

⚠️ **Important** : 
- La clé Development expire toutes les 24 heures
- Elle a un rate limit de 20 requêtes/seconde et 100 requêtes/2 minutes
- Pour la production, il faut demander une Personal API Key ou une Production API Key

#### Tester la clé API

Vous pouvez tester votre clé avec curl :

```bash
curl -X GET "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/Faker" \
  -H "X-Riot-Token: VOTRE_CLE_API"
```

---

### 3. Configuration Upstash Redis

#### Créer une base de données Redis

1. Allez sur https://upstash.com et créez un compte
2. Cliquez sur **Create Database**
3. Configurez :
   - **Name** : lol-platform-cache
   - **Type** : Regional
   - **Region** : Choisissez la même région que Supabase
   - **TLS** : Enabled

4. Cliquez sur **Create**

#### Récupérer les credentials

1. Dans le dashboard de votre base Redis, allez dans l'onglet **Details**
2. Copiez :
   - **UPSTASH_REDIS_REST_URL** → `UPSTASH_REDIS_URL`
   - **UPSTASH_REDIS_REST_TOKEN** → `UPSTASH_REDIS_TOKEN`

---

### 4. Créer le fichier .env.local

À la racine du projet, créez un fichier `.env.local` et remplissez avec vos valeurs :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Riot Games API
RIOT_API_KEY=RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Upstash Redis
UPSTASH_REDIS_URL=https://xxxxxx.upstash.io
UPSTASH_REDIS_TOKEN=AXxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:8080
```

---

### 5. Installer les dépendances et lancer

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez http://localhost:8080 dans votre navigateur.

---

## Vérification de l'installation

### Checklist

- [ ] Supabase : Projet créé et toutes les tables visibles
- [ ] Supabase : Les 3 clés API copiées dans `.env.local`
- [ ] Riot API : Clé API obtenue et testée
- [ ] Redis : Base de données créée et credentials copiés
- [ ] `.env.local` : Fichier créé avec toutes les variables
- [ ] `npm install` : Toutes les dépendances installées
- [ ] `npm run dev` : Serveur démarré sans erreurs
- [ ] Page d'accueil accessible sur http://localhost:8080
- [ ] Inscription : Créer un compte fonctionne
- [ ] Connexion : Se connecter fonctionne
- [ ] Dashboard : Page dashboard accessible après connexion

---

## Troubleshooting

### Erreur "relation does not exist"

→ Le schéma SQL n'a pas été exécuté correctement dans Supabase
→ Solution : Retournez dans SQL Editor et réexécutez le script

### Erreur "Invalid API key" (Riot)

→ La clé API Riot est expirée ou incorrecte
→ Solution : Générez une nouvelle clé sur developer.riotgames.com

### Erreur "Redis connection failed"

→ Les credentials Redis sont incorrects
→ Solution : Vérifiez l'URL et le token dans Upstash

### Erreur "Supabase client error"

→ Les clés Supabase sont incorrectes ou le projet n'existe pas
→ Solution : Vérifiez les credentials dans Settings > API

### L'inscription ne fonctionne pas

→ Vérifiez que :
1. Le schéma SQL a bien créé la table `profiles`
2. La fonction trigger `handle_new_user()` existe
3. L'email confirmation est désactivée pour le dev (Supabase > Authentication > Email Auth)

Pour désactiver l'email confirmation en développement :
1. Allez dans **Authentication** > **Providers** > **Email**
2. Décochez "Confirm email"

---

## Prochaines étapes

Une fois l'installation terminée, vous pouvez :

1. **Créer votre profil** et lier votre compte Riot Games
2. **Créer un tournoi** et inviter des équipes
3. **Former une équipe** et recruter des joueurs
4. **Explorer les ligues** disponibles

Pour le développement, consultez le PRD complet dans le fichier de documentation.

---

## Support

En cas de problème, vérifiez :
1. Les logs de la console du navigateur (F12)
2. Les logs du terminal Next.js
3. Les logs Supabase (Dashboard > Logs)
4. Les erreurs Redis (Dashboard Upstash)

Pour plus d'aide :
- Documentation Supabase : https://supabase.com/docs
- Documentation Next.js : https://nextjs.org/docs
- Documentation Riot API : https://developer.riotgames.com/docs/lol


# Guide CLI Supabase - Gestion complète de la base de données

## 🚀 Installation (Déjà fait)

Le CLI Supabase est installé localement dans le projet. Utilisez `npm run supabase` pour accéder aux commandes.

## 📝 Configuration initiale

### 1. Initialiser Supabase dans le projet

```bash
npm run supabase:init
```

Cela crée un dossier `supabase/` avec la configuration.

### 2. Lier le projet à votre instance Supabase

```bash
npx supabase login
```

Puis :

```bash
npx supabase link --project-ref VOTRE_PROJECT_REF
```

Pour trouver votre `project-ref` : allez sur https://supabase.com/dashboard/project/VOTRE_PROJET/settings/general

## 🔨 Commandes principales pour gérer la base de données

### Pousser le schéma SQL vers Supabase

Pour appliquer notre migration SQL à votre base de données Supabase :

```bash
npx supabase db push
```

OU directement depuis le fichier :

```bash
npx supabase db push --include-all
```

### Créer une nouvelle migration

```bash
npx supabase migration new nom_de_la_migration
```

Exemple :
```bash
npx supabase migration new add_tournament_brackets
```

### Appliquer toutes les migrations

```bash
npx supabase db push
```

### Réinitialiser la base de données locale

```bash
npx supabase db reset
```

⚠️ **Attention** : Cela supprime toutes les données locales !

### Récupérer le schéma depuis Supabase

Si vous avez modifié la base via le dashboard :

```bash
npx supabase db pull
```

### Générer les types TypeScript

```bash
npx supabase gen types typescript --project-id VOTRE_PROJECT_ID > src/lib/types/database.types.ts
```

OU si vous êtes lié au projet :

```bash
npm run supabase:types
```

## 🎯 Workflow complet pour appliquer notre schéma

### Option 1 : Via le CLI (Recommandé)

1. **Lier le projet** :
```bash
npx supabase login
npx supabase link --project-ref VOTRE_PROJECT_REF
```

2. **Pousser les migrations** :
```bash
npx supabase db push
```

Cela appliquera automatiquement le fichier `supabase/migrations/20240101000000_initial_schema.sql`

3. **Vérifier** :
```bash
npx supabase db diff
```

### Option 2 : Via le Dashboard Supabase (Plus simple pour débuter)

1. Allez sur https://supabase.com/dashboard/project/VOTRE_PROJET
2. Cliquez sur **SQL Editor**
3. Cliquez sur **New Query**
4. Copiez le contenu de `supabase/migrations/20240101000000_initial_schema.sql`
5. Collez-le dans l'éditeur
6. Cliquez sur **Run** ou appuyez sur `Ctrl+Enter`
7. Vérifiez qu'il n'y a pas d'erreurs

### Option 3 : Script automatique

J'ai créé un script pour vous :

```bash
npx supabase db push --db-url "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

Remplacez `[PASSWORD]` et `[PROJECT_REF]` par vos valeurs.

## 📊 Commandes utiles

### Vérifier l'état de la base

```bash
npx supabase db diff
```

### Voir les migrations appliquées

```bash
npx supabase migration list
```

### Créer un dump de la base

```bash
npx supabase db dump -f dump.sql
```

### Exécuter un fichier SQL

```bash
npx supabase db execute -f chemin/vers/fichier.sql
```

### Démarrer Supabase en local

```bash
npx supabase start
```

Cela démarre une instance locale de Supabase (PostgreSQL + API) pour le développement !

### Arrêter Supabase local

```bash
npx supabase stop
```

## 🔄 Workflow de développement recommandé

### Pour le développement local

1. **Démarrer Supabase local** :
```bash
npx supabase start
```

2. **Appliquer les migrations** :
```bash
npx supabase db reset
```

3. **Générer les types** :
```bash
npx supabase gen types typescript --local > src/lib/types/database.types.ts
```

4. **Développer** : Faites vos modifications

5. **Créer une migration** si vous modifiez le schéma :
```bash
npx supabase db diff -f nom_migration
```

6. **Pousser vers production** :
```bash
npx supabase db push
```

### Pour appliquer directement en production

```bash
# Se connecter
npx supabase login

# Lier au projet
npx supabase link --project-ref VOTRE_PROJECT_REF

# Pousser les migrations
npx supabase db push
```

## 🎨 Commandes spécifiques au projet

### Créer toutes les tables

Notre fichier `supabase/migrations/20240101000000_initial_schema.sql` contient :
- ✅ 20+ tables (profiles, tournaments, teams, leagues, etc.)
- ✅ RLS policies
- ✅ Indexes
- ✅ Triggers
- ✅ Functions

Pour l'appliquer :

```bash
npx supabase db push
```

### Seed data (données de test)

Créez un fichier `supabase/seed.sql` pour des données de test :

```sql
-- Exemples de tournois
INSERT INTO tournaments (name, description, format, game_mode, organizer_id, status)
VALUES 
  ('Coupe d''été EUW', 'Tournoi estival pour joueurs Gold+', 'single_elimination', 'draft', 'USER_ID', 'open'),
  ('League Amateur FR', 'Championnat mensuel francophone', 'round_robin', 'draft', 'USER_ID', 'open');
```

Puis :

```bash
npx supabase db execute -f supabase/seed.sql
```

## 📖 Documentation complète

https://supabase.com/docs/guides/cli

---

## 🚨 Commande FORCE pour tout appliquer maintenant

Si vous voulez que je puisse **tout faire automatiquement** sur la base de données, voici la commande :

### Avec votre URL de connexion directe :

```bash
npx supabase db push --db-url "postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require"
```

**Pour obtenir cette URL** :
1. Allez sur https://supabase.com/dashboard/project/VOTRE_PROJET/settings/database
2. Copiez la "Connection string" en mode "URI"
3. Remplacez `[YOUR-PASSWORD]` par votre mot de passe de base de données

### Ou simplement :

```bash
# 1. Se connecter une fois
npx supabase login

# 2. Lier le projet
npx supabase link --project-ref VOTRE_PROJECT_REF

# 3. Tout appliquer d'un coup
npx supabase db push --include-all
```

Après cela, je pourrai créer/modifier des migrations et vous n'aurez qu'à faire `npx supabase db push` !


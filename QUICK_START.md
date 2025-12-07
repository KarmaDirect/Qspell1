# 🚀 Quick Start - Configuration complète

Ce guide vous aide à configurer RAPIDEMENT tous les services nécessaires.

## ⚡ Configuration en 10 minutes

### 1️⃣ Supabase (Base de données) - 3 minutes

**Méthode automatique** :
```bash
./setup-supabase.bat
# Ou sur Linux/Mac: ./setup-supabase.sh
```

**Méthode manuelle** :
1. Créez un compte sur https://supabase.com
2. Créez un nouveau projet
3. Allez dans **SQL Editor** → Nouvelle requête
4. Copiez-collez `supabase/migrations/20240101000000_initial_schema.sql`
5. Exécutez (Run)
6. Récupérez vos clés dans **Settings → API**

**Variables .env.local** :
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

### 2️⃣ Riot Games API (Données LoL) - 2 minutes

**🎯 RECOMMANDÉ : Personal API Key (ne expire jamais)**

1. Allez sur https://developer.riotgames.com/
2. Cliquez sur **"Register Product"**
3. Choisissez **"Personal"**
4. Remplissez :
   - **Name** : LoL Amateur Platform
   - **Description** : Plateforme tournois amateurs LoL
   - **URL** : http://localhost:8080
5. Soumettez → **Clé générée instantanément !**

**Variables .env.local** :
```env
RIOT_API_KEY=RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**📚 Guide détaillé** : `OBTENIR_CLE_RIOT.md`

---

### 3️⃣ Upstash Redis (Cache - OPTIONNEL) - 2 minutes

**Recommandé mais pas obligatoire** (l'app fonctionne sans)

1. Créez un compte sur https://upstash.com
2. Créez une base Redis
3. Copiez l'URL et le Token

**Variables .env.local** :
```env
UPSTASH_REDIS_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_TOKEN=AXxxxxxxxxx
```

---

### 4️⃣ Lancer l'application - 1 minute

```bash
# Installer les dépendances (première fois seulement)
npm install

# Lancer en développement
npm run dev
```

**🎉 Votre app est sur http://localhost:8080**

---

## ✅ Checklist de configuration

### Obligatoire
- [ ] Supabase configuré (URL + 2 clés API)
- [ ] Tables créées (via SQL Editor ou CLI)
- [ ] Riot API Key (Personal recommandée)
- [ ] `.env.local` créé avec les variables

### Optionnel
- [ ] Redis configuré (pour meilleure performance)
- [ ] CLI Supabase installé (`npm install supabase --save-dev`)
- [ ] Projet lié (`npx supabase link`)

---

## 🎯 Test rapide

1. **Créer un compte** : http://localhost:8080/register
2. **Se connecter** : http://localhost:8080/login
3. **Aller dans Profil** : Cliquer sur "Ajouter un compte Riot"
4. **Entrer** : Votre gameName et tagLine (ex: Faker#EUW)
5. **Vérifier** : Vos stats s'affichent !

✅ Si ça marche → **Tout est bien configuré !**

---

## 🆘 Problèmes ?

### "Supabase error: relation does not exist"
→ Les tables ne sont pas créées. Exécutez le SQL dans Supabase SQL Editor.

### "Riot API error: 403 Forbidden"
→ Votre clé est expirée ou invalide. Régénérez-la ou obtenez une Personal Key.

### "Redis connection failed"
→ Normal si vous n'avez pas configuré Redis. L'app fonctionnera sans cache.

---

## 📚 Documentation complète

- **Configuration Supabase** : `SUPABASE_CLI.md`
- **API Riot Games** : `RIOT_API.md`
- **Obtenir clé Riot** : `OBTENIR_CLE_RIOT.md`
- **Setup détaillé** : `SETUP.md`
- **Statut du projet** : `STATUS.md`

---

## 🎮 Prêt à coder !

Votre environnement de développement est configuré. Vous pouvez maintenant :
- Créer des tournois
- Lier des comptes Riot
- Voir les stats des joueurs
- Développer les features suivantes

**Bon développement ! 🚀**


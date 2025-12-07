# Script pour créer les comptes administrateurs QSPELL

## 🚀 Utilisation automatique

**Option 1: Script Bash (Git Bash sous Windows)**

```bash
bash scripts/setup-admins.sh
```

**Option 2: Node.js direct**

```bash
node scripts/create-admin-accounts.js
```

---

## ⚙️ Prérequis

### 1. Ajouter la clé Service Role dans `.env.local`

Récupère ta **Service Role Key** depuis Supabase :
1. Va sur https://supabase.com/dashboard
2. Ouvre ton projet
3. Settings > API
4. Copie la **service_role key** (pas la anon key !)

Ajoute-la dans `.env.local` :

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
```

⚠️ **ATTENTION:** Cette clé donne tous les pouvoirs, ne la partage JAMAIS et ne la commit pas !

---

## 📝 Ce que fait le script

1. ✅ Définit ton compte comme **CEO**
2. ✅ Crée 3 comptes admin :
   - `admin.tournois@qspell.gg`
   - `admin.coaching@qspell.gg`
   - `admin.moderateur@qspell.gg`
3. ✅ Définit leurs rôles automatiquement
4. ✅ Vérifie que tout fonctionne

---

## 🔐 Identifiants créés

```
CEO:
Email: hatim.moro.2002@gmail.com
Mot de passe: (ton mot de passe actuel)

Admin 1:
Email: admin.tournois@qspell.gg
Mot de passe: AdminQspell2024!

Admin 2:
Email: admin.coaching@qspell.gg
Mot de passe: AdminQspell2024!

Admin 3:
Email: admin.moderateur@qspell.gg
Mot de passe: AdminQspell2024!
```

---

## ✅ Vérification

Après exécution :

1. Déconnecte-toi
2. Reconnecte-toi avec `hatim.moro.2002@gmail.com`
3. Tu dois voir un bouton rouge **"Admin"** avec badge **"CEO"** dans la nav
4. Clique dessus → `/dashboard/admin`

---

## 🐛 En cas d'erreur

### "Database error saving new user"

Cela signifie probablement que la table `profiles` ou les policies RLS posent problème.

**Solution:**

```bash
# Vérifier que la migration admin est appliquée
npx supabase db push

# Puis relancer le script
bash scripts/setup-admins.sh
```

### "SUPABASE_SERVICE_ROLE_KEY not found"

Ajoute la clé dans `.env.local` (voir Prérequis ci-dessus)

### "Account already exists"

C'est normal ! Le script mettra à jour le rôle automatiquement.

---

## 📊 Alternative manuelle via SQL

Si le script ne fonctionne pas, tu peux créer les comptes via l'interface web puis exécuter ce SQL dans Supabase SQL Editor :

```sql
-- Voir: supabase/sql/set_admin_roles.sql
UPDATE profiles 
SET role = 'ceo', display_name = 'Hatim (CEO)'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'hatim.moro.2002@gmail.com'
);

-- Puis pour chaque admin après création manuelle...
```

---

**Durée:** 2-3 minutes

**Support:** En cas de problème, vérifie les logs de la console


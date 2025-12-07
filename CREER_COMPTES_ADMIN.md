# Guide: Création des comptes Admin

## Problème rencontré

La création automatique des comptes via SQL ne fonctionne pas car `gen_salt()` n'est pas accessible dans le schéma `auth`.

## ✅ Solution: Création manuelle

### Étape 1: Créer les comptes via l'interface QSPELL

**Option A: Via l'interface web**

Allez sur http://localhost:8080/register et créez ces 3 comptes:

1. **Admin Tournois**
   - Email: `admin.tournois@qspell.gg`
   - Mot de passe: `AdminQspell2024!`
   - Username: `admin-tournois`

2. **Admin Coaching**
   - Email: `admin.coaching@qspell.gg`
   - Mot de passe: `AdminQspell2024!`
   - Username: `admin-coaching`

3. **Admin Modérateur**
   - Email: `admin.moderateur@qspell.gg`
   - Mot de passe: `AdminQspell2024!`
   - Username: `admin-modo`

---

### Étape 2: Définir les rôles admin via SQL

Une fois les 3 comptes créés, exécute ce SQL dans Supabase SQL Editor:

```sql
-- Set CEO role for hatim.moro.2002@gmail.com
UPDATE profiles 
SET role = 'ceo', display_name = 'Hatim (CEO)'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'hatim.moro.2002@gmail.com'
);

-- Set admin role for admin.tournois@qspell.gg
UPDATE profiles 
SET role = 'admin', display_name = 'Admin Tournois'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin.tournois@qspell.gg'
);

-- Set admin role for admin.coaching@qspell.gg
UPDATE profiles 
SET role = 'admin', display_name = 'Admin Coaching'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin.coaching@qspell.gg'
);

-- Set admin role for admin.moderateur@qspell.gg
UPDATE profiles 
SET role = 'admin', display_name = 'Admin Modérateur'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin.moderateur@qspell.gg'
);

-- Verify roles
SELECT 
  u.email,
  p.username,
  p.display_name,
  p.role
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE p.role IN ('admin', 'ceo')
ORDER BY p.role DESC, u.email;
```

**Ou utilise le fichier préparé:**

```bash
# Copie le contenu de supabase/sql/set_admin_roles.sql
# Et exécute-le dans Supabase SQL Editor
```

---

### Étape 3: Vérification

1. Déconnecte-toi
2. Reconnecte-toi avec `hatim.moro.2002@gmail.com`
3. Tu devrais voir un bouton rouge **"Admin"** avec le badge **"CEO"** dans la navigation
4. Clique dessus pour accéder au dashboard admin

---

## 🔄 Alternative: Script automatisé

Si tu préfères, je peux créer un script Node.js qui utilise l'API Supabase pour créer les comptes automatiquement. Veux-tu cette option ?

---

## 📝 Récapitulatif

**Comptes créés:**
- ✅ CEO: `hatim.moro.2002@gmail.com` (déjà existant)
- 🔄 Admin 1: `admin.tournois@qspell.gg` (à créer manuellement)
- 🔄 Admin 2: `admin.coaching@qspell.gg` (à créer manuellement)
- 🔄 Admin 3: `admin.moderateur@qspell.gg` (à créer manuellement)

**Après création:**
- Exécute le SQL pour définir les rôles
- Les comptes auront accès au dashboard admin
- Ils pourront changer leur mot de passe dans le profil

---

**Durée estimée:** 5-10 minutes


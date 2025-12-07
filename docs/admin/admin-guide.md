# 👑 Guide Administrateur QSPELL

Ce guide explique le système de rôles, les permissions et comment gérer les comptes administrateurs.

---

## 🎯 Système de Rôles

QSPELL dispose de 4 niveaux d'accès :

### 👤 **User (Utilisateur)**
Rôle par défaut pour tous les nouveaux comptes.

**Permissions :**
- ✅ Participer aux tournois
- ✅ Rejoindre/créer des équipes
- ✅ Chercher des coéquipiers
- ✅ Interagir sur la plateforme
- ✅ Gérer son profil et liens sociaux
- ✅ Accéder au coaching

---

### ⚔️ **Moderator (Modérateur)**
Rôle pour la modération de contenu.

**Permissions :**
- ✅ Toutes les permissions User
- ✅ Modérer les contenus
- ✅ Gérer les rapports d'utilisateurs
- ✅ Voir les logs d'actions admin
- ✅ Avertir les utilisateurs

---

### 👑 **Admin (Administrateur)**
Rôle pour gérer la plateforme.

**Permissions :**
- ✅ Toutes les permissions Moderator
- ✅ **Créer et gérer des tournois**
- ✅ **Créer et gérer des ligues**
- ✅ **Gérer le système de coaching**
- ✅ **Bannir/débannir des utilisateurs**
- ✅ **Gérer le calendrier d'événements**
- ✅ **Accès au CRM utilisateurs**
- ✅ **Voir les statistiques de la plateforme**
- ❌ Pas d'accès aux paramètres système
- ❌ Ne peut pas gérer les autres admins

---

### 👔 **CEO (Propriétaire)**
Rôle pour le propriétaire de la plateforme.

**Permissions :**
- ✅ **TOUS LES POUVOIRS**
- ✅ Gérer les administrateurs
- ✅ Accès aux paramètres système
- ✅ Statistiques complètes et analytics
- ✅ Configuration avancée

---

## 📊 Schéma de Base de Données

### Table `profiles` (champs admin)

```sql
profiles {
  -- ... autres champs ...
  
  -- Système de rôles
  role TEXT DEFAULT 'user',        -- 'user', 'moderator', 'admin', 'ceo'
  is_banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
  banned_until TIMESTAMPTZ,
  last_seen TIMESTAMPTZ,
  
  -- Réseaux sociaux
  discord_username TEXT,
  youtube_url TEXT,
  twitch_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT
}
```

### Table `admin_actions` (audit log)

```sql
admin_actions {
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES profiles(id),
  target_user_id UUID REFERENCES profiles(id),
  action_type TEXT,              -- 'ban', 'unban', 'role_change', etc.
  action_details JSONB,
  reason TEXT,
  created_at TIMESTAMPTZ
}
```

---

## 🔐 Sécurité et Permissions (RLS)

### Profils
- ✅ **Tout le monde** peut voir les profils publics
- ✅ **Utilisateurs** peuvent modifier leur propre profil
- ✅ **Admins** peuvent modifier n'importe quel profil
- ✅ **Seuls les admins** peuvent changer les rôles

### Tournois
- ✅ **Tout le monde** peut voir les tournois
- ❌ **Seuls les admins** peuvent créer des tournois
- ✅ **Organisateur OU admin** peuvent modifier un tournoi
- ❌ **Seuls les admins** peuvent supprimer des tournois

### Ligues
- ✅ **Tout le monde** peut voir les ligues
- ❌ **Seuls les admins** peuvent créer des ligues
- ✅ **Organisateur OU admin** peuvent modifier une ligue
- ❌ **Seuls les admins** peuvent supprimer des ligues

---

## 👥 Comptes Administrateurs par Défaut

### 🔴 CEO (Propriétaire)

**Email :** `hatim.moro.2002@gmail.com`  
**Rôle :** CEO (tous pouvoirs)  
**Badge :** 👔 CEO

---

### 🟠 Administrateurs

#### Admin 1 - Gestion Tournois
**Email :** `admin.tournois@qspell.gg`  
**Rôle :** Admin  
**Responsabilités :**
- Création et gestion des tournois
- Modération des inscriptions
- Gestion des brackets
- Résolution des litiges

---

#### Admin 2 - Gestion Coaching
**Email :** `admin.coaching@qspell.gg`  
**Rôle :** Admin  
**Responsabilités :**
- Gestion des coachs
- Validation des sessions de coaching
- Gestion des formations
- Support coaching privé/groupe

---

#### Admin 3 - Modération
**Email :** `admin.moderateur@qspell.gg`  
**Rôle :** Admin  
**Responsabilités :**
- Modération générale
- Gestion des reports
- Bannissements
- Surveillance de la communauté

---

## 🚀 Création des Comptes Admin

### Méthode 1 : Via l'interface (Recommandé)

#### Étape 1 : Créer les comptes

Allez sur http://localhost:8080/register et créez ces comptes :

1. **Admin Tournois**
   - Email : `admin.tournois@qspell.gg`
   - Mot de passe : `AdminQspell2024!`
   - Username : `admin-tournois`

2. **Admin Coaching**
   - Email : `admin.coaching@qspell.gg`
   - Mot de passe : `AdminQspell2024!`
   - Username : `admin-coaching`

3. **Admin Modérateur**
   - Email : `admin.moderateur@qspell.gg`
   - Mot de passe : `AdminQspell2024!`
   - Username : `admin-modo`

---

#### Étape 2 : Définir les rôles admin

Exécutez ce SQL dans **Supabase SQL Editor** :

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

**Ou utilisez le fichier préparé :**
```bash
# Le SQL est dans : supabase/sql/set_admin_roles.sql
```

---

### Méthode 2 : Script automatisé

Utilisez le script Node.js fourni :

```bash
cd scripts
node create-admin-accounts.js
```

⚠️ **Nécessite les variables d'environnement Supabase configurées.**

---

## 🔒 Sécurité des Comptes Admin

### ⚠️ IMPORTANT

**Tous les administrateurs doivent :**
1. ✅ Changer leur mot de passe lors de la première connexion
2. ✅ Activer l'authentification à deux facteurs (si disponible)
3. ✅ Ne jamais partager leurs identifiants
4. ✅ Utiliser un gestionnaire de mots de passe

### Changer le mot de passe

1. Se connecter avec les identifiants fournis
2. Aller dans **Profil** → **Paramètres**
3. Changer le mot de passe
4. ✅ Sauvegarder dans un gestionnaire de mots de passe

---

## 📍 Accès au Dashboard Admin

Une fois connecté avec un compte admin :

1. Un bouton **"Admin"** rouge apparaît dans la navigation
2. Badge **"CEO"** si vous êtes CEO
3. Cliquez pour accéder à `/dashboard/admin`

### Fonctionnalités du Dashboard Admin

#### 1. **Vue d'ensemble**
- Statistiques en temps réel
- Actions récentes
- Utilisateurs actifs
- Tournois en cours

#### 2. **Gestion utilisateurs (CRM)**
- Liste de tous les utilisateurs
- Recherche et filtres
- Bannir/débannir
- Changer les rôles
- Voir l'historique

#### 3. **Gestion tournois**
- Créer un tournoi
- Modifier/supprimer
- Gérer les inscriptions
- Résultats et brackets

#### 4. **Calendrier d'événements**
- Ajouter des événements personnalisés
- Gérer le calendrier communautaire
- Événements récurrents

#### 5. **Coaching**
- Gérer les coachs
- Approuver/refuser les sessions
- Voir les statistiques de coaching

#### 6. **Modération**
- Reports utilisateurs
- Bannissements
- Logs d'actions
- Surveillance de la communauté

#### 7. **Paramètres** (CEO uniquement)
- Configuration système
- Gestion des admins
- Paramètres avancés

---

## 📝 Audit Log (Traçabilité)

Toutes les actions admin sont enregistrées dans `admin_actions` :

**Informations enregistrées :**
- 👤 Qui a fait l'action (admin_id)
- 🎯 Sur quel utilisateur (target_user_id)
- 📋 Type d'action (action_type)
- 📝 Détails (action_details)
- 💬 Raison (reason)
- ⏰ Date et heure (created_at)

**Accès :** Dashboard Admin → **Actions récentes**

---

## 🛡️ Gestion des Bannissements

### Bannir un utilisateur

1. Aller dans **Admin** → **Utilisateurs**
2. Trouver l'utilisateur
3. Cliquer sur **Bannir**
4. Remplir :
   - Raison du bannissement
   - Durée (temporaire ou permanent)
   - Date d'expiration (si temporaire)
5. Confirmer

### Débannir un utilisateur

1. Aller dans **Admin** → **Utilisateurs**
2. Filtrer par "Bannis"
3. Cliquer sur **Débannir**
4. Confirmer

---

## 🔄 Appliquer les Migrations

Pour créer les tables nécessaires :

```bash
cd c:\Users\hatim\Desktop\parias
npx supabase db push
```

**Cela créera :**
- ✅ La colonne `role` dans `profiles`
- ✅ La table `admin_actions` (audit log)
- ✅ La table `calendar_events` (événements)
- ✅ Les RLS policies pour les admins
- ✅ Les fonctions helper (`is_admin`, `is_moderator_or_admin`)

---

## 🆘 Support et Dépannage

### Problème : Le bouton Admin n'apparaît pas

**Solution :**
1. Vérifiez que votre rôle est bien `admin` ou `ceo` dans la table `profiles`
2. Déconnectez-vous et reconnectez-vous
3. Videz le cache du navigateur

### Problème : "Permission denied" sur une action

**Solution :**
1. Vérifiez les RLS policies dans Supabase
2. Confirmez que votre rôle a les permissions nécessaires
3. Consultez les logs Supabase pour plus de détails

### Réinitialiser un mot de passe admin

**Via Supabase Dashboard :**
1. Allez dans **Authentication** → **Users**
2. Trouvez l'utilisateur admin
3. Cliquez sur **Reset password**
4. Envoyez un email de réinitialisation

---

## 📚 Ressources

- **Supabase RLS :** https://supabase.com/docs/guides/auth/row-level-security
- **Next.js Auth :** https://nextjs.org/docs/authentication
- **Documentation QSPELL :** Voir `/docs` dans le projet

---

**Date de création :** 7 décembre 2024  
**Version :** 1.0  
**Dernière mise à jour :** 7 décembre 2024

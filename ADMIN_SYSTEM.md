# 🎯 SYSTÈME DE PROFILS ET RÔLES ADMIN

## ✨ Fonctionnalités ajoutées

### 1. **Profils avec Réseaux Sociaux** 📱

Chaque utilisateur peut ajouter ses liens sociaux :
- 🎮 Discord (username#1234)
- 📹 YouTube
- 🎥 Twitch
- 🐦 Twitter/X
- 📷 Instagram
- 🎵 TikTok

### 2. **Système de Rôles** 👑

Trois niveaux d'accès :

#### **👤 User (Utilisateur)**
- Participer aux tournois
- Rejoindre/créer des équipes
- Chercher des coéquipiers
- Interagir sur la plateforme
- Gérer son profil

#### **⚔️ Moderator (Modérateur)**
- Toutes les permissions User
- Modérer les contenus
- Gérer les rapports
- Voir les logs admin

#### **👑 Admin (Administrateur)**
- Toutes les permissions Moderator
- **Créer des tournois**
- **Créer des ligues**
- **Supprimer des tournois/ligues**
- **Bannir/débannir des utilisateurs**
- **Promouvoir/rétrograder des rôles**
- Accès complet à la plateforme

### 3. **Gestion des Utilisateurs** 🛡️

Les admins peuvent :
- ✅ Bannir un utilisateur (temporaire ou permanent)
- ✅ Spécifier une raison de ban
- ✅ Définir une date d'expiration du ban
- ✅ Voir l'historique des actions admin

### 4. **Audit Log** 📝

Toutes les actions admin sont enregistrées :
- Qui a fait l'action
- Sur quel utilisateur
- Type d'action
- Raison
- Date et heure

---

## 📊 Schéma de la Base de Données

### **Table `profiles` (mise à jour)**

```sql
profiles {
  id UUID
  username TEXT
  display_name TEXT
  avatar_url TEXT
  banner_url TEXT
  bio TEXT
  
  -- 🆕 Réseaux sociaux
  discord_username TEXT
  youtube_url TEXT
  twitch_url TEXT
  twitter_url TEXT
  instagram_url TEXT
  tiktok_url TEXT
  
  -- 🆕 Système de rôles
  role TEXT ('user', 'admin', 'moderator')
  is_banned BOOLEAN
  ban_reason TEXT
  banned_until TIMESTAMPTZ
  last_seen TIMESTAMPTZ
  
  created_at TIMESTAMPTZ
  updated_at TIMESTAMPTZ
}
```

### **Nouvelle Table `admin_actions`**

```sql
admin_actions {
  id UUID
  admin_id UUID → profiles
  target_user_id UUID → profiles
  action_type TEXT
  action_details JSONB
  reason TEXT
  created_at TIMESTAMPTZ
}
```

---

## 🔒 Permissions et Sécurité

### **Row Level Security (RLS)**

#### Profils
- ✅ **Tout le monde** peut voir les profils publics
- ✅ **Utilisateurs** peuvent modifier leur propre profil
- ✅ **Admins** peuvent modifier n'importe quel profil
- ✅ **Seuls les admins** peuvent changer les rôles

#### Tournois
- ✅ **Tout le monde** peut voir les tournois
- ❌ **Seuls les admins** peuvent créer des tournois
- ✅ **Organisateur OU admin** peuvent modifier un tournoi
- ❌ **Seuls les admins** peuvent supprimer des tournois

#### Ligues
- ✅ **Tout le monde** peut voir les ligues
- ❌ **Seuls les admins** peuvent créer des ligues
- ✅ **Organisateur OU admin** peuvent modifier une ligue
- ❌ **Seuls les admins** peuvent supprimer des ligues

### **Fonctions Helper**

```sql
-- Vérifier si un utilisateur est admin
is_admin(user_id UUID) → BOOLEAN

-- Vérifier si un utilisateur est modo ou admin
is_moderator_or_admin(user_id UUID) → BOOLEAN

-- Logger une action admin
log_admin_action(admin_id, target_user_id, action_type, details, reason)
```

---

## 🚀 Prochaines Étapes

### **À implémenter :**

1. **Pages Admin** 
   - `/admin/dashboard` - Vue d'ensemble
   - `/admin/users` - Gestion des utilisateurs
   - `/admin/tournaments` - Gestion des tournois
   - `/admin/logs` - Historique des actions

2. **Composants**
   - `EditProfileForm` - Formulaire d'édition avec réseaux sociaux
   - `AdminUserManager` - Gérer les utilisateurs
   - `BanUserDialog` - Bannir un utilisateur
   - `AdminActionLog` - Afficher les logs

3. **API Routes**
   - `/api/admin/users/ban` - Bannir un utilisateur
   - `/api/admin/users/unban` - Débannir un utilisateur
   - `/api/admin/users/role` - Changer le rôle
   - `/api/admin/actions` - Récupérer les logs

4. **Middleware**
   - Vérifier si l'utilisateur est banni
   - Rediriger les utilisateurs bannis
   - Protéger les routes admin

---

## 💡 Fonctionnalités Bonus

### **Pour les Utilisateurs**
- 🔍 Chercher des coéquipiers par rôle/rang
- 💬 Système de messagerie privée
- ⭐ Système de favoris (équipes/joueurs)
- 📊 Statistiques personnelles avancées

### **Pour les Admins**
- 📈 Dashboard analytics
- 🔔 Système d'alertes
- 📧 Envoi d'emails groupés
- 🎮 Gestion des saisons

---

## 🎯 Premier Utilisateur = Admin Automatique

Le **premier utilisateur** à s'inscrire devient automatiquement **admin** !

Cela facilite la configuration initiale de la plateforme.

---

## 📝 Migration

Pour appliquer cette migration :

```bash
npx supabase db push
```

Ou sur le dashboard Supabase :
1. Allez dans "SQL Editor"
2. Copiez le contenu de `20240108000000_add_social_and_roles.sql`
3. Exécutez le script

---

## ✅ Checklist Implémentation

- [x] Migration SQL créée
- [ ] Types TypeScript mis à jour
- [ ] Composant EditProfileForm
- [ ] API routes admin
- [ ] Pages admin
- [ ] Middleware de vérification ban
- [ ] Tests

---

**La base est prête ! Passons maintenant à l'implémentation des composants et des pages admin ! 🚀**

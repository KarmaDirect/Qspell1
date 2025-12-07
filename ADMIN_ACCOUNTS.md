# Comptes Administrateurs QSPELL

## 🔴 CEO (Propriétaire)

**Email:** hatim.moro.2002@gmail.com  
**Rôle:** CEO (tous pouvoirs)  
**Mot de passe:** *Votre mot de passe actuel*

---

## 🟠 Administrateurs

### Admin 1 - Gestion Tournois

**Email:** admin.tournois@qspell.gg  
**Mot de passe initial:** `AdminQspell2024!`  
**Rôle:** Admin  
**Responsabilités:**
- Création et gestion des tournois
- Modération des inscriptions
- Gestion des brackets
- Résolution des litiges

---

### Admin 2 - Gestion Coaching

**Email:** admin.coaching@qspell.gg  
**Mot de passe initial:** `AdminQspell2024!`  
**Rôle:** Admin  
**Responsabilités:**
- Gestion des coachs
- Validation des sessions de coaching
- Gestion des formations
- Support coaching privé/groupe

---

### Admin 3 - Modération

**Email:** admin.moderateur@qspell.gg  
**Mot de passe initial:** `AdminQspell2024!`  
**Rôle:** Admin  
**Responsabilités:**
- Modération générale
- Gestion des reports
- Bannissements
- Surveillance de la communauté

---

## 🔐 Sécurité

⚠️ **IMPORTANT:** Tous les administrateurs doivent changer leur mot de passe lors de la première connexion.

Pour changer le mot de passe :
1. Se connecter avec les identifiants fournis
2. Aller dans Profil > Paramètres
3. Changer le mot de passe

---

## 🛡️ Permissions Administrateur

### CEO (Vous)
- ✅ Tous pouvoirs
- ✅ Gestion des administrateurs
- ✅ Accès aux paramètres système
- ✅ Statistiques complètes
- ✅ CRM complet

### Admin
- ✅ Gestion utilisateurs (CRM)
- ✅ Création/modification/suppression tournois
- ✅ Ajout d'événements au calendrier
- ✅ Gestion coaching & coachs
- ✅ Modération (bans, reports)
- ✅ Suppression de contenu
- ✅ Statistiques de la plateforme
- ❌ Pas d'accès aux paramètres système
- ❌ Ne peut pas gérer les autres admins

---

## 📍 Accès Dashboard Admin

Une fois connecté avec un compte admin :
- Un bouton **"Admin"** rouge apparaît dans la navigation
- Badge **"CEO"** si vous êtes CEO
- Accès à `/dashboard/admin`

### Fonctionnalités Admin Dashboard

1. **Gestion utilisateurs** - CRM complet avec liste de tous les inscrits
2. **Gestion tournois** - Création, modification, suppression
3. **Événements** - Ajout d'événements personnalisés au calendrier
4. **Coaching** - Gestion des coachs et sessions
5. **Modération** - Reports, bannissements
6. **Paramètres** (CEO uniquement) - Configuration système

---

## 🔄 Pour appliquer les migrations

```bash
cd /c/Users/hatim/Desktop/parias
npx supabase db push
```

Cela créera :
- La colonne `role` dans `profiles`
- La table `admin_actions` (log des actions)
- La table `calendar_events` (événements personnalisés)
- Les RLS policies pour les admins
- Les 3 comptes admin

---

## 📊 Log des actions

Toutes les actions admin sont enregistrées dans `admin_actions` :
- Qui a fait l'action
- Type d'action (create, update, delete, ban, etc.)
- Cible (utilisateur, tournoi, etc.)
- Détails (JSON)
- Date/heure

Accessible depuis le dashboard admin > Actions récentes

---

## 🆘 Support

En cas de problème avec les comptes admin, tu peux :
1. Réinitialiser les mots de passe via Supabase Dashboard
2. Créer de nouveaux comptes admin via SQL
3. Modifier les rôles directement dans la table `profiles`

---

**Date de création:** 7 décembre 2024  
**Version:** 1.0


# 🚀 Guide : Configuration et Push vers GitHub

Ce guide vous explique comment configurer Git et pousser votre code vers GitHub.

---

## 🎯 Méthode Recommandée : GitHub CLI

GitHub CLI est l'outil officiel qui simplifie l'authentification et les opérations Git.

### Étape 1 : Installer GitHub CLI

**Windows :**
```bash
winget install --id GitHub.cli
```

**Ou téléchargez depuis :** https://cli.github.com/

**Linux/Mac :**
```bash
# macOS
brew install gh

# Linux (Debian/Ubuntu)
sudo apt install gh
```

**Vérifier l'installation :**
```bash
gh --version
```

---

### Étape 2 : Authentification

**Commande simple (recommandée) :**
```bash
gh auth login --web --git-protocol https
```

**Ce qui va se passer :**
1. Une URL s'affichera dans le terminal
2. Votre navigateur s'ouvrira automatiquement
3. Connectez-vous à GitHub
4. Autorisez GitHub CLI
5. ✅ C'est fait !

**Vérifier l'authentification :**
```bash
gh auth status
```

---

### Étape 3 : Workflow Git standard

**Ajouter des fichiers modifiés :**
```bash
git add .
# Ou pour des fichiers spécifiques :
git add src/components/mon-composant.tsx
```

**Créer un commit :**
```bash
git commit -m "feat: ajouter nouvelle fonctionnalité"
```

**Pousser vers GitHub :**
```bash
# Premier push
git push -u origin main

# Pushs suivants
git push
```

---

### Étape 4 : Créer un repo GitHub (si nécessaire)

Si vous n'avez pas encore de repository sur GitHub :

```bash
# Créer un repo public
gh repo create Qspell --public --source=. --remote=origin --push

# Ou créer un repo privé
gh repo create Qspell --private --source=. --remote=origin --push
```

---

## 🔄 Méthode Alternative : Personal Access Token

Si vous préférez ne pas utiliser GitHub CLI :

### 1. Créer un Personal Access Token

1. Allez sur : https://github.com/settings/tokens
2. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
3. Donnez un nom : `QSPELL Project`
4. Sélectionnez les permissions :
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (si vous utilisez GitHub Actions)
5. Cliquez sur **"Generate token"**
6. **⚠️ COPIEZ LE TOKEN** (vous ne pourrez plus le voir !)

---

### 2. Configurer Git avec le token

**Méthode 1 : URL avec token (simple mais moins sécurisée)**
```bash
git remote add origin https://VOTRE_TOKEN@github.com/USERNAME/Qspell.git
```

**Méthode 2 : Git Credential Manager (recommandée)**
```bash
# Configurer le remote normalement
git remote add origin https://github.com/USERNAME/Qspell.git

# Au premier push, Git vous demandera vos identifiants
# Username: votre username GitHub
# Password: collez votre Personal Access Token
git push -u origin main
```

---

## 📋 Configuration Git initiale

Si c'est votre premier projet Git :

```bash
# Configurer votre identité
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Vérifier la configuration
git config --list
```

---

## 🛠️ Commandes Git utiles

### Vérifier l'état de votre repo
```bash
git status
```

### Voir l'historique des commits
```bash
git log --oneline -10
```

### Voir les différences avant commit
```bash
git diff
```

### Annuler des modifications non commitées
```bash
# Annuler les modifications d'un fichier
git checkout -- fichier.ts

# Annuler tous les changements
git reset --hard
```

### Voir les remotes configurés
```bash
git remote -v
```

### Changer l'URL du remote
```bash
git remote set-url origin https://github.com/USERNAME/Qspell.git
```

---

## 🌿 Workflow avec branches

### Créer une nouvelle branche
```bash
git checkout -b feature/ma-nouvelle-feature
```

### Lister les branches
```bash
git branch
```

### Changer de branche
```bash
git checkout main
```

### Fusionner une branche
```bash
git checkout main
git merge feature/ma-nouvelle-feature
```

### Supprimer une branche
```bash
git branch -d feature/ma-nouvelle-feature
```

---

## 📊 Vérifier après le push

Après avoir poussé, vérifiez sur GitHub :
👉 https://github.com/USERNAME/Qspell

Vous devriez voir :
- ✅ Vos commits
- ✅ Vos fichiers
- ✅ Votre README.md affiché

---

## ❓ Problèmes courants

### "Repository not found"
**Cause :** Le repo n'existe pas sur GitHub ou l'URL est incorrecte

**Solution :**
```bash
# Vérifier l'URL du remote
git remote -v

# Si incorrecte, corriger
git remote set-url origin https://github.com/USERNAME/Qspell.git
```

---

### "Authentication failed"
**Cause :** Token expiré ou identifiants incorrects

**Solution avec GitHub CLI :**
```bash
gh auth login --web
```

**Solution avec token :**
- Créez un nouveau Personal Access Token
- Mettez à jour le remote avec le nouveau token

---

### "Permission denied"
**Cause :** Pas de droits sur le repository

**Solution :**
- Vérifiez que vous êtes le propriétaire du repo
- Ou demandez les droits de collaboration

---

### "Failed to push some refs"
**Cause :** Votre branche locale est en retard par rapport à GitHub

**Solution :**
```bash
# Récupérer les changements distants
git pull origin main

# Résoudre les conflits si nécessaire
# Puis pousser
git push origin main
```

---

### Conflits de merge
**Quand :** Modifications concurrentes sur les mêmes lignes

**Solution :**
```bash
# 1. Git marque les conflits dans les fichiers
# 2. Ouvrez les fichiers et résolvez manuellement
# 3. Ajoutez les fichiers résolus
git add fichier-resolu.ts

# 4. Finalisez le merge
git commit -m "resolve: conflits résolus"
```

---

## 🆘 Commandes de diagnostic

```bash
# Vérifier le statut Git
git status

# Vérifier l'authentification GitHub CLI
gh auth status

# Voir les remotes configurés
git remote -v

# Voir les derniers commits
git log --oneline -5

# Voir les branches
git branch -a
```

---

## 📚 Ressources

- **GitHub CLI Docs :** https://cli.github.com/manual/
- **Git Documentation :** https://git-scm.com/doc
- **GitHub Docs :** https://docs.github.com/
- **Personal Access Tokens :** https://github.com/settings/tokens

---

**💡 Conseil :** Utilisez GitHub CLI pour une meilleure expérience. C'est l'outil officiel et il simplifie beaucoup d'opérations !

# 🚀 GUIDE RAPIDE - Push vers GitHub

## ⚡ Méthode ULTRA SIMPLE (2 commandes)

### 1️⃣ Authentification (une seule fois)

Ouvrez **Git Bash** dans le dossier `parias` :

```bash
bash auth-github-simple.sh
```

**Ce qui se passe :**
- Un lien s'affiche
- Votre navigateur s'ouvre
- Connectez-vous à GitHub
- Autorisez l'accès
- ✅ Terminé !

---

### 2️⃣ Push vers GitHub

```bash
bash push-github-simple.sh
```

**Le script va automatiquement :**
- ✅ Ajouter vos fichiers
- ✅ Créer le commit
- ✅ Configurer le remote
- ✅ Pousser vers GitHub

**Résultat :** Votre code sera sur https://github.com/KarmaDirect/Qspell

---

## 🔧 Alternative : Commandes manuelles

Si vous préférez faire étape par étape :

### Étape 1 : Authentification
```bash
gh auth login --web
```

### Étape 2 : Push
```bash
# Ajouter les fichiers
git add src/lib/riot-api/client.ts src/app/api/riot/sync-stats/route.ts

# Commit
git commit -m "fix: use by-puuid endpoint for ranked stats"

# Remote
git remote add origin https://github.com/KarmaDirect/Qspell.git

# Branche
git branch -M main

# Push
git push -u origin main
```

---

## ❓ Problèmes ?

### "gh: command not found"
GitHub CLI n'est pas installé :
```bash
winget install --id GitHub.cli
```

### "Permission denied"
Réauthentifiez-vous :
```bash
bash auth-github-simple.sh
```

### Vérifier l'authentification
```bash
gh auth status
```

---

## 📊 Vérifier le résultat

Après le push, allez sur :
👉 **https://github.com/KarmaDirect/Qspell**

Vous verrez votre commit : `fix: use by-puuid endpoint for ranked stats`

---

## 🎯 Résumé en 2 lignes

```bash
bash auth-github-simple.sh    # Une seule fois
bash push-github-simple.sh    # À chaque push
```

C'est tout ! 🎉

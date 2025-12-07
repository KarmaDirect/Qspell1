# 🚀 Guide Push GitHub

## Méthode 1 : Utiliser GitHub CLI (RECOMMANDÉ) ✅

### Étape 1 : Installer GitHub CLI

Si ce n'est pas déjà fait, installez GitHub CLI :

**Windows :**
```bash
winget install --id GitHub.cli
```

Ou téléchargez depuis : https://cli.github.com/

**Vérifier l'installation :**
```bash
gh --version
```

---

### Étape 2 : Authentification avec le navigateur

**Option A - Windows (CMD/PowerShell) :**
```bash
github-auth.bat
```

**Option B - Git Bash :**
```bash
bash github-auth.sh
```

**Option C - Commande directe :**
```bash
gh auth login --web --git-protocol https
```

📌 **Ce qui va se passer :**
1. Une URL s'affichera dans le terminal
2. Votre navigateur s'ouvrira automatiquement
3. Connectez-vous à GitHub
4. Autorisez GitHub CLI
5. ✅ C'est fait !

---

### Étape 3 : Pousser vers GitHub

**Option A - Windows (CMD/PowerShell) :**
```bash
github-push.bat
```

**Option B - Git Bash :**
```bash
bash github-push.sh
```

**Option C - Commandes manuelles :**
```bash
# Ajouter les fichiers
git add src/lib/riot-api/client.ts src/app/api/riot/sync-stats/route.ts

# Créer le commit
git commit -m "fix: use by-puuid endpoint for ranked stats"

# Configurer le remote
git remote add origin https://github.com/KarmaDirect/Qspell.git

# Renommer la branche
git branch -M main

# Pousser
git push -u origin main
```

---

## Méthode 2 : Authentification classique avec GitHub

Si vous préférez ne pas utiliser GitHub CLI :

### 1. Créer un Personal Access Token

1. Allez sur : https://github.com/settings/tokens
2. Cliquez sur "Generate new token" → "Generate new token (classic)"
3. Donnez un nom : `Qspell Project`
4. Cochez : `repo` (Full control of private repositories)
5. Cliquez sur "Generate token"
6. **⚠️ COPIEZ LE TOKEN** (vous ne pourrez plus le voir !)

### 2. Configurer Git

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

### 3. Pousser avec le token

```bash
# Ajouter les fichiers
git add src/lib/riot-api/client.ts src/app/api/riot/sync-stats/route.ts

# Créer le commit
git commit -m "fix: use by-puuid endpoint for ranked stats"

# Configurer le remote avec token
git remote add origin https://VOTRE_TOKEN@github.com/KarmaDirect/Qspell.git

# Renommer la branche
git branch -M main

# Pousser
git push -u origin main
```

---

## 🎯 Modifications effectuées

### Fichiers modifiés :
- ✅ `src/lib/riot-api/client.ts` - Utilise l'endpoint `/entries/by-puuid`
- ✅ `src/app/api/riot/sync-stats/route.ts` - Simplifié la logique de sync

### Avantages :
- 🎯 API moderne recommandée par Riot
- ⚡ Meilleurs rate limits : 20,000 req/10s
- 🏆 Vrais rangs : Gold II, Platinum IV, etc.
- 💎 LP exacts de toute la saison
- 🔄 Plus fiable

---

## 📊 Vérifier le push

Après le push, vérifiez sur GitHub :
👉 https://github.com/KarmaDirect/Qspell

---

## ❓ Problèmes courants

### "Repository not found"
- Vérifiez que le repo existe : https://github.com/KarmaDirect/Qspell
- Si non, créez-le d'abord sur GitHub

### "Authentication failed"
- Réexécutez : `gh auth login --web`
- Ou utilisez un Personal Access Token

### "Permission denied"
- Vérifiez que vous avez les droits sur le repo
- Ou que le repo est bien le vôtre

---

## 🆘 Besoin d'aide ?

```bash
# Vérifier le statut Git
git status

# Vérifier l'authentification GitHub CLI
gh auth status

# Voir les remotes configurés
git remote -v

# Voir les derniers commits
git log --oneline -5
```

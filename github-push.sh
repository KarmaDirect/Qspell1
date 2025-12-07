#!/bin/bash

cd "$(dirname "$0")"

echo "========================================"
echo "Push vers GitHub avec GitHub CLI"
echo "========================================"
echo ""

# Vérifier si GitHub CLI est installé (Windows compatible)
if ! command -v gh &> /dev/null && ! command -v gh.exe &> /dev/null; then
    echo "❌ GitHub CLI n'est pas installé"
    echo ""
    echo "Exécutez d'abord : bash github-auth.sh"
    exit 1
fi

# Vérifier l'authentification
GH_CMD="gh"
command -v gh.exe &> /dev/null && GH_CMD="gh.exe"

if ! $GH_CMD auth status &> /dev/null; then
    echo "❌ Non authentifié avec GitHub"
    echo ""
    echo "Exécutez d'abord : bash github-auth.sh"
    exit 1
fi

echo "✅ Authentifié avec GitHub"
echo ""

echo "📝 1. Ajout des fichiers modifiés..."
git add src/lib/riot-api/client.ts src/app/api/riot/sync-stats/route.ts
echo "   ✓ Fichiers ajoutés"

echo ""
echo "💾 2. Création du commit..."
git commit -m "fix: use by-puuid endpoint for ranked stats

- Changed getRankedStats to use /league/v4/entries/by-puuid endpoint
- Removed dependency on summonerId which was often missing
- Simplified sync-stats route by removing summoner ID refresh logic
- Better rate limits: 20k req/10s instead of limited by-summoner
- Now returns actual tier/rank/LP from Riot API" 2>&1 | head -10

if [ $? -eq 0 ]; then
    echo "   ✓ Commit créé"
else
    echo "   ⚠ Commit échoué ou rien à committer"
fi

echo ""
echo "🔗 3. Configuration du remote..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/KarmaDirect/Qspell.git
echo "   ✓ Remote configuré"

echo ""
echo "🌿 4. Renommer la branche en main..."
git branch -M main
echo "   ✓ Branche renommée"

echo ""
echo "🚀 5. Push vers GitHub..."
git push -u origin main 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "✅ Push terminé avec succès !"
    echo "========================================"
    echo ""
    echo "🌐 Voir votre repo : https://github.com/KarmaDirect/Qspell"
else
    echo ""
    echo "❌ Erreur lors du push"
    echo "Vérifiez que le repo existe sur GitHub"
fi

echo ""

#!/bin/bash

cd "$(dirname "$0")"

echo "========================================"
echo "🚀 Push vers GitHub"
echo "========================================"
echo ""

# Déterminer la commande gh
GH_CMD="gh"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    GH_CMD="gh.exe"
fi

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
- Now returns actual tier/rank/LP from Riot API"

if [ $? -eq 0 ]; then
    echo "   ✓ Commit créé"
elif [ $? -eq 1 ]; then
    echo "   ⚠ Rien à committer (déjà fait ?)"
else
    echo "   ❌ Erreur lors du commit"
fi

echo ""
echo "🔗 3. Configuration du remote..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/KarmaDirect/Qspell.git
echo "   ✓ Remote configuré : https://github.com/KarmaDirect/Qspell.git"

echo ""
echo "🌿 4. Renommer la branche en main..."
git branch -M main
echo "   ✓ Branche renommée en 'main'"

echo ""
echo "🚀 5. Push vers GitHub..."
echo ""
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "✅ SUCCÈS ! Push terminé"
    echo "========================================"
    echo ""
    echo "🌐 Voir votre repo :"
    echo "   https://github.com/KarmaDirect/Qspell"
    echo ""
else
    echo ""
    echo "========================================"
    echo "❌ Erreur lors du push"
    echo "========================================"
    echo ""
    echo "Causes possibles :"
    echo "  1. Repo n'existe pas sur GitHub"
    echo "  2. Pas authentifié : bash auth-github-simple.sh"
    echo "  3. Pas de permissions sur le repo"
    echo ""
fi

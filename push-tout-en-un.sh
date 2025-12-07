#!/bin/bash

echo "======================================"
echo "🚀 Push GitHub - Version Simple"
echo "======================================"
echo ""

cd /c/Users/hatim/Desktop/parias

echo "Étape 1 : Authentification GitHub..."
echo "Un navigateur va s'ouvrir"
echo ""

gh auth login --web --git-protocol https

echo ""
echo "======================================"
echo ""
echo "Étape 2 : Ajout des fichiers..."
git add src/lib/riot-api/client.ts src/app/api/riot/sync-stats/route.ts

echo ""
echo "Étape 3 : Commit..."
git commit -m "fix: use by-puuid endpoint for ranked stats"

echo ""
echo "Étape 4 : Configuration remote..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/KarmaDirect/Qspell.git
git branch -M main

echo ""
echo "Étape 5 : Push vers GitHub..."
git push -u origin main

echo ""
echo "======================================"
echo "✅ Terminé !"
echo "======================================"
echo ""
echo "Voir : https://github.com/KarmaDirect/Qspell"
echo ""

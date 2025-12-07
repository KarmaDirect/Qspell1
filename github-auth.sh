#!/bin/bash

echo "========================================"
echo "Authentification GitHub CLI"
echo "========================================"
echo ""

# Vérifier si GitHub CLI est installé (Windows compatible)
if ! command -v gh &> /dev/null && ! command -v gh.exe &> /dev/null; then
    echo "❌ GitHub CLI n'est pas installé"
    echo ""
    echo "Téléchargez-le sur : https://cli.github.com/"
    echo ""
    echo "Ou installez-le avec :"
    echo "  - Windows: winget install --id GitHub.cli"
    echo "  - Mac: brew install gh"
    echo ""
    exit 1
fi

echo "✅ GitHub CLI est installé"
echo ""
echo "🔐 Authentification avec le navigateur..."
echo "Un lien va s'ouvrir dans votre navigateur"
echo ""

# Authentification avec le navigateur
gh auth login --web --git-protocol https

echo ""
echo "========================================"
echo "✅ Authentification terminée !"
echo "========================================"
echo ""

# Vérifier le statut
echo "📊 Vérification du statut..."
gh auth status

echo ""
echo "Appuyez sur Entrée pour continuer..."
read

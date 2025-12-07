#!/bin/bash

echo "========================================"
echo "🔐 Authentification GitHub"
echo "========================================"
echo ""

echo "Authentification avec le navigateur..."
echo "Un lien va s'ouvrir dans votre navigateur"
echo ""

# Utiliser gh.exe sur Windows, gh ailleurs
GH_CMD="gh"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    GH_CMD="gh.exe"
fi

# Authentification
$GH_CMD auth login --web --git-protocol https

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "✅ Authentification réussie !"
    echo "========================================"
    echo ""
    
    echo "📊 Statut de l'authentification :"
    $GH_CMD auth status
else
    echo ""
    echo "❌ Erreur lors de l'authentification"
    echo ""
    echo "Vérifiez que GitHub CLI est installé :"
    echo "  gh --version"
fi

echo ""

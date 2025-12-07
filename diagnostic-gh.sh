#!/bin/bash

echo "========================================"
echo "🔍 Diagnostic GitHub CLI"
echo "========================================"
echo ""

echo "1. Test commande 'gh' :"
if command -v gh &> /dev/null; then
    echo "   ✅ 'gh' trouvé"
    gh --version 2>&1 | head -3
else
    echo "   ❌ 'gh' non trouvé"
fi

echo ""
echo "2. Test commande 'gh.exe' (Windows) :"
if command -v gh.exe &> /dev/null; then
    echo "   ✅ 'gh.exe' trouvé"
    gh.exe --version 2>&1 | head -3
else
    echo "   ❌ 'gh.exe' non trouvé"
fi

echo ""
echo "3. Recherche dans PATH :"
which gh 2>/dev/null || echo "   'gh' pas dans PATH"
which gh.exe 2>/dev/null || echo "   'gh.exe' pas dans PATH"

echo ""
echo "4. Test direct avec chemin complet :"
if [ -f "/c/Program Files/GitHub CLI/gh.exe" ]; then
    echo "   ✅ Trouvé dans Program Files"
    "/c/Program Files/GitHub CLI/gh.exe" --version 2>&1 | head -3
elif [ -f "/c/Program Files (x86)/GitHub CLI/gh.exe" ]; then
    echo "   ✅ Trouvé dans Program Files (x86)"
    "/c/Program Files (x86)/GitHub CLI/gh.exe" --version 2>&1 | head -3
else
    echo "   ❌ Pas trouvé dans les emplacements standards"
fi

echo ""
echo "5. Variables d'environnement PATH :"
echo "$PATH" | tr ':' '\n' | grep -i github || echo "   Aucun chemin GitHub dans PATH"

echo ""
echo "========================================"
echo "💡 Solutions :"
echo "========================================"
echo ""
echo "Si GitHub CLI n'est pas trouvé :"
echo "  1. Redémarrez Git Bash/Terminal"
echo "  2. Ou ajoutez au PATH manuellement"
echo "  3. Ou utilisez le chemin complet"
echo ""

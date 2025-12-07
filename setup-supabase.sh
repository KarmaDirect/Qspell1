#!/bin/bash

echo "🚀 Configuration de la base de données Supabase"
echo "================================================"
echo ""

# Vérifier si Supabase CLI est installé
if ! command -v supabase &> /dev/null && ! [ -f "./node_modules/.bin/supabase" ]; then
    echo "❌ Supabase CLI n'est pas installé"
    echo "Installation en cours..."
    npm install supabase --save-dev
fi

echo "✅ Supabase CLI détecté"
echo ""

# Demander le project ref
read -p "📝 Entrez votre Project REF (trouvable sur supabase.com/dashboard/project/VOTRE_PROJET/settings/general): " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Project REF requis"
    exit 1
fi

echo ""
echo "🔗 Connexion à Supabase..."
npx supabase login

echo ""
echo "🔗 Liaison du projet..."
npx supabase link --project-ref "$PROJECT_REF"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Projet lié avec succès !"
    echo ""
    
    read -p "📤 Voulez-vous pousser les migrations maintenant ? (y/n): " PUSH_MIGRATIONS
    
    if [ "$PUSH_MIGRATIONS" = "y" ] || [ "$PUSH_MIGRATIONS" = "Y" ]; then
        echo ""
        echo "📤 Application des migrations..."
        npx supabase db push
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Migrations appliquées avec succès !"
            echo ""
            echo "🎉 Configuration terminée !"
            echo ""
            echo "Prochaines étapes :"
            echo "1. Vérifiez vos tables sur https://supabase.com/dashboard/project/$PROJECT_REF/editor"
            echo "2. Configurez vos variables d'environnement dans .env.local"
            echo "3. Lancez l'application avec : npm run dev"
        else
            echo ""
            echo "❌ Erreur lors de l'application des migrations"
            echo "Vous pouvez les appliquer manuellement via le dashboard Supabase"
        fi
    else
        echo ""
        echo "⏭️  Migrations ignorées"
        echo "Vous pouvez les appliquer plus tard avec : npm run supabase:push"
    fi
else
    echo ""
    echo "❌ Erreur lors de la liaison du projet"
    echo "Vérifiez votre Project REF et réessayez"
fi

echo ""
echo "📚 Documentation complète : voir SUPABASE_CLI.md"


@echo off
echo ============================================
echo Configuration de la base de donnees Supabase
echo ============================================
echo.

REM Verifier si Supabase CLI est installe
where supabase >nul 2>&1
if %errorlevel% neq 0 (
    if not exist "node_modules\.bin\supabase.cmd" (
        echo Installation de Supabase CLI...
        call npm install supabase --save-dev
    )
)

echo Supabase CLI detecte
echo.

set /p PROJECT_REF="Entrez votre Project REF (trouvable sur supabase.com/dashboard/project/VOTRE_PROJET/settings/general): "

if "%PROJECT_REF%"=="" (
    echo Project REF requis
    exit /b 1
)

echo.
echo Connexion a Supabase...
call npx supabase login

echo.
echo Liaison du projet...
call npx supabase link --project-ref %PROJECT_REF%

if %errorlevel% equ 0 (
    echo.
    echo Projet lie avec succes !
    echo.
    
    set /p PUSH_MIGRATIONS="Voulez-vous pousser les migrations maintenant ? (y/n): "
    
    if /i "%PUSH_MIGRATIONS%"=="y" (
        echo.
        echo Application des migrations...
        call npx supabase db push
        
        if %errorlevel% equ 0 (
            echo.
            echo Migrations appliquees avec succes !
            echo.
            echo Configuration terminee !
            echo.
            echo Prochaines etapes :
            echo 1. Verifiez vos tables sur https://supabase.com/dashboard/project/%PROJECT_REF%/editor
            echo 2. Configurez vos variables d'environnement dans .env.local
            echo 3. Lancez l'application avec : npm run dev
        ) else (
            echo.
            echo Erreur lors de l'application des migrations
            echo Vous pouvez les appliquer manuellement via le dashboard Supabase
        )
    ) else (
        echo.
        echo Migrations ignorees
        echo Vous pouvez les appliquer plus tard avec : npm run supabase:push
    )
) else (
    echo.
    echo Erreur lors de la liaison du projet
    echo Verifiez votre Project REF et reessayez
)

echo.
echo Documentation complete : voir SUPABASE_CLI.md
pause


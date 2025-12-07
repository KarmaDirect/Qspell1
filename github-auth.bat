@echo off
echo ========================================
echo Authentification GitHub CLI
echo ========================================
echo.

REM Vérifier si GitHub CLI est installé
where gh >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo GitHub CLI n'est pas installe
    echo.
    echo Telechargez-le sur : https://cli.github.com/
    echo.
    echo Appuyez sur une touche pour ouvrir le site...
    pause >nul
    start https://cli.github.com/
    exit /b 1
)

echo GitHub CLI est installe
echo.
echo Authentification avec le navigateur...
echo Un lien va s'ouvrir dans votre navigateur
echo.

gh auth login --web --git-protocol https

echo.
echo ========================================
echo Authentification terminee !
echo ========================================
echo.

echo Verification du statut...
gh auth status

echo.
pause

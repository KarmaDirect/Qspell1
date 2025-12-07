@echo off
echo ========================================
echo Push vers GitHub avec GitHub CLI
echo ========================================
echo.

cd /d "%~dp0"

REM Vérifier si GitHub CLI est installé
where gh >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo GitHub CLI n'est pas installe
    echo.
    echo Telechargez-le sur : https://cli.github.com/
    echo.
    pause
    exit /b 1
)

echo 1. Authentification avec GitHub CLI...
echo.
gh auth login --web

echo.
echo 2. Configuration du repo...
git add src/lib/riot-api/client.ts src/app/api/riot/sync-stats/route.ts

echo.
echo 3. Creation du commit...
git commit -m "fix: use by-puuid endpoint for ranked stats instead of deprecated by-summoner"

echo.
echo 4. Configuration du remote...
git remote remove origin 2>nul
gh repo set-default KarmaDirect/Qspell
git remote add origin https://github.com/KarmaDirect/Qspell.git

echo.
echo 5. Renommer la branche en main...
git branch -M main

echo.
echo 6. Push vers GitHub...
git push -u origin main

echo.
echo ========================================
echo Push termine avec succes !
echo ========================================
echo.
pause

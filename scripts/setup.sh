#!/bin/bash

# 🚀 QSPELL - Script de configuration automatique
# Ce script vous aide à configurer votre environnement de développement

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════╗"
echo "║         🎮 QSPELL - Setup Wizard 🎮          ║"
echo "║     Master Your Q. Master Your Win. ⚡        ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}"

# Fonction pour afficher les étapes
step() {
    echo -e "\n${BLUE}━━━ $1 ━━━${NC}\n"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier Node.js
step "1. Vérification des prérequis"

if ! command -v node &> /dev/null; then
    error "Node.js n'est pas installé !"
    echo "Installez Node.js depuis : https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
success "Node.js installé : $NODE_VERSION"

if ! command -v npm &> /dev/null; then
    error "npm n'est pas installé !"
    exit 1
fi

NPM_VERSION=$(npm -v)
success "npm installé : $NPM_VERSION"

if ! command -v git &> /dev/null; then
    warning "Git n'est pas installé. Recommandé pour le versioning."
else
    GIT_VERSION=$(git --version)
    success "Git installé : $GIT_VERSION"
fi

# Installer les dépendances
step "2. Installation des dépendances"

if [ ! -d "node_modules" ]; then
    echo "Installation des packages npm..."
    npm install
    success "Dépendances installées !"
else
    warning "node_modules existe déjà. Utilisez 'npm install' pour mettre à jour."
fi

# Créer .env.local si nécessaire
step "3. Configuration du fichier .env.local"

if [ -f ".env.local" ]; then
    warning "Le fichier .env.local existe déjà."
    echo -n "Voulez-vous le recréer ? (y/N) : "
    read -r RECREATE_ENV
    if [[ ! $RECREATE_ENV =~ ^[Yy]$ ]]; then
        echo "Conservation du .env.local existant."
        ENV_EXISTS=true
    fi
fi

if [ "$ENV_EXISTS" != true ]; then
    echo "Création du fichier .env.local..."
    
    cat > .env.local << 'EOF'
# ═══════════════════════════════════════════════════════
#  🎮 QSPELL - Configuration Environnement
# ═══════════════════════════════════════════════════════

# ──────────────────────────────────────────────────────
# 🗄️  SUPABASE (Base de données)
# ──────────────────────────────────────────────────────
# 1. Créez un compte sur : https://supabase.com
# 2. Créez un nouveau projet
# 3. Allez dans Settings → API
# 4. Copiez les valeurs ci-dessous

NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key

# ──────────────────────────────────────────────────────
# 🎮 RIOT GAMES API (Données LoL)
# ──────────────────────────────────────────────────────
# Guide complet : docs/setup/riot-api-key.md
# 
# RECOMMANDÉ : Personal API Key (ne expire jamais)
# 1. https://developer.riotgames.com/
# 2. Register Product → Personal
# 3. Remplir le formulaire
# 4. Copier la clé générée

RIOT_API_KEY=RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# ──────────────────────────────────────────────────────
# 🗃️  UPSTASH REDIS (Cache - OPTIONNEL)
# ──────────────────────────────────────────────────────
# Améliore les performances mais pas obligatoire
# 1. https://upstash.com
# 2. Create Database → Regional
# 3. Copier REST URL et TOKEN

# UPSTASH_REDIS_URL=https://xxxxx.upstash.io
# UPSTASH_REDIS_TOKEN=AXxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ──────────────────────────────────────────────────────
# ⚙️  APP CONFIG
# ──────────────────────────────────────────────────────

NEXT_PUBLIC_APP_URL=http://localhost:8080

# ═══════════════════════════════════════════════════════
#  📚 Documentation :
#  - Guide rapide : QUICK_START.md
#  - Riot API : docs/setup/riot-api-key.md
#  - Admin : docs/admin/admin-guide.md
# ═══════════════════════════════════════════════════════
EOF

    success "Fichier .env.local créé !"
    warning "⚠️  N'oubliez pas de remplir les valeurs dans .env.local"
fi

# Vérifier Supabase CLI
step "4. Vérification Supabase CLI"

if command -v supabase &> /dev/null; then
    SUPABASE_VERSION=$(supabase --version)
    success "Supabase CLI installé : $SUPABASE_VERSION"
else
    warning "Supabase CLI n'est pas installé."
    echo "Pour l'installer : npm install supabase --save-dev"
    echo "Ou globalement : npm install -g supabase"
fi

# Vérifier GitHub CLI
step "5. Vérification GitHub CLI"

if command -v gh &> /dev/null; then
    GH_VERSION=$(gh --version | head -n 1)
    success "GitHub CLI installé : $GH_VERSION"
    
    # Vérifier l'authentification
    if gh auth status &> /dev/null; then
        success "GitHub CLI authentifié !"
    else
        warning "GitHub CLI non authentifié."
        echo "Pour vous authentifier : gh auth login --web"
    fi
else
    warning "GitHub CLI n'est pas installé."
    echo "Pour l'installer : https://cli.github.com/"
fi

# Résumé
step "📋 Résumé de la configuration"

echo "État de l'installation :"
echo ""
echo "✅ Dépendances npm     : Installées"
echo "✅ Fichier .env.local  : $([ -f ".env.local" ] && echo "Créé" || echo "Absent")"
echo "$(command -v supabase &> /dev/null && echo "✅" || echo "⚠️ ") Supabase CLI      : $(command -v supabase &> /dev/null && echo "Installé" || echo "Non installé")"
echo "$(command -v gh &> /dev/null && echo "✅" || echo "⚠️ ") GitHub CLI        : $(command -v gh &> /dev/null && echo "Installé" || echo "Non installé")"

# Instructions finales
step "🎯 Prochaines étapes"

echo "1. 📝 Complétez le fichier .env.local avec vos clés :"
echo "   - Créez un projet Supabase : https://supabase.com"
echo "   - Obtenez une clé Riot API : https://developer.riotgames.com/"
echo "   - (Optionnel) Redis : https://upstash.com"
echo ""
echo "2. 🗄️  Exécutez les migrations SQL dans Supabase :"
echo "   - Allez dans SQL Editor"
echo "   - Exécutez tous les fichiers .sql dans supabase/migrations/"
echo ""
echo "3. 🚀 Lancez l'application :"
echo "   npm run dev"
echo ""
echo "4. 🌐 Ouvrez votre navigateur :"
echo "   http://localhost:8080"
echo ""

success "Setup terminé !"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📚 Documentation complète : QUICK_START.md${NC}"
echo -e "${BLUE}⚡ Master Your Q. Master Your Win.${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# 🎮 QSPELL - Plateforme League of Legends Amateur

**⚡ Master Your Q. Master Your Win. ⚡**

Plateforme communautaire pour joueurs League of Legends permettant de participer à des tournois amateurs, rejoindre des ligues, suivre des formations coaching, trouver des coéquipiers et partager son profil avec statistiques détaillées.

---

## 🌟 Pourquoi "QSPELL" ?

**Q** = Première compétence dans League of Legends (touche Q)  
**SPELL** = Sort/Magie (vocabulaire LoL)  

🎯 **Identité forte** : Tout joueur LoL comprend immédiatement  
⚡ **Court & mémorable** : 6 lettres, facile à retenir  
🌍 **International** : Fonctionne en FR et EN  
🎨 **Brandable** : Logo évident (touche Q + effet magique)

**Tagline** : "Master Your Q. Master Your Win."

---

## 🚀 Technologies

- **Next.js 14+** (App Router, TypeScript)
- **React 18** avec Server Components
- **TailwindCSS** + **shadcn/ui**
- **Supabase** (PostgreSQL, Auth, Realtime, Storage)
- **Riot Games API** - Données officielles LoL
- **Upstash Redis** - Cache API Riot + leaderboards
- **Tanstack Query** pour data fetching
- **Zustand** pour state management

---

## 📦 Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd qspell
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration rapide (10 minutes)

📚 **Voir `QUICK_START.md` pour le guide complet**

**En résumé** :
1. **Supabase** : Créer projet + exécuter SQL + récupérer clés
2. **Riot API** : Obtenir Personal API Key (ne expire jamais)
3. **Redis** (optionnel) : Créer base Upstash
4. Créer `.env.local` avec vos clés

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Riot Games API
RIOT_API_KEY=RGAPI-your-personal-key

# Upstash Redis (optionnel)
UPSTASH_REDIS_URL=your-redis-url
UPSTASH_REDIS_TOKEN=your-redis-token

# App
NEXT_PUBLIC_APP_URL=http://localhost:8080
```

### 4. Lancer le serveur

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:8080** [[memory:6770529]]

---

## 🎯 Features

### ✅ Implémenté (MVP)

- ✅ **Authentification** : Inscription, connexion, profils
- ✅ **Profils LoL** : Lien compte Riot, stats ranked (Solo/Duo, Flex)
- ✅ **Tournois** : Création, liste, inscription
- ✅ **API Riot** : ACCOUNT-V1, SUMMONER-V4, LEAGUE-V4, MATCH-V5
- ✅ **Cache Redis** : Performance optimisée
- ✅ **Dashboard** : Navigation complète

### 🚧 En développement

- ⏳ Page détails tournoi avec bracket viewer
- ⏳ Système d'équipes (création, invitations, roster)
- ⏳ Match reporting & validation
- ⏳ Ligues saisonnières
- ⏳ LFG (Looking For Group)
- ⏳ Feed social & posts
- ⏳ Coaching & formations

---

## 📁 Structure du projet

```
qspell/
├── src/
│   ├── app/                     # Pages Next.js
│   │   ├── (auth)/             # Login, Register
│   │   ├── (dashboard)/        # Dashboard et pages protégées
│   │   ├── api/                # API Routes
│   │   └── page.tsx            # Page d'accueil QSPELL
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── auth/               # Formulaires auth
│   │   ├── profile/            # Composants profil
│   │   ├── tournament/         # Composants tournois
│   │   └── shared/             # Navigation, etc.
│   └── lib/
│       ├── supabase/           # Client Supabase
│       ├── riot-api/           # Client Riot API
│       ├── redis/              # Cache Redis
│       └── types/              # Types TypeScript
├── supabase/
│   └── migrations/             # Schéma SQL complet
├── public/
├── QSPELL_BRAND.md             # 🎨 Brand identity
├── QUICK_START.md              # ⚡ Configuration rapide
├── OBTENIR_CLE_RIOT.md         # 🔑 Guide clé Riot
└── README.md                   # Ce fichier
```

---

## 🎨 Brand Identity

### Couleurs QSPELL
```css
/* Primary - Purple Magic */
--qspell-purple: #8B5CF6;

/* Secondary - Electric Blue (Q keybind) */
--qspell-blue: #3B82F6;

/* Accent - Gold (Rewards) */
--qspell-gold: #F59E0B;
```

### Personnalité de marque
- **Compétitif** mais **accessible**
- **Skill-based** : Valorise la maîtrise technique
- **Communautaire** : "Q Gods", "Q Masters"
- **Récompensant** : Chaque Q peut changer le match

📚 **Guide complet** : `QSPELL_BRAND.md`

---

## 🛠 Scripts disponibles

```bash
# Développement
npm run dev                      # Lancer l'app (port 8080)

# Build
npm run build                    # Build de production
npm start                        # Démarrer en production

# Supabase
npm run supabase:push           # Appliquer migrations
npm run supabase:types          # Générer types TypeScript

# Linter
npm run lint
```

---

## 📖 Documentation

### Configuration
- 📋 **QUICK_START.md** - Configuration en 10 minutes
- 🔑 **OBTENIR_CLE_RIOT.md** - Guide clé Riot API Personal
- 📊 **SUPABASE_CLI.md** - Commandes Supabase
- 📖 **SETUP.md** - Setup détaillé complet

### Technique
- 🎮 **RIOT_API.md** - APIs Riot utilisées
- 🎨 **QSPELL_BRAND.md** - Brand identity complète
- 📈 **STATUS.md** - État du projet
- 📝 **RESUME_CONFIG.md** - Récapitulatif configuration

---

## 🎯 Fonctionnalités principales

### 🏆 Q Arena (Tournois)
Créez ou participez à des tournois communautaires :
- Formats : Simple/Double élimination, Round Robin, Swiss
- Restrictions de rang (Bronze → Challenger)
- Prize pools
- Brackets automatiques

### 📊 Q Stats (Profils)
Profils avec statistiques Riot Games en temps réel :
- Rank Solo/Duo et Flex
- Winrate, LP, KDA
- Champion mastery
- Historique de matchs

### 🏅 Q League (Ligues)
Ligues saisonnières avec :
- Classements
- Promotion/Relégation
- Système de points
- Calendrier de matchs

### 👥 Q Squad (Équipes)
Trouvez vos coéquipiers :
- Création d'équipes
- Recherche de joueurs (LFG)
- Matchmaking intelligent
- Team roster

### 🎓 Q Academy (Coaching)
Progressez avec :
- Formations vidéo
- Coaching 1-to-1
- Guides par champion/rôle
- Certifications

---

## 🔐 Sécurité

- Row Level Security (RLS) sur Supabase
- Authentification sécurisée
- API Keys protégées côté serveur
- Rate limiting sur API routes
- Validation Zod

---

## 🌐 Domaines

### Recommandés
- **qspell.gg** ⭐ (Standard LoL community)
- **qspell.fr** 🇫🇷 (Marché francophone)
- **qspell.io** (Alternative tech)

### Réseaux sociaux
- Twitter/X : @qspell
- Instagram : @qspell
- Discord : qspell
- TikTok : @qspell
- Twitch : qspell

---

## 🤝 Contribution

Le projet est en développement actif. Les contributions sont bienvenues !

---

## 📝 License

MIT

---

## 🎮 Disclaimer

**QSPELL** n'est pas affilié à Riot Games. League of Legends et Riot Games sont des marques déposées ou des marques de service de Riot Games, Inc.

---

<div align="center">

**⚡ QSPELL - Where Every Q Counts ⚡**

*Master Your Q. Master Your Win.*

Made with 💜 for the LoL community

</div>

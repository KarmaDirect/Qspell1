// Récapitulatif des dates dans le système QSPELL

## 📅 Calendrier Unifié

Toutes les dates sont automatiquement synchronisées dans le calendrier principal accessible sur :
- Landing page (section calendrier)
- Dashboard utilisateur (/dashboard)
- Dashboard admin (/dashboard/admin)

---

## 🔗 Sources de dates synchronisées

### 1. **Tournois** (Jaune 🎮)
- **Date de début** : `tournaments.start_date`
- **Fin des inscriptions** : `tournaments.registration_end`
- Visible quand `status` = 'upcoming', 'registration_open', 'in_progress'
- 2 événements par tournoi :
  - "📝 [Nom] - Fin inscriptions" (date de fin d'inscription)
  - "🎮 [Nom] - Début" (date de début du tournoi)

### 2. **Coaching Groupe** (Bleu 👥)
- **Date de session** : `group_coaching_sessions.scheduled_at`
- Durée : `group_coaching_sessions.duration_minutes`
- Visible quand `status` = 'scheduled', 'in_progress'
- Affiche la lane concernée

### 3. **Événements personnalisés** (Violet/Vert ✨)
- **Date début** : `calendar_events.start_date`
- **Date fin** : `calendar_events.end_date` (optionnel)
- Types : 'event', 'custom'
- Créés depuis l'admin

---

## 🎨 Code couleur

| Type | Couleur | Badge | Icône |
|------|---------|-------|-------|
| Coaching Groupe | Bleu | `bg-blue-500` | 👥 Users |
| Tournoi | Jaune foncé | `bg-yellow-600` | 🏆 Trophy |
| Événement | Violet | `bg-purple-500` | ✨ Sparkles |
| Personnalisé | Vert | `bg-green-500` | ✨ Sparkles |

---

## 📍 Où créer les dates ?

### Admin peut créer :
1. **Tournois** → `/dashboard/admin/tournaments` → Créer un tournoi
   - Champs : start_date, registration_end
   - Format : datetime-local (navigateur)

2. **Coaching Groupe** → `/dashboard/admin/coaching/group`
   - Champ : scheduled_at
   - Format : datetime-local

3. **Événements** → `/dashboard/admin/calendar`
   - Champs : start_date, end_date (optionnel)
   - Format : datetime-local

---

## 🔄 Synchronisation automatique

L'API `/api/events` :
- Récupère toutes les dates entre `startDate` et `endDate`
- Fusionne les 3 sources (tournois, coaching, événements)
- Trie par date
- Retourne un tableau unifié

Le calendrier :
- Appelle l'API chaque fois qu'on change de mois
- Affiche tous les événements sur les bonnes dates
- Code couleur automatique selon le type
- Détails au clic sur une date

---

## 📝 Format de date

**Input (formulaires)** :
```html
<input type="datetime-local" />
```
Format : `YYYY-MM-DDTHH:mm` (ISO 8601)
Exemple : `2024-12-25T14:30`

**Output (affichage)** :
- Français : `25 décembre 2024, 14:30`
- API : ISO 8601 avec timezone

---

## ✅ Avantages

1. **Une seule source de vérité** : tous les événements au même endroit
2. **Sync automatique** : aucune manipulation manuelle
3. **Visuel unifié** : même design partout
4. **Admin centralisé** : créer depuis plusieurs endroits, voir au même endroit
5. **User-friendly** : utilisateurs voient tout sur un calendrier

---

**Date de dernière mise à jour** : 7 décembre 2024


# 🔥 MIGRATION À APPLIQUER MANUELLEMENT

## Instructions

1. **Allez sur** : https://supabase.com/dashboard/project/ymqikotvwrebrkwcawnw/sql/new
2. **Copiez-collez** le SQL ci-dessous
3. **Cliquez** sur "Run" pour exécuter

---

## SQL à exécuter

```sql
-- Add team_invitations table for invitation system
CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  inviter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  invitee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'player',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  UNIQUE(team_id, invitee_id, status)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_team_invitations_invitee ON team_invitations(invitee_id, status);
CREATE INDEX IF NOT EXISTS idx_team_invitations_team ON team_invitations(team_id, status);

-- RLS policies for team_invitations
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- Inviters can see invitations they sent
CREATE POLICY "Users can see invitations they sent"
  ON team_invitations FOR SELECT
  USING (auth.uid() = inviter_id);

-- Invitees can see invitations they received
CREATE POLICY "Users can see invitations they received"
  ON team_invitations FOR SELECT
  USING (auth.uid() = invitee_id);

-- Team captains can create invitations
CREATE POLICY "Team captains can create invitations"
  ON team_invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = team_invitations.team_id
      AND teams.captain_id = auth.uid()
    )
  );

-- Invitees can update their own invitations (accept/decline)
CREATE POLICY "Invitees can respond to invitations"
  ON team_invitations FOR UPDATE
  USING (auth.uid() = invitee_id);
```

---

## Vérification

Après l'exécution, vérifiez que la table existe :

```sql
SELECT * FROM team_invitations LIMIT 1;
```

Si aucune erreur → **C'est bon ! ✅**


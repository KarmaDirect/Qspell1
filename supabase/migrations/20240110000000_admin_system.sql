-- Admin System: Roles and Permissions

-- Drop existing role constraint if exists
DO $$ 
BEGIN
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add role column to profiles if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
END $$;

-- Add new constraint with ceo included
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin', 'ceo'));

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Admin actions log
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id) NOT NULL,
  action_type TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_actions_admin ON admin_actions(admin_id, created_at DESC);

-- Calendar events table (for custom events)
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT DEFAULT 'event' CHECK (event_type IN ('coaching_group', 'tournament', 'event', 'custom')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  lane TEXT,
  created_by UUID REFERENCES profiles(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_dates ON calendar_events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(event_type);

-- RLS Policies for admin
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Admin actions: only admins can view
CREATE POLICY "Admins can view admin actions"
  ON admin_actions FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'ceo'))
  );

CREATE POLICY "Admins can insert admin actions"
  ON admin_actions FOR INSERT
  WITH CHECK (
    auth.uid() = admin_id AND 
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'ceo'))
  );

-- Calendar events: everyone can view, only admins can modify
CREATE POLICY "Everyone can view calendar events"
  ON calendar_events FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert calendar events"
  ON calendar_events FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'ceo'))
  );

CREATE POLICY "Admins can update calendar events"
  ON calendar_events FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'ceo'))
  );

CREATE POLICY "Admins can delete calendar events"
  ON calendar_events FOR DELETE
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'ceo'))
  );

-- Update tournaments: admins can create/update/delete
DROP POLICY IF EXISTS "Users can create tournaments" ON tournaments;
CREATE POLICY "Anyone authenticated can create tournaments"
  ON tournaments FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Admins can update any tournament"
  ON tournaments FOR UPDATE
  USING (
    auth.uid() = organizer_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'ceo'))
  );

CREATE POLICY "Admins can delete any tournament"
  ON tournaments FOR DELETE
  USING (
    auth.uid() = organizer_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'ceo'))
  );

-- Set CEO role for hatim.moro.2002@gmail.com
UPDATE profiles 
SET role = 'ceo' 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'hatim.moro.2002@gmail.com'
);

COMMENT ON TABLE admin_actions IS 'Log des actions administratives';
COMMENT ON TABLE calendar_events IS 'Événements personnalisés du calendrier';
COMMENT ON COLUMN profiles.role IS 'Rôle utilisateur: user, admin, ceo';


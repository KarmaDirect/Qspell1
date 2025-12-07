-- Migration: Add social media links, role system and profile improvements
-- Version: 20240108000000

-- Add social media links and role to profiles
ALTER TABLE profiles 
ADD COLUMN discord_username TEXT,
ADD COLUMN youtube_url TEXT,
ADD COLUMN twitch_url TEXT,
ADD COLUMN twitter_url TEXT,
ADD COLUMN instagram_url TEXT,
ADD COLUMN tiktok_url TEXT,
ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
ADD COLUMN is_banned BOOLEAN DEFAULT false,
ADD COLUMN ban_reason TEXT,
ADD COLUMN banned_until TIMESTAMPTZ,
ADD COLUMN last_seen TIMESTAMPTZ DEFAULT NOW();

-- Comments for better documentation
COMMENT ON COLUMN profiles.discord_username IS 'Discord username (e.g., username#1234)';
COMMENT ON COLUMN profiles.youtube_url IS 'YouTube channel URL';
COMMENT ON COLUMN profiles.twitch_url IS 'Twitch channel URL';
COMMENT ON COLUMN profiles.twitter_url IS 'Twitter/X profile URL';
COMMENT ON COLUMN profiles.instagram_url IS 'Instagram profile URL';
COMMENT ON COLUMN profiles.tiktok_url IS 'TikTok profile URL';
COMMENT ON COLUMN profiles.role IS 'User role: user, admin, or moderator';
COMMENT ON COLUMN profiles.is_banned IS 'Whether the user is currently banned';
COMMENT ON COLUMN profiles.ban_reason IS 'Reason for ban (if banned)';
COMMENT ON COLUMN profiles.banned_until IS 'Ban expiration date (null = permanent ban)';

-- Create admin_actions table for audit log
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  target_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  action_details JSONB,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE admin_actions IS 'Audit log of all admin/moderator actions';
CREATE INDEX idx_admin_actions_admin ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_target ON admin_actions(target_user_id);
CREATE INDEX idx_admin_actions_created ON admin_actions(created_at DESC);

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND role = 'admin'
    AND is_banned = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is moderator or admin
CREATE OR REPLACE FUNCTION is_moderator_or_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND role IN ('admin', 'moderator')
    AND is_banned = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_id UUID,
  p_target_user_id UUID,
  p_action_type TEXT,
  p_action_details JSONB,
  p_reason TEXT
)
RETURNS UUID AS $$
DECLARE
  v_action_id UUID;
BEGIN
  INSERT INTO admin_actions (admin_id, target_user_id, action_type, action_details, reason)
  VALUES (p_admin_id, p_target_user_id, p_action_type, p_action_details, p_reason)
  RETURNING id INTO v_action_id;
  
  RETURN v_action_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for tournaments (only admins can create)
DROP POLICY IF EXISTS "Authenticated users can create tournaments" ON tournaments;

CREATE POLICY "Only admins can create tournaments"
ON tournaments FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Update RLS policy for tournaments update (organizer OR admin can update)
DROP POLICY IF EXISTS "Organizer can update tournament" ON tournaments;

CREATE POLICY "Organizer or admin can update tournament"
ON tournaments FOR UPDATE
USING (auth.uid() = organizer_id OR is_admin(auth.uid()));

-- New policy: Admins can delete tournaments
CREATE POLICY "Admins can delete tournaments"
ON tournaments FOR DELETE
USING (is_admin(auth.uid()));

-- Update profile update policy (users can only update own profile, admins can update any)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (
  auth.uid() = id 
  OR is_admin(auth.uid())
);

-- Policy: Only admins can change roles
CREATE POLICY "Only admins can change user roles"
ON profiles FOR UPDATE
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Admin actions table RLS
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all admin actions"
ON admin_actions FOR SELECT
USING (is_moderator_or_admin(auth.uid()));

CREATE POLICY "Only admins can insert admin actions"
ON admin_actions FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Update leagues RLS (only admins can create leagues)
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leagues viewable by everyone"
ON leagues FOR SELECT
USING (true);

CREATE POLICY "Only admins can create leagues"
ON leagues FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Organizer or admin can update league"
ON leagues FOR UPDATE
USING (auth.uid() = organizer_id OR is_admin(auth.uid()));

CREATE POLICY "Admins can delete leagues"
ON leagues FOR DELETE
USING (is_admin(auth.uid()));

-- Create function to automatically set first user as admin
CREATE OR REPLACE FUNCTION set_first_user_as_admin()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- If this is the first user, make them admin
  IF user_count = 0 THEN
    NEW.role := 'admin';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to make first user admin
CREATE TRIGGER set_first_user_admin
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_first_user_as_admin();

-- Update the handle_new_user function to include role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
  user_role TEXT;
BEGIN
  -- Check if this is the first user
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  -- Set role: first user is admin, others are regular users
  IF user_count = 0 THEN
    user_role := 'admin';
  ELSE
    user_role := 'user';
  END IF;
  
  INSERT INTO public.profiles (id, username, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


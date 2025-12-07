-- Coaching & Formations Schema

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price_monthly DECIMAL(10, 2) NOT NULL,
  price_yearly DECIMAL(10, 2),
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  payment_provider TEXT,
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: one active subscription per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_subscriptions_active_unique 
  ON user_subscriptions(profile_id) 
  WHERE status = 'active';

-- Courses/Formations
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  lane TEXT CHECK (lane IN ('top', 'jungle', 'mid', 'bot', 'support', 'general')),
  thumbnail_url TEXT,
  content_type TEXT DEFAULT 'video' CHECK (content_type IN ('video', 'text', 'interactive')),
  is_premium BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course lessons/chapters
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  content TEXT,
  duration_minutes INTEGER,
  order_index INTEGER DEFAULT 0,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User course progress
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  progress_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, course_id, lesson_id)
);

-- Coaches
CREATE TABLE IF NOT EXISTS coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  hourly_rate DECIMAL(10, 2),
  rating DECIMAL(3, 2) DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add is_active column if table exists without it
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'coaches') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coaches' AND column_name = 'is_active') THEN
      ALTER TABLE coaches ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
  END IF;
END $$;

-- Group coaching sessions (by lane)
CREATE TABLE IF NOT EXISTS group_coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  lane TEXT NOT NULL CHECK (lane IN ('top', 'jungle', 'mid', 'bot', 'support', 'general')),
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  max_participants INTEGER DEFAULT 10,
  price DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  meeting_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group coaching participants
CREATE TABLE IF NOT EXISTS group_coaching_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES group_coaching_sessions(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no_show', 'cancelled')),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, profile_id)
);

-- Private coaching sessions
CREATE TABLE IF NOT EXISTS private_coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  meeting_url TEXT,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_profile ON user_subscriptions(profile_id, status);
CREATE INDEX IF NOT EXISTS idx_courses_lane ON courses(lane, order_index);
CREATE INDEX IF NOT EXISTS idx_user_course_progress ON user_course_progress(profile_id, course_id);
CREATE INDEX IF NOT EXISTS idx_group_coaching_lane ON group_coaching_sessions(lane, scheduled_at, status);
CREATE INDEX IF NOT EXISTS idx_private_coaching_student ON private_coaching_sessions(student_id, status);

-- RLS Policies
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_coaching_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_coaching_sessions ENABLE ROW LEVEL SECURITY;

-- Users can see their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = profile_id);

-- Courses are public (premium check happens in app)
CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Course lessons are viewable by everyone"
  ON course_lessons FOR SELECT
  USING (true);

-- Users can view their own progress
CREATE POLICY "Users can view own progress"
  ON user_course_progress FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update own progress"
  ON user_course_progress FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own progress"
  ON user_course_progress FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Coaches are viewable by everyone (update policy to use is_active if column exists)
DROP POLICY IF EXISTS "Coaches are viewable" ON coaches;

-- Create policy that checks if is_active exists, otherwise show all
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coaches' AND column_name = 'is_active') THEN
    EXECUTE 'CREATE POLICY "Coaches are viewable" ON coaches FOR SELECT USING (is_active = true)';
  ELSE
    EXECUTE 'CREATE POLICY "Coaches are viewable" ON coaches FOR SELECT USING (true)';
  END IF;
END $$;

-- Group sessions are viewable
CREATE POLICY "Group sessions are viewable"
  ON group_coaching_sessions FOR SELECT
  USING (true);

-- Users can see their group session registrations
CREATE POLICY "Users can view own group registrations"
  ON group_coaching_participants FOR SELECT
  USING (auth.uid() = profile_id);

-- Users can see their private sessions
CREATE POLICY "Users can view own private sessions"
  ON private_coaching_sessions FOR SELECT
  USING (auth.uid() = student_id OR auth.uid() = (SELECT profile_id FROM coaches WHERE id = coach_id));

-- Insert default subscription plan
INSERT INTO subscription_plans (name, price_monthly, features)
VALUES (
  'QSPELL Premium',
  10.99,
  '["Accès à toutes les formations", "Coaching groupe par lane", "Statistiques avancées"]'::jsonb
)
ON CONFLICT (name) DO NOTHING;

-- Insert default courses
INSERT INTO courses (title, slug, lane, description, is_premium, order_index) VALUES
  ('Maîtrisez la TOP Lane', 'formation-top', 'top', 'Apprenez toutes les mécaniques essentielles pour dominer la top lane', true, 1),
  ('Dominez la JUNGLE', 'formation-jungle', 'jungle', 'Pathing, ganking, objectifs : devenez un jungler redoutable', true, 2),
  ('Formation MID Lane', 'formation-mid', 'mid', 'Wave management, roaming, teamfights pour les midlaners', true, 3),
  ('Formation BOT Lane', 'formation-bot', 'bot', 'Farm, trading, positionnement pour les ADC', true, 4),
  ('Guide SUPPORT', 'formation-support', 'support', 'Warding, engage, peel : le guide complet du support', true, 5),
  ('Formation GÉNÉRALE', 'formation-generale', 'general', 'Macro, vision, teamplay : les fondamentaux du jeu', true, 6)
ON CONFLICT (slug) DO NOTHING;

COMMENT ON TABLE subscription_plans IS 'Plans d''abonnement disponibles';
COMMENT ON TABLE user_subscriptions IS 'Abonnements actifs des utilisateurs';
COMMENT ON TABLE courses IS 'Formations disponibles sur QSPELL';
COMMENT ON TABLE course_lessons IS 'Leçons/vidéos des formations';
COMMENT ON TABLE coaches IS 'Profils des coachs disponibles';


-- Restrict tournament creation to admins only
-- Drop all existing tournament policies
DROP POLICY IF EXISTS "Anyone authenticated can create tournaments" ON tournaments;
DROP POLICY IF EXISTS "Users can create tournaments" ON tournaments;
DROP POLICY IF EXISTS "Only admins can create tournaments" ON tournaments;
DROP POLICY IF EXISTS "Admins can update any tournament" ON tournaments;
DROP POLICY IF EXISTS "Admins can delete any tournament" ON tournaments;
DROP POLICY IF EXISTS "Tournaments are viewable by everyone" ON tournaments;

-- Only admins and CEO can create tournaments
CREATE POLICY "Only admins can create tournaments"
  ON tournaments FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'ceo'))
  );

-- Admins can update any tournament
CREATE POLICY "Admins can update any tournament"
  ON tournaments FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'ceo'))
  );

-- Admins can delete any tournament  
CREATE POLICY "Admins can delete any tournament"
  ON tournaments FOR DELETE
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'ceo'))
  );

-- Everyone can view tournaments
CREATE POLICY "Tournaments are viewable by everyone"
  ON tournaments FOR SELECT
  USING (true);

COMMENT ON POLICY "Only admins can create tournaments" ON tournaments IS 'Seuls les admins et CEO peuvent créer des tournois';


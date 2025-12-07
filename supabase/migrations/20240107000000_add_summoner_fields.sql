-- Add summoner level and profile icon to riot_accounts table
ALTER TABLE riot_accounts 
ADD COLUMN IF NOT EXISTS summoner_level INTEGER,
ADD COLUMN IF NOT EXISTS profile_icon_id INTEGER;

-- Add comment
COMMENT ON COLUMN riot_accounts.summoner_level IS 'Summoner level from Riot API';
COMMENT ON COLUMN riot_accounts.profile_icon_id IS 'Profile icon ID from Riot API';


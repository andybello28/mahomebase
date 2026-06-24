CREATE TABLE IF NOT EXISTS "Session" (
  id TEXT NOT NULL PRIMARY KEY,
  sid TEXT NOT NULL UNIQUE,
  data TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX IF NOT EXISTS "Session_expiresAt_idx" ON "Session"("expiresAt");

CREATE TABLE IF NOT EXISTS "League" (
  id SERIAL PRIMARY KEY,
  league_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  season TEXT NOT NULL,
  rosters INT NOT NULL,
  roster_positions JSONB NOT NULL,
  scoring_settings JSONB NOT NULL,
  roster_data JSONB NOT NULL,
  transactions JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_linked INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "Player" (
  player_id TEXT NOT NULL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  search_full_name TEXT,
  team TEXT,
  position TEXT,
  fantasy_positions TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  age INT,
  status TEXT,
  college TEXT,
  years_exp INT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  projection TEXT,
  stats JSONB,
  headshot TEXT
);
CREATE INDEX IF NOT EXISTS "Player_team_position_idx" ON "Player"(team, position);
CREATE INDEX IF NOT EXISTS "Player_position_idx" ON "Player"(position);
CREATE INDEX IF NOT EXISTS "Player_search_full_name_idx" ON "Player"(search_full_name);
CREATE INDEX IF NOT EXISTS "Player_status_idx" ON "Player"(status);

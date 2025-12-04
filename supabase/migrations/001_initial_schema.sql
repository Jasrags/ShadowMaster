-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE player_role AS ENUM ('player', 'gamemaster', 'administrator');
CREATE TYPE session_status AS ENUM ('planned', 'active', 'completed');
CREATE TYPE character_state AS ENUM ('creation', 'advancement');

-- Create users_profile table (extends Supabase auth.users)
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  gm_user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE RESTRICT,
  setting TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create campaign_players table (many-to-many relationship)
CREATE TABLE campaign_players (
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  role player_role NOT NULL DEFAULT 'player',
  PRIMARY KEY (campaign_id, user_id)
);

-- Create characters table
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  player_user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  character_data JSONB NOT NULL DEFAULT '{}',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT,
  scheduled_date TIMESTAMPTZ,
  status session_status NOT NULL DEFAULT 'planned',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create game_state table
CREATE TABLE game_state (
  session_id UUID PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
  initiative_order JSONB DEFAULT '[]',
  active_effects JSONB DEFAULT '[]',
  map_state JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create maps table
CREATE TABLE maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT,
  grid_size INTEGER,
  width INTEGER,
  height INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_profile_updated_at
  BEFORE UPDATE ON users_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_state_updated_at
  BEFORE UPDATE ON game_state
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE maps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users_profile
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users_profile FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for campaigns
-- GMs can read their own campaigns
CREATE POLICY "GMs can read own campaigns"
  ON campaigns FOR SELECT
  USING (auth.uid() = gm_user_id);

-- Players can read campaigns they're in
CREATE POLICY "Players can read campaigns they're in"
  ON campaigns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaign_players
      WHERE campaign_players.campaign_id = campaigns.id
      AND campaign_players.user_id = auth.uid()
    )
  );

-- GMs can insert their own campaigns
CREATE POLICY "GMs can insert own campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = gm_user_id);

-- GMs can update their own campaigns
CREATE POLICY "GMs can update own campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() = gm_user_id);

-- GMs can delete their own campaigns
CREATE POLICY "GMs can delete own campaigns"
  ON campaigns FOR DELETE
  USING (auth.uid() = gm_user_id);

-- RLS Policies for campaign_players
-- Campaign members can read campaign_players for their campaigns
CREATE POLICY "Campaign members can read campaign_players"
  ON campaign_players FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_players.campaign_id
      AND (
        campaigns.gm_user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM campaign_players cp
          WHERE cp.campaign_id = campaign_players.campaign_id
          AND cp.user_id = auth.uid()
        )
      )
    )
  );

-- GMs can insert campaign_players
CREATE POLICY "GMs can insert campaign_players"
  ON campaign_players FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_players.campaign_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- GMs can update campaign_players
CREATE POLICY "GMs can update campaign_players"
  ON campaign_players FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_players.campaign_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- GMs can delete campaign_players
CREATE POLICY "GMs can delete campaign_players"
  ON campaign_players FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_players.campaign_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- RLS Policies for characters
-- Campaign members can read characters in their campaigns
CREATE POLICY "Campaign members can read characters"
  ON characters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = characters.campaign_id
      AND (
        campaigns.gm_user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM campaign_players
          WHERE campaign_players.campaign_id = characters.campaign_id
          AND campaign_players.user_id = auth.uid()
        )
      )
    )
  );

-- Character owners and GMs can insert characters
CREATE POLICY "Owners and GMs can insert characters"
  ON characters FOR INSERT
  WITH CHECK (
    auth.uid() = player_user_id
    OR EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = characters.campaign_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- Character owners and GMs can update characters
CREATE POLICY "Owners and GMs can update characters"
  ON characters FOR UPDATE
  USING (
    auth.uid() = player_user_id
    OR EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = characters.campaign_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- Character owners and GMs can delete characters
CREATE POLICY "Owners and GMs can delete characters"
  ON characters FOR DELETE
  USING (
    auth.uid() = player_user_id
    OR EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = characters.campaign_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- RLS Policies for sessions
-- Campaign members can read sessions
CREATE POLICY "Campaign members can read sessions"
  ON sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = sessions.campaign_id
      AND (
        campaigns.gm_user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM campaign_players
          WHERE campaign_players.campaign_id = sessions.campaign_id
          AND campaign_players.user_id = auth.uid()
        )
      )
    )
  );

-- GMs can insert sessions
CREATE POLICY "GMs can insert sessions"
  ON sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = sessions.campaign_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- GMs can update sessions
CREATE POLICY "GMs can update sessions"
  ON sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = sessions.campaign_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- GMs can delete sessions
CREATE POLICY "GMs can delete sessions"
  ON sessions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = sessions.campaign_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- RLS Policies for game_state
-- Campaign members can read game_state
CREATE POLICY "Campaign members can read game_state"
  ON game_state FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      JOIN campaigns ON campaigns.id = sessions.campaign_id
      WHERE sessions.id = game_state.session_id
      AND (
        campaigns.gm_user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM campaign_players
          WHERE campaign_players.campaign_id = sessions.campaign_id
          AND campaign_players.user_id = auth.uid()
        )
      )
    )
  );

-- Only GMs can update game_state
CREATE POLICY "Only GMs can update game_state"
  ON game_state FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      JOIN campaigns ON campaigns.id = sessions.campaign_id
      WHERE sessions.id = game_state.session_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- Only GMs can insert game_state
CREATE POLICY "Only GMs can insert game_state"
  ON game_state FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      JOIN campaigns ON campaigns.id = sessions.campaign_id
      WHERE sessions.id = game_state.session_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- RLS Policies for maps
-- Campaign members can read maps
CREATE POLICY "Campaign members can read maps"
  ON maps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = maps.campaign_id
      AND (
        campaigns.gm_user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM campaign_players
          WHERE campaign_players.campaign_id = maps.campaign_id
          AND campaign_players.user_id = auth.uid()
        )
      )
    )
  );

-- GMs can insert maps
CREATE POLICY "GMs can insert maps"
  ON maps FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = maps.campaign_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- GMs can update maps
CREATE POLICY "GMs can update maps"
  ON maps FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = maps.campaign_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- GMs can delete maps
CREATE POLICY "GMs can delete maps"
  ON maps FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = maps.campaign_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_campaigns_gm_user_id ON campaigns(gm_user_id);
CREATE INDEX idx_characters_campaign_id ON characters(campaign_id);
CREATE INDEX idx_characters_player_user_id ON characters(player_user_id);
CREATE INDEX idx_sessions_campaign_id ON sessions(campaign_id);
CREATE INDEX idx_maps_campaign_id ON maps(campaign_id);
CREATE INDEX idx_campaign_players_campaign_id ON campaign_players(campaign_id);
CREATE INDEX idx_campaign_players_user_id ON campaign_players(user_id);


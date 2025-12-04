-- Fix RLS policies to avoid infinite recursion
-- 
-- PROBLEM IDENTIFIED:
-- 1. The "Campaign members can read campaign_players" policy (line 175-190) was recursively
--    checking campaign_players within itself (lines 184-187), creating infinite recursion
-- 2. The "Campaign members can read characters" policy (line 227-242) checks campaign_players,
--    which triggers the recursive policy above
--
-- SOLUTION:
-- 1. Fix campaign_players policy to be non-recursive
-- 2. Create a SECURITY DEFINER helper function to check campaign membership without RLS
-- 3. Use this helper function in the characters policy to avoid recursion

-- Drop the problematic policies
DROP POLICY IF EXISTS "Campaign members can read campaign_players" ON campaign_players;
DROP POLICY IF EXISTS "Campaign members can read characters" ON characters;

-- Create a helper function to check campaign membership without triggering RLS recursion
-- SECURITY DEFINER allows the function to bypass RLS policies
CREATE OR REPLACE FUNCTION check_campaign_membership(p_campaign_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is a member of the campaign
  -- This bypasses RLS policies due to SECURITY DEFINER
  RETURN EXISTS (
    SELECT 1 FROM campaign_players
    WHERE campaign_id = p_campaign_id
    AND user_id = p_user_id
  );
END;
$$;

-- Fix campaign_players SELECT policy - completely non-recursive
-- Users can see their own membership records OR if they're the GM of the campaign
CREATE POLICY "Campaign members can read campaign_players"
  ON campaign_players FOR SELECT
  USING (
    -- User can see their own membership (direct check, no recursion)
    user_id = auth.uid()
    OR
    -- User is the GM of the campaign (direct check on campaigns, no recursion)
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_players.campaign_id
      AND campaigns.gm_user_id = auth.uid()
    )
  );

-- Fix characters SELECT policy - use helper function to avoid recursion
CREATE POLICY "Campaign members can read characters"
  ON characters FOR SELECT
  USING (
    -- Character owner can always read their own characters (direct check, no recursion)
    player_user_id = auth.uid()
    OR
    -- GM can read characters in their campaigns (direct check, no recursion)
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = characters.campaign_id
      AND campaigns.gm_user_id = auth.uid()
    )
    OR
    -- Campaign members can read characters using helper function (bypasses RLS recursion)
    check_campaign_membership(characters.campaign_id, auth.uid())
  );


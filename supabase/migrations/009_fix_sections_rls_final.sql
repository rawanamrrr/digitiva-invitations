-- Migration: Fix RLS for guest invitation sections
-- This migration ensures that anonymous users can save sections for invitations they just created.

-- 1. Ensure RLS is enabled
ALTER TABLE invitation_sections ENABLE ROW LEVEL SECURITY;

-- 2. Allow anonymous users to INSERT sections
DROP POLICY IF EXISTS "Allow anon to insert invitation sections" ON invitation_sections;
CREATE POLICY "Allow anon to insert invitation sections"
  ON invitation_sections
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 3. Allow anonymous users to UPDATE sections
DROP POLICY IF EXISTS "Allow anon to update invitation sections" ON invitation_sections;
CREATE POLICY "Allow anon to update invitation sections"
  ON invitation_sections
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- 4. Allow anonymous and authenticated users to SELECT sections
DROP POLICY IF EXISTS "Allow anon to select invitation sections" ON invitation_sections;
CREATE POLICY "Allow anon to select invitation sections"
  ON invitation_sections
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- 5. Ensure service_role always has access
DROP POLICY IF EXISTS "Service role has full access to invitation_sections" ON invitation_sections;
CREATE POLICY "Service role has full access to invitation_sections"
  ON invitation_sections
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. Comments
COMMENT ON POLICY "Allow anon to insert invitation sections" ON invitation_sections IS 
  'Allows guest users to create sections for their invitations using the secret UUID';
COMMENT ON POLICY "Allow anon to update invitation sections" ON invitation_sections IS 
  'Allows guest users to modify sections for their invitations using the secret UUID';

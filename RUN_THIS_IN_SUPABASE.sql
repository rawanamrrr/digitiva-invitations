-- ============================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- ============================================
-- This fixes the RLS policy error for invitation_sections

-- Enable Row Level Security
ALTER TABLE invitation_sections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role has full access to invitation_sections" ON invitation_sections;
DROP POLICY IF EXISTS "Users can read their own invitation sections" ON invitation_sections;
DROP POLICY IF EXISTS "Users can insert sections for their own invitations" ON invitation_sections;
DROP POLICY IF EXISTS "Users can update their own invitation sections" ON invitation_sections;
DROP POLICY IF EXISTS "Users can delete their own invitation sections" ON invitation_sections;
DROP POLICY IF EXISTS "Public can read sections for published invitations" ON invitation_sections;

-- Create new policies

-- 1. Service role (API routes) has full access
CREATE POLICY "Service role has full access to invitation_sections"
  ON invitation_sections
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2. Authenticated users can read their own sections
CREATE POLICY "Users can read their own invitation sections"
  ON invitation_sections
  FOR SELECT
  TO authenticated
  USING (
    invitation_id IN (
      SELECT id FROM invitations WHERE user_id = auth.uid()
    )
  );

-- 3. Authenticated users can insert sections for their invitations
CREATE POLICY "Users can insert sections for their own invitations"
  ON invitation_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (
    invitation_id IN (
      SELECT id FROM invitations WHERE user_id = auth.uid()
    )
  );

-- 4. Authenticated users can update their sections
CREATE POLICY "Users can update their own invitation sections"
  ON invitation_sections
  FOR UPDATE
  TO authenticated
  USING (
    invitation_id IN (
      SELECT id FROM invitations WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    invitation_id IN (
      SELECT id FROM invitations WHERE user_id = auth.uid()
    )
  );

-- 5. Authenticated users can delete their sections
CREATE POLICY "Users can delete their own invitation sections"
  ON invitation_sections
  FOR DELETE
  TO authenticated
  USING (
    invitation_id IN (
      SELECT id FROM invitations WHERE user_id = auth.uid()
    )
  );

-- 6. Public can read sections for published invitations
CREATE POLICY "Public can read sections for published invitations"
  ON invitation_sections
  FOR SELECT
  TO anon
  USING (
    invitation_id IN (
      SELECT id FROM invitations WHERE is_published = true
    )
  );

-- Verify policies were created
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'invitation_sections';

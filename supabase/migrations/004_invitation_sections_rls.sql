-- Migration: Add RLS policies for invitation_sections table
-- This fixes the "row-level security policy" error when saving section details

-- Enable Row Level Security (if not already enabled)
ALTER TABLE invitation_sections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Service role has full access to invitation_sections" ON invitation_sections;
DROP POLICY IF EXISTS "Users can read their own invitation sections" ON invitation_sections;
DROP POLICY IF EXISTS "Users can insert sections for their own invitations" ON invitation_sections;
DROP POLICY IF EXISTS "Users can update their own invitation sections" ON invitation_sections;
DROP POLICY IF EXISTS "Users can delete their own invitation sections" ON invitation_sections;
DROP POLICY IF EXISTS "Public can read sections for published invitations" ON invitation_sections;

-- RLS Policies for invitation_sections

-- 1. Allow service role (admin/server) full access
CREATE POLICY "Service role has full access to invitation_sections"
  ON invitation_sections
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2. Allow authenticated users to read their own invitation sections
CREATE POLICY "Users can read their own invitation sections"
  ON invitation_sections
  FOR SELECT
  TO authenticated
  USING (
    invitation_id IN (
      SELECT id FROM invitations WHERE user_id = auth.uid()
    )
  );

-- 3. Allow authenticated users to insert sections for their own invitations
CREATE POLICY "Users can insert sections for their own invitations"
  ON invitation_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (
    invitation_id IN (
      SELECT id FROM invitations WHERE user_id = auth.uid()
    )
  );

-- 4. Allow authenticated users to update their own invitation sections
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

-- 5. Allow authenticated users to delete their own invitation sections
CREATE POLICY "Users can delete their own invitation sections"
  ON invitation_sections
  FOR DELETE
  TO authenticated
  USING (
    invitation_id IN (
      SELECT id FROM invitations WHERE user_id = auth.uid()
    )
  );

-- 6. Allow public read access to sections for published invitations
CREATE POLICY "Public can read sections for published invitations"
  ON invitation_sections
  FOR SELECT
  TO anon
  USING (
    invitation_id IN (
      SELECT id FROM invitations WHERE is_published = true
    )
  );

-- Comments
COMMENT ON POLICY "Service role has full access to invitation_sections" ON invitation_sections IS 
  'Allows server-side operations (API routes) to manage all invitation sections';

COMMENT ON POLICY "Users can read their own invitation sections" ON invitation_sections IS 
  'Allows authenticated users to view sections for their own invitations';

COMMENT ON POLICY "Users can insert sections for their own invitations" ON invitation_sections IS 
  'Allows authenticated users to create sections for their own invitations';

COMMENT ON POLICY "Public can read sections for published invitations" ON invitation_sections IS 
  'Allows anyone to view sections for published invitations (for public invitation pages)';

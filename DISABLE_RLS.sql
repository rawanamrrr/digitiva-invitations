-- ============================================
-- SIMPLE FIX: DISABLE RLS FOR invitation_sections
-- ============================================
-- Run this in Supabase SQL Editor

-- Disable Row Level Security for invitation_sections table
ALTER TABLE invitation_sections DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'invitation_sections';

-- Should show: rowsecurity = false

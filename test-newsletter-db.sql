-- Test script to verify newsletter_subscribers table
-- Run this in Supabase SQL Editor to check everything

-- 1. Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'newsletter_subscribers'
) as table_exists;

-- 2. Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'newsletter_subscribers'
ORDER BY ordinal_position;

-- 3. Check if there's any data
SELECT COUNT(*) as total_subscribers FROM newsletter_subscribers;

-- 4. View all subscribers (if any)
SELECT * FROM newsletter_subscribers ORDER BY created_at DESC;

-- 5. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'newsletter_subscribers';

-- 6. Insert a test record (optional - uncomment to test)
-- INSERT INTO newsletter_subscribers (name, phone) 
-- VALUES ('Test User', '+201234567890');

-- 7. Verify the test record was inserted
-- SELECT * FROM newsletter_subscribers WHERE phone = '+201234567890';

-- Migration: Fix Storage RLS for 'uploads' bucket
-- This allows anonymous users to upload files to the 'uploads' bucket.

-- 1. Ensure the bucket exists (if not already created via UI)
-- Note: You might need to do this manually in the Storage UI if this fails.
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('uploads', 'uploads', true)
-- ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Enable RLS on storage.objects (usually enabled by default)
-- If you get a permission error here, skip this line; RLS is likely already enabled.
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow public to upload files to the 'uploads' bucket
-- We restrict this to the 'uploads' bucket for security.
CREATE POLICY "Allow public to upload files to uploads bucket"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'uploads');

-- 4. Policy: Allow public to read files from the 'uploads' bucket
CREATE POLICY "Allow public to read files from uploads bucket"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'uploads');

-- 5. Policy: Allow service role full access (just in case)
CREATE POLICY "Service role full access to storage"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

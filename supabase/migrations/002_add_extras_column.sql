-- Add extras and package_name columns to the invitations table
-- Run this in your Supabase SQL Editor

ALTER TABLE invitations 
ADD COLUMN IF NOT EXISTS package_name TEXT;

ALTER TABLE invitations 
ADD COLUMN IF NOT EXISTS extras TEXT[] DEFAULT '{}';

-- Optional: If you want to make sure your existing data has a default package
UPDATE invitations SET package_name = 'standard' WHERE package_name IS NULL;

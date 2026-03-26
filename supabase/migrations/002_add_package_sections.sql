-- Add package name and sections configuration to invitations
ALTER TABLE invitations
ADD COLUMN IF NOT EXISTS package_name TEXT,
ADD COLUMN IF NOT EXISTS sections JSONB;


-- Add personal_images column (text array) to invitations table
ALTER TABLE invitations ADD COLUMN personal_images TEXT[];

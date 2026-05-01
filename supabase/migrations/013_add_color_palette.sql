-- Add color palette columns to invitations table
ALTER TABLE invitations 
ADD COLUMN IF NOT EXISTS color_palette_text TEXT,
ADD COLUMN IF NOT EXISTS color_palette_image TEXT;

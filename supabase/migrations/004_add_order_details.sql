-- Add payment & contact fields to invitations
ALTER TABLE invitations
ADD COLUMN IF NOT EXISTS payment_screenshot TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('instapay', 'bank'));

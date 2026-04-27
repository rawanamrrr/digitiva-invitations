-- Newsletter Subscribers Table
-- Stores users who subscribe to the newsletter popup

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  unsubscribed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'popup'
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_phone 
  ON newsletter_subscribers(phone);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at 
  ON newsletter_subscribers(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_is_active 
  ON newsletter_subscribers(is_active);

-- Comments for documentation
COMMENT ON TABLE newsletter_subscribers IS 'Stores newsletter subscribers from popup and other sources';
COMMENT ON COLUMN newsletter_subscribers.name IS 'Subscriber full name';
COMMENT ON COLUMN newsletter_subscribers.phone IS 'Phone number with country code (unique)';
COMMENT ON COLUMN newsletter_subscribers.is_active IS 'Whether subscription is active';
COMMENT ON COLUMN newsletter_subscribers.source IS 'Source of subscription (popup, footer, etc.)';

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert (for newsletter signup)
CREATE POLICY "Allow public to subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Allow authenticated users to read
CREATE POLICY "Allow users to read subscriptions"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- Currency selected when the customer placed the order (ISO-style codes: egp, usd, …)
ALTER TABLE invitations
ADD COLUMN IF NOT EXISTS order_currency TEXT;

COMMENT ON COLUMN invitations.order_currency IS 'Site currency code at order time: egp, usd, eur, aed, iqd, sar, lbp';

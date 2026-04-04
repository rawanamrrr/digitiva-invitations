-- Store order total at order time and allow marking invitations as finished
ALTER TABLE invitations
ADD COLUMN IF NOT EXISTS order_total NUMERIC,
ADD COLUMN IF NOT EXISTS is_finished BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN invitations.order_total IS 'Total price at order time, in order_currency';
COMMENT ON COLUMN invitations.is_finished IS 'Admin marker: invitation delivery/fulfillment finished';

-- Allow Vodafone Cash as a payment method

DO $$
DECLARE
  r RECORD;
BEGIN
  -- Drop any existing payment_method CHECK constraints (name can differ between environments)
  FOR r IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.invitations'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%payment_method%'
  LOOP
    EXECUTE format('ALTER TABLE public.invitations DROP CONSTRAINT IF EXISTS %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE public.invitations
  ADD CONSTRAINT invitations_payment_method_check
  CHECK (payment_method IN ('instapay', 'bank', 'vodafone_cash'));

# Newsletter Subscribers Troubleshooting Guide

## Step 1: Verify Database Table

Run this in **Supabase SQL Editor**:

```sql
-- Drop existing table and recreate with correct structure
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

-- Create the table
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  unsubscribed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'popup'
);

-- Create indexes
CREATE INDEX idx_newsletter_subscribers_phone ON newsletter_subscribers(phone);
CREATE INDEX idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at DESC);
CREATE INDEX idx_newsletter_subscribers_is_active ON newsletter_subscribers(is_active);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public to subscribe"
  ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to read"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert test data
INSERT INTO newsletter_subscribers (name, phone) 
VALUES ('Test User', '+201234567890');

-- Verify
SELECT * FROM newsletter_subscribers;
```

## Step 2: Check if Data is Being Inserted

After running the SQL above, you should see 1 test record.

## Step 3: Test the Newsletter Popup

1. Open your website in an **incognito/private window**
2. Clear localStorage: Open DevTools → Console → Run: `localStorage.clear()`
3. Scroll down 100px
4. Wait 30 seconds
5. The popup should appear
6. Fill in name and phone (use a different number than the test)
7. Click "LET'S CELEBRATE!"
8. Check browser console for any errors

## Step 4: Verify API is Working

Open DevTools → Network tab, then submit the form. Look for:
- Request to `/api/newsletter/subscribe`
- Status should be `200 OK`
- Response should show `{"success":true,"message":"Successfully subscribed to newsletter"}`

## Step 5: Check Database Again

Run in Supabase SQL Editor:

```sql
SELECT * FROM newsletter_subscribers ORDER BY created_at DESC;
```

You should see your test submission.

## Step 6: Check Admin Dashboard

1. Go to `/admin` (make sure you're logged in as admin)
2. Check browser console for logs:
   - "Newsletter fetch error:" (if there's an error)
   - "Newsletter subscribers count:" (should show number)
3. The "Newsletter Subscribers" section should appear at the top

## Step 7: Verify Admin User Role

Run in Supabase SQL Editor:

```sql
-- Check your user's role
SELECT id, email, role FROM users WHERE email = 'YOUR_EMAIL_HERE';

-- If role is not 'admin', update it:
UPDATE users SET role = 'admin' WHERE email = 'YOUR_EMAIL_HERE';
```

## Step 8: Check RLS Policies

The admin user needs to be able to read from newsletter_subscribers. Run:

```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'newsletter_subscribers';

-- If needed, add admin policy
CREATE POLICY "Allow admins full access"
  ON newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

## Common Issues

### Issue 1: "Table doesn't exist"
**Solution**: Run Step 1 SQL to create the table

### Issue 2: "No data showing in dashboard"
**Solution**: 
- Check if data exists in database (Step 5)
- Check browser console for errors (Step 6)
- Verify you're logged in as admin (Step 7)

### Issue 3: "Popup doesn't appear"
**Solution**:
- Clear localStorage
- Make sure you scroll down 100px
- Wait full 30 seconds
- Check if `newsletter_subscribed` is in localStorage

### Issue 4: "Form submits but no data in DB"
**Solution**:
- Check Network tab for API errors
- Check Supabase logs for errors
- Verify RLS policies allow INSERT (Step 8)

### Issue 5: "Permission denied" error
**Solution**: Run the RLS policy commands in Step 8

## Quick Test Command

Run this to insert test data and verify everything works:

```sql
-- Clean slate
TRUNCATE newsletter_subscribers;

-- Insert 3 test records
INSERT INTO newsletter_subscribers (name, phone) VALUES
  ('Ahmed Mohamed', '+201234567890'),
  ('Sarah Ali', '+971501234567'),
  ('John Smith', '+14155551234');

-- Verify
SELECT 
  id,
  name,
  phone,
  created_at,
  is_active
FROM newsletter_subscribers 
ORDER BY created_at DESC;
```

After running this, refresh your admin dashboard. You should see 3 subscribers.

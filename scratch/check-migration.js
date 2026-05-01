const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Manual env parsing
const env = fs.readFileSync('.env.local', 'utf8')
const envVars = {}
env.split('\n').forEach(line => {
  const parts = line.split('=')
  const key = parts[0]
  const value = parts.slice(1).join('=')
  if (key && value) envVars[key.trim()] = value.trim().replace(/^["']|["']$/g, '')
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function applyMigration() {
  console.log('--- Applying Migration: Add small_invitation_image ---')
  
  // Since we can't run raw SQL via supabase-js easily unless we have an RPC
  // We'll just log that the user should run the SQL file in Supabase dashboard
  // Or we can try to use a dummy select to check if the column exists
  
  const { error } = await supabase.from('invitations').select('small_invitation_image').limit(1)
  
  if (error) {
    console.log('Column small_invitation_image does NOT exist yet.')
    console.log('Please run the following SQL in your Supabase SQL Editor:')
    console.log('ALTER TABLE invitations ADD COLUMN small_invitation_image TEXT;')
  } else {
    console.log('Column small_invitation_image ALREADY exists.')
  }
}

applyMigration()

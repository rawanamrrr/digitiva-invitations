const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkData() {
  console.log('Checking invitation_sections...')
  const { data, error } = await supabase.from('invitation_sections').select('*, invitations(bride_name, groom_name)').limit(5)
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Sample data:', JSON.stringify(data, null, 2))
    console.log('Total count:', data.length)
  }
}

checkData()

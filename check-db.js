const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Manual env parsing
const env = fs.readFileSync('.env.local', 'utf8')
const envVars = {}
env.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) envVars[key.trim()] = value.trim()
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkData() {
  console.log('--- Database Check ---')
  
  const { data: count, error: countError } = await supabase.from('invitation_sections').select('id', { count: 'exact' })
  console.log('Total invitation_sections rows:', count?.length || 0)

  const { data: sections, error: secError } = await supabase.from('invitation_sections').select('*, invitations(id, bride_name)').limit(5)
  console.log('Sample sections:', JSON.stringify(sections, null, 2))

  const { data: invs, error: invError } = await supabase.from('invitations').select('id, bride_name').limit(5)
  console.log('Sample invitations:', JSON.stringify(invs, null, 2))
}

checkData()

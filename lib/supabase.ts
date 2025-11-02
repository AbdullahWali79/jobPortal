import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validate environment variables
const isConfigValid = supabaseUrl && supabaseAnonKey && supabaseUrl.length > 0 && supabaseAnonKey.length > 0

if (!isConfigValid) {
  console.error('Missing Supabase environment variables!')
  console.error('Please check your .env.local file has:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('Current values:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? 'Set' : 'Missing'
  })
}

// Create client with validated config (will still create but with empty strings if invalid)
export const supabase = isConfigValid 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('', '') // Fallback to prevent crashes

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => isConfigValid

// For server-side operations that need elevated privileges
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
export const supabaseAdmin = (supabaseUrl && serviceRoleKey)
  ? createClient(supabaseUrl, serviceRoleKey)
  : null


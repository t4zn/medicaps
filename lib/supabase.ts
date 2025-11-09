import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations only
export const supabaseAdmin = (() => {
  // Only create admin client on server-side
  if (typeof window === 'undefined') {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for server-side operations')
    }
    return createClient(supabaseUrl, serviceRoleKey)
  }
  // Return null on client-side - admin operations should only happen on server
  return null
})()
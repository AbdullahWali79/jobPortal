// Supabase Edge Function to auto-expire jobs
// This function should be scheduled to run daily via Supabase Cron

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Find all active jobs that have passed their expiration date
    const now = new Date().toISOString()
    
    const { data: expiredJobs, error: fetchError } = await supabase
      .from('job_posts')
      .select('id')
      .eq('status', 'active')
      .lt('expires_at', now)

    if (fetchError) {
      throw fetchError
    }

    if (!expiredJobs || expiredJobs.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No jobs to expire', count: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Update expired jobs to 'expired' status
    const { error: updateError } = await supabase
      .from('job_posts')
      .update({ status: 'expired' })
      .in('id', expiredJobs.map(job => job.id))

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({
        message: 'Jobs expired successfully',
        count: expiredJobs.length,
        expired_job_ids: expiredJobs.map(job => job.id),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})


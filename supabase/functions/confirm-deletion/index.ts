import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let token
  try {
    const body = await req.json()
    token = body.token
  } catch (_) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token requerido.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const adminClient = createClient(supabaseUrl, serviceKey)

  const { data: deletion, error: lookupError } = await adminClient
    .from('account_deletions')
    .select('*')
    .eq('deletion_token', token)
    .single()

  if (lookupError || !deletion) {
    console.error('Token lookup error:', lookupError)
    return new Response(JSON.stringify({ error: 'Enlace inválido o no encontrado.' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (deletion.fully_deleted) {
    return new Response(JSON.stringify({ error: 'Los datos ya fueron eliminados anteriormente.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (new Date(deletion.token_expires_at) < new Date()) {
    return new Response(JSON.stringify({ error: 'El enlace ha caducado (válido 7 días).' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const userId = deletion.user_id

  await adminClient.from('chat_usage').delete().eq('user_id', userId)
  await adminClient.from('real_bets').delete().eq('user_id', userId)
  await adminClient.from('user_profiles').delete().eq('id', userId)

  await adminClient
    .from('account_deletions')
    .update({
      fully_deleted: true,
      fully_deleted_at: new Date().toISOString(),
      email: '[eliminado]',
    })
    .eq('deletion_token', token)

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})

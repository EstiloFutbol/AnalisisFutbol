import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let token: string | undefined
  try {
    const body = await req.json()
    token = body.token
  } catch {
    return json({ error: 'Invalid request body' }, 400)
  }

  if (!token) return json({ error: 'Token requerido.' }, 400)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const adminClient = createClient(supabaseUrl, serviceKey)

  // Look up the token
  const { data: deletion, error: lookupError } = await adminClient
    .from('account_deletions')
    .select('*')
    .eq('deletion_token', token)
    .single()

  if (lookupError || !deletion) {
    return json({ error: 'Enlace inválido o no encontrado.' }, 404)
  }

  if (deletion.fully_deleted) {
    return json({ error: 'Los datos ya fueron eliminados anteriormente.' }, 400)
  }

  if (new Date(deletion.token_expires_at) < new Date()) {
    return json({ error: 'El enlace ha caducado (válido 7 días).' }, 400)
  }

  const userId = deletion.user_id

  // Delete all remaining user data (auth user was already deleted in step 1;
  // some tables cascade automatically, but we delete explicitly to be safe).
  await adminClient.from('chat_usage').delete().eq('user_id', userId)
  await adminClient.from('real_bets').delete().eq('user_id', userId)
  await adminClient.from('user_profiles').delete().eq('id', userId)

  // Mark the deletion record as fully done (keeps audit trail, removes email value)
  await adminClient
    .from('account_deletions')
    .update({
      fully_deleted: true,
      fully_deleted_at: new Date().toISOString(),
      email: '[eliminado]',
    })
    .eq('deletion_token', token)

  return json({ success: true })
})

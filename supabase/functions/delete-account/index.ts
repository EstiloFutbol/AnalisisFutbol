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

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Unauthorized' }, 401)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const anonKey     = Deno.env.get('SUPABASE_ANON_KEY')!
  const resendKey   = Deno.env.get('RESEND_API_KEY')!
  const appUrl      = Deno.env.get('APP_URL') || 'https://analisisfutbol.com'

  const adminClient = createClient(supabaseUrl, serviceKey)
  const userClient  = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  })

  // Verify the caller is an authenticated user
  const { data: { user }, error: userError } = await userClient.auth.getUser()
  if (userError || !user) return json({ error: 'Unauthorized' }, 401)

  const userId = user.id
  const email  = user.email!
  const token  = crypto.randomUUID()

  // Store deletion record before touching auth (so we always have the email)
  const { error: insertError } = await adminClient
    .from('account_deletions')
    .insert({ user_id: userId, email, deletion_token: token })

  if (insertError) {
    console.error('account_deletions insert:', insertError)
    return json({ error: 'No se pudo procesar la eliminación.' }, 500)
  }

  // Delete the Supabase auth user (cascades to tables referencing auth.users)
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId)
  if (deleteError) {
    console.error('auth.admin.deleteUser:', deleteError)
    await adminClient.from('account_deletions').delete().eq('deletion_token', token)
    return json({ error: 'No se pudo eliminar la cuenta.' }, 500)
  }

  // Send email via Resend (best-effort — account is deleted regardless)
  const deletionLink = `${appUrl}/eliminar-datos?token=${token}`
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@analisisfutbol.com',
        to: email,
        subject: 'Tu cuenta ha sido eliminada — AnalisisFutbol',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
            <h2 style="margin-bottom:8px">Tu cuenta ha sido eliminada</h2>
            <p>Tu cuenta en <strong>AnalisisFutbol</strong> ha sido eliminada correctamente.</p>
            <p>Guardamos tu dirección de email en nuestros registros internos.
               Si deseas eliminar también esos datos de forma permanente, haz clic aquí:</p>
            <p style="margin:28px 0">
              <a href="${deletionLink}"
                 style="background:#ef4444;color:#fff;padding:12px 24px;
                        text-decoration:none;border-radius:6px;font-weight:600;
                        display:inline-block">
                Eliminar todos mis datos permanentemente
              </a>
            </p>
            <p style="color:#666;font-size:13px">
              Este enlace caduca en 7 días. Si no solicitaste esta acción, ignora este email.
            </p>
          </div>
        `,
      }),
    })
    if (!res.ok) console.error('Resend error:', await res.text())
  } catch (e) {
    console.error('Email exception:', e)
  }

  return json({ success: true })
})

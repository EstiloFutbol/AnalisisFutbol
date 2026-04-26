// Supabase Edge Function: ai-assistant
// Handles two actions:
//   - "chat"    → conversational Q&A about the football data
//   - "analyze" → generate AI bet picks for upcoming matches (admin only)
//
// Secrets needed (set via `supabase secrets set`):
//   GEMINI_API_KEY=<your key>
//
// Built-in secrets (auto-available in Edge Functions):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_MODEL = 'gemini-2.5-flash'
// Stake amounts by confidence level (in monedas)
const STAKE_BY_CONFIDENCE: Record<string, number> = {
  alta:  150,
  media: 100,
  baja:   50,
}

// Max chat messages per user per calendar day (resets at midnight UTC)
const DAILY_CHAT_LIMIT = 20

// ── Rate limiting helpers ────────────────────────────────────────────────────

function getClientIP(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

async function checkAndIncrementUsage(
  supabase: ReturnType<typeof createClient>,
  req: Request,
  authHeader: string | null,
): Promise<{ allowed: boolean; used: number; remaining: number }> {
  let userKey: string

  // Prefer user ID for logged-in users, fall back to IP
  if (authHeader) {
    try {
      const jwt = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(jwt)
      userKey = user?.id ? `user:${user.id}` : `ip:${getClientIP(req)}`
    } catch {
      userKey = `ip:${getClientIP(req)}`
    }
  } else {
    userKey = `ip:${getClientIP(req)}`
  }

  const today = new Date().toISOString().slice(0, 10) // "2026-04-01"

  const { data: newCount, error } = await supabase.rpc('increment_chat_usage', {
    p_user_key: userKey,
    p_date: today,
  })

  if (error) {
    // If table doesn't exist or RPC fails, allow the request (fail open)
    console.warn('Rate limit check failed:', error.message)
    return { allowed: true, used: 0, remaining: DAILY_CHAT_LIMIT }
  }

  const used = newCount as number
  const remaining = Math.max(0, DAILY_CHAT_LIMIT - used)
  return { allowed: used <= DAILY_CHAT_LIMIT, used, remaining }
}

// ── Gemini API call ──────────────────────────────────────────────────────────

async function callGemini(
  contents: { role: string; parts: { text: string }[] }[],
  systemInstruction?: string,
  jsonOutput = false,
): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY')
  if (!apiKey) throw new Error('GEMINI_API_KEY not set in secrets')

  const body: Record<string, unknown> = { contents }
  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] }
  }
  if (jsonOutput) {
    body.generationConfig = { responseMimeType: 'application/json' }
  }

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }

  // Lista de modelos alternativos en caso de sobrecarga (estrictamente aquellos a los que tiene acceso la nueva clave)
  const modelsToTry = [GEMINI_MODEL, 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-flash-latest']
  
  let lastErrText = ''
  let lastStatus = 0

  for (const model of modelsToTry) {
    // 2 intentos por modelo
    for (let attempt = 1; attempt <= 2; attempt++) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
      const resp = await fetch(url, options)

      if (resp.ok) {
        const data = await resp.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (!text) throw new Error('Empty response from Gemini')
        return text
      }

      lastStatus = resp.status
      lastErrText = await resp.text()

      // Si hay alta demanda o tasa excedida, pausa e inténtalo de nuevo
      if (resp.status === 503 || resp.status === 429) {
        if (attempt < 2) {
          await new Promise(r => setTimeout(r, 1500)) // Espera 1.5s
          continue 
        } else {
          break // Pasa al siguiente modelo disponible
        }
      }

      // Si es un error crítico distinto a sobrecarga, interrumpe
      throw new Error(`Gemini API error ${lastStatus} en modelo ${model}: ${lastErrText}`)
    }
  }

  throw new Error(`Todos los modelos experimentaron alta demanda (503/429). Último error: ${lastErrText}`)
}

// ── Supabase data helpers ────────────────────────────────────────────────────

async function getSeasonResults(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      matchday, match_date, home_goals, away_goals,
      home_team:teams!matches_home_team_id_fkey(name),
      away_team:teams!matches_away_team_id_fkey(name)
    `)
    .not('home_goals', 'is', null)
    .order('matchday', { ascending: true })
    .order('match_date', { ascending: true })

  if (error) throw new Error('DB error fetching results: ' + error.message)
  return data || []
}

async function getUpcomingWithOdds(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id, matchday, match_date, kick_off_time,
      home_odds, draw_odds, away_odds,
      home_team:teams!matches_home_team_id_fkey(id, name),
      away_team:teams!matches_away_team_id_fkey(id, name)
    `)
    .not('home_odds', 'is', null)
    .not('draw_odds', 'is', null)
    .not('away_odds', 'is', null)
    .is('home_goals', null)
    .order('matchday', { ascending: true })

  if (error) throw new Error('DB error fetching upcoming: ' + error.message)
  return data || []
}

// ── JWT helper ──────────────────────────────────────────────────────────────
// NOTE: We do NOT verify the signature here — the Supabase gateway already
// validates every JWT before the request reaches this function. We only need
// to read the user's ID (sub) from the payload.
function decodeJWTPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    // Base64url → standard base64 → decode
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(b64)
    return JSON.parse(json)
  } catch {
    return null
  }
}

// ── action: analyze ─────────────────────────────────────────────────────────

async function handleAnalyze(
  supabase: ReturnType<typeof createClient>,
  authHeader: string | null,
) {
  // ── Auth check ─────────────────────────────────────────────────────────────
  if (!authHeader) {
    return Response.json({ error: 'Authentication required' }, { status: 401, headers: corsHeaders })
  }

  // Decode JWT to get user ID (gateway already validated the signature)
  const jwt = authHeader.replace(/^Bearer\s+/i, '').trim()
  const payload = decodeJWTPayload(jwt)
  const userId = payload?.sub as string | undefined

  if (!userId) {
    return Response.json({ error: 'Token inválido o expirado' }, { status: 401, headers: corsHeaders })
  }

  // ── Admin check (fetch from DB with service role — bypasses RLS) ──────────
  const { data: profile, error: profileErr } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()

  if (profileErr || !profile?.is_admin) {
    return Response.json({ error: 'Admin access required' }, { status: 403, headers: corsHeaders })
  }

  // Fetch data
  const [results, upcoming, pastBetsRaw, expertReviewsRaw] = await Promise.all([
    getSeasonResults(supabase),
    getUpcomingWithOdds(supabase),
    // Past AI bets with results (for learning loop)
    supabase
      .from('ai_bets')
      .select(`
        bet_type, odds, stake, status, confidence, reasoning, post_analysis,
        match:matches(
          matchday, home_goals, away_goals,
          home_team:teams!matches_home_team_id_fkey(name),
          away_team:teams!matches_away_team_id_fkey(name)
        )
      `)
      .in('status', ['won', 'lost'])
      .order('created_at', { ascending: false })
      .limit(30),
    // Expert reviews (for learning)
    supabase
      .from('match_expert_reviews')
      .select(`
        content, match_id,
        match:matches(
          matchday, home_goals, away_goals,
          home_team:teams!matches_home_team_id_fkey(name),
          away_team:teams!matches_away_team_id_fkey(name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(15),
  ])

  if (!upcoming.length) {
    return Response.json({ bets: [], message: 'No hay partidos disponibles con cuotas' }, { headers: corsHeaders })
  }

  // ── Check if bets already exist for these matches ──────────────────────────
  // Avoids re-calling Gemini (expensive + slow) and prevents timeout on 2nd click
  const upcomingIds = upcoming.map((m: any) => m.id)
  const { data: existingBets } = await supabase
    .from('ai_bets')
    .select('match_id, status')
    .in('match_id', upcomingIds)

  if (existingBets && existingBets.length > 0) {
    return Response.json(
      {
        bets: existingBets,
        count: existingBets.length,
        message: `Las apuestas de IA ya fueron generadas para esta jornada (${existingBets.length} apuestas). Vuelve a generar cuando haya nuevos partidos disponibles.`,
        alreadyGenerated: true,
      },
      { status: 200, headers: corsHeaders },
    )
  }

  // ── Build context (last 15 jornadas to keep context short & fast) ──────────
  const recentResults = results.slice(-150) // ~15 jornadas × 10 matches
  const resultsText = recentResults.map((m: any) =>
    `J${m.matchday}: ${m.home_team.name} ${m.home_goals}-${m.away_goals} ${m.away_team.name}`
  ).join('\n')

  const upcomingText = upcoming.map((m: any) =>
    `ID:${m.id} J${m.matchday} ${m.match_date} — ${m.home_team.name} vs ${m.away_team.name} | Cuotas: Local=${m.home_odds} X=${m.draw_odds} Visit=${m.away_odds}`
  ).join('\n')

  // ── AI Learning Loop: Build feedback from past bets ────────────────────────
  const pastBets = pastBetsRaw?.data || []
  const wonBets = pastBets.filter((b: any) => b.status === 'won')
  const lostBets = pastBets.filter((b: any) => b.status === 'lost')
  const winRate = pastBets.length > 0
    ? ((wonBets.length / pastBets.length) * 100).toFixed(0)
    : '0'

  const pastBetsText = lostBets.slice(0, 10).map((b: any) => {
    const m = b.match
    const label = b.bet_type === 'home' ? 'Local' : b.bet_type === 'draw' ? 'Empate' : 'Visitante'
    return `❌ J${m?.matchday}: ${m?.home_team?.name} ${m?.home_goals}-${m?.away_goals} ${m?.away_team?.name} → Predijiste ${label} @${b.odds}. Razón: "${b.reasoning}"`
  }).join('\n')

  const expertReviews = (expertReviewsRaw?.data || []).slice(0, 5)
  const expertText = expertReviews.map((r: any) => {
    const m = r.match
    return `📋 J${m?.matchday} ${m?.home_team?.name} ${m?.home_goals}-${m?.away_goals} ${m?.away_team?.name}:\n   Análisis experto: "${r.content.slice(0, 300)}"`
  }).join('\n')

  const learningBlock = (pastBetsText || expertText) ? `

═══ RETROALIMENTACIÓN Y APRENDIZAJE ═══
Tu rendimiento actual: ${wonBets.length} ganadas, ${lostBets.length} perdidas (${winRate}% win rate).

${pastBetsText ? `PREDICCIONES FALLIDAS RECIENTES (aprende de estos errores):
${pastBetsText}` : ''}

${expertText ? `ANÁLISIS DE EXPERTOS (ten en cuenta estas correcciones):
${expertText}` : ''}

INSTRUCCIONES DE APRENDIZAJE:
- Analiza POR QUÉ fallaron tus predicciones anteriores
- Identifica patrones: ¿sobrevaloras el factor local? ¿subestimas empates?
- Los análisis de expertos contienen correcciones valiosas que debes incorporar
- Ajusta tu confianza basándote en tu historial con equipos similares
════════════════════════════════════` : ''

  const systemPrompt = `Eres un experto analista de apuestas de fútbol de La Liga española temporada 2025-2026.
Analiza datos históricos reales de la temporada y haz predicciones fundamentadas.
REGLA FUNDAMENTAL: Basa tu análisis EXCLUSIVAMENTE en los datos históricos proporcionados.
Considera: forma reciente, rendimiento local/visitante, tendencia de goles y valor de las cuotas.
IMPORTANTE: Aprende de tus errores pasados y de los análisis de expertos proporcionados.
Responde SIEMPRE en español.`

  const userPrompt = `Aquí están todos los resultados de la temporada 2025-2026:
${resultsText}
${learningBlock}

Analiza los siguientes partidos y recomienda la mejor apuesta para cada uno.
Para cada partido considera:
1. Últimas 5-8 jornadas de cada equipo
2. Rendimiento jugando en casa vs. fuera
3. Tendencia de goles (para razonar empates)
4. Valor real de las cuotas vs. probabilidad estimada
5. Lecciones de tus predicciones fallidas anteriores
6. Correcciones de los análisis de expertos

PARTIDOS A ANALIZAR:
${upcomingText}

Responde únicamente con un array JSON válido, un objeto por partido:
[
  {
    "match_id": <número exacto del ID>,
    "bet_type": "home" | "draw" | "away",
    "confidence": "alta" | "media" | "baja",
    "reasoning": "<2-3 frases en español explicando tu análisis, incluyendo qué aprendiste de errores previos si aplica>",
    "key_factors": ["factor clave 1", "factor clave 2", "factor clave 3"]
  }
]
Solo responde con el JSON, sin texto adicional.`

  const responseText = await callGemini(
    [{ role: 'user', parts: [{ text: userPrompt }] }],
    systemPrompt,
    true,
  )

  let picks: any[]
  try {
    picks = JSON.parse(responseText)
    if (!Array.isArray(picks)) throw new Error('Not an array')
  } catch (e) {
    console.error('Parse error:', responseText)
    throw new Error('Error al parsear la respuesta de Gemini: ' + e)
  }

  // Insert / upsert bets
  const inserted: any[] = []
  for (const pick of picks) {
    const match = upcoming.find((m: any) => m.id === pick.match_id)
    if (!match) {
      console.warn('Unknown match_id:', pick.match_id)
      continue
    }

    const odds =
      pick.bet_type === 'home' ? match.home_odds
      : pick.bet_type === 'draw' ? match.draw_odds
      : match.away_odds

    const stake = STAKE_BY_CONFIDENCE[pick.confidence] ?? 100
    const payout = Math.round(stake * odds * 100) / 100

    const { data: rows, error: upsertErr } = await supabase
      .from('ai_bets')
      .upsert(
        {
          match_id:         pick.match_id,
          bet_type:         pick.bet_type,
          odds,
          stake,
          potential_payout: payout,
          reasoning:        pick.reasoning,
          key_factors:      pick.key_factors ?? [],
          confidence:       pick.confidence,
          status:           'pending',
        },
        { onConflict: 'match_id', ignoreDuplicates: false },
      )
      .select()

    if (upsertErr) console.error('Upsert error:', upsertErr)
    if (rows) inserted.push(...rows)
  }

  return Response.json(
    { bets: inserted, count: inserted.length },
    { headers: corsHeaders }
  )
}

// ── action: chat ─────────────────────────────────────────────────────────────

async function handleChat(
  supabase: ReturnType<typeof createClient>,
  body: { message: string; history?: { role: string; content: string }[] },
  req: Request,
  authHeader: string | null,
) {
  const { message, history = [] } = body
  if (!message?.trim()) {
    return Response.json({ error: 'Message is required' }, { status: 400, headers: corsHeaders })
  }

  // ── Rate limit check ──────────────────────────────────────────────────────
  const { allowed, used, remaining } = await checkAndIncrementUsage(supabase, req, authHeader)
  if (!allowed) {
    return Response.json(
      {
        error: `Has alcanzado el límite diario de ${DAILY_CHAT_LIMIT} mensajes. Vuelve mañana.`,
        remaining: 0,
        used,
      },
      { status: 429, headers: corsHeaders },
    )
  }

  // Fetch context
  const [results, aiBetsRaw] = await Promise.all([
    getSeasonResults(supabase),
    supabase
      .from('ai_bets')
      .select(`
        bet_type, odds, stake, status, confidence, reasoning,
        match:matches(
          matchday, home_goals, away_goals,
          home_team:teams!matches_home_team_id_fkey(name),
          away_team:teams!matches_away_team_id_fkey(name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(30),
  ])

  const resultsText = results.map((m: any) =>
    `J${m.matchday} (${m.match_date?.slice(0, 10)}): ${m.home_team.name} ${m.home_goals}-${m.away_goals} ${m.away_team.name}`
  ).join('\n')

  const aiBetsText = (aiBetsRaw?.data || []).map((b: any) => {
    const m = b.match
    const label = b.bet_type === 'home' ? 'Local' : b.bet_type === 'draw' ? 'Empate' : 'Visitante'
    return `${m?.home_team?.name} vs ${m?.away_team?.name} → ${label} @${b.odds} [${b.status.toUpperCase()}]`
  }).join('\n')

  const systemPrompt = `Eres un asistente experto en La Liga española temporada 2025-2026.
Solo respondes preguntas basadas en los datos reales de la base de datos proporcionados.
Eres amigable, conciso y usas emojis ocasionalmente para hacer las respuestas más dinámicas.
Si no tienes datos suficientes para responder algo, dilo claramente.
Responde SIEMPRE en español.

═══ RESULTADOS DE LA TEMPORADA 2025-2026 ═══
${resultsText}

═══ APUESTAS DEL BOT IA ═══
${aiBetsText || 'Sin apuestas registradas aún'}
═══════════════════════════════════════════`

  const contents = [
    ...history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ]

  const response = await callGemini(contents, systemPrompt)
  return Response.json({ response, remaining }, { headers: corsHeaders })
}

// ── Entry point ──────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const body = await req.json()
    const { action } = body
    const authHeader = req.headers.get('Authorization')

    if (action === 'analyze') {
      return await handleAnalyze(supabase, authHeader)
    } else if (action === 'chat') {
      return await handleChat(supabase, body, req, authHeader)
    } else {
      return Response.json({ error: 'Action must be "chat" or "analyze"' }, {
        status: 400,
        headers: corsHeaders,
      })
    }
  } catch (err) {
    console.error('Edge function error:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500, headers: corsHeaders },
    )
  }
})

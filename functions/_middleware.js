// Cloudflare Pages Functions: contraseña opcional delante de toda la web.
//
// - Si existe la variable secreta SITE_PASSWORD (Cloudflare → Pages → Settings →
//   Variables and Secrets), la web pide usuario y contraseña (HTTP Basic Auth).
// - Si no existe, la web es pública y este archivo no hace nada.
// La contraseña nunca va en el código: este repositorio es público.

const USER = 'analisis'
const REALM = 'AnalisisFutbol (privada)'

const encoder = new TextEncoder()

// Compara sin revelar por el tiempo de respuesta cuántos caracteres coinciden.
async function safeEqual(a, b) {
    const [ha, hb] = await Promise.all([
        crypto.subtle.digest('SHA-256', encoder.encode(a)),
        crypto.subtle.digest('SHA-256', encoder.encode(b)),
    ])
    const x = new Uint8Array(ha)
    const y = new Uint8Array(hb)
    let diff = 0
    for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i]
    return diff === 0
}

function parseBasicAuth(header) {
    if (!header || !header.startsWith('Basic ')) return null
    try {
        const decoded = atob(header.slice(6))
        const sep = decoded.indexOf(':')
        if (sep < 0) return null
        return { user: decoded.slice(0, sep), pass: decoded.slice(sep + 1) }
    } catch {
        return null
    }
}

export async function onRequest(context) {
    const password = context.env.SITE_PASSWORD
    if (!password) return context.next()

    const creds = parseBasicAuth(context.request.headers.get('Authorization'))
    const ok = creds && (await safeEqual(creds.user, USER)) && (await safeEqual(creds.pass, password))

    if (!ok) {
        return new Response('Acceso restringido.', {
            status: 401,
            headers: {
                'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-store',
                'X-Robots-Tag': 'noindex, nofollow',
            },
        })
    }

    const response = await context.next()
    const headers = new Headers(response.headers)
    headers.set('Cache-Control', 'no-store')
    headers.set('X-Robots-Tag', 'noindex, nofollow')
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

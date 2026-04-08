import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://analisisfutbol.com'
const SITE_NAME = 'Análisis Fútbol — Estadísticas y Predicciones La Liga'
const DEFAULT_DESC = 'Análisis completo de La Liga 2025-2026: estadísticas de partidos, goles, córners, tarjetas, clasificación, goleadores, predicciones con IA y apuestas virtuales. Datos reales actualizados cada jornada.'
const DEFAULT_IMAGE = '/og-image.png'

// Competitive Spanish football keywords matching Marca, AS, BeSoccer, SofaScore
const DEFAULT_KEYWORDS = [
    // Core
    'La Liga', 'La Liga 2025-2026', 'liga española', 'primera división',
    // Results & standings
    'resultados La Liga', 'clasificación La Liga', 'tabla posiciones liga española',
    'jornada La Liga', 'partidos hoy La Liga',
    // Stats
    'estadísticas fútbol', 'estadísticas La Liga', 'análisis partidos fútbol',
    'goles La Liga', 'córners La Liga', 'tarjetas La Liga',
    // Players
    'goleadores La Liga', 'pichichi', 'máximo goleador', 'asistencias La Liga',
    'jugadores La Liga', 'zamora La Liga',
    // Betting
    'predicciones fútbol', 'pronósticos La Liga', 'cuotas apuestas fútbol',
    'apuestas La Liga', 'over under La Liga', 'btts ambos marcan',
    // AI
    'inteligencia artificial fútbol', 'predicciones IA fútbol', 'robot apuestas fútbol',
    // Advanced
    'xG expected goals', 'análisis táctico', 'estadísticas avanzadas fútbol',
].join(', ')

export default function SEO({
    title,
    description = DEFAULT_DESC,
    path = '',
    type = 'website',
    image = DEFAULT_IMAGE,
    noIndex = false,
    structuredData = null,
    keywords = null,
}) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
    const canonicalUrl = `${BASE_URL}${path}`

    // Generate BreadcrumbList for non-root pages
    const breadcrumbs = path && path !== '/'
        ? {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Inicio',
                    item: BASE_URL,
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: title || 'Página',
                    item: canonicalUrl,
                },
            ],
        }
        : null

    // WebSite structured data for root page
    const websiteSchema = path === '' || path === '/'
        ? {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Análisis Fútbol',
            alternateName: 'AnalisisFutbol',
            url: BASE_URL,
            description: DEFAULT_DESC,
            inLanguage: 'es',
            potentialAction: {
                '@type': 'SearchAction',
                target: `${BASE_URL}/?tab=partidos&q={search_term_string}`,
                'query-input': 'required name=search_term_string',
            },
        }
        : null

    return (
        <Helmet>
            {/* Core */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            {!noIndex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}
            <link rel="canonical" href={canonicalUrl} />
            <meta name="language" content="es" />
            <meta name="geo.region" content="ES" />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={`${BASE_URL}${image}`} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="es_ES" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={`${BASE_URL}${image}`} />

            {/* Keywords */}
            <meta name="keywords" content={keywords || DEFAULT_KEYWORDS} />

            {/* Structured Data: Page-specific */}
            {structuredData && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            )}

            {/* Structured Data: Breadcrumbs */}
            {breadcrumbs && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
            )}

            {/* Structured Data: WebSite */}
            {websiteSchema && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
            )}
        </Helmet>
    )
}

/** Generate SportsEvent schema for a match */
export function matchStructuredData(match) {
    if (!match) return null
    const homeTeam = match.home_team?.name || 'Local'
    const awayTeam = match.away_team?.name || 'Visitante'

    return {
        '@context': 'https://schema.org',
        '@type': 'SportsEvent',
        name: `${homeTeam} vs ${awayTeam} — Jornada ${match.matchday || ''} La Liga 2025-2026`,
        description: `Estadísticas y análisis del partido ${homeTeam} vs ${awayTeam} de La Liga 2025-2026`,
        startDate: match.match_date,
        location: match.stadium ? {
            '@type': 'Place',
            name: match.stadium,
        } : undefined,
        competitor: [
            { '@type': 'SportsTeam', name: homeTeam },
            { '@type': 'SportsTeam', name: awayTeam },
        ],
        ...(match.home_goals != null ? {
            result: `${match.home_goals} - ${match.away_goals}`,
        } : {}),
        sport: 'Fútbol',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    }
}

/** Generate Organization schema for the site */
export function siteOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'SportsOrganization',
        name: 'Análisis Fútbol',
        url: BASE_URL,
        description: 'Análisis estadístico completo de La Liga con predicciones de inteligencia artificial',
        sport: 'Fútbol',
    }
}

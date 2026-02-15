
/**
 * Parses a CSV string (specifically formatted for AnálisisFútbol) into match objects
 * @param {string} csvText - The raw CSV text content
 * @returns {Array} - Array of match objects ready for insertion
 */
export function parseMatchesCSV(csvText) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) throw new Error('El archivo CSV no tiene datos suficientes (faltan cabeceras o filas).');

    // Parse headers
    const rawHeaders = lines[0].split(';').map(h => h.trim());
    const headers = rawHeaders.map(h => h.replace(/^[`"']+|[`"']+$/g, ''));

    const getValue = (rowParts, headerName) => {
        const index = headers.indexOf(headerName);
        if (index === -1) return null;
        let val = rowParts[index];
        if (!val) return null;
        val = val.trim();
        val = val.replace(/^[`"']+|[`"']+$/g, '');
        if (val === 'NULL' || val === '' || val.startsWith('#') || val.includes('VALOR') || val.includes('VALUE')) return null;
        return val;
    };

    const num = (n) => (n !== null && n !== undefined && n !== '') ? Number(n) : null;

    // Helper to parse "['27']" string to actual array or null
    const parseJsonArray = (str) => {
        if (!str) return [];
        try {
            // Replace single quotes with double for JSON.parse if needed, but the format is usually messy
            // The input seems to be like "[27]" or "['27']"
            // Simple regex extraction might be safer
            const matches = str.match(/\d+/g);
            return matches ? matches.map(String) : [];
        } catch (e) {
            return [];
        }
    };

    const matches = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const parts = line.split(';');
        if (parts.length < 5) continue;

        const id = getValue(parts, 'id_partido');
        if (!id) continue;

        let match_date = getValue(parts, 'fe_fecha');
        if (match_date && match_date.includes('/')) {
            const [d, m, y] = match_date.split('/');
            match_date = `${y}-${m}-${d}`;
        }

        const match = {
            id: Number(id),
            season: getValue(parts, 'id_temporada') || '2024-2025',
            matchday: num(getValue(parts, 'num_jornada')),
            day_of_week: getValue(parts, 'ds_dia_semana'),
            match_date: match_date,
            kick_off_time: getValue(parts, 'ds_hora'),

            home_team_id: num(getValue(parts, 'id_equipo_local')),
            away_team_id: num(getValue(parts, 'id_equipo_visitante')),

            home_goals: num(getValue(parts, 'ct_goles_local')) || 0,
            away_goals: num(getValue(parts, 'ct_goles_visitante')) || 0,
            btts: getValue(parts, 'BTTS') === '1',

            home_xg: num(getValue(parts, 'ct_xg_local')),
            away_xg: num(getValue(parts, 'ct_xg_visitante')),
            home_odds: num(getValue(parts, 'ct_odds_local')),
            draw_odds: num(getValue(parts, 'ct_odds_empate')),
            away_odds: num(getValue(parts, 'ct_odds_visitante')),

            attendance: num(getValue(parts, 'ct_asistencia')),
            stadium: getValue(parts, 'ds_estadio_partido'),
            referee: getValue(parts, 'ds_arbitro'),
            home_coach: getValue(parts, 'Entrenador local'),
            away_coach: getValue(parts, 'Entrenador visitante'),

            home_possession: num(getValue(parts, 'ct_possesion_local')),
            away_possession: num(getValue(parts, 'ct_possesion_visitante')),
            home_shots: num(getValue(parts, 'num_remates_local')),
            away_shots: num(getValue(parts, 'num_remates_visitante')),
            home_shots_on_target: num(getValue(parts, 'num_remates_puerta_local')),
            away_shots_on_target: num(getValue(parts, 'num_remates_puerta_visitante')),
            home_shots_off_target: num(getValue(parts, 'num_remates_fuera_local')),
            away_shots_off_target: num(getValue(parts, 'num_remates_fuera_visitante')),

            home_cards: num(getValue(parts, 'num_tarjetas_local')),
            away_cards: num(getValue(parts, 'num_tarjetas_visitante')),
            home_red_cards: num(getValue(parts, 'Tajerata roja local')) || 0,
            away_red_cards: num(getValue(parts, 'Tajerata roja visitante')) || 0,
            first_red_card_minute: getValue(parts, 'Minuto primera tarjeta roja'),

            home_corners_1h: num(getValue(parts, 'num_corners_local_1p')),
            away_corners_1h: num(getValue(parts, 'num_corners_visitante_1p')),
            home_corners_2h: num(getValue(parts, 'num_corners_local_2p')),
            away_corners_2h: num(getValue(parts, 'num_corners_visitante_2p')),
            total_corners: num(getValue(parts, 'Total corners')),

            home_fouls: num(getValue(parts, 'num_faltas_local')),
            away_fouls: num(getValue(parts, 'num_faltas_visitante')),
            home_offsides: num(getValue(parts, 'num_fueras_juego_local')),
            away_offsides: num(getValue(parts, 'num_fueras_juego_visitante')),

            home_formation: getValue(parts, 'ds_formacion_local'),
            away_formation: getValue(parts, 'ds_formacion_visitante'),
        };

        // Handle goal minutes safely
        const home_goals_mins = [];
        for (let k = 1; k <= 12; k++) {
            const m = getValue(parts, `m_gol_${k}_loc`);
            if (m) home_goals_mins.push(m);
        }
        match.home_goal_minutes = home_goals_mins;

        const away_goals_mins = [];
        for (let k = 1; k <= 12; k++) {
            const m = getValue(parts, `m_gol_${k}_vis`);
            if (m) away_goals_mins.push(m);
        }
        match.away_goal_minutes = away_goals_mins;

        matches.push(match);
    }

    return matches;
}

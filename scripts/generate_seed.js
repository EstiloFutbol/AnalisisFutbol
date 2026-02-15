
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_FILE = path.join(__dirname, '../af_th_partidos.csv');
const OUTPUT_FILE = path.join(__dirname, '../seed_matches.sql');

try {
    if (!fs.existsSync(CSV_FILE)) {
        console.error('CSV file not found:', CSV_FILE);
        process.exit(1);
    }

    // Read as utf8 (file is likely UTF-8)
    const csvData = fs.readFileSync(CSV_FILE, 'utf8');
    const lines = csvData.split(/\r?\n/).filter(line => line.trim());

    if (lines.length < 2) {
        console.error('CSV file has no data');
        process.exit(1);
    }

    // Parse headers - clean quotes
    const rawHeaders = lines[0].split(';').map(h => h.trim());
    const headers = rawHeaders.map(h => h.replace(/^[`"']+|[`"']+$/g, ''));

    // console.log('Headers found:', headers.join(', '));

    const sqlStatements = [];

    sqlStatements.push('-- Seed data for matches table');
    sqlStatements.push('-- Generated from af_th_partidos.csv');
    sqlStatements.push('-- IMPORTANT: Run supabase_migration.sql FIRST to create tables!');
    sqlStatements.push('');

    const getValue = (rowParts, headerName) => {
        const index = headers.indexOf(headerName);
        if (index === -1) return null;
        let val = rowParts[index];
        if (!val) return null;
        val = val.trim();
        val = val.replace(/^[`"']+|[`"']+$/g, '');

        // Handle Excel errors
        if (val === 'NULL' || val === '' || val.startsWith('#') || val.includes('VALOR') || val.includes('VALUE')) return null;

        return val;
    };

    const esc = (str) => str ? `'${str.replace(/'/g, "''")}'` : 'NULL';
    const num = (n) => (n !== null && n !== undefined && n !== '') ? n : 'NULL';

    let successCount = 0;
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split(';');

        if (parts.length < 5) continue;

        const id = getValue(parts, 'id_partido');
        if (!id) continue;

        const season = getValue(parts, 'id_temporada');
        const matchday = getValue(parts, 'num_jornada');
        const day_of_week = getValue(parts, 'ds_dia_semana');

        let match_date = getValue(parts, 'fe_fecha');
        if (match_date && match_date.includes('/')) {
            const [d, m, y] = match_date.split('/');
            match_date = `${y}-${m}-${d}`;
        }

        const kick_off_time = getValue(parts, 'ds_hora');
        const home_team_id = getValue(parts, 'id_equipo_local');
        const away_team_id = getValue(parts, 'id_equipo_visitante');

        const home_goals = getValue(parts, 'ct_goles_local');
        const away_goals = getValue(parts, 'ct_goles_visitante');
        const btts = getValue(parts, 'BTTS') === '1' ? 'true' : 'false';

        const home_xg = getValue(parts, 'ct_xg_local');
        const away_xg = getValue(parts, 'ct_xg_visitante');
        const home_odds = getValue(parts, 'ct_odds_local');
        const draw_odds = getValue(parts, 'ct_odds_empate');
        const away_odds = getValue(parts, 'ct_odds_visitante');

        const attendance = getValue(parts, 'ct_asistencia');
        const stadium = getValue(parts, 'ds_estadio_partido');
        const referee = getValue(parts, 'ds_arbitro');
        const home_coach = getValue(parts, 'Entrenador local');
        const away_coach = getValue(parts, 'Entrenador visitante');

        const home_pos = getValue(parts, 'ct_possesion_local');
        const away_pos = getValue(parts, 'ct_possesion_visitante');
        const home_shots = getValue(parts, 'num_remates_local');
        const away_shots = getValue(parts, 'num_remates_visitante');
        const home_shots_ot = getValue(parts, 'num_remates_puerta_local');
        const away_shots_ot = getValue(parts, 'num_remates_puerta_visitante');
        const home_shots_off = getValue(parts, 'num_remates_fuera_local');
        const away_shots_off = getValue(parts, 'num_remates_fuera_visitante');

        const home_cards = getValue(parts, 'num_tarjetas_local');
        const away_cards = getValue(parts, 'num_tarjetas_visitante');
        const home_red = getValue(parts, 'Tajerata roja local') || 0;
        const away_red = getValue(parts, 'Tajerata roja visitante') || 0;
        const first_red_min = getValue(parts, 'Minuto primera tarjeta roja');

        const h_corn_1 = getValue(parts, 'num_corners_local_1p');
        const a_corn_1 = getValue(parts, 'num_corners_visitante_1p');
        const h_corn_2 = getValue(parts, 'num_corners_local_2p');
        const a_corn_2 = getValue(parts, 'num_corners_visitante_2p');
        const total_corners = getValue(parts, 'Total corners');

        const h_fouls = getValue(parts, 'num_faltas_local');
        const a_fouls = getValue(parts, 'num_faltas_visitante');
        const h_off = getValue(parts, 'num_fueras_juego_local');
        const a_off = getValue(parts, 'num_fueras_juego_visitante');

        const h_form = getValue(parts, 'ds_formacion_local');
        const a_form = getValue(parts, 'ds_formacion_visitante');

        const home_goal_mins = [];
        for (let k = 1; k <= 12; k++) {
            const m = getValue(parts, `m_gol_${k}_loc`);
            if (m) home_goal_mins.push(m);
        }

        const away_goal_mins = [];
        for (let k = 1; k <= 12; k++) {
            const m = getValue(parts, `m_gol_${k}_vis`);
            if (m) away_goal_mins.push(m);
        }

        const values = [
            id,
            esc(season),
            num(matchday),
            esc(day_of_week),
            esc(match_date),
            esc(kick_off_time),
            home_team_id,
            away_team_id,
            num(home_goals),
            num(away_goals),
            btts,
            num(home_xg),
            num(away_xg),
            num(home_odds),
            num(draw_odds),
            num(away_odds),
            num(attendance),
            esc(stadium),
            esc(referee),
            esc(home_coach),
            esc(away_coach),
            num(home_pos),
            num(away_pos),
            num(home_shots),
            num(away_shots),
            num(home_shots_ot),
            num(away_shots_ot),
            num(home_shots_off),
            num(away_shots_off),
            num(home_cards),
            num(away_cards),
            num(home_red),
            num(away_red),
            esc(first_red_min),
            num(h_corn_1),
            num(a_corn_1),
            num(h_corn_2),
            num(a_corn_2),
            num(total_corners),
            num(h_fouls),
            num(a_fouls),
            num(h_off),
            num(a_off),
            esc(h_form),
            esc(a_form),
            `'${JSON.stringify(home_goal_mins)}'`,
            `'${JSON.stringify(away_goal_mins)}'`
        ];

        sqlStatements.push(`INSERT INTO matches (
    id, season, matchday, day_of_week, match_date, kick_off_time, 
    home_team_id, away_team_id, home_goals, away_goals, btts,
    home_xg, away_xg, home_odds, draw_odds, away_odds,
    attendance, stadium, referee, home_coach, away_coach,
    home_possession, away_possession, home_shots, away_shots,
    home_shots_on_target, away_shots_on_target, home_shots_off_target, away_shots_off_target,
    home_cards, away_cards, home_red_cards, away_red_cards, first_red_card_minute,
    home_corners_1h, away_corners_1h, home_corners_2h, away_corners_2h, total_corners,
    home_fouls, away_fouls, home_offsides, away_offsides,
    home_formation, away_formation, home_goal_minutes, away_goal_minutes
) VALUES (${values.join(', ')}) ON CONFLICT (id) DO NOTHING;`);
        successCount++;
    }

    fs.writeFileSync(OUTPUT_FILE, sqlStatements.join('\n'), 'utf8');
    console.log(`Generated SQL for ${successCount} matches to ${OUTPUT_FILE}`);

} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}

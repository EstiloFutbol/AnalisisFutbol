-- Seed data for matches table
-- Generated from af_th_partidos.csv
-- IMPORTANT: Run supabase_migration.sql FIRST to create tables!

INSERT INTO matches (
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
) VALUES (1, '2024-2025', 1, 'jueves', '2024-08-15', '19:00', 1, 2, 1, 1, true, 0.83, 0.73, 1.41, 4.06, 6.85, 47845, 'San Mamés', 'Alejandro Muñíz', 'Ernesto Valverde', 'Pepe Bordalas', 69, 31, 5, 7, 4, 2, 1, 5, 4, 1, 0, 0, NULL, 0, 1, 5, 5, 11, 15, 12, 2, 6, '4-2-3-1', '4-1-4-1', '["27"]', '["64"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (2, '2024-2025', 1, 'jueves', '2024-08-15', '21:30', 3, 4, 1, 1, true, 1.46, 1.13, 2.73, 3.12, 2.42, 54084, 'Estadio Benito Villamarín', 'Miguel Ángel Ortiz Arias', 'Manuel Pellegrini', 'Michel', 39, 61, 19, 13, 4, 2, 15, 11, 2, 0, 0, 0, NULL, 3, 1, 1, 3, 8, 11, 7, 1, 3, '4-2-3-1', '4-4-3', '["6"]', '["72"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (3, '2024-2025', 1, 'viernes', '2024-08-16', '19:00', 5, 6, 2, 1, true, 0.94, 0.85, 1.92, 3.44, 4.12, 22477, 'Estadio Abanca Balaídos', 'Alejandro Quintero', 'Claudio Giraldez', 'Luis Garcia', 64, 36, 6, 10, 4, 2, 2, 8, 2, 2, 0, 0, NULL, 1, 1, 2, 2, 6, 8, 23, 4, 3, '4-4-2', '4-2-3-1', '["66","84"]', '["17"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (4, '2024-2025', 1, 'viernes', '2024-08-16', '21:30', 7, 8, 2, 2, true, 1.31, 1.57, 2.85, 3.14, 2.61, 24843, 'Estadio de Gran Canaria', 'Francisco Hernández', 'Luis Miguel Carrion', 'Garcia Pimienta', 48, 52, 11, 15, 5, 5, 6, 10, 2, 2, 0, 0, NULL, 3, 3, 3, 0, 9, 14, 15, 1, 2, '4-2-3-1', '4-5-1', '["42","71"]', '["25","61"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (5, '2024-2025', 1, 'sabado', '2024-08-17', '19:00', 9, 10, 1, 1, true, 1.70, 0.81, 1.65, 3.9, 5.25, 19561, 'Estadio El Sadar', 'Juan Pulido', 'Vicente Moreno', 'Borja Jimenez', 61, 39, 12, 6, 6, 4, 6, 2, 3, 2, 0, 0, NULL, 0, 3, 6, 1, 10, 14, 12, 1, 2, '4-4-3', '4-2-3-1', '["79"]', '["22"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (6, '2024-2025', 1, 'sabado', '2024-08-17', '21:30', 11, 12, 1, 2, true, 0.73, 1.49, 4.20, 3.70, 1.67, 46673, 'Estadio de Mestalla', 'Jose Maria Sánchez', 'Ruben Baraja', 'Hans-Dieter Flick', 36, 64, 5, 12, 2, 6, 3, 6, 2, 3, 0, 0, NULL, 1, 3, 2, 5, 11, 11, 13, 7, 1, '4-4-2', '4-2-3-1', '["44"]', '["45+6","49"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (7, '2024-2025', 1, 'domingo', '2024-08-18', '19:00', 13, 14, 1, 2, true, 1.23, 1.19, 1.51, 3.56, 6.45, 31763, 'Reale Arena', 'Alejandro Hernández', 'Imanol Alguacil', 'Inigo P�rez', 66, 34, 9, 9, 4, 5, 5, 4, 2, 4, 0, 0, NULL, 5, 4, 5, 1, 15, 14, 21, 0, 3, '4-4-2', '4-4-2', '["90+8"]', '["67","84"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (8, '2024-2025', 1, 'domingo', '2024-08-18', '21:30', 15, 16, 1, 1, true, 1.38, 1.45, 4.54, 3.38, 1.71, 2301, 'Estadi Mallorca Son Moix', 'César Soto', 'Jagoba Arrasate', 'Carlo Ancelotti', 34, 66, 11, 10, 5, 5, 6, 5, 1, 2, 0, 1, '90+7', 6, 3, 2, 4, 15, 11, 6, 0, 0, '4-2-3-1', '4-1-2-3', '["53"]', '["13"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (9, '2024-2025', 1, 'lunes', '2024-08-19', '19:00', 17, 18, 1, 0, false, 0.80, 0.66, 2.4, 3.15, 3.15, 22027, 'Estadio Municipal José Zorrilla', 'Pablo González', 'Paulo Pezzolano', 'Manolo Gonzalez', 45, 55, 12, 10, 1, 2, 11, 8, 2, 2, 0, 0, NULL, 2, 1, 1, 1, 5, 15, 8, 6, 1, '4-5-1', '5-3-2', '["23"]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (10, '2024-2025', 1, 'lunes', '2024-08-19', '21:30', 19, 20, 2, 2, true, 0.79, 1.11, 2.95, 3.45, 2.36, 21566, 'Estadio de la Cerámica', 'Guillermo Cuadra', 'Marcelino Garcia', 'Diego Simeone', 45, 55, 9, 9, 3, 4, 6, 5, 1, 3, 0, 0, NULL, 1, 1, 1, 2, 5, 7, 12, 2, 2, '4-4-2', '3-5-2', '["18","37"]', '["20","45+5"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (11, '2024-2025', 2, 'viernes', '2024-08-23', '19:00', 5, 11, 3, 1, true, 1.32, 0.93, 2.10, 3.20, 3.80, 23519, 'Estadio Abanca Balaídos', 'José Luis Munuera', 'Claudio Giraldez', 'Ruben Baraja', 49, 51, 7, 13, 5, 5, 2, 8, 3, 0, 0, 0, NULL, 1, 3, 3, 4, 11, 9, 11, 2, 1, '3-4-2-1', '4-4-2', '["22","27","60"]', '["15"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (12, '2024-2025', 2, 'viernes', '2024-08-23', '21:30', 8, 19, 1, 2, true, 1.04, 0.87, 1.95, 3.30, 4.20, 34004, 'Estadio Ramón Sánchez Pizjuán', 'Isidro Díaz de Mera', 'Garcia Pimienta', 'Marcelino Garcia', 60, 40, 16, 8, 7, 6, 9, 2, 3, 5, 0, 0, NULL, 6, 0, 1, 2, 9, 16, 8, 4, 4, '4-3-3', '4-4-2', '["45+6"]', '["2","90+5"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (13, '2024-2025', 2, 'sabado', '2024-08-24', '17:00', 9, 15, 1, 0, false, 0.57, 0.57, 2.45, 3.10, 3.10, 199, 'Estadio El Sadar', 'Adrián Cordero', 'Vicente Moreno', 'Jagoba Arrasate', 45, 55, 15, 10, 5, 1, 10, 9, 2, 1, 0, 0, NULL, 3, 2, 2, 2, 9, 10, 8, 1, 0, '4-3-3', '4-3-3', '["55"]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (14, '2024-2025', 2, 'sabado', '2024-08-24', '19:00', 12, 1, 2, 1, true, 1.83, 1.03, 1.57, 4.33, 5.25, 46448, 'Estadi Olímpic Lluís Companys', 'Jesús Gil', 'Hans-Dieter Flick', 'Ernesto Valverde', 65, 35, 13, 8, 5, 2, 8, 6, 4, 5, 0, 0, NULL, 4, 4, 1, 2, 11, 11, 16, 2, 5, '4-2-3-1', '4-2-3-1', '["24","75"]', '["42"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (15, '2024-2025', 2, 'sabado', '2024-08-24', '21:30', 2, 14, 0, 0, false, 0.48, 0.24, 2.55, 2.8, 3.3, 9529, 'Coliseum Alfonso Pérez', 'Javier Alberola', 'Pepe Bordalas', 'Inigo P�rez', 48, 52, 12, 3, 0, 0, 12, 3, 1, 2, 0, 0, NULL, 0, 2, 3, 0, 5, 16, 18, 0, 4, '4-4-1-1', '4-2-3-1', '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (16, '2024-2025', 2, 'sabado', '2024-08-24', '21:30', 18, 13, 0, 1, false, 1.78, 0.77, 3.7, 3.1, 2.15, 209, 'RCDE Stadium', 'Mario Melero', NULL, 'Imanol Alguacil', 34, 66, 13, 10, 4, 4, 9, 6, 2, 2, 0, 0, NULL, 2, 1, 5, 3, 11, 14, 18, 1, 2, '4-4-2', '4-1-4-1', '[]', '["80"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (17, '2024-2025', 2, 'domingo', '2024-08-25', '17:00', 16, 17, 3, 0, false, 2.14, 0.42, 1.13, 9.0, 17.0, 70178, 'Estadio Santiago Bernabéu', 'Víctor García', NULL, NULL, 64, 36, 17, 8, 9, 0, 8, 8, 1, 1, 0, 0, NULL, 3, 1, 2, 4, 10, 10, 15, 4, 0, '4-2-3-1', '4-1-4-1', '["50","88","90+6"]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (18, '2024-2025', 2, 'domingo', '2024-08-25', '19:00', 10, 7, 2, 1, true, 1.48, 0.88, 2.40, 3.10, 3.25, 10052, 'Estadio Municipal de Butarque', 'Ricardo de Burgos', 'Borja Jimenez', 'Luis Miguel Carrion', 40, 60, 10, 10, 5, 5, 5, 5, 1, 1, 0, 0, NULL, 1, 3, 2, 4, 10, 11, 10, 1, 0, '4-1-4-1', '4-2-3-1', '["71","85"]', '["90+3"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (19, '2024-2025', 2, 'domingo', '2024-08-25', '19:15', 6, 3, 0, 0, false, 0.21, 1.49, 2.45, 3.0, 3.25, 16623, 'Estadio de Mendizorroza', 'Mateo Busquets', NULL, 'Manuel Pellegrini', 37, 63, 5, 15, 1, 3, 4, 12, 1, 4, 1, 0, '86', 2, 1, 1, 7, 11, 17, 16, 1, 1, '4-4-2', '4-2-3-1', '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (20, '2024-2025', 2, 'domingo', '2024-08-25', '21:30', 20, 4, 3, 0, false, 1.22, 0.68, 1.48, 4.5, 6.25, 60414, 'Riyadh Air Metropolitan Stadium', 'Juan Martínez', NULL, 'Michel', 42, 58, 11, 13, 6, 4, 5, 9, 1, 3, 0, 0, NULL, 0, 4, 1, 5, 10, 11, 11, 2, 2, '3-5-2', '4-3-3', '["39","48","90+4"]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (21, '2024-2025', 3, 'lunes', '2024-08-26', '21:30', 19, 5, 4, 3, true, 3.7, 2.71, 1.67, 4.2, 4.75, 19651, 'Estadio de la Cerámica', 'Miguel Ángel Ortiz Arias', NULL, NULL, 45, 55, 24, 20, 9, 9, 15, 11, 4, 3, 0, 0, NULL, 6, 1, 1, 3, 11, 8, 7, 2, 1, '4-4-2', '3-4-2-1', '["26","60","64","90+10"]', '["12","31","80"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (22, '2024-2025', 3, 'martes', '2024-08-27', '19:00', 15, 8, 0, 0, false, 0.9, 0.74, 2.35, 3.10, 3.30, 2047, 'Estadi Mallorca Son Moix', 'Alejandro Muñíz', NULL, NULL, 45, 55, 12, 16, 4, 7, 8, 9, 0, 1, 0, 0, NULL, 1, 4, 4, 5, 14, 15, 10, 3, 1, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (23, '2024-2025', 3, 'martes', '2024-08-27', '21:30', 14, 12, 1, 2, true, 0.37, 1.41, 5.0, 3.8, 1.67, 14031, 'Campo de Fútbol de Vallecas', 'César Soto', NULL, NULL, 35, 65, 8, 22, 4, 5, 4, 17, 3, 1, 0, 0, NULL, 2, 2, 4, 4, 12, 17, 11, 4, 1, NULL, NULL, '["9"]', '["60","82"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (24, '2024-2025', 3, 'miercoles', '2024-08-28', '19:00', 1, 11, 1, 0, false, 1.38, 0.08, 1.7, 3.7, 5.0, 48644, 'San Mamés', 'Pablo González', NULL, NULL, 50, 50, 13, 2, 4, 0, 9, 2, 1, 3, 0, 0, NULL, 4, 1, 1, 2, 8, 14, 9, 1, 3, NULL, NULL, '["45"]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (25, '2024-2025', 3, 'miercoles', '2024-08-28', '19:00', 17, 10, 0, 0, false, 1.13, 0.18, 2.15, 3.00, 3.8, 21764, 'Estadio Municipal José Zorrilla', 'Alejandro Quintero', NULL, NULL, 59, 41, 12, 7, 2, 1, 10, 6, 1, 4, 0, 0, NULL, 3, 2, 1, 2, 8, 13, 19, 0, 2, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (26, '2024-2025', 3, 'miercoles', '2024-08-28', '21:30', 20, 18, 0, 0, false, 2.47, 0.61, 1.27, 5.75, 13.00, 56669, 'Riyadh Air Metropolitan Stadium', 'Ricardo de Burgos', NULL, NULL, 62, 38, 25, 8, 7, 1, 18, 7, 0, 2, 0, 0, NULL, 6, 2, 3, 1, 12, 6, 9, 6, 0, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (27, '2024-2025', 3, 'miercoles', '2024-08-28', '21:30', 13, 6, 1, 2, true, 1.03, 1.59, 1.62, 3.7, 6.25, 3222, 'Reale Arena', 'Jose Maria Sánchez', NULL, NULL, 53, 47, 10, 14, 1, 5, 9, 9, 4, 4, 0, 0, NULL, 3, 4, 5, 2, 14, 16, 13, 3, 3, NULL, NULL, '["32"]', '["45+5","77"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (28, '2024-2025', 3, 'jueves', '2024-08-29', '19:00', 4, 9, 4, 0, false, 2.42, 0.04, 1.67, 3.90, 4.75, 13275, 'Estadi Municipal de Montilivi', 'Francisco Hernández', NULL, NULL, 60, 40, 10, 1, 5, 0, 5, 1, 0, 0, 0, 0, NULL, 2, 0, 3, 0, 5, 10, 9, 5, 2, NULL, NULL, '["34","53","56","90"]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (29, '2024-2025', 3, 'jueves', '2024-08-29', '21:30', 7, 16, 1, 1, true, 0.76, 2.95, 8.5, 5.5, 1.3, 31192, 'Estadio de Gran Canaria', 'Mateo Busquets', NULL, NULL, 44, 56, 7, 25, 2, 8, 5, 17, 0, 3, 0, 0, NULL, 0, 4, 2, 2, 8, 16, 13, 1, 0, NULL, NULL, '["5"]', '["69"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (30, '2024-2025', 4, 'sabado', '2024-08-31', '17:00', 12, 17, 7, 0, false, 4.77, 0.52, 1.20, 7.50, 13.00, 44359, 'Estadi Olímpic Lluís Companys', 'Isidro Díaz de Mera', NULL, NULL, 70, 30, 23, 4, 11, 1, 12, 3, 0, 3, 0, 0, NULL, 4, 0, 6, 1, 11, 6, 12, 4, 4, NULL, NULL, '["20","64","72","24","45+2","82","85"]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (31, '2024-2025', 4, 'sabado', '2024-08-31', '19:00', 1, 20, 0, 1, false, 0.29, 1.73, 2.7, 3.3, 2.63, 48617, 'San Mamés', 'Alejandro Hernández', NULL, NULL, 53, 47, 8, 9, 1, 2, 7, 7, 3, 1, 0, 0, NULL, 0, 1, 2, 1, 4, 13, 9, 0, 2, NULL, NULL, '[]', '["90+2"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (32, '2024-2025', 4, 'sabado', '2024-08-31', '19:15', 18, 14, 2, 1, true, 1.68, 1.29, 2.8, 3.0, 2.8, 22405, 'RCDE Stadium', 'Adrián Cordero', NULL, NULL, 47, 53, 10, 17, 3, 5, 7, 12, 3, 2, 0, 0, NULL, 1, 2, 2, 5, 10, 14, 16, 0, 3, NULL, NULL, '["8","90+6"]', '["4"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (33, '2024-2025', 4, 'sabado', '2024-08-31', '21:30', 11, 19, 1, 1, true, 1.07, 0.51, 2.55, 3.25, 2.8, 43857, 'Estadio de Mestalla', 'Jesús Gil', NULL, NULL, 58, 42, 22, 9, 5, 2, 17, 7, 3, 3, 0, 0, NULL, 6, 1, 8, 2, 17, 15, 11, 1, 1, NULL, NULL, '["24"]', '["45+3"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (34, '2024-2025', 4, 'sabado', '2024-08-31', '21:30', 10, 15, 0, 1, false, 0.32, 1.02, 2.8, 2.75, 3, 10482, 'Estadio Municipal de Butarque', 'Mario Melero', NULL, NULL, 54, 46, 9, 12, 2, 3, 7, 9, 1, 3, 0, 0, NULL, 1, 2, 0, 1, 4, 11, 17, 3, 0, NULL, NULL, '[]', '["43"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (35, '2024-2025', 4, 'domingo', '2024-09-01', '17:00', 6, 7, 2, 0, false, 2.04, 0.68, 1.7, 3.6, 5.0, 16386, 'Estadio de Mendizorroza', 'Víctor García', NULL, NULL, 29, 71, 15, 12, 5, 6, 10, 6, 3, 0, 0, 0, NULL, 3, 2, 3, 2, 10, 13, 9, 1, 0, NULL, NULL, '["7","78"]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (36, '2024-2025', 4, 'domingo', '2024-09-01', '17:00', 9, 5, 3, 2, true, 0.96, 1.69, 2.45, 3.25, 3.0, 19908, 'Estadio El Sadar', 'Juan Martínez', NULL, NULL, 50, 50, 10, 12, 3, 4, 7, 8, 2, 0, 0, 0, NULL, 3, 1, 3, 2, 9, 19, 10, 3, 3, NULL, NULL, '["21","45","62"]', '["29","90+1"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (37, '2024-2025', 4, 'domingo', '2024-09-01', '19:00', 8, 4, 0, 2, false, 0.97, 1.94, 2.75, 3.75, 2.35, 35735, 'Estadio Ramón Sánchez Pizjuán', 'Jose Maria Sánchez', NULL, NULL, 49, 51, 16, 11, 5, 4, 11, 7, 3, 2, 0, 0, NULL, 3, 3, 4, 2, 12, 6, 14, 4, 0, NULL, NULL, '[]', '["41","73"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (38, '2024-2025', 4, 'domingo', '2024-09-01', '19:15', 2, 13, 0, 0, false, 0.57, 0.02, 3.1, 2.7, 2.8, 10929, 'Coliseum Alfonso Pérez', 'José Luis Munuera', NULL, NULL, 53, 47, 16, 1, 1, 0, 15, 1, 1, 1, 0, 0, NULL, 0, 1, 4, 0, 5, 14, 16, 2, 0, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (39, '2024-2025', 4, 'domingo', '2024-09-01', '21:30', 16, 3, 2, 0, false, 2.45, 0.57, 1.22, 6.5, 12.00, 73072, 'Estadio Santiago Bernabéu', 'Javier Alberola', NULL, NULL, 60, 40, 22, 11, 7, 2, 15, 9, 2, 0, 0, 0, NULL, 4, 1, 3, 2, 10, 9, 17, 1, 2, NULL, NULL, '["67","75"]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (40, '2024-2025', 5, 'viernes', '2024-09-13', '21:00', 3, 10, 2, 0, false, 2.12, 0.1, 1.67, 3.5, 6.0, 48089, 'Estadio Benito Villamarín', 'Pablo González', NULL, NULL, 64, 36, 14, 3, 5, 0, 9, 3, 1, 2, 0, 0, NULL, 4, 0, 7, 1, 12, 11, 18, 2, 1, NULL, NULL, '["74","86"]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (41, '2024-2025', 5, 'sabado', '2024-09-14', '14:00', 15, 19, 1, 2, true, 0.35, 1.77, 2.35, 3.35, 3.2, 18303, 'Estadi Mallorca Son Moix', 'Ricardo de Burgos', NULL, NULL, 54, 46, 9, 21, 4, 4, 5, 17, 3, 3, 0, 0, NULL, 5, 4, 2, 2, 13, 11, 10, 2, 1, NULL, NULL, '["57"]', '["27","90+4"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (42, '2024-2025', 5, 'sabado', '2024-09-14', '16:15', 18, 6, 3, 2, true, 1.58, 1.91, 2.9, 3.0, 2.7, 24238, 'RCDE Stadium', 'Juan Pulido', NULL, NULL, 38, 62, 9, 19, 4, 6, 5, 13, 2, 3, 0, 0, NULL, 0, 2, 0, 3, 5, 17, 14, 3, 0, NULL, NULL, '["21","56","63"]', '["35","68"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (43, '2024-2025', 5, 'sabado', '2024-09-14', '18:30', 8, 2, 1, 0, false, 1.41, 1.01, 2.25, 3.0, 3.6, 32643, 'Estadio Ramón Sánchez Pizjuán', 'Mateo Busquets', NULL, NULL, 60, 40, 10, 15, 4, 4, 6, 11, 1, 4, 0, 0, NULL, 1, 2, 2, 2, 7, 19, 15, 1, 2, NULL, NULL, '["23"]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (44, '2024-2025', 5, 'sabado', '2024-09-14', '21:00', 13, 16, 0, 2, false, 1.07, 2.38, 4.75, 3.7, 1.73, 3737, 'Reale Arena', 'Juan Martínez', NULL, NULL, 48, 52, 11, 16, 2, 6, 9, 10, 4, 1, 0, 0, NULL, 5, 3, 1, 3, 12, 12, 9, 2, 1, NULL, NULL, '[]', '["58","75"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (45, '2024-2025', 5, 'domingo', '2024-09-15', '14:00', 5, 17, 3, 1, true, 1.84, 0.51, 1.62, 3.8, 5.5, 2167, 'Estadio Abanca Balaídos', 'Francisco Hernández', NULL, NULL, 54, 46, 14, 6, 9, 2, 5, 4, 3, 5, 0, 0, NULL, 3, 0, 2, 3, 8, 14, 15, 3, 1, NULL, NULL, '["22","35","90+1"]', '["50"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (46, '2024-2025', 5, 'domingo', '2024-09-15', '16:15', 4, 12, 1, 4, true, 1.29, 1.88, 4.33, 4.1, 1.73, 13891, 'Estadi Municipal de Montilivi', 'Alejandro Muñíz', NULL, NULL, 45, 55, 9, 20, 4, 9, 5, 11, 3, 2, 0, 0, NULL, 0, 3, 1, 3, 7, 13, 4, 7, 0, NULL, NULL, '["80"]', '["30","37","47","64"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (47, '2024-2025', 5, 'domingo', '2024-09-15', '18:30', 7, 1, 2, 3, true, 1.42, 2.15, 3.75, 3.4, 2.05, 25908, 'Estadio de Gran Canaria', 'Miguel Ángel Ortiz Arias', NULL, NULL, 65, 35, 15, 9, 6, 4, 9, 5, 1, 2, 0, 0, NULL, 2, 1, 7, 2, 12, 8, 12, 0, 1, NULL, NULL, '["58","83"]', '["7","30","76"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (48, '2024-2025', 5, 'domingo', '2024-09-15', '21:00', 20, 11, 3, 0, false, 3.24, 0.15, 1.38, 4.33, 9.0, 61752, 'Riyadh Air Metropolitan Stadium', 'César Soto', NULL, NULL, 53, 47, 14, 5, 4, 1, 10, 4, 1, 2, 0, 0, NULL, 6, 0, 1, 3, 10, 10, 8, 1, 2, NULL, NULL, '["39","54","90+4"]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (49, '2024-2025', 5, 'lunes', '2024-09-16', '21:00', 14, 9, 3, 1, true, 1.68, 0.33, 2.1, 3.2, 3.8, 13073, 'Campo de Fútbol de Vallecas', 'Alejandro Quintero', NULL, NULL, 66, 34, 17, 5, 6, 2, 11, 3, 3, 2, 0, 0, NULL, 3, 1, 4, 3, 11, 12, 15, 3, 0, NULL, NULL, '["50","66","90+5"]', '["27"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (50, '2024-2025', 7, 'martes', '2024-09-17', '19:00', 15, 13, 1, 0, false, NULL, NULL, 2.90, 3.00, 2.70, 17132, 'Estadi Mallorca Son Moix', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (51, '2024-2025', 3, 'miercoles', '2024-09-18', '19:00', 3, 2, 2, 1, true, 2.93, 0.61, 1.85, 3.1, 5.25, 48547, 'Estadio Benito Villamarín', 'Juan Pulido', NULL, NULL, 66, 34, 17, 15, 7, 5, 10, 10, 3, 5, 0, 0, NULL, 3, 3, 5, 3, 14, 10, 20, 0, 2, NULL, NULL, '["61","74"]', '["90+3"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (52, '2024-2025', 7, 'jueves', '2024-09-19', '19:00', 10, 1, 0, 2, false, NULL, NULL, 2.25, 3.10, 3.50, 8304, 'Estadio Municipal de Butarque', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (53, '2024-2025', 6, 'viernes', '2024-09-20', '21:00', 6, 8, 2, 1, true, NULL, NULL, 2.25, 3.20, 3.40, 16538, 'Estadio de Mendizorroza', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (54, '2024-2025', 6, 'sabado', '2024-09-21', '14:00', 17, 13, 0, 0, false, NULL, NULL, 2.50, 3.10, 3.10, 21171, 'Estadio Municipal José Zorrilla', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (55, '2024-2025', 6, 'sabado', '2024-09-21', '16:15', 9, 7, 2, 1, true, NULL, NULL, 2.15, 3.10, 3.75, 19043, 'Estadio El Sadar', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (56, '2024-2025', 6, 'sabado', '2024-09-21', '18:30', 11, 4, 2, 0, false, NULL, NULL, 2.05, 3.20, 4.00, 40896, 'Estadio de Mestalla', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (57, '2024-2025', 6, 'sabado', '2024-09-21', '21:00', 16, 18, 4, 1, true, NULL, NULL, 1.15, 8.00, 19.00, 17284, 'Estadio Santiago Bernabéu', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (58, '2024-2025', 6, 'domingo', '2024-09-22', '14:00', 2, 10, 1, 1, true, NULL, NULL, 1.95, 3.20, 4.50, 1306, 'Coliseum Alfonso Pérez', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (59, '2024-2025', 6, 'domingo', '2024-09-22', '16:15', 1, 5, 3, 1, true, NULL, NULL, 1.62, 3.75, 6.00, 48737, 'San Mamés', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (60, '2024-2025', 6, 'domingo', '2024-09-22', '18:30', 19, 12, 1, 5, true, NULL, NULL, 4.20, 4.00, 1.75, 22048, 'Estadio de la Cerámica', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (61, '2024-2025', 6, 'domingo', '2024-09-22', '21:00', 14, 20, 1, 1, true, NULL, NULL, 2.20, 3.25, 3.40, 13646, 'Campo de Fútbol de Vallecas', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (62, '2024-2025', 6, 'lunes', '2024-09-23', '21:00', 3, 15, 1, 2, true, NULL, NULL, 1.85, 3.40, 4.50, 47017, 'Estadio Benito Villamarín', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (63, '2024-2025', 7, 'martes', '2024-09-24', '19:00', 8, 17, 2, 1, true, NULL, NULL, 2.15, 3.10, 3.75, 35292, 'Estadio Ramón Sánchez Pizjuán', 'Juan Pulido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (64, '2024-2025', 7, 'martes', '2024-09-24', '19:00', 11, 9, 0, 0, false, NULL, NULL, 2.05, 3.25, 3.90, 40425, 'Estadio de Mestalla', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (65, '2024-2025', 7, 'martes', '2024-09-24', '21:00', 16, 6, 3, 2, true, NULL, NULL, 1.20, 7.00, 15.00, 6748, 'Estadio Santiago Bernabéu', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (66, '2024-2025', 7, 'miercoles', '2024-09-25', '19:00', 4, 14, 0, 0, false, NULL, NULL, 1.73, 3.60, 5.25, 12272, 'Estadi Municipal de Montilivi', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (67, '2024-2025', 7, 'miercoles', '2024-09-25', '21:00', 12, 2, 1, 0, false, NULL, NULL, 1.25, 6.50, 11.00, 44407, 'Estadi Olímpic Lluís Companys', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (68, '2024-2025', 7, 'jueves', '2024-09-26', '19:00', 7, 3, 1, 1, true, NULL, NULL, 2.60, 3.00, 3.00, 22722, 'Estadio de Gran Canaria', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (69, '2024-2025', 7, 'jueves', '2024-09-26', '19:00', 18, 19, 1, 2, true, NULL, NULL, 2.20, 3.20, 3.50, 23147, 'RCDE Stadium', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (70, '2024-2025', 7, 'jueves', '2024-09-26', '21:00', 5, 20, 0, 1, false, NULL, NULL, 3.60, 3.30, 2.15, 21533, 'Estadio Abanca Balaídos', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (71, '2024-2025', 8, 'viernes', '2024-09-27', '21:00', 17, 15, 1, 2, true, NULL, NULL, 2.62, 3.10, 2.90, 20388, 'Estadio Municipal José Zorrilla', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (72, '2024-2025', 8, 'sabado', '2024-09-28', '14:00', 2, 6, 2, 0, false, NULL, NULL, 2.20, 3.10, 3.60, 10006, 'Coliseum Alfonso Pérez', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (73, '2024-2025', 8, 'sabado', '2024-09-28', '16:15', 14, 10, 1, 1, true, NULL, NULL, 3.20, 3.20, 2.35, 13186, 'Campo de Fútbol de Vallecas', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (74, '2024-2025', 8, 'sabado', '2024-09-28', '18:30', 13, 11, 3, 0, false, NULL, NULL, 1.65, 3.75, 5.50, 32332, 'Reale Arena', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (75, '2024-2025', 8, 'sabado', '2024-09-28', '21:00', 9, 12, 4, 2, true, NULL, NULL, 5.50, 4.20, 1.60, 22322, 'Estadio El Sadar', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (76, '2024-2025', 8, 'domingo', '2024-09-29', '14:00', 5, 4, 1, 1, true, NULL, NULL, 1.91, 3.25, 4.50, 21347, 'Estadio Abanca Balaídos', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (77, '2024-2025', 8, 'domingo', '2024-09-29', '16:15', 1, 8, 1, 1, true, NULL, NULL, 1.95, 3.40, 4.00, 48288, 'San Mamés', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (78, '2024-2025', 8, 'domingo', '2024-09-29', '18:30', 3, 18, 1, 0, false, NULL, NULL, 1.44, 4.33, 8.00, 53065, 'Estadio Benito Villamarín', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (79, '2024-2025', 8, 'domingo', '2024-09-29', '21:00', 20, 16, 1, 1, true, NULL, NULL, 2.80, 3.60, 2.45, 70112, 'Riyadh Air Metropolitan Stadium', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (80, '2024-2025', 8, 'lunes', '2024-09-30', '21:00', 19, 7, 3, 1, true, NULL, NULL, 2.05, 3.50, 3.60, 18159, 'Estadio de la Cerámica', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (81, '2024-2025', 9, NULL, '2024-10-04', '21:00', 10, 11, 0, 0, false, NULL, NULL, 2.30, 3.10, 3.40, 10958, 'Estadio Municipal de Butarque', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (82, '2024-2025', 9, NULL, '2024-10-05', '14:00', 18, 15, 2, 1, true, NULL, NULL, 2.30, 3.00, 3.50, 24434, 'RCDE Stadium', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (83, '2024-2025', 9, NULL, '2024-10-05', '16:15', 2, 9, 1, 1, true, NULL, NULL, 2.45, 3.00, 3.30, 1067, 'Coliseum Alfonso Pérez', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (84, '2024-2025', 9, NULL, '2024-10-05', '18:30', 7, 5, 0, 1, false, NULL, NULL, 3.20, 3.10, 2.45, 21482, 'Estadio de Gran Canaria', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (85, '2024-2025', 9, NULL, '2024-10-05', '18:30', 17, 14, 1, 2, true, NULL, NULL, 1.70, 3.80, 5.00, 21112, 'Estadio Municipal José Zorrilla', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (86, '2024-2025', 9, NULL, '2024-10-05', '21:00', 16, 19, 2, 0, false, NULL, NULL, 1.25, 6.00, 11.00, 73842, 'Estadio Santiago Bernabéu', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (87, '2024-2025', 9, NULL, '2024-10-06', '14:00', 4, 1, 2, 1, true, NULL, NULL, 1.57, 3.90, 6.50, 13396, 'Estadi Municipal de Montilivi', 'Juan Pulido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (88, '2024-2025', 9, NULL, '2024-10-06', '16:15', 6, 12, 0, 3, false, NULL, NULL, 1.95, 3.30, 4.20, 19468, 'Estadio de Mendizorroza', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (89, '2024-2025', 9, NULL, '2024-10-06', '18:30', 8, 3, 1, 0, false, NULL, NULL, 2.05, 3.25, 3.90, 42571, 'Estadio Ramón Sánchez Pizjuán', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (90, '2024-2025', 9, NULL, '2024-10-06', '21:00', 13, 20, 1, 1, true, NULL, NULL, 1.85, 3.40, 4.75, 31983, 'Reale Arena', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (91, '2024-2025', 10, NULL, '2024-10-18', '21:00', 6, 17, 2, 3, true, NULL, NULL, 2.05, 3.20, 4.00, 16904, 'Estadio de Mendizorroza', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (92, '2024-2025', 10, NULL, '2024-10-19', '14:00', 1, 18, 4, 1, true, NULL, NULL, 1.95, 3.30, 4.20, 46713, 'San Mamés', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (93, '2024-2025', 10, NULL, '2024-10-19', '16:15', 9, 3, 1, 2, true, NULL, NULL, 1.85, 3.40, 4.75, 21045, 'Estadio El Sadar', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (94, '2024-2025', 10, NULL, '2024-10-19', '18:30', 4, 13, 0, 1, false, NULL, NULL, 2.30, 3.10, 3.40, 12602, 'Estadi Municipal de Montilivi', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (95, '2024-2025', 10, NULL, '2024-10-19', '21:00', 5, 16, 1, 2, true, NULL, NULL, 3.40, 3.30, 2.20, 24445, 'Estadio Abanca Balaídos', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (96, '2024-2025', 10, NULL, '2024-10-20', '14:00', 15, 14, 1, 0, false, NULL, NULL, 1.80, 3.30, 5.25, 18316, 'Estadi Mallorca Son Moix', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (97, '2024-2025', 10, NULL, '2024-10-20', '16:15', 20, 10, 3, 1, true, NULL, NULL, 1.35, 5.25, 9.00, 60122, 'Riyadh Air Metropolitan Stadium', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (98, '2024-2025', 10, NULL, '2024-10-20', '18:30', 19, 2, 1, 1, true, NULL, NULL, 2.15, 3.40, 3.40, 19355, 'Estadio de la Cerámica', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (99, '2024-2025', 10, NULL, '2024-10-20', '21:00', 12, 8, 5, 1, true, NULL, NULL, 1.25, 6.50, 11.00, 47848, 'Estadi Olímpic Lluís Companys', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (100, '2024-2025', 10, NULL, '2024-10-21', '21:00', 11, 7, 2, 3, true, NULL, NULL, 2.20, 3.25, 3.40, 42453, 'Estadio de Mestalla', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (101, '2024-2025', 11, NULL, '2024-10-25', '21:00', 18, 8, 0, 2, false, NULL, NULL, 2.45, 3.10, 3.20, 23656, 'RCDE Stadium', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (102, '2024-2025', 11, NULL, '2024-10-26', '14:00', 17, 19, 1, 2, true, NULL, NULL, 4.40, 3.50, 1.85, 20178, 'Estadio Municipal José Zorrilla', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (103, '2024-2025', 11, NULL, '2024-10-26', '16:15', 14, 6, 1, 0, false, NULL, NULL, 2.30, 3.25, 3.30, 1301, 'Campo de Fútbol de Vallecas', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (104, '2024-2025', 11, NULL, '2024-10-26', '18:30', 7, 4, 1, 0, false, NULL, NULL, 2.62, 3.10, 2.90, 21506, 'Estadio de Gran Canaria', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (105, '2024-2025', 11, NULL, '2024-10-26', '21:00', 16, 12, 0, 4, false, NULL, NULL, 2.05, 3.80, 3.20, 78192, 'Estadio Santiago Bernabéu', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (106, '2024-2025', 11, NULL, '2024-10-27', '14:00', 10, 5, 3, 0, false, NULL, NULL, 2.10, 3.10, 3.90, 11358, 'Estadio Municipal de Butarque', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (107, '2024-2025', 11, NULL, '2024-10-27', '16:15', 2, 11, 1, 1, true, NULL, NULL, 1.65, 3.75, 5.75, 12412, 'Coliseum Alfonso Pérez', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (108, '2024-2025', 11, NULL, '2024-10-27', '18:30', 3, 20, 1, 0, false, NULL, NULL, 1.73, 3.75, 5.00, 52621, 'Estadio Benito Villamarín', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (109, '2024-2025', 11, NULL, '2024-10-27', '21:00', 13, 9, 0, 2, false, NULL, NULL, 1.80, 3.60, 4.50, 31729, 'Reale Arena', 'Juan Pulido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (110, '2024-2025', 11, NULL, '2024-10-28', '21:00', 15, 1, 0, 0, false, NULL, NULL, 3.00, 3.10, 2.60, 19797, 'Estadi Mallorca Son Moix', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (111, '2024-2025', 12, NULL, '2024-11-01', '21:00', 6, 15, 1, 0, false, NULL, NULL, 2.20, 3.20, 3.50, 17212, 'Estadio de Mendizorroza', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (112, '2024-2025', 12, NULL, '2024-11-02', '14:00', 9, 17, 1, 0, false, NULL, NULL, 1.62, 3.75, 6.00, 2043, 'Estadio El Sadar', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (113, '2024-2025', 12, NULL, '2024-11-02', '16:15', 4, 10, 4, 3, true, NULL, NULL, 1.85, 3.40, 4.75, 10839, 'Estadi Municipal de Montilivi', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (114, '2024-2025', 12, NULL, '2024-11-03', '14:00', 20, 7, 2, 0, false, NULL, NULL, 1.30, 5.50, 11.00, 5661, 'Riyadh Air Metropolitan Stadium', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (115, '2024-2025', 12, NULL, '2024-11-03', '16:15', 12, 18, 3, 1, true, NULL, NULL, 1.13, 9.50, 17.00, 48843, 'Estadi Olímpic Lluís Companys', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (116, '2024-2025', 12, NULL, '2024-11-03', '18:30', 8, 13, 0, 2, false, NULL, NULL, 2.15, 3.10, 3.75, 37619, 'Estadio Ramón Sánchez Pizjuán', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (117, '2024-2025', 12, NULL, '2024-11-03', '21:00', 1, 3, 1, 1, true, NULL, NULL, 1.95, 3.30, 4.20, 46898, 'San Mamés', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (118, '2024-2025', 12, NULL, '2024-11-04', '21:00', 5, 2, 1, 0, false, NULL, NULL, 2.30, 3.10, 3.40, 19502, 'Estadio Abanca Balaídos', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (119, '2024-2025', 13, NULL, '2024-11-08', '21:00', 14, 7, 1, 3, true, NULL, NULL, 2.20, 3.25, 3.40, 12978, 'Campo de Fútbol de Vallecas', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (120, '2024-2025', 13, NULL, '2024-11-09', '14:00', 16, 9, 4, 0, false, NULL, NULL, 1.20, 7.00, 14.00, 72462, 'Estadio Santiago Bernabéu', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (121, '2024-2025', 13, NULL, '2024-11-09', '16:15', 19, 6, 3, 0, false, NULL, NULL, 1.85, 3.50, 4.50, 17659, 'Estadio de la Cerámica', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (122, '2024-2025', 13, NULL, '2024-11-09', '21:00', 10, 8, 1, 0, false, NULL, NULL, 2.30, 3.10, 3.40, 11167, 'Estadio Municipal de Butarque', 'Juan Pulido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (123, '2024-2025', 13, NULL, '2024-11-10', '14:00', 3, 5, 2, 2, true, NULL, NULL, 1.95, 3.40, 4.00, 54015, 'Estadio Benito Villamarín', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (124, '2024-2025', 13, NULL, '2024-11-10', '16:15', 15, 20, 0, 1, false, NULL, NULL, 4.00, 3.40, 1.95, 195, 'Estadi Mallorca Son Moix', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (125, '2024-2025', 13, NULL, '2024-11-10', '18:30', 17, 1, 1, 1, true, NULL, NULL, 2.50, 3.10, 3.10, 23515, 'Estadio Municipal José Zorrilla', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (126, '2024-2025', 13, NULL, '2024-11-10', '18:30', 2, 4, 0, 1, false, NULL, NULL, 2.05, 3.30, 3.90, 10923, 'Coliseum Alfonso Pérez', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (127, '2024-2025', 13, NULL, '2024-11-10', '21:00', 13, 12, 1, 0, false, NULL, NULL, 4.33, 3.75, 1.83, 36194, 'Reale Arena', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (128, '2024-2025', 14, NULL, '2024-11-22', '21:00', 2, 17, 2, 0, false, NULL, NULL, 2.00, 3.40, 3.90, 9991, 'Coliseum Alfonso Pérez', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (129, '2024-2025', 14, NULL, '2024-11-23', '14:00', 11, 3, 4, 2, true, NULL, NULL, 2.20, 3.25, 3.40, 43975, 'Estadio de Mestalla', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (130, '2024-2025', 14, NULL, '2024-11-23', '16:15', 20, 6, 2, 1, true, NULL, NULL, 1.33, 5.50, 9.00, 5891, 'Riyadh Air Metropolitan Stadium', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (131, '2024-2025', 14, NULL, '2024-11-23', '18:30', 7, 15, 2, 3, true, NULL, NULL, 2.40, 3.10, 3.25, 2294, 'Estadio de Gran Canaria', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (132, '2024-2025', 14, NULL, '2024-11-23', '18:30', 4, 18, 4, 1, true, NULL, NULL, 1.70, 3.80, 5.25, 12461, 'Estadi Municipal de Montilivi', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (133, '2024-2025', 14, NULL, '2024-11-23', '21:00', 5, 12, 2, 2, true, NULL, NULL, 4.50, 4.00, 1.73, 24573, 'Estadio Abanca Balaídos', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (134, '2024-2025', 14, NULL, '2024-11-24', '14:00', 9, 19, 2, 2, true, NULL, NULL, 2.30, 3.20, 3.30, 19795, 'Estadio El Sadar', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (135, '2024-2025', 14, NULL, '2024-11-24', '16:15', 8, 14, 1, 0, false, NULL, NULL, 2.15, 3.10, 3.75, 35125, 'Estadio Ramón Sánchez Pizjuán', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (136, '2024-2025', 14, NULL, '2024-11-24', '18:30', 10, 16, 0, 3, false, NULL, NULL, 8.50, 4.75, 1.38, 12338, 'Estadio Municipal de Butarque', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (137, '2024-2025', 14, NULL, '2024-11-24', '21:00', 1, 13, 1, 0, false, NULL, NULL, 2.15, 3.10, 3.75, 50719, 'San Mamés', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (138, '2024-2025', 15, NULL, '2024-11-29', '21:00', 15, 11, 2, 1, true, NULL, NULL, 1.85, 3.40, 4.75, 17717, 'Estadi Mallorca Son Moix', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (139, '2024-2025', 15, NULL, '2024-11-30', '14:00', 12, 7, 1, 2, true, NULL, NULL, 1.25, 6.50, 11.00, 43921, 'Estadi Olímpic Lluís Companys', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (140, '2024-2025', 15, NULL, '2024-11-30', '16:15', 6, 10, 1, 1, true, NULL, NULL, 2.45, 3.10, 3.10, 16881, 'Estadio de Mendizorroza', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (141, '2024-2025', 15, NULL, '2024-11-30', '18:30', 18, 5, 3, 1, true, NULL, NULL, 2.30, 3.10, 3.40, 23792, 'RCDE Stadium', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (142, '2024-2025', 15, NULL, '2024-11-30', '21:00', 17, 20, 0, 5, false, NULL, NULL, 2.50, 3.10, 3.10, 23482, 'Estadio Municipal José Zorrilla', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (143, '2024-2025', 15, NULL, '2024-12-01', '14:00', 19, 4, 2, 2, true, NULL, NULL, 2.05, 3.40, 3.60, 17732, 'Estadio de la Cerámica', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (144, '2024-2025', 15, NULL, '2024-12-01', '16:15', 16, 2, 2, 0, false, NULL, NULL, 1.30, 5.50, 10.00, 74341, 'Estadio Santiago Bernabéu', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (145, '2024-2025', 15, NULL, '2024-12-01', '18:30', 14, 1, 1, 2, true, NULL, NULL, 3.25, 3.25, 2.30, 13639, 'Campo de Fútbol de Vallecas', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (146, '2024-2025', 15, NULL, '2024-12-01', '21:00', 13, 3, 2, 0, false, NULL, NULL, 2.15, 3.10, 3.75, 28119, 'Reale Arena', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (147, '2024-2025', 15, NULL, '2024-12-02', '21:00', 8, 9, 1, 1, true, NULL, NULL, 1.80, 3.60, 4.50, 31536, 'Estadio Ramón Sánchez Pizjuán', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (148, '2024-2025', 19, NULL, '2024-12-03', '19:00', 15, 12, 1, 5, true, NULL, NULL, 1.85, 3.50, 4.60, 22352, 'Estadi Mallorca Son Moix', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (149, '2024-2025', 19, NULL, '2024-12-04', '21:00', 1, 16, 2, 1, true, NULL, NULL, 2.80, 4.00, 2.25, 51364, 'San Mamés', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (150, '2024-2025', 16, NULL, '2024-12-06', '21:00', 5, 15, 2, 0, false, NULL, NULL, 2.45, 3.10, 3.20, 22861, 'Estadio Abanca Balaídos', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (151, '2024-2025', 16, NULL, '2024-12-07', '14:00', 7, 17, 2, 1, true, NULL, NULL, 2.62, 3.10, 2.90, 2161, 'Estadio de Gran Canaria', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (152, '2024-2025', 16, NULL, '2024-12-07', '16:15', 3, 12, 2, 2, true, NULL, NULL, 5.50, 4.33, 1.55, 51749, 'Estadio Benito Villamarín', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (153, '2024-2025', 16, NULL, '2024-12-07', '18:30', 11, 14, 0, 1, false, NULL, NULL, 2.30, 3.20, 3.25, 40968, 'Estadio de Mestalla', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (154, '2024-2025', 16, NULL, '2024-12-07', '21:00', 4, 16, 0, 3, false, NULL, NULL, 2.05, 3.80, 3.20, 13827, 'Estadi Municipal de Montilivi', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (155, '2024-2025', 16, NULL, '2024-12-08', '14:00', 10, 13, 0, 3, false, NULL, NULL, 2.30, 3.25, 3.30, 11312, 'Estadio Municipal de Butarque', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (156, '2024-2025', 16, NULL, '2024-12-08', '16:15', 1, 19, 2, 0, false, NULL, NULL, 1.95, 3.30, 4.20, 47203, 'San Mamés', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (157, '2024-2025', 16, NULL, '2024-12-08', '18:30', 9, 6, 2, 2, true, NULL, NULL, 1.85, 3.40, 4.50, 1822, 'Estadio El Sadar', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (158, '2024-2025', 16, NULL, '2024-12-08', '21:00', 20, 8, 4, 3, true, NULL, NULL, 2.10, 3.10, 3.90, 60065, 'Riyadh Air Metropolitan Stadium', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (159, '2024-2025', 16, NULL, '2024-12-09', '21:00', 2, 18, 1, 0, false, NULL, NULL, 1.65, 3.75, 5.75, 7559, 'Coliseum Alfonso Pérez', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (160, '2024-2025', 17, NULL, '2024-12-13', '21:00', 17, 11, 1, 0, false, NULL, NULL, 2.50, 3.10, 3.10, 18449, 'Estadio Municipal José Zorrilla', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (161, '2024-2025', 17, NULL, '2024-12-14', '14:00', 18, 9, 0, 0, false, NULL, NULL, 2.30, 3.10, 3.40, 20513, 'RCDE Stadium', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (162, '2024-2025', 17, NULL, '2024-12-14', '16:15', 15, 4, 2, 1, true, NULL, NULL, 2.80, 3.20, 2.62, 15866, 'Estadi Mallorca Son Moix', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (163, '2024-2025', 17, NULL, '2024-12-14', '18:30', 8, 5, 1, 0, false, NULL, NULL, 1.80, 3.60, 4.50, 37295, 'Estadio Ramón Sánchez Pizjuán', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (164, '2024-2025', 17, NULL, '2024-12-14', '21:00', 14, 16, 3, 3, true, NULL, NULL, 5.75, 4.20, 1.57, 14168, 'Campo de Fútbol de Vallecas', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (165, '2024-2025', 17, NULL, '2024-12-15', '14:00', 20, 2, 1, 0, false, NULL, NULL, 1.30, 5.25, 11.00, 60169, 'Riyadh Air Metropolitan Stadium', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (166, '2024-2025', 17, NULL, '2024-12-15', '16:15', 6, 1, 1, 1, true, NULL, NULL, 2.20, 3.20, 3.50, 19239, 'Estadio de Mendizorroza', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (167, '2024-2025', 17, NULL, '2024-12-15', '18:30', 13, 7, 0, 0, false, NULL, NULL, 2.15, 3.10, 3.75, 30775, 'Reale Arena', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (168, '2024-2025', 17, NULL, '2024-12-15', '18:30', 19, 3, 1, 2, true, NULL, NULL, 2.05, 3.40, 3.60, 18757, 'Estadio de la Cerámica', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (169, '2024-2025', 17, NULL, '2024-12-15', '21:00', 12, 10, 0, 1, false, NULL, NULL, 1.25, 6.50, 11.00, 39523, 'Estadi Olímpic Lluís Companys', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (170, '2024-2025', 12, NULL, '2024-12-18', '21:30', 19, 14, 1, 1, true, NULL, NULL, 2.05, 3.40, 3.60, 14, 'Estadio de la Cerámica', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (171, '2024-2025', 13, NULL, '2024-12-18', '21:30', 18, 11, 1, 1, true, NULL, NULL, 2.45, 3.10, 3.10, 18122, 'RCDE Stadium', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (172, '2024-2025', 18, NULL, '2024-12-20', '21:00', 4, 17, 3, 0, false, NULL, NULL, 1.95, 3.30, 4.20, 9534, 'Estadi Municipal de Montilivi', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (173, '2024-2025', 18, NULL, '2024-12-21', '14:00', 2, 15, 0, 1, false, NULL, NULL, 2.20, 3.25, 3.40, 9747, 'Coliseum Alfonso Pérez', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (174, '2024-2025', 18, NULL, '2024-12-21', '16:15', 5, 13, 2, 0, false, NULL, NULL, 2.30, 3.10, 3.40, 22956, 'Estadio Abanca Balaídos', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (175, '2024-2025', 18, NULL, '2024-12-21', '18:30', 9, 1, 1, 2, true, NULL, NULL, 1.65, 3.75, 5.75, 2203, 'Estadio El Sadar', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (176, '2024-2025', 18, NULL, '2024-12-21', '21:00', 12, 20, 1, 2, true, NULL, NULL, 1.85, 3.70, 4.00, 46249, 'Estadi Olímpic Lluís Companys', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (177, '2024-2025', 18, NULL, '2024-12-22', '14:00', 11, 6, 2, 2, true, NULL, NULL, 2.05, 3.20, 4.00, 37586, 'Estadio de Mestalla', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (178, '2024-2025', 18, NULL, '2024-12-22', '16:15', 16, 8, 4, 2, true, NULL, NULL, 1.40, 4.50, 8.50, 75227, 'Estadio Santiago Bernabéu', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (179, '2024-2025', 18, NULL, '2024-12-22', '18:30', 7, 18, 1, 0, false, NULL, NULL, 2.45, 3.10, 3.10, 23743, 'Estadio de Gran Canaria', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (180, '2024-2025', 18, NULL, '2024-12-22', '18:30', 10, 19, 2, 5, true, NULL, NULL, 2.45, 3.10, 3.20, 11034, 'Estadio Municipal de Butarque', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (181, '2024-2025', 18, NULL, '2024-12-22', '21:00', 3, 14, 1, 1, true, NULL, NULL, 1.95, 3.40, 4.00, 53121, 'Estadio Benito Villamarín', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (182, '2024-2025', 12, NULL, '2025-01-03', '21:00', 11, 16, 1, 2, true, NULL, NULL, 5.50, 4.00, 1.62, 4642, 'Estadio de Mestalla', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (183, '2024-2025', 19, NULL, '2025-01-10', '21:00', 14, 5, 2, 1, true, NULL, NULL, 3.20, 3.10, 2.45, 12955, 'Campo de Fútbol de Vallecas', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (184, '2024-2025', 19, NULL, '2025-01-11', '14:00', 6, 4, 0, 1, false, NULL, NULL, 2.10, 3.30, 3.80, 16454, 'Estadio de Mendizorroza', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (185, '2024-2025', 19, NULL, '2025-01-11', '16:15', 17, 3, 1, 0, false, NULL, NULL, 2.30, 3.20, 3.35, 21911, 'Estadio Municipal José Zorrilla', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (186, '2024-2025', 19, NULL, '2025-01-11', '18:30', 18, 10, 1, 1, true, NULL, NULL, 2.40, 3.10, 3.25, 26606, 'RCDE Stadium', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (187, '2024-2025', 19, NULL, '2025-01-11', '21:00', 8, 11, 1, 1, true, NULL, NULL, 2.55, 3.15, 3.00, 34297, 'Estadio Ramón Sánchez Pizjuán', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (188, '2024-2025', 19, NULL, '2025-01-12', '14:00', 7, 2, 1, 2, true, NULL, NULL, 3.10, 3.20, 2.45, 23698, 'Estadio de Gran Canaria', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (189, '2024-2025', 19, NULL, '2025-01-12', '16:15', 20, 9, 1, 0, false, NULL, NULL, 1.55, 3.90, 6.50, 64801, 'Riyadh Air Metropolitan Stadium', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (190, '2024-2025', 19, NULL, '2025-01-13', '21:00', 13, 19, 1, 0, false, NULL, NULL, 2.30, 3.30, 3.20, 20855, 'Reale Arena', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (191, '2024-2025', 20, NULL, '2025-01-17', '21:00', 18, 17, 2, 1, true, NULL, NULL, 2.25, 3.10, 3.50, 23554, 'RCDE Stadium', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (192, '2024-2025', 20, NULL, '2025-01-18', '14:00', 4, 8, 1, 2, true, NULL, NULL, 1.35, 5.00, 9.50, 1204, 'Estadi Municipal de Montilivi', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (193, '2024-2025', 20, NULL, '2025-01-18', '16:15', 10, 20, 1, 0, false, NULL, NULL, 6.00, 4.00, 1.57, 12371, 'Estadio Municipal de Butarque', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (194, '2024-2025', 20, NULL, '2025-01-18', '18:30', 3, 6, 1, 3, true, NULL, NULL, 2.05, 3.40, 3.85, 50021, 'Estadio Benito Villamarín', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (195, '2024-2025', 20, NULL, '2025-01-18', '21:00', 2, 12, 1, 1, true, NULL, NULL, 8.00, 5.00, 1.36, 15134, 'Coliseum Alfonso Pérez', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (196, '2024-2025', 20, NULL, '2025-01-19', '14:00', 5, 1, 1, 2, true, NULL, NULL, 1.95, 3.45, 4.10, 22279, 'Estadio Abanca Balaídos', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (197, '2024-2025', 20, NULL, '2025-01-19', '16:15', 16, 7, 4, 1, true, NULL, NULL, 1.18, 7.50, 16.00, 74808, 'Estadio Santiago Bernabéu', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (198, '2024-2025', 20, NULL, '2025-01-19', '18:30', 9, 14, 1, 1, true, NULL, NULL, 2.20, 3.25, 3.45, 2077, 'Estadio El Sadar', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (199, '2024-2025', 20, NULL, '2025-01-19', '21:00', 11, 13, 1, 0, false, NULL, NULL, 1.70, 3.80, 5.25, 40791, 'Estadio de Mestalla', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (200, '2024-2025', 20, NULL, '2025-01-20', '21:00', 19, 15, 4, 0, false, NULL, NULL, 2.00, 3.50, 3.80, 14852, 'Estadio de la Cerámica', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (201, '2024-2025', 21, NULL, '2025-01-24', '21:00', 7, 9, 1, 1, true, NULL, NULL, 3.20, 3.10, 2.45, 19762, 'Estadio de Gran Canaria', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (202, '2024-2025', 21, NULL, '2025-01-25', '14:00', 15, 3, 0, 1, false, NULL, NULL, 2.45, 3.20, 3.00, 19452, 'Estadi Mallorca Son Moix', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (203, '2024-2025', 21, NULL, '2025-01-25', '16:15', 20, 19, 1, 1, true, NULL, NULL, 1.85, 3.60, 4.20, 63596, 'Riyadh Air Metropolitan Stadium', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (204, '2024-2025', 21, NULL, '2025-01-25', '18:30', 8, 18, 1, 1, true, NULL, NULL, 2.05, 3.30, 4.00, 33602, 'Estadio Ramón Sánchez Pizjuán', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (205, '2024-2025', 21, NULL, '2025-01-25', '21:00', 17, 16, 0, 3, false, NULL, NULL, 2.50, 3.10, 3.10, 26025, 'Estadio Municipal José Zorrilla', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (206, '2024-2025', 21, NULL, '2025-01-26', '14:00', 14, 4, 2, 1, true, NULL, NULL, 2.20, 3.25, 3.40, 12405, 'Campo de Fútbol de Vallecas', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (207, '2024-2025', 21, NULL, '2025-01-26', '16:15', 13, 2, 0, 3, false, NULL, NULL, 1.80, 3.40, 5.00, 30004, 'Reale Arena', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (208, '2024-2025', 21, NULL, '2025-01-26', '18:30', 1, 10, 0, 0, false, NULL, NULL, 1.90, 3.40, 4.30, 47612, 'San Mamés', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (209, '2024-2025', 21, NULL, '2025-01-26', '21:00', 12, 11, 7, 1, true, NULL, NULL, 1.22, 7.50, 9.50, 45312, 'Estadi Olímpic Lluís Companys', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (210, '2024-2025', 21, NULL, '2025-01-27', '21:00', 6, 5, 1, 1, true, NULL, NULL, 2.25, 3.15, 3.45, 13612, 'Estadio de Mendizorroza', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (211, '2024-2025', 22, NULL, '2025-01-31', '21:00', 10, 14, 0, 1, false, NULL, NULL, 2.60, 3.00, 3.00, 11432, 'Estadio Municipal de Butarque', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (212, '2024-2025', 22, NULL, '2025-02-01', '14:00', 2, 8, 0, 0, false, NULL, NULL, 2.40, 3.10, 3.25, 1173, 'Coliseum Alfonso Pérez', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (213, '2024-2025', 22, NULL, '2025-02-01', '16:15', 19, 17, 5, 1, true, NULL, NULL, 2.00, 3.50, 3.80, 17032, 'Estadio de la Cerámica', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (214, '2024-2025', 22, NULL, '2025-02-01', '18:30', 20, 15, 2, 0, false, NULL, NULL, 1.35, 5.25, 9.00, 6071, 'Riyadh Air Metropolitan Stadium', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (215, '2024-2025', 22, NULL, '2025-02-01', '21:00', 18, 16, 1, 0, false, NULL, NULL, 9.00, 5.50, 1.30, 33669, 'RCDE Stadium', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (216, '2024-2025', 22, NULL, '2025-02-02', '14:00', 12, 6, 1, 0, false, NULL, NULL, 1.15, 8.00, 15.00, 429, 'Estadi Olímpic Lluís Companys', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (217, '2024-2025', 22, NULL, '2025-02-02', '16:15', 11, 5, 2, 1, true, NULL, NULL, 1.70, 3.80, 5.25, 42273, 'Estadio de Mestalla', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (218, '2024-2025', 22, NULL, '2025-02-02', '18:30', 9, 13, 2, 1, true, NULL, NULL, 2.20, 3.25, 3.45, 21678, 'Estadio El Sadar', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (219, '2024-2025', 22, NULL, '2025-02-02', '21:00', 3, 1, 2, 2, true, NULL, NULL, 2.05, 3.40, 3.85, 49292, 'Estadio Benito Villamarín', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (220, '2024-2025', 22, NULL, '2025-02-03', '21:00', 4, 7, 2, 1, true, NULL, NULL, 1.62, 3.90, 5.80, 10088, 'Estadi Municipal de Montilivi', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (221, '2024-2025', 23, NULL, '2025-02-07', '21:00', 14, 17, 1, 0, false, NULL, NULL, 2.20, 3.25, 3.40, 12286, 'Campo de Fútbol de Vallecas', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (222, '2024-2025', 23, NULL, '2025-02-08', '14:00', 5, 3, 3, 2, true, NULL, NULL, 2.20, 3.30, 3.40, 22651, 'Estadio Abanca Balaídos', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (223, '2024-2025', 23, NULL, '2025-02-08', '16:15', 1, 4, 3, 0, false, NULL, NULL, 1.90, 3.40, 4.30, 48261, 'San Mamés', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (224, '2024-2025', 23, NULL, '2025-02-08', '18:30', 7, 19, 1, 2, true, NULL, NULL, 3.20, 3.10, 2.45, 22909, 'Estadio de Gran Canaria', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (225, '2024-2025', 23, NULL, '2025-02-08', '21:00', 16, 20, 1, 1, true, NULL, NULL, 1.75, 3.80, 4.75, 78082, 'Estadio Santiago Bernabéu', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (226, '2024-2025', 23, NULL, '2025-02-09', '14:00', 6, 2, 0, 1, false, NULL, NULL, 2.25, 3.15, 3.45, 16236, 'Estadio de Mendizorroza', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (227, '2024-2025', 23, NULL, '2025-02-09', '16:15', 11, 10, 2, 0, false, NULL, NULL, 1.80, 3.40, 5.25, 42312, 'Estadio de Mestalla', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (228, '2024-2025', 23, NULL, '2025-02-09', '18:30', 13, 18, 2, 1, true, NULL, NULL, 1.75, 3.50, 5.00, 29478, 'Reale Arena', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (229, '2024-2025', 23, NULL, '2025-02-09', '21:00', 8, 12, 1, 4, true, NULL, NULL, 2.05, 3.30, 4.00, 38592, 'Estadio Ramón Sánchez Pizjuán', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (230, '2024-2025', 23, NULL, '2025-02-10', '21:00', 15, 9, 1, 1, true, NULL, NULL, 1.95, 3.25, 4.20, 15378, 'Estadi Mallorca Son Moix', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (231, '2024-2025', 24, NULL, '2025-02-14', '21:00', 4, 2, 1, 2, true, NULL, NULL, 1.70, 3.80, 5.00, 10354, 'Estadi Municipal de Montilivi', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (232, '2024-2025', 24, NULL, '2025-02-15', '14:00', 10, 6, 3, 3, true, NULL, NULL, 2.50, 3.10, 3.10, 10681, 'Estadio Municipal de Butarque', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (233, '2024-2025', 24, NULL, '2025-02-15', '16:15', 9, 16, 1, 1, true, NULL, NULL, 5.50, 4.20, 1.55, 2239, 'Estadio El Sadar', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (234, '2024-2025', 24, NULL, '2025-02-15', '18:30', 20, 5, 1, 1, true, NULL, NULL, 1.45, 4.33, 7.50, 64211, 'Riyadh Air Metropolitan Stadium', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (235, '2024-2025', 24, NULL, '2025-02-15', '21:00', 19, 11, 1, 1, true, NULL, NULL, 1.80, 3.75, 4.20, 19701, 'Estadio de la Cerámica', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (236, '2024-2025', 24, NULL, '2025-02-16', '14:00', 18, 1, 1, 1, true, NULL, NULL, 3.40, 3.30, 2.20, 26645, 'RCDE Stadium', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (237, '2024-2025', 24, NULL, '2025-02-16', '16:15', 17, 8, 0, 4, false, NULL, NULL, 2.60, 3.20, 2.80, 22123, 'Estadio Municipal José Zorrilla', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (238, '2024-2025', 24, NULL, '2025-02-16', '18:30', 15, 7, 3, 1, true, NULL, NULL, 2.05, 3.25, 3.90, 18475, 'Estadi Mallorca Son Moix', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (239, '2024-2025', 24, NULL, '2025-02-16', '21:00', 3, 13, 3, 0, false, NULL, NULL, 2.30, 3.40, 3.10, 48758, 'Estadio Benito Villamarín', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (240, '2024-2025', 24, NULL, '2025-02-17', '21:00', 12, 14, 1, 0, false, NULL, NULL, 1.20, 7.00, 13.00, 45296, 'Estadi Olímpic Lluís Companys', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (241, '2024-2025', 25, NULL, '2025-02-21', '21:00', 5, 9, 1, 0, false, NULL, NULL, 1.85, 3.60, 4.10, 22005, 'Estadio Abanca Balaídos', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (242, '2024-2025', 25, NULL, '2025-02-22', '14:00', 6, 18, 0, 1, false, NULL, NULL, 1.83, 3.25, 5.00, 17068, 'Estadio de Mendizorroza', 'Juan Pulido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (243, '2024-2025', 25, NULL, '2025-02-22', '16:15', 14, 19, 0, 1, false, NULL, NULL, 2.90, 3.50, 2.30, 13373, 'Campo de Fútbol de Vallecas', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (244, '2024-2025', 25, NULL, '2025-02-22', '18:30', 11, 20, 0, 3, false, NULL, NULL, 4.20, 3.40, 1.91, 46297, 'Estadio de Mestalla', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (245, '2024-2025', 25, NULL, '2025-02-22', '21:00', 7, 12, 0, 2, false, NULL, NULL, 9.50, 6.00, 1.25, 30746, 'Estadio de Gran Canaria', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (246, '2024-2025', 25, NULL, '2025-02-23', '14:00', 1, 17, 7, 1, true, NULL, NULL, 1.18, 7.00, 12.00, 47715, 'San Mamés', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (247, '2024-2025', 25, NULL, '2025-02-23', '16:15', 16, 4, 2, 0, false, NULL, NULL, 1.30, 6.00, 8.00, 74028, 'Estadio Santiago Bernabéu', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (248, '2024-2025', 25, NULL, '2025-02-23', '18:30', 2, 3, 1, 2, true, NULL, NULL, 2.50, 3.25, 2.80, 13964, 'Coliseum Alfonso Pérez', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (249, '2024-2025', 25, NULL, '2025-02-23', '21:00', 13, 10, 3, 0, false, NULL, NULL, 1.53, 3.75, 7.50, 22533, 'Reale Arena', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (250, '2024-2025', 25, NULL, '2025-02-24', '21:00', 8, 15, 1, 1, true, NULL, NULL, 2.05, 3.20, 3.80, 35424, 'Estadio Ramón Sánchez Pizjuán', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (251, '2024-2025', 26, NULL, '2025-02-28', '21:00', 17, 7, 1, 1, true, NULL, NULL, 3.00, 3.20, 2.40, 16024, 'Estadio Municipal José Zorrilla', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (252, '2024-2025', 26, NULL, '2025-03-01', '14:00', 4, 5, 2, 2, true, NULL, NULL, 2.10, 3.50, 3.40, 11449, 'Estadi Municipal de Montilivi', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (253, '2024-2025', 26, NULL, '2025-03-01', '16:15', 14, 8, 1, 1, true, NULL, NULL, 2.20, 3.25, 3.30, 11947, 'Campo de Fútbol de Vallecas', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (254, '2024-2025', 26, NULL, '2025-03-01', '18:30', 3, 16, 2, 1, true, NULL, NULL, 4.50, 3.90, 1.70, 55873, 'Estadio Benito Villamarín', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (255, '2024-2025', 26, NULL, '2025-03-01', '21:00', 20, 1, 1, 0, false, NULL, NULL, 2.05, 3.40, 3.60, 6381, 'Riyadh Air Metropolitan Stadium', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (256, '2024-2025', 26, NULL, '2025-03-02', '14:00', 10, 2, 1, 0, false, NULL, NULL, 2.80, 2.63, 3.00, 10311, 'Estadio Municipal de Butarque', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (257, '2024-2025', 26, NULL, '2025-03-02', '16:15', 12, 13, 4, 0, false, NULL, NULL, 1.25, 5.50, 11.00, 46324, 'Estadi Olímpic Lluís Companys', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (258, '2024-2025', 26, NULL, '2025-03-02', '18:30', 15, 6, 1, 1, true, NULL, NULL, 2.20, 3.10, 3.60, 17702, 'Estadi Mallorca Son Moix', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (259, '2024-2025', 26, NULL, '2025-03-02', '21:00', 9, 11, 3, 3, true, NULL, NULL, 2.25, 3.10, 3.30, 1923, 'Estadio El Sadar', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (260, '2024-2025', 27, NULL, '2025-03-08', '14:00', 5, 10, 2, 1, true, NULL, NULL, 1.80, 3.60, 4.33, 17326, 'Estadio Abanca Balaídos', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (261, '2024-2025', 27, NULL, '2025-03-08', '16:15', 6, 19, 1, 0, false, NULL, NULL, 2.60, 3.30, 2.70, 16582, 'Estadio de Mendizorroza', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (262, '2024-2025', 27, NULL, '2025-03-08', '18:30', 11, 17, 2, 1, true, NULL, NULL, 1.95, 3.00, 4.50, 4172, 'Estadio de Mestalla', 'Juan Pulido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (263, '2024-2025', 27, NULL, '2025-03-09', '14:00', 2, 20, 2, 1, true, NULL, NULL, 4.20, 3.50, 1.90, 12862, 'Coliseum Alfonso Pérez', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (264, '2024-2025', 27, NULL, '2025-03-09', '16:15', 16, 14, 2, 1, true, NULL, NULL, 1.30, 5.75, 9.50, 7417, 'Estadio Santiago Bernabéu', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (265, '2024-2025', 27, NULL, '2025-03-09', '18:30', 3, 7, 1, 0, false, NULL, NULL, 1.61, 4.24, 5.53, 49292, 'Estadio Benito Villamarín', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (266, '2024-2025', 27, NULL, '2025-03-09', '18:30', 1, 15, 1, 1, true, NULL, NULL, 1.89, 3.30, 4.91, 48203, 'San Mamés', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (267, '2024-2025', 27, NULL, '2025-03-09', '21:00', 13, 8, 0, 1, false, NULL, NULL, 1.90, 3.40, 4.33, 25478, 'Reale Arena', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (268, '2024-2025', 27, NULL, '2025-03-10', '21:00', 18, 4, 1, 1, true, NULL, NULL, 2.15, 3.50, 3.30, 23997, 'RCDE Stadium', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (269, '2024-2025', 28, NULL, '2025-03-14', '21:00', 7, 6, 2, 2, true, NULL, NULL, 3.20, 3.10, 2.45, 17566, 'Estadio de Gran Canaria', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (270, '2024-2025', 28, NULL, '2025-03-15', '14:00', 17, 5, 0, 1, false, NULL, NULL, 2.50, 3.10, 3.10, 17521, 'Estadio Municipal José Zorrilla', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (271, '2024-2025', 28, NULL, '2025-03-15', '16:15', 15, 18, 2, 1, true, NULL, NULL, 2.10, 3.25, 3.75, 1824, 'Estadi Mallorca Son Moix', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (272, '2024-2025', 28, NULL, '2025-03-15', '18:30', 19, 16, 1, 2, true, NULL, NULL, 2.05, 3.40, 3.60, 20559, 'Estadio de la Cerámica', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (273, '2024-2025', 28, NULL, '2025-03-15', '21:00', 4, 11, 1, 1, true, NULL, NULL, 1.85, 3.50, 4.50, 10262, 'Estadi Municipal de Montilivi', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (274, '2024-2025', 28, NULL, '2025-03-16', '14:00', 10, 3, 2, 3, true, NULL, NULL, 3.30, 3.20, 2.30, 11691, 'Estadio Municipal de Butarque', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (275, '2024-2025', 28, NULL, '2025-03-16', '16:15', 8, 1, 0, 1, false, NULL, NULL, 2.15, 3.10, 3.75, 37016, 'Estadio Ramón Sánchez Pizjuán', 'Juan Pulido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (276, '2024-2025', 28, NULL, '2025-03-16', '18:30', 9, 2, 1, 2, true, NULL, NULL, 1.85, 3.40, 4.75, 19611, 'Estadio El Sadar', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (277, '2024-2025', 28, NULL, '2025-03-16', '18:30', 14, 13, 2, 2, true, NULL, NULL, 3.00, 3.20, 2.45, 12364, 'Campo de Fútbol de Vallecas', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (278, '2024-2025', 28, NULL, '2025-03-16', '21:00', 20, 12, 2, 4, true, NULL, NULL, 2.05, 3.25, 3.90, 67602, 'Riyadh Air Metropolitan Stadium', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (279, '2024-2025', 27, NULL, '2025-03-27', '21:00', 12, 9, 3, 0, false, NULL, NULL, 1.18, 7.50, 15.00, 42319, 'Estadi Olímpic Lluís Companys', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (280, '2024-2025', 29, NULL, '2025-03-29', '14:00', 13, 17, 2, 1, true, NULL, NULL, 1.80, 3.60, 4.50, 28151, 'Reale Arena', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (281, '2024-2025', 29, NULL, '2025-03-29', '16:15', 18, 20, 1, 1, true, NULL, NULL, 2.45, 3.10, 3.10, 30559, 'RCDE Stadium', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (282, '2024-2025', 29, NULL, '2025-03-29', '18:30', 6, 14, 0, 2, false, NULL, NULL, 2.00, 3.25, 4.00, 18336, 'Estadio de Mendizorroza', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (283, '2024-2025', 29, NULL, '2025-03-29', '21:00', 16, 10, 3, 2, true, NULL, NULL, 1.30, 5.50, 11.00, 73641, 'Estadio Santiago Bernabéu', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (284, '2024-2025', 29, NULL, '2025-03-30', '14:00', 2, 19, 1, 2, true, NULL, NULL, 1.95, 3.30, 3.90, 11406, 'Coliseum Alfonso Pérez', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (285, '2024-2025', 29, NULL, '2025-03-30', '16:15', 12, 4, 4, 1, true, NULL, NULL, 1.65, 4.00, 5.00, 48258, 'Estadi Olímpic Lluís Companys', 'Juan Pulido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (286, '2024-2025', 29, NULL, '2025-03-30', '18:30', 11, 15, 1, 0, false, NULL, NULL, 1.90, 3.30, 4.50, 44082, 'Estadio de Mestalla', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (287, '2024-2025', 29, NULL, '2025-03-30', '18:30', 1, 9, 0, 0, false, NULL, NULL, 1.70, 3.75, 5.25, 49671, 'San Mamés', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (288, '2024-2025', 29, NULL, '2025-03-30', '21:00', 3, 8, 2, 1, true, NULL, NULL, 2.05, 3.50, 3.60, 58538, 'Estadio Benito Villamarín', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (289, '2024-2025', 29, NULL, '2025-03-31', '21:00', 5, 7, 1, 1, true, NULL, NULL, 2.15, 3.40, 3.40, 18549, 'Estadio Abanca Balaídos', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (290, '2024-2025', 30, NULL, '2025-04-04', '21:00', 14, 18, 0, 4, false, NULL, NULL, 2.25, 3.10, 3.50, 11905, 'Campo de Fútbol de Vallecas', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (291, '2024-2025', 30, NULL, '2025-04-05', '14:00', 4, 6, 0, 1, false, NULL, NULL, 1.62, 3.80, 5.75, 11384, 'Estadi Municipal de Montilivi', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (292, '2024-2025', 30, NULL, '2025-04-05', '16:15', 16, 11, 1, 2, true, NULL, NULL, 1.25, 6.00, 11.00, 75382, 'Estadio Santiago Bernabéu', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (293, '2024-2025', 30, NULL, '2025-04-05', '18:30', 15, 5, 1, 2, true, NULL, NULL, 2.20, 3.20, 3.50, 18291, 'Estadi Mallorca Son Moix', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (294, '2024-2025', 30, NULL, '2025-04-05', '21:00', 12, 3, 1, 1, true, NULL, NULL, 1.27, 6.00, 9.00, 47043, 'Estadi Olímpic Lluís Companys', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (295, '2024-2025', 30, NULL, '2025-04-06', '14:00', 7, 13, 1, 3, true, NULL, NULL, 2.40, 3.10, 3.25, 22616, 'Estadio de Gran Canaria', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (296, '2024-2025', 30, NULL, '2025-04-06', '16:15', 8, 20, 1, 2, true, NULL, NULL, 2.15, 3.10, 3.75, 34505, 'Estadio Ramón Sánchez Pizjuán', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (297, '2024-2025', 30, NULL, '2025-04-06', '18:30', 17, 2, 0, 4, false, NULL, NULL, 2.50, 3.10, 3.10, 17737, 'Estadio Municipal José Zorrilla', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (298, '2024-2025', 30, NULL, '2025-04-06', '21:00', 19, 1, 0, 0, false, NULL, NULL, 2.30, 3.50, 3.00, 19158, 'Estadio de la Cerámica', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (299, '2024-2025', 30, NULL, '2025-04-07', '21:00', 10, 9, 1, 1, true, NULL, NULL, 2.10, 3.20, 3.80, 10755, 'Estadio Municipal de Butarque', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (300, '2024-2025', 31, NULL, '2025-04-11', '21:00', 11, 8, 1, 0, false, NULL, NULL, 2.40, 3.25, 3.00, 45618, 'Estadio de Mestalla', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (301, '2024-2025', 31, NULL, '2025-04-12', '14:00', 13, 15, 0, 2, false, NULL, NULL, 2.15, 3.10, 3.80, 29181, 'Reale Arena', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (302, '2024-2025', 31, NULL, '2025-04-12', '16:15', 2, 7, 1, 3, true, NULL, NULL, 1.95, 3.30, 4.20, 837, 'Coliseum Alfonso Pérez', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (303, '2024-2025', 31, NULL, '2025-04-12', '18:30', 5, 18, 0, 2, false, NULL, NULL, 2.45, 3.10, 3.10, 19801, 'Estadio Abanca Balaídos', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (304, '2024-2025', 31, NULL, '2025-04-12', '21:00', 10, 12, 0, 1, false, NULL, NULL, 2.15, 3.10, 3.75, 1253, 'Estadio Municipal de Butarque', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (305, '2024-2025', 31, NULL, '2025-04-13', '14:00', 9, 4, 2, 1, true, NULL, NULL, 2.45, 3.30, 2.90, 2026, 'Estadio El Sadar', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (306, '2024-2025', 31, NULL, '2025-04-13', '16:15', 6, 16, 0, 1, false, NULL, NULL, 1.95, 3.30, 4.20, 19438, 'Estadio de Mendizorroza', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (307, '2024-2025', 31, NULL, '2025-04-13', '18:30', 3, 19, 1, 2, true, NULL, NULL, 2.40, 3.50, 2.80, 54778, 'Estadio Benito Villamarín', 'Juan Pulido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (308, '2024-2025', 31, NULL, '2025-04-13', '21:00', 1, 14, 3, 1, true, NULL, NULL, 1.65, 3.75, 5.50, 47584, 'San Mamés', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (309, '2024-2025', 31, NULL, '2025-04-14', '21:00', 20, 17, 4, 2, true, NULL, NULL, 1.25, 6.00, 12.00, 55936, 'Riyadh Air Metropolitan Stadium', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (310, '2024-2025', 32, NULL, '2025-04-18', '21:00', 18, 2, 1, 0, false, NULL, NULL, 2.30, 3.20, 3.30, 25003, 'RCDE Stadium', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (311, '2024-2025', 32, NULL, '2025-04-19', '14:00', 14, 11, 1, 1, true, NULL, NULL, 2.25, 3.10, 3.60, 11308, 'Campo de Fútbol de Vallecas', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (312, '2024-2025', 32, NULL, '2025-04-19', '16:15', 12, 5, 4, 3, true, NULL, NULL, 1.18, 7.50, 15.00, 48569, 'Estadi Olímpic Lluís Companys', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (313, '2024-2025', 32, NULL, '2025-04-19', '18:30', 15, 10, 0, 0, false, NULL, NULL, 1.85, 3.50, 4.60, 17404, 'Estadi Mallorca Son Moix', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (314, '2024-2025', 32, NULL, '2025-04-19', '21:00', 7, 20, 1, 0, false, NULL, NULL, 6.50, 4.33, 1.50, 27154, 'Estadio de Gran Canaria', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (315, '2024-2025', 32, NULL, '2025-04-20', '14:00', 17, 9, 2, 3, true, NULL, NULL, 2.50, 3.10, 3.10, 1223, 'Estadio Municipal José Zorrilla', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (316, '2024-2025', 32, NULL, '2025-04-20', '16:15', 19, 13, 2, 2, true, NULL, NULL, 2.15, 3.50, 3.25, 1762, 'Estadio de la Cerámica', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (317, '2024-2025', 32, NULL, '2025-04-20', '18:30', 8, 6, 1, 1, true, NULL, NULL, 1.85, 3.50, 4.50, 36436, 'Estadio Ramón Sánchez Pizjuán', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (318, '2024-2025', 32, NULL, '2025-04-20', '21:00', 16, 1, 1, 0, false, NULL, NULL, 2.05, 3.75, 3.40, 72535, 'Estadio Santiago Bernabéu', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (319, '2024-2025', 32, NULL, '2025-04-21', '21:00', 4, 3, 1, 3, true, NULL, NULL, 1.80, 3.70, 4.50, 12535, 'Estadi Municipal de Montilivi', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (320, '2024-2025', 33, NULL, '2025-04-22', '19:00', 11, 18, 1, 1, true, NULL, NULL, 2.10, 3.25, 3.75, 42448, 'Estadio de Mestalla', 'Juan Pulido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (321, '2024-2025', 33, NULL, '2025-04-22', '21:30', 12, 15, 1, 0, false, NULL, NULL, 1.15, 8.50, 17.00, 45602, 'Estadi Olímpic Lluís Companys', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (322, '2024-2025', 33, NULL, '2025-04-23', '19:00', 5, 19, 3, 0, false, NULL, NULL, 2.30, 3.10, 3.40, 19324, 'Estadio Abanca Balaídos', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (323, '2024-2025', 33, NULL, '2025-04-23', '19:00', 1, 7, 1, 0, false, NULL, NULL, 1.90, 3.40, 4.30, 47724, 'San Mamés', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (324, '2024-2025', 33, NULL, '2025-04-23', '21:30', 6, 13, 1, 0, false, NULL, NULL, 2.45, 3.10, 3.10, 17049, 'Estadio de Mendizorroza', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (325, '2024-2025', 33, NULL, '2025-04-23', '21:30', 2, 16, 0, 1, false, NULL, NULL, 7.00, 4.50, 1.45, 15184, 'Coliseum Alfonso Pérez', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (326, '2024-2025', 33, NULL, '2025-04-24', '19:00', 9, 8, 1, 0, false, NULL, NULL, 2.45, 3.30, 2.90, 20555, 'Estadio El Sadar', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (327, '2024-2025', 33, NULL, '2025-04-24', '19:00', 10, 4, 1, 1, true, NULL, NULL, 2.30, 3.10, 3.35, 11595, 'Estadio Municipal de Butarque', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (328, '2024-2025', 33, NULL, '2025-04-24', '21:30', 20, 14, 3, 0, false, NULL, NULL, 1.45, 4.50, 7.00, 4941, 'Riyadh Air Metropolitan Stadium', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (329, '2024-2025', 33, NULL, '2025-04-24', '21:30', 3, 17, 5, 1, true, NULL, NULL, 1.62, 3.80, 5.75, 46458, 'Estadio Benito Villamarín', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (330, '2024-2025', 26, NULL, '2025-04-27', '16:15', 19, 18, 1, 0, false, NULL, NULL, 1.70, 3.80, 5.00, 17236, 'Estadio de la Cerámica', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (331, '2024-2025', 34, NULL, '2025-05-02', '21:00', 14, 2, 1, 0, false, NULL, NULL, 2.20, 3.10, 3.60, 11648, 'Campo de Fútbol de Vallecas', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (332, '2024-2025', 34, NULL, '2025-05-03', '14:00', 6, 20, 0, 0, false, NULL, NULL, 4.75, 3.75, 1.75, 18117, 'Estadio de Mendizorroza', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (333, '2024-2025', 34, NULL, '2025-05-03', '16:15', 19, 9, 4, 2, true, NULL, NULL, 2.00, 3.50, 3.80, 17147, 'Estadio de la Cerámica', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (334, '2024-2025', 34, NULL, '2025-05-03', '18:30', 7, 11, 2, 3, true, NULL, NULL, 2.90, 3.20, 2.50, 24942, 'Estadio de Gran Canaria', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (335, '2024-2025', 34, NULL, '2025-05-03', '21:00', 17, 12, 1, 2, true, NULL, NULL, 12.00, 6.50, 1.22, 23967, 'Estadio Municipal José Zorrilla', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (336, '2024-2025', 34, NULL, '2025-05-04', '14:00', 16, 5, 3, 2, true, NULL, NULL, 1.18, 7.50, 16.00, 67661, 'Estadio Santiago Bernabéu', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (337, '2024-2025', 34, NULL, '2025-05-04', '16:15', 8, 10, 2, 2, true, NULL, NULL, 1.85, 3.40, 4.50, 35495, 'Estadio Ramón Sánchez Pizjuán', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (338, '2024-2025', 34, NULL, '2025-05-04', '18:30', 18, 3, 1, 2, true, NULL, NULL, 2.62, 3.30, 2.70, 29126, 'RCDE Stadium', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (339, '2024-2025', 34, NULL, '2025-05-04', '21:00', 13, 1, 0, 0, false, NULL, NULL, 2.15, 3.15, 3.70, 36058, 'Reale Arena', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (340, '2024-2025', 34, NULL, '2025-05-05', '21:00', 4, 15, 1, 0, false, NULL, NULL, 1.62, 3.90, 5.80, 7721, 'Estadi Municipal de Montilivi', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (341, '2024-2025', 35, NULL, '2025-05-09', '21:00', 7, 14, 0, 1, false, NULL, NULL, 3.20, 3.10, 2.45, 20577, 'Estadio de Gran Canaria', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (342, '2024-2025', 35, NULL, '2025-05-10', '14:00', 11, 2, 3, 0, false, NULL, NULL, 2.05, 3.25, 3.90, 43357, 'Estadio de Mestalla', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (343, '2024-2025', 35, NULL, '2025-05-10', '16:15', 5, 8, 3, 2, true, NULL, NULL, 2.20, 3.30, 3.40, 20281, 'Estadio Abanca Balaídos', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (344, '2024-2025', 35, NULL, '2025-05-10', '18:30', 15, 17, 2, 1, true, NULL, NULL, 1.95, 3.40, 4.20, 16018, 'Estadi Mallorca Son Moix', 'Juan Pulido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (345, '2024-2025', 35, NULL, '2025-05-10', '18:30', 4, 19, 0, 1, false, NULL, NULL, 2.25, 3.60, 3.00, 12011, 'Estadi Municipal de Montilivi', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (346, '2024-2025', 35, NULL, '2025-05-10', '21:00', 20, 13, 4, 0, false, NULL, NULL, 1.95, 3.50, 4.00, 59612, 'Riyadh Air Metropolitan Stadium', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (347, '2024-2025', 35, NULL, '2025-05-11', '14:00', 10, 18, 3, 2, true, NULL, NULL, 2.30, 3.10, 3.35, 11669, 'Estadio Municipal de Butarque', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (348, '2024-2025', 35, NULL, '2025-05-11', '16:15', 12, 16, 4, 3, true, NULL, NULL, 1.25, 6.00, 11.00, 50319, 'Estadi Olímpic Lluís Companys', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (349, '2024-2025', 35, NULL, '2025-05-11', '18:30', 1, 6, 1, 0, false, NULL, NULL, 1.95, 3.30, 4.20, 47947, 'San Mamés', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (350, '2024-2025', 35, NULL, '2025-05-11', '21:00', 3, 9, 1, 1, true, NULL, NULL, 2.15, 3.30, 3.50, 52839, 'Estadio Benito Villamarín', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (351, '2024-2025', 36, NULL, '2025-05-13', '19:00', 17, 4, 0, 1, false, NULL, NULL, 4.75, 3.80, 1.70, 12664, 'Estadio Municipal José Zorrilla', 'Alejandro Quintero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (352, '2024-2025', 36, NULL, '2025-05-13', '20:00', 13, 5, 0, 1, false, NULL, NULL, 2.30, 3.30, 3.10, 25124, 'Reale Arena', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (353, '2024-2025', 36, NULL, '2025-05-13', '21:30', 8, 7, 1, 0, false, NULL, NULL, 1.70, 3.80, 4.75, 37078, 'Estadio Ramón Sánchez Pizjuán', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (354, '2024-2025', 36, NULL, '2025-05-14', '19:00', 6, 11, 1, 0, false, NULL, NULL, 2.10, 3.20, 3.70, 17626, 'Estadio de Mendizorroza', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (355, '2024-2025', 36, NULL, '2025-05-14', '19:00', 19, 10, 3, 0, false, NULL, NULL, 1.33, 5.00, 8.50, 17067, 'Estadio de la Cerámica', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (356, '2024-2025', 36, NULL, '2025-05-14', '21:30', 16, 15, 2, 1, true, NULL, NULL, 1.22, 6.50, 11.00, 60753, 'Estadio Santiago Bernabéu', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (357, '2024-2025', 36, NULL, '2025-05-15', '19:00', 14, 3, 2, 2, true, NULL, NULL, 3.00, 3.30, 2.35, 1348, 'Campo de Fútbol de Vallecas', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (358, '2024-2025', 36, NULL, '2025-05-15', '19:00', 9, 20, 2, 0, false, NULL, NULL, 3.60, 3.30, 2.10, 21171, 'Estadio El Sadar', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (359, '2024-2025', 36, NULL, '2025-05-15', '21:30', 2, 1, 0, 2, false, NULL, NULL, 3.40, 2.75, 2.55, 11564, 'Coliseum Alfonso Pérez', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (360, '2024-2025', 36, NULL, '2025-05-15', '21:30', 18, 12, 0, 2, false, NULL, NULL, 10.00, 5.50, 1.29, 34283, 'RCDE Stadium', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (361, '2024-2025', 37, NULL, '2025-05-18', '19:00', 7, 10, 0, 1, false, NULL, NULL, 2.77, 3.41, 2.46, 11279, 'Estadio de Gran Canaria', 'Jose Maria Sánchez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (362, '2024-2025', 37, NULL, '2025-05-18', '19:00', 15, 2, 1, 2, true, NULL, NULL, 2.20, 3.15, 3.65, 18124, 'Estadi Mallorca Son Moix', 'Alejandro Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (363, '2024-2025', 37, NULL, '2025-05-18', '19:00', 11, 1, 0, 1, false, NULL, NULL, 2.98, 3.15, 2.40, 45641, 'Estadio de Mestalla', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (364, '2024-2025', 37, NULL, '2025-05-18', '19:00', 20, 3, 4, 1, true, NULL, NULL, 1.83, 3.65, 4.00, 62269, 'Riyadh Air Metropolitan Stadium', 'Adrián Cordero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (365, '2024-2025', 37, NULL, '2025-05-18', '19:00', 9, 18, 2, 0, false, NULL, NULL, 2.02, 3.20, 3.75, 21131, 'Estadio El Sadar', 'Francisco Hernández', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (366, '2024-2025', 37, NULL, '2025-05-18', '19:00', 12, 19, 2, 3, true, NULL, NULL, 1.51, 4.70, 5.10, 49558, 'Estadi Olímpic Lluís Companys', 'José Luis Munuera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (367, '2024-2025', 37, NULL, '2025-05-18', '19:00', 17, 6, 0, 1, false, NULL, NULL, 5.20, 3.84, 1.69, 14506, 'Estadio Municipal José Zorrilla', 'Isidro Díaz de Mera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (368, '2024-2025', 37, NULL, '2025-05-18', '19:00', 13, 4, 3, 2, true, NULL, NULL, 2.23, 3.00, 3.80, 28315, 'Reale Arena', 'Miguel Ángel Ortiz Arias', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (369, '2024-2025', 37, NULL, '2025-05-18', '19:00', 8, 16, 0, 2, false, NULL, NULL, 4.40, 3.95, 1.69, 325, 'Estadio Ramón Sánchez Pizjuán', 'Mateo Busquets', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (370, '2024-2025', 37, NULL, '2025-05-18', '19:00', 5, 14, 1, 2, true, NULL, NULL, 1.80, 3.88, 4.30, 21482, 'Estadio Abanca Balaídos', 'Juan Pulido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (371, '2024-2025', 38, NULL, '2025-05-23', '21:00', 3, 11, 1, 1, true, NULL, NULL, 2.05, 3.70, 3.25, 51141, 'Estadio Benito Villamarín', 'Víctor García', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (372, '2024-2025', 38, NULL, '2025-05-24', '16:15', 16, 13, 2, 0, false, NULL, NULL, 1.40, 5.00, 7.00, 73186, 'Estadio Santiago Bernabéu', 'Mario Melero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (373, '2024-2025', 38, NULL, '2025-05-24', '18:30', 10, 17, 3, 0, false, NULL, NULL, 1.31, 5.63, 10.04, 11523, 'Estadio Municipal de Butarque', 'César Soto', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (374, '2024-2025', 38, NULL, '2025-05-24', '18:30', 18, 7, 2, 0, false, NULL, NULL, 1.41, 4.67, 6.83, 32511, 'RCDE Stadium', 'Alejandro Muñíz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (375, '2024-2025', 38, NULL, '2025-05-24', '21:00', 14, 15, 0, 0, false, NULL, NULL, 1.58, 4.11, 6.12, 13854, 'Campo de Fútbol de Vallecas', 'Ricardo de Burgos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (376, '2024-2025', 38, NULL, '2025-05-24', '21:00', 6, 9, 1, 1, true, NULL, NULL, 3.28, 3.16, 2.42, 19274, 'Estadio de Mendizorroza', 'Guillermo Cuadra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (377, '2024-2025', 38, NULL, '2025-05-24', '21:00', 2, 5, 1, 2, true, NULL, NULL, 4.14, 3.83, 1.88, 12862, 'Coliseum Alfonso Pérez', 'Juan Martínez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (378, '2024-2025', 38, NULL, '2025-05-25', '14:00', 4, 20, 0, 4, false, NULL, NULL, 3.80, 3.75, 1.85, 11546, 'Estadi Municipal de Montilivi', 'Jesús Gil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (379, '2024-2025', 38, NULL, '2025-05-25', '16:15', 19, 8, 4, 2, true, NULL, NULL, 1.44, 4.70, 6.00, 17758, 'Estadio de la Cerámica', 'Javier Alberola', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
INSERT INTO matches (
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
) VALUES (380, '2024-2025', 38, NULL, '2025-05-25', '21:00', 1, 12, 0, 3, false, NULL, NULL, 3.15, 3.65, 2.08, 50231, 'San Mamés', 'Pablo González', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', '[]') ON CONFLICT (id) DO NOTHING;
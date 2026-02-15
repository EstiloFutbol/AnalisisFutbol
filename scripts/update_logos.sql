-- =============================================================
-- Update Team Logos (Supabase Storage) - SANITIZED
-- =============================================================
-- REPLACE [YOUR_PROJECT_ID] with your Supabase project ID (found in your URL: https://[project-id].supabase.co)
-- ASSUMPTION: Bucket 'logos', file names match team names but WITHOUT ACCENTS (e.g. "Atletico Madrid.png")

DO $$
DECLARE
    -- CORRECTED PUBLIC URL FORMAT
    base_url TEXT := 'https://uchaeyxgymzmgmujrivi.supabase.co/storage/v1/object/public/logos/';
BEGIN
    -- Standardize names (remove accents/special chars manually mapped if needed)
    
    UPDATE teams SET logo_url = base_url || 'Athletic Club.png' WHERE name = 'Athletic Club';
    UPDATE teams SET logo_url = base_url || 'Getafe.png' WHERE name = 'Getafe';
    UPDATE teams SET logo_url = base_url || 'Real Betis.png' WHERE name = 'Real Betis';
    UPDATE teams SET logo_url = base_url || 'Girona.png' WHERE name = 'Girona';
    UPDATE teams SET logo_url = base_url || 'Celta Vigo.png' WHERE name = 'Celta Vigo';
    
    -- Alavés -> Alaves
    UPDATE teams SET logo_url = base_url || 'Alaves.png' WHERE name = 'Alavés';
    
    UPDATE teams SET logo_url = base_url || 'Las Palmas.png' WHERE name = 'Las Palmas';
    UPDATE teams SET logo_url = base_url || 'Sevilla.png' WHERE name = 'Sevilla';
    UPDATE teams SET logo_url = base_url || 'Osasuna.png' WHERE name = 'Osasuna';
    
    -- Leganés -> Leganes
    UPDATE teams SET logo_url = base_url || 'Leganes.png' WHERE name = 'Leganés';
    
    UPDATE teams SET logo_url = base_url || 'Valencia.png' WHERE name = 'Valencia';
    UPDATE teams SET logo_url = base_url || 'Barcelona.png' WHERE name = 'Barcelona';
    UPDATE teams SET logo_url = base_url || 'Real Sociedad.png' WHERE name = 'Real Sociedad';
    UPDATE teams SET logo_url = base_url || 'Rayo Vallecano.png' WHERE name = 'Rayo Vallecano';
    UPDATE teams SET logo_url = base_url || 'Mallorca.png' WHERE name = 'Mallorca';
    UPDATE teams SET logo_url = base_url || 'Real Madrid.png' WHERE name = 'Real Madrid';
    UPDATE teams SET logo_url = base_url || 'Valladolid.png' WHERE name = 'Valladolid';
    UPDATE teams SET logo_url = base_url || 'Espanyol.png' WHERE name = 'Espanyol';
    UPDATE teams SET logo_url = base_url || 'Villarreal.png' WHERE name = 'Villarreal';
    
    -- Atlético Madrid -> Atletico Madrid
    UPDATE teams SET logo_url = base_url || 'Atletico Madrid.png' WHERE name = 'Atlético Madrid';

END $$;

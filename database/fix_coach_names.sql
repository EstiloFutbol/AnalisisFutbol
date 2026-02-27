-- Fix coach name inconsistencies
-- Updates matches table, then removes duplicates from coaches table

-- 1. Borja Jimenez → Borja Jiménez
UPDATE matches SET home_coach = 'Borja Jiménez' WHERE home_coach = 'Borja Jimenez';
UPDATE matches SET away_coach = 'Borja Jiménez' WHERE away_coach = 'Borja Jimenez';

-- 2. Claudio Girarldez → Claudio Giráldez (fix typo + add accent)
UPDATE matches SET home_coach = 'Claudio Giráldez' WHERE home_coach IN ('Claudio Girarldez', 'Claudio GIrarldez');
UPDATE matches SET away_coach = 'Claudio Giráldez' WHERE away_coach IN ('Claudio Girarldez', 'Claudio GIrarldez');

-- 3. Iñigo Pérez — fix any variant with ? or missing accents
UPDATE matches SET home_coach = 'Iñigo Pérez' WHERE home_coach IN ('I?igo Pérez', 'I?igo Perez', 'Iñigo Perez', 'Inigo Pérez', 'Inigo Perez');
UPDATE matches SET away_coach = 'Iñigo Pérez' WHERE away_coach IN ('I?igo Pérez', 'I?igo Perez', 'Iñigo Perez', 'Inigo Pérez', 'Inigo Perez');

-- 4. Pepe Bordalas → Pepe Bordalás
UPDATE matches SET home_coach = 'Pepe Bordalás' WHERE home_coach = 'Pepe Bordalas';
UPDATE matches SET away_coach = 'Pepe Bordalás' WHERE away_coach = 'Pepe Bordalas';

-- Now delete the wrong-name entries from coaches table (correct names already exist)
DELETE FROM coaches WHERE name IN (
    'Borja Jimenez',
    'Claudio Girarldez',
    'Claudio GIrarldez',
    'I?igo Pérez',
    'I?igo Perez',
    'Iñigo Perez',
    'Inigo Pérez',
    'Inigo Perez',
    'Pepe Bordalas'
);

-- Insert correct names only if they don't already exist
INSERT INTO coaches (name) VALUES ('Borja Jiménez') ON CONFLICT (name) DO NOTHING;
INSERT INTO coaches (name) VALUES ('Claudio Giráldez') ON CONFLICT (name) DO NOTHING;
INSERT INTO coaches (name) VALUES ('Iñigo Pérez') ON CONFLICT (name) DO NOTHING;
INSERT INTO coaches (name) VALUES ('Pepe Bordalás') ON CONFLICT (name) DO NOTHING;

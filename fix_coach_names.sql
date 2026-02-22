-- Fix coach name inconsistencies
-- Updates both matches table and coaches table

-- 1. Borja Jimenez → Borja Jiménez
UPDATE matches SET home_coach = 'Borja Jiménez' WHERE home_coach = 'Borja Jimenez';
UPDATE matches SET away_coach = 'Borja Jiménez' WHERE away_coach = 'Borja Jimenez';
UPDATE coaches SET name = 'Borja Jiménez' WHERE name = 'Borja Jimenez';

-- 2. Claudio Girarldez → Claudio Giráldez (fix typo + add accent)
UPDATE matches SET home_coach = 'Claudio Giráldez' WHERE home_coach IN ('Claudio Girarldez', 'Claudio GIrarldez');
UPDATE matches SET away_coach = 'Claudio Giráldez' WHERE away_coach IN ('Claudio Girarldez', 'Claudio GIrarldez');
UPDATE coaches SET name = 'Claudio Giráldez' WHERE name IN ('Claudio Girarldez', 'Claudio GIrarldez');

-- 3. Iñigo Pérez — fix any variant with ? or missing accents
UPDATE matches SET home_coach = 'Iñigo Pérez' WHERE home_coach IN ('I?igo Pérez', 'I?igo Perez', 'Iñigo Perez', 'Inigo Pérez', 'Inigo Perez');
UPDATE matches SET away_coach = 'Iñigo Pérez' WHERE away_coach IN ('I?igo Pérez', 'I?igo Perez', 'Iñigo Perez', 'Inigo Pérez', 'Inigo Perez');
UPDATE coaches SET name = 'Iñigo Pérez' WHERE name IN ('I?igo Pérez', 'I?igo Perez', 'Iñigo Perez', 'Inigo Pérez', 'Inigo Perez');

-- 4. Pepe Bordalas → Pepe Bordalás
UPDATE matches SET home_coach = 'Pepe Bordalás' WHERE home_coach = 'Pepe Bordalas';
UPDATE matches SET away_coach = 'Pepe Bordalás' WHERE away_coach = 'Pepe Bordalas';
UPDATE coaches SET name = 'Pepe Bordalás' WHERE name = 'Pepe Bordalas';

-- Clean up duplicate coaches entries (keep only the corrected names)
DELETE FROM coaches WHERE name NOT IN (
    SELECT DISTINCT name FROM coaches
    GROUP BY name
    HAVING COUNT(*) = 1
);

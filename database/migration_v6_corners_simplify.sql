-- ============================================================
-- Migration v6: Simplify corners — remove per-half columns
-- Run once in Supabase SQL editor
-- ============================================================

-- 1. Backfill home_corners / away_corners from half data where needed
UPDATE matches
SET
    home_corners  = COALESCE(home_corners, home_corners_1h + home_corners_2h),
    away_corners  = COALESCE(away_corners, away_corners_1h + away_corners_2h),
    total_corners = COALESCE(
        total_corners,
        COALESCE(home_corners, home_corners_1h + home_corners_2h, 0)
        + COALESCE(away_corners, away_corners_1h + away_corners_2h, 0)
    )
WHERE
    home_corners_1h IS NOT NULL
    OR away_corners_1h IS NOT NULL;

-- 2. Also recalculate total_corners for every row where it's NULL
UPDATE matches
SET total_corners = COALESCE(home_corners, 0) + COALESCE(away_corners, 0)
WHERE total_corners IS NULL
  AND (home_corners IS NOT NULL OR away_corners IS NOT NULL);

-- 3. Drop the four half-corner columns
ALTER TABLE matches
    DROP COLUMN IF EXISTS home_corners_1h,
    DROP COLUMN IF EXISTS away_corners_1h,
    DROP COLUMN IF EXISTS home_corners_2h,
    DROP COLUMN IF EXISTS away_corners_2h;

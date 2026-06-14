"""
ml/compute_elo.py — Elo Ratings for Teams and Coaches
======================================================

Processes all played matches in chronological order and computes:

  1. Per-team Elo split by venue role:
       team_home_elo[team_id]  — updated when the team plays at HOME
       team_away_elo[team_id]  — updated when the team plays AWAY

  2. Per-coach Elo (normalized name, coach_name.strip().lower()):
       coach_elo[normalized_name]

  Standard Elo formula (no margin of victory):
    E = 1 / (1 + 10^((opponent_elo - own_elo) / 400))
    new_elo = old_elo + K * (actual - E),  K = 32

  Outcomes (from home team perspective):
    Home win  → actual_home = 1.0
    Draw      → actual_home = 0.5
    Away win  → actual_home = 0.0

Tables written:
  team_elo          (upsert on team_id): elo_home, elo_away, matches_home,
                    matches_away, last_updated
  team_elo_history  (insert): team_id, match_id, match_date, league_id,
                    is_home, elo_before, elo_after
  coach_elo         (upsert on coach_name): coach_name, elo, matches_count,
                    last_updated
  coach_elo_history (insert): coach_name, match_id, match_date, league_id,
                    team_id, is_home, elo_before, elo_after

All four tables are fully cleared before each run (idempotent).

Usage:
    python ml/compute_elo.py              # writes to Supabase
    python ml/compute_elo.py --dry-run    # print output, no DB writes
"""

import argparse
import io
import os
import sys
from collections import defaultdict
from datetime import date, timezone, datetime

from dotenv import load_dotenv
from supabase import create_client

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# ── Environment setup ─────────────────────────────────────────────────────────

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(_ROOT, ".env.local"))

_URL = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("VITE_SUPABASE_SERVICE_ROLE_KEY")

if not _URL or not _KEY:
    sys.exit(
        "[ERROR] Missing Supabase credentials. "
        "Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY "
        "(or VITE_* equivalents) in .env.local"
    )

# ── Elo constants ─────────────────────────────────────────────────────────────

ELO_INIT = 1500
ELO_K    = 32
ELO_D    = 400   # standard scaling divisor

BATCH_SIZE = 500  # max rows per Supabase upsert call


# ── Elo helpers ───────────────────────────────────────────────────────────────

def _expected(own_elo: float, opp_elo: float) -> float:
    """Expected score for own_elo side (no home advantage applied here)."""
    return 1.0 / (1.0 + 10.0 ** ((opp_elo - own_elo) / ELO_D))


def _update(own_elo: float, opp_elo: float, actual: float) -> float:
    """Return updated Elo after one result."""
    return round(own_elo + ELO_K * (actual - _expected(own_elo, opp_elo)), 4)


# ── Batch upsert helpers ──────────────────────────────────────────────────────

def _batch_upsert(sb, table: str, rows: list[dict], on_conflict: str, dry_run: bool):
    """Upsert rows in batches of BATCH_SIZE."""
    if dry_run:
        print(f"  [DRY-RUN] Would upsert {len(rows)} rows into {table} (on_conflict={on_conflict})")
        return
    for i in range(0, len(rows), BATCH_SIZE):
        chunk = rows[i : i + BATCH_SIZE]
        sb.from_(table).upsert(chunk, on_conflict=on_conflict).execute()
    print(f"  [DB] Upserted {len(rows)} rows into '{table}'")


def _batch_insert(sb, table: str, rows: list[dict], dry_run: bool):
    """Insert rows in batches of BATCH_SIZE."""
    if dry_run:
        print(f"  [DRY-RUN] Would insert {len(rows)} rows into {table}")
        return
    for i in range(0, len(rows), BATCH_SIZE):
        chunk = rows[i : i + BATCH_SIZE]
        sb.from_(table).insert(chunk).execute()
    print(f"  [DB] Inserted {len(rows)} rows into '{table}'")


# ── Main ──────────────────────────────────────────────────────────────────────

def compute_elo(dry_run: bool = False):
    sb = create_client(_URL, _KEY)
    now_iso = datetime.now(timezone.utc).isoformat()

    # ── 1. Fetch all played matches ordered chronologically ───────────────────
    print("[DB] Fetching played matches...")
    raw = (
        sb.from_("matches")
        .select(
            "id, match_date, league_id, matchday, "
            "home_team_id, away_team_id, "
            "home_goals, away_goals, "
            "home_coach, away_coach"
        )
        .not_.is_("home_goals", "null")
        .not_.is_("away_goals", "null")
        .order("match_date", desc=False)
        .order("id", desc=False)
        .execute()
        .data
    )
    print(f"[INFO] {len(raw)} played matches fetched")

    # ── 2. Initialise state ───────────────────────────────────────────────────
    # Per-team: separate Elo for home and away roles
    team_home_elo:    dict[int, float] = defaultdict(lambda: float(ELO_INIT))
    team_away_elo:    dict[int, float] = defaultdict(lambda: float(ELO_INIT))
    team_home_count:  dict[int, int]   = defaultdict(int)
    team_away_count:  dict[int, int]   = defaultdict(int)

    # Per-coach: single Elo regardless of home/away
    coach_elo:        dict[str, float] = defaultdict(lambda: float(ELO_INIT))
    coach_count:      dict[str, int]   = defaultdict(int)

    team_history:  list[dict] = []
    coach_history: list[dict] = []

    processed = 0
    skipped_team = 0
    skipped_coach = 0

    # ── 3. Process each match chronologically ─────────────────────────────────
    for m in raw:
        hid  = m["home_team_id"]
        aid  = m["away_team_id"]
        hg   = m["home_goals"]
        ag   = m["away_goals"]

        # Skip TBD knockout slots (team IDs may be null for WC)
        if hid is None or aid is None:
            skipped_team += 1
            continue

        hg = int(hg)
        ag = int(ag)

        match_date = m["match_date"]
        league_id  = m["league_id"]
        match_id   = m["id"]

        # ── Outcome from home team's perspective ──────────────────────────────
        if hg > ag:
            actual_home = 1.0
        elif hg == ag:
            actual_home = 0.5
        else:
            actual_home = 0.0
        actual_away = 1.0 - actual_home

        # ── Team Elo update ───────────────────────────────────────────────────
        h_elo_before = team_home_elo[hid]
        a_elo_before = team_away_elo[aid]

        h_elo_after = _update(h_elo_before, a_elo_before, actual_home)
        a_elo_after = _update(a_elo_before, h_elo_before, actual_away)

        team_home_elo[hid] = h_elo_after
        team_away_elo[aid] = a_elo_after
        team_home_count[hid] += 1
        team_away_count[aid] += 1

        team_history.append({
            "team_id":    hid,
            "match_id":   match_id,
            "match_date": match_date,
            "league_id":  league_id,
            "is_home":    True,
            "elo_before": h_elo_before,
            "elo_after":  h_elo_after,
        })
        team_history.append({
            "team_id":    aid,
            "match_id":   match_id,
            "match_date": match_date,
            "league_id":  league_id,
            "is_home":    False,
            "elo_before": a_elo_before,
            "elo_after":  a_elo_after,
        })

        # ── Coach Elo update ──────────────────────────────────────────────────
        hc_raw = m.get("home_coach") or ""
        ac_raw = m.get("away_coach") or ""
        hc = hc_raw.strip().lower()
        ac = ac_raw.strip().lower()

        if not hc or not ac:
            skipped_coach += 1
        else:
            hc_before = coach_elo[hc]
            ac_before = coach_elo[ac]

            hc_after = _update(hc_before, ac_before, actual_home)
            ac_after = _update(ac_before, hc_before, actual_away)

            coach_elo[hc] = hc_after
            coach_elo[ac] = ac_after
            coach_count[hc] += 1
            coach_count[ac] += 1

            coach_history.append({
                "coach_name": hc,
                "match_id":   match_id,
                "match_date": match_date,
                "league_id":  league_id,
                "team_id":    hid,
                "is_home":    True,
                "elo_before": hc_before,
                "elo_after":  hc_after,
            })
            coach_history.append({
                "coach_name": ac,
                "match_id":   match_id,
                "match_date": match_date,
                "league_id":  league_id,
                "team_id":    aid,
                "is_home":    False,
                "elo_before": ac_before,
                "elo_after":  ac_after,
            })

        processed += 1
        if processed % 200 == 0:
            print(f"  ... {processed} matches processed")

    print(f"\n[INFO] Processed: {processed} | Skipped (null team): {skipped_team} | "
          f"Matches without coach data: {skipped_coach}")

    # ── 4. Build current-state rows ───────────────────────────────────────────
    all_team_ids = set(team_home_elo.keys()) | set(team_away_elo.keys())
    team_elo_rows = [
        {
            "team_id":      tid,
            "elo_home":     round(team_home_elo[tid], 4),
            "elo_away":     round(team_away_elo[tid], 4),
            "matches_home": team_home_count[tid],
            "matches_away": team_away_count[tid],
            "last_updated": now_iso,
        }
        for tid in all_team_ids
    ]

    coach_elo_rows = [
        {
            "coach_name":   name,
            "elo":          round(elo_val, 4),
            "matches_count": coach_count[name],
            "last_updated": now_iso,
        }
        for name, elo_val in coach_elo.items()
    ]

    # ── 5. Clear existing data and write ──────────────────────────────────────
    print("\n[DB] Clearing existing Elo tables...")
    if not dry_run:
        # supabase-py requires a WHERE filter on DELETE; .not_.is_(..., "null")
        # matches every row where the PK column is non-null (i.e. all rows).
        sb.from_("team_elo_history").delete().not_.is_("team_id", "null").execute()
        sb.from_("coach_elo_history").delete().not_.is_("coach_name", "null").execute()
        sb.from_("team_elo").delete().not_.is_("team_id", "null").execute()
        sb.from_("coach_elo").delete().not_.is_("coach_name", "null").execute()
        print("  [DB] All Elo tables cleared")
    else:
        print("  [DRY-RUN] Would clear team_elo_history, coach_elo_history, team_elo, coach_elo")

    # ── 6. Write new data ─────────────────────────────────────────────────────
    print("\n[DB] Writing Elo data...")
    _batch_insert(sb, "team_elo_history",  team_history,  dry_run)
    _batch_insert(sb, "coach_elo_history", coach_history, dry_run)
    _batch_upsert(sb, "team_elo",  team_elo_rows,  "team_id",   dry_run)
    _batch_upsert(sb, "coach_elo", coach_elo_rows, "coach_name", dry_run)

    # ── 7. Print summary ──────────────────────────────────────────────────────
    print(f"\n{'─'*60}")
    print(f"  Teams with Elo:   {len(team_elo_rows)}")
    print(f"  Coaches with Elo: {len(coach_elo_rows)}")
    print(f"  Team history rows:  {len(team_history)}")
    print(f"  Coach history rows: {len(coach_history)}")

    print(f"\n  Top 10 teams by HOME Elo:")
    top10 = sorted(team_elo_rows, key=lambda r: r["elo_home"], reverse=True)[:10]
    print(f"  {'team_id':>8}  {'elo_home':>9}  {'elo_away':>9}  {'home_games':>10}  {'away_games':>10}")
    for r in top10:
        print(f"  {r['team_id']:>8}  {r['elo_home']:>9.1f}  {r['elo_away']:>9.1f}  "
              f"{r['matches_home']:>10}  {r['matches_away']:>10}")

    if coach_elo_rows:
        print(f"\n  Top 10 coaches by Elo:")
        top10c = sorted(coach_elo_rows, key=lambda r: r["elo"], reverse=True)[:10]
        print(f"  {'coach_name':<30}  {'elo':>7}  {'matches':>7}")
        for r in top10c:
            print(f"  {r['coach_name']:<30}  {r['elo']:>7.1f}  {r['matches_count']:>7}")

    print(f"{'─'*60}")
    print("\n[DONE] Elo computation complete.")


# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Compute team and coach Elo ratings from all played matches."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be written without touching the database",
    )
    args = parser.parse_args()

    compute_elo(dry_run=args.dry_run)

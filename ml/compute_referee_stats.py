"""
ml/compute_referee_stats.py — Per-Referee Statistics and Data Quality Report
============================================================================

Fetches all matches with a non-null referee_id, reports data quality,
then computes per-referee card and foul averages and upserts them into
the `referee_stats` table.

Data Quality Report (printed to console):
  - Total matches with referee_id vs all matches (% coverage)
  - Per stat: count + % of matches where value is NULL:
      home_yellow_cards, away_yellow_cards, home_red_cards,
      away_red_cards, home_fouls, away_fouls
  - Referees with fewer than 5 matches (low sample size warning)

Per-referee stats computed:
  avg_home_yellow, avg_away_yellow, avg_total_yellow
  home_yellow_pct   = avg_home_yellow / avg_total_yellow * 100
                      (NULL if avg_total_yellow = 0)
  avg_home_red,  avg_away_red,  avg_total_red
  avg_home_fouls, avg_away_fouls, avg_total_fouls
  matches_with_yellow_data  (count of non-null rows used for yellow stats)
  matches_with_red_data
  matches_with_fouls_data
  total_matches             (all matches assigned to this referee)

Table written:
  referee_stats (upsert on referee_id) — one row per referee

Usage:
    python ml/compute_referee_stats.py              # writes to Supabase
    python ml/compute_referee_stats.py --dry-run    # print only, no DB writes
"""

import argparse
import io
import os
import sys
from collections import defaultdict
from datetime import timezone, datetime

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

BATCH_SIZE = 500


# ── Helpers ───────────────────────────────────────────────────────────────────

def _safe_avg(values: list[float]) -> float | None:
    """Return the mean of a non-empty list, else None."""
    if not values:
        return None
    return round(sum(values) / len(values), 4)


def _batch_upsert(sb, table: str, rows: list[dict], on_conflict: str, dry_run: bool):
    if dry_run:
        print(f"  [DRY-RUN] Would upsert {len(rows)} rows into '{table}' "
              f"(on_conflict={on_conflict})")
        return
    for i in range(0, len(rows), BATCH_SIZE):
        chunk = rows[i : i + BATCH_SIZE]
        sb.from_(table).upsert(chunk, on_conflict=on_conflict).execute()
    print(f"  [DB] Upserted {len(rows)} rows into '{table}'")


# ── Main ──────────────────────────────────────────────────────────────────────

def compute_referee_stats(dry_run: bool = False):
    sb = create_client(_URL, _KEY)
    now_iso = datetime.now(timezone.utc).isoformat()

    # ── 1. Total match count (for coverage %) ─────────────────────────────────
    print("[DB] Fetching total match count...")
    total_resp = (
        sb.from_("matches")
        .select("id", count="exact")
        .execute()
    )
    total_matches = total_resp.count if total_resp.count is not None else len(total_resp.data)
    print(f"[INFO] Total matches in DB: {total_matches}")

    # ── 2. Fetch matches with referee_id (played or unplayed both count for
    #       coverage, but we only use played matches for stat averages) ─────────
    print("[DB] Fetching matches with referee_id...")
    ref_rows = (
        sb.from_("matches")
        .select(
            "id, match_date, league_id, referee_id, referee, "
            "home_goals, away_goals, "
            "home_yellow_cards, away_yellow_cards, "
            "home_red_cards, away_red_cards, "
            "home_fouls, away_fouls"
        )
        .not_.is_("referee_id", "null")
        .execute()
        .data
    )
    print(f"[INFO] Matches with referee_id: {len(ref_rows)}")

    # ── 3. Data quality report ────────────────────────────────────────────────
    n_with_ref = len(ref_rows)
    coverage_pct = (n_with_ref / total_matches * 100) if total_matches else 0.0

    print(f"\n{'='*60}")
    print("  DATA QUALITY REPORT")
    print(f"{'='*60}")
    print(f"  Matches with referee_id : {n_with_ref:>6} / {total_matches}  "
          f"({coverage_pct:.1f}% coverage)")

    stat_cols = [
        "home_yellow_cards", "away_yellow_cards",
        "home_red_cards",    "away_red_cards",
        "home_fouls",        "away_fouls",
    ]

    print(f"\n  Null value breakdown (among {n_with_ref} matches with referee):")
    print(f"  {'Column':<25}  {'Null count':>10}  {'% Null':>7}")
    print(f"  {'-'*25}  {'-'*10}  {'-'*7}")
    for col in stat_cols:
        null_count = sum(1 for r in ref_rows if r.get(col) is None)
        null_pct   = (null_count / n_with_ref * 100) if n_with_ref else 0.0
        print(f"  {col:<25}  {null_count:>10}  {null_pct:>6.1f}%")

    # ── 4. Group matches by referee ───────────────────────────────────────────
    # bucket: referee_id → list of match dicts
    by_ref: dict[int, list[dict]] = defaultdict(list)
    for row in ref_rows:
        by_ref[row["referee_id"]].append(row)

    # Low sample size warning
    low_sample = [
        (rid, rows[0].get("referee", f"referee_id={rid}"), len(rows))
        for rid, rows in by_ref.items()
        if len(rows) < 5
    ]
    if low_sample:
        print(f"\n  WARNING — Referees with <5 matches (low sample size):")
        print(f"  {'referee_id':>12}  {'name':<30}  {'matches':>7}")
        for rid, name, cnt in sorted(low_sample, key=lambda x: x[2]):
            print(f"  {rid:>12}  {str(name):<30}  {cnt:>7}")
    else:
        print("\n  No referees with fewer than 5 matches.")

    print(f"{'='*60}\n")

    # ── 5. Compute per-referee stats ──────────────────────────────────────────
    print("[INFO] Computing per-referee statistics...")
    stat_rows = []

    for ref_id, matches in by_ref.items():
        ref_name = matches[0].get("referee")

        # Collect values from rows where each stat group is non-null
        yellow_home, yellow_away = [], []
        red_home,    red_away    = [], []
        fouls_home,  fouls_away  = [], []

        for m in matches:
            hy = m.get("home_yellow_cards")
            ay = m.get("away_yellow_cards")
            hr = m.get("home_red_cards")
            ar = m.get("away_red_cards")
            hf = m.get("home_fouls")
            af = m.get("away_fouls")

            if hy is not None and ay is not None:
                yellow_home.append(float(hy))
                yellow_away.append(float(ay))
            if hr is not None and ar is not None:
                red_home.append(float(hr))
                red_away.append(float(ar))
            if hf is not None and af is not None:
                fouls_home.append(float(hf))
                fouls_away.append(float(af))

        avg_hy  = _safe_avg(yellow_home)
        avg_ay  = _safe_avg(yellow_away)
        avg_ty  = (_safe_avg([h + a for h, a in zip(yellow_home, yellow_away)])
                   if yellow_home else None)

        avg_hr  = _safe_avg(red_home)
        avg_ar  = _safe_avg(red_away)
        avg_tr  = (_safe_avg([h + a for h, a in zip(red_home, red_away)])
                   if red_home else None)

        avg_hf  = _safe_avg(fouls_home)
        avg_af  = _safe_avg(fouls_away)
        avg_tf  = (_safe_avg([h + a for h, a in zip(fouls_home, fouls_away)])
                   if fouls_home else None)

        # home_yellow_pct: NULL when total is zero (both teams got 0 yellows avg)
        if avg_ty is not None and avg_ty > 0 and avg_hy is not None:
            home_yellow_pct = round(avg_hy / avg_ty * 100, 2)
        else:
            home_yellow_pct = None

        stat_rows.append({
            "referee_id":              ref_id,
            "referee_name":            ref_name,
            "total_matches":           len(matches),
            "matches_with_yellow_data": len(yellow_home),
            "matches_with_red_data":   len(red_home),
            "matches_with_fouls_data": len(fouls_home),
            "avg_home_yellow":         avg_hy,
            "avg_away_yellow":         avg_ay,
            "avg_total_yellow":        avg_ty,
            "home_yellow_pct":         home_yellow_pct,
            "avg_home_red":            avg_hr,
            "avg_away_red":            avg_ar,
            "avg_total_red":           avg_tr,
            "avg_home_fouls":          avg_hf,
            "avg_away_fouls":          avg_af,
            "avg_total_fouls":         avg_tf,
            "last_updated":            now_iso,
        })

    # ── 6. Upsert ─────────────────────────────────────────────────────────────
    print(f"[INFO] {len(stat_rows)} referees to write")
    _batch_upsert(sb, "referee_stats", stat_rows, "referee_id", dry_run)

    # ── 7. Summary table: top 10 referees by total matches ───────────────────
    print(f"\n{'─'*90}")
    print("  Top 10 referees by total matches (with yellow card data):")
    print(f"  {'referee_id':>12}  {'name':<28}  {'matches':>7}  "
          f"{'avg_yellow':>10}  {'home_yel%':>9}  {'avg_red':>7}  {'avg_fouls':>9}")
    print(f"  {'-'*12}  {'-'*28}  {'-'*7}  {'-'*10}  {'-'*9}  {'-'*7}  {'-'*9}")

    top10 = sorted(stat_rows, key=lambda r: r["total_matches"], reverse=True)[:10]
    for r in top10:
        name_str    = str(r["referee_name"] or "")[:28]
        avg_y_str   = f"{r['avg_total_yellow']:.2f}" if r["avg_total_yellow"] is not None else "  N/A"
        home_pct_str = f"{r['home_yellow_pct']:.1f}%" if r["home_yellow_pct"] is not None else "  N/A"
        avg_r_str   = f"{r['avg_total_red']:.2f}"    if r["avg_total_red"]    is not None else "  N/A"
        avg_f_str   = f"{r['avg_total_fouls']:.1f}"  if r["avg_total_fouls"]  is not None else "  N/A"

        print(
            f"  {r['referee_id']:>12}  {name_str:<28}  "
            f"{r['total_matches']:>7}  {avg_y_str:>10}  "
            f"{home_pct_str:>9}  {avg_r_str:>7}  {avg_f_str:>9}"
        )

    print(f"{'─'*90}")
    print("\n[DONE] Referee stats computation complete.")


# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Compute per-referee card/foul stats and run a data quality report."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be written without touching the database",
    )
    args = parser.parse_args()

    compute_referee_stats(dry_run=args.dry_run)

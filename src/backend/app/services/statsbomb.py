from app.models.match import Match, MatchDetail
from app.models.player import Player, PlayerEvent, HeatMapData, PlayerStats
from app.models.database import get_db, Competition, Season, Match as DBMatch, Player as DBPlayer, PlayerStats as DBPlayerStats, PlayerHeatmap
from app.config import settings
from app.services.cache import cache_service
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class StatsBombService:
    """Service for interacting with StatsBomb data with caching and local storage"""
    
    def __init__(self):
        """Initialize the StatsBomb service"""
        # If using private API, configure credentials
        if settings.STATSBOMB_USE_PRIVATE_API:
            # This would be implemented when switching to private API
            pass
    
    def get_competitions(self) -> List[Dict[str, Any]]:
        """Get available competitions with their seasons.
        Prefers local database; uses cache as a performance layer. Returns ONLY competitions/seasons that have matches in the local DB to avoid empty selections in the UI.
        """
        cache_key = "competitions:all"

        # Check cache first to avoid repeated DB scans
        try:
            cached = cache_service.get(cache_key, prefix="competitions")
            if cached:
                logger.info("Returning competitions from cache")
                return cached
        except Exception as e:
            logger.warning(f"Cache read failed for competitions: {e}")

        # Prefer local database first to ensure UI reflects DB contents
        try:
            db = next(get_db())
            db_competitions = db.query(Competition).all()

            if db_competitions:
                logger.info("Returning competitions from local database (filtered by seasons with matches)")
                result = []
                for comp in db_competitions:
                    # Only include seasons that have at least one match for this competition
                    seasons = db.query(Season).filter(Season.competition_id == comp.competition_id).all()
                    filtered_seasons = []
                    for season in seasons:
                        try:
                            from app.models.database import Match as DBMatch
                            has_matches = db.query(DBMatch).filter(
                                DBMatch.competition_id == comp.competition_id,
                                DBMatch.season_id == season.season_id
                            ).count() > 0
                        except Exception:
                            has_matches = False
                        if has_matches:
                            filtered_seasons.append({
                                'season_id': season.season_id,
                                'season_name': season.season_name
                            })

                    # Skip competition entirely if no seasons have matches
                    if not filtered_seasons:
                        continue

                    result.append({
                        'competition_id': comp.competition_id,
                        'competition_name': comp.competition_name,
                        'country_name': comp.country_name,
                        'seasons': filtered_seasons
                    })

                # Refresh cache with filtered DB result
                cache_service.set(cache_key, result, settings.CACHE_COMPETITIONS_EXPIRE, prefix="competitions")
                return result
        except Exception as e:
            logger.warning(f"Database query failed when reading competitions (filtered): {e}")

        # If DB is empty or no seasons with matches, return empty list to avoid empty UI selections
        logger.info("No competitions/seasons with matches in local database; returning empty list")
        return []

    def get_competitions_open_data(self) -> List[Dict[str, Any]]:
        """Fetch competitions and seasons directly from StatsBomb Open Data.

        Returns a list of dicts:
        [{
            'competition_id': int,
            'competition_name': str,
            'country_name': str,
            'seasons': [{'season_id': int, 'season_name': str}, ...]
        }, ...]
        """
        try:
            from statsbombpy import sb
            import pandas as pd

            df = sb.competitions()
            if df is None or df.empty:
                logger.info("StatsBomb Open Data returned no competitions")
                return []

            # Normalize column names
            required_cols = ['competition_id', 'competition_name', 'country_name', 'season_id', 'season_name']
            for col in required_cols:
                if col not in df.columns:
                    logger.warning(f"Missing expected column in competitions DF: {col}")

            comps: Dict[int, Dict[str, Any]] = {}
            for _, row in df.iterrows():
                try:
                    comp_id = int(row.get('competition_id'))
                except Exception:
                    # Skip invalid rows
                    continue
                comp_name = str(row.get('competition_name') or '')
                country_name = str(row.get('country_name') or '')
                season_id = row.get('season_id')
                season_name = str(row.get('season_name') or '')

                if comp_id not in comps:
                    comps[comp_id] = {
                        'competition_id': comp_id,
                        'competition_name': comp_name,
                        'country_name': country_name,
                        'seasons': []
                    }
                if pd.notnull(season_id):
                    try:
                        season_id_int = int(season_id)
                        # Avoid duplicates
                        if not any(s['season_id'] == season_id_int for s in comps[comp_id]['seasons']):
                            comps[comp_id]['seasons'].append({
                                'season_id': season_id_int,
                                'season_name': season_name
                            })
                    except Exception:
                        pass

            return list(comps.values())
        except Exception as e:
            logger.error(f"Error fetching competitions from Open Data: {e}")
            return []
    
    def get_matches(self, competition_id: int, season_id: int) -> List[Match]:
        """Get matches for a specific competition and season"""
        # Try cache first
        cache_key = f"matches:{competition_id}:{season_id}"
        cached_data = cache_service.get(cache_key, prefix="matches")
        
        if cached_data:
            logger.info(f"Returning matches from cache for competition {competition_id}, season {season_id}")
            return [Match(**match_data) for match_data in cached_data]
        
        # Try local database
        try:
            db = next(get_db())
            db_matches = db.query(DBMatch).filter(
                DBMatch.competition_id == competition_id,
                DBMatch.season_id == season_id
            ).all()
            
            if db_matches:
                logger.info(f"Returning matches from local database for competition {competition_id}, season {season_id}")
                # Prepare a date-based fallback mapping when match_round is empty
                # Build sorted unique date keys for this (competition, season)
                def date_key(dt):
                    if dt is None:
                        return None
                    return f"{dt.year}-{str(dt.month).zfill(2)}-{str(dt.day).zfill(2)}"

                unique_dates = sorted({date_key(m.match_date) for m in db_matches if m.match_date is not None})
                date_to_round_index = {d: i + 1 for i, d in enumerate(unique_dates)}
                matches = []
                for db_match in db_matches:
                    # Use DB match_round when present, otherwise fallback to "Matchday N" by calendar date
                    mr = (db_match.match_round or "").strip()
                    if not mr:
                        dk = date_key(db_match.match_date)
                        # Only fallback when we have a valid date key
                        if dk in date_to_round_index:
                            mr = f"Matchday {date_to_round_index[dk]}"
                    match = Match(
                        match_id=db_match.match_id,
                        match_date=db_match.match_date,
                        match_round=mr if mr else None,
                        home_team=db_match.home_team,
                        away_team=db_match.away_team,
                        home_score=db_match.home_score,
                        away_score=db_match.away_score,
                        competition_id=competition_id,
                        season_id=season_id
                    )
                    matches.append(match)
                
                # Cache the result
                cache_data = [
                    {
                        'match_id': m.match_id,
                        'match_date': m.match_date.isoformat() if m.match_date else None,
                        'match_round': m.match_round,
                        'home_team': m.home_team,
                        'away_team': m.away_team,
                        'home_score': m.home_score,
                        'away_score': m.away_score,
                        'competition_id': m.competition_id,
                        'season_id': m.season_id
                    } for m in matches
                ]
                cache_service.set(cache_key, cache_data, settings.CACHE_MATCHES_EXPIRE, prefix="matches")
                return matches
        except Exception as e:
            logger.warning(f"Database query failed; returning empty list: {e}")
        
        # No external fallback — reflect local DB state only
        logger.info(
            f"No matches in local database for competition {competition_id}, season {season_id}; returning empty list"
        )
        return []

    def get_matches_open_data(self, competition_id: int, season_id: int) -> List[Match]:
        """Fetch matches directly from StatsBomb Open Data and map match_round.

        Mapping rules:
        - If `match_week` exists and is not null -> `match_round = f"Matchday {int(match_week)}"`
        - Else if `competition_stage` exists -> use its value (e.g., 'Round of 16', 'Quarter-final', 'Group Stage')
        - Else -> None
        """
        try:
            from statsbombpy import sb  # Lazy import to avoid overhead when unused
            import pandas as pd

            df = sb.matches(competition_id=competition_id, season_id=season_id)
            if df is None or df.empty:
                logger.info(f"StatsBomb returned no matches for competition {competition_id}, season {season_id}")
                return []

            def get_col(row, *candidates):
                for c in candidates:
                    if c in row and pd.notnull(row[c]):
                        return row[c]
                return None

            matches: List[Match] = []
            # Ensure match_date is parsed to datetime.date where possible
            if 'match_date' in df.columns:
                try:
                    df['match_date'] = pd.to_datetime(df['match_date'])
                except Exception:
                    pass

            for _, row in df.iterrows():
                match_id = int(row['match_id'])
                match_date = row['match_date'] if 'match_date' in row else None
                home_team = get_col(row, 'home_team', 'home_team_name')
                away_team = get_col(row, 'away_team', 'away_team_name')
                home_score = int(row['home_score']) if 'home_score' in row and pd.notnull(row['home_score']) else 0
                away_score = int(row['away_score']) if 'away_score' in row and pd.notnull(row['away_score']) else 0
                # Determine match_round
                match_week = row['match_week'] if 'match_week' in row else None
                comp_stage = get_col(row, 'competition_stage')
                if pd.notnull(match_week):
                    try:
                        match_round = f"Matchday {int(match_week)}"
                    except Exception:
                        match_round = f"Matchday {match_week}"
                elif comp_stage:
                    match_round = str(comp_stage)
                else:
                    match_round = None

                matches.append(Match(
                    match_id=match_id,
                    match_date=match_date,
                    match_round=match_round,
                    home_team=str(home_team) if home_team else '',
                    away_team=str(away_team) if away_team else '',
                    home_score=home_score,
                    away_score=away_score,
                    competition_id=competition_id,
                    season_id=season_id,
                ))

            return matches
        except Exception as e:
            logger.error(f"Error fetching matches from StatsBomb Open Data: {e}")
            return []
    
    def get_match_detail(self, match_id: int) -> Optional[MatchDetail]:
        """Get detailed information for a specific match"""
        # Try cache first
        cache_key = f"match_detail:{match_id}"
        cached_data = cache_service.get(cache_key, prefix="matches")
        
        if cached_data:
            logger.info(f"Returning match detail from cache for match {match_id}")
            return MatchDetail(**cached_data)
        
        # Try local database ONLY
        try:
            db = next(get_db())
            db_match = db.query(DBMatch).filter(DBMatch.match_id == match_id).first()
            
            if db_match:
                logger.info(f"Returning match detail from local database for match {match_id}")
                # Fallback match_round by date when empty, consistent with list endpoint
                mr = (db_match.match_round or "").strip()
                if not mr and db_match.match_date and db_match.competition_id and db_match.season_id:
                    # Build date → index mapping for this competition/season
                    comp_id = db_match.competition_id
                    season_id = db_match.season_id
                    db_matches = db.query(DBMatch).filter(
                        DBMatch.competition_id == comp_id,
                        DBMatch.season_id == season_id
                    ).all()
                    def date_key(dt):
                        return f"{dt.year}-{str(dt.month).zfill(2)}-{str(dt.day).zfill(2)}"
                    unique_dates = sorted({date_key(m.match_date) for m in db_matches if m.match_date is not None})
                    date_to_round_index = {d: i + 1 for i, d in enumerate(unique_dates)}
                    dk = date_key(db_match.match_date)
                    if dk in date_to_round_index:
                        mr = f"Matchday {date_to_round_index[dk]}"
                match_detail = MatchDetail(
                    match_id=db_match.match_id,
                    match_date=db_match.match_date,
                    match_round=mr if mr else None,
                    home_team=db_match.home_team,
                    away_team=db_match.away_team,
                    home_score=db_match.home_score,
                    away_score=db_match.away_score,
                    competition_id=db_match.competition_id,
                    season_id=db_match.season_id,
                    stadium=db_match.stadium,
                    referee=db_match.referee,
                    events_count=db_match.events_count
                )
                
                # Cache the result
                cache_data = {
                    'match_id': match_detail.match_id,
                    'match_date': match_detail.match_date.isoformat() if match_detail.match_date else None,
                    'match_round': match_detail.match_round,
                    'home_team': match_detail.home_team,
                    'away_team': match_detail.away_team,
                    'home_score': match_detail.home_score,
                    'away_score': match_detail.away_score,
                    'competition_id': match_detail.competition_id,
                    'season_id': match_detail.season_id,
                    'stadium': match_detail.stadium,
                    'referee': match_detail.referee,
                    'events_count': match_detail.events_count
                }
                cache_service.set(cache_key, cache_data, settings.CACHE_MATCHES_EXPIRE, prefix="matches")
                return match_detail
        except Exception:
            # If DB access fails, do not fall back to external API —
            # return None to avoid heavy and noisy operations.
            return None
    
    def get_players_by_competition(self, competition_id: int, season_id: int) -> List[Player]:
        """Get all players from a specific competition and season"""
        # Try cache first
        cache_key = f"players:{competition_id}:{season_id}"
        cached_data = cache_service.get(cache_key, prefix="players")
        
        if cached_data:
            logger.info(f"Returning players from cache for competition {competition_id}, season {season_id}")
            return [Player(**player_data) for player_data in cached_data]
        
        # Try local database
        try:
            db = next(get_db())
            db_players = db.query(DBPlayer).join(DBPlayer.stats).filter(
                DBPlayerStats.competition_id == competition_id,
                DBPlayerStats.season_id == season_id
            ).distinct().all()
            
            if db_players:
                logger.info(f"Returning players from local database for competition {competition_id}, season {season_id}")
                players = []
                for db_player in db_players:
                    player = Player(
                        player_id=db_player.player_id,
                        player_name=db_player.player_name,
                        jersey_number=db_player.jersey_number,
                        position=db_player.position,
                        team_name=db_player.team_name
                    )
                    players.append(player)
                
                # Cache the result
                cache_data = [
                    {
                        'player_id': p.player_id,
                        'player_name': p.player_name,
                        'jersey_number': p.jersey_number,
                        'position': p.position,
                        'team_name': p.team_name
                    } for p in players
                ]
                cache_service.set(cache_key, cache_data, settings.CACHE_PLAYERS_EXPIRE, prefix="players")
                return players
        except Exception as e:
            logger.warning(f"Database query failed; returning empty list: {e}")
        
        # No external fallback — reflect local DB state only
        logger.info(
            f"No players in local database for competition {competition_id}, season {season_id}; returning empty list"
        )
        return []
    
    def get_player_heat_map_data(self, competition_id: int, season_id: int, player_id: int) -> Optional[HeatMapData]:
        """Get heat map data for a specific player"""
        # Try cache first
        cache_key = f"heatmap:{competition_id}:{season_id}:{player_id}"
        cached_data = cache_service.get(cache_key, prefix="heatmap")
        
        if cached_data:
            logger.info(f"Returning heatmap from cache for player {player_id}, competition {competition_id}, season {season_id}")
            return HeatMapData(**cached_data)
        
        # Try local database
        try:
            db = next(get_db())
            db_heatmap = db.query(PlayerHeatmap).filter(
                PlayerHeatmap.player_id == player_id,
                PlayerHeatmap.competition_id == competition_id,
                PlayerHeatmap.season_id == season_id
            ).first()
            
            if db_heatmap:
                logger.info(f"Returning heatmap from local database for player {player_id}, competition {competition_id}, season {season_id}")
                import json
                heatmap_data = json.loads(db_heatmap.heatmap_data)
                
                heatmap = HeatMapData(
                    zones=heatmap_data['zones'],
                    max_intensity=heatmap_data['max_intensity'],
                    total_events=heatmap_data['total_events'],
                    pitch_length=db_heatmap.pitch_length,
                    pitch_width=db_heatmap.pitch_width,
                    grid_size_x=db_heatmap.grid_size_x,
                    grid_size_y=db_heatmap.grid_size_y
                )
                
                # Cache the result
                cache_data = {
                    'zones': heatmap.zones,
                    'max_intensity': heatmap.max_intensity,
                    'total_events': heatmap.total_events,
                    'pitch_length': heatmap.pitch_length,
                    'pitch_width': heatmap.pitch_width,
                    'grid_size_x': heatmap.grid_size_x,
                    'grid_size_y': heatmap.grid_size_y
                }
                cache_service.set(cache_key, cache_data, settings.CACHE_HEATMAP_EXPIRE, prefix="heatmap")
                return heatmap
        except Exception as e:
            logger.warning(f"Database query failed; returning None: {e}")
        
        # No external fallback — reflect local DB state only
        logger.info(
            f"No heatmap in local database for player {player_id}, competition {competition_id}, season {season_id}; returning None"
        )
        return None
    
    def _calculate_heat_zones(self, locations: List[List[float]]) -> List[Dict[str, Any]]:
        """Calculate heat zones from location data"""
        if not locations:
            return []
        
        # Convert to numpy array for easier processing
        locations_array = np.array(locations)
        
        # Define pitch dimensions (in meters)
        pitch_length = 120.0
        pitch_width = 80.0
        
        # Define grid size
        grid_size_x = 12
        grid_size_y = 8
        
        # Calculate grid cell dimensions
        cell_length = pitch_length / grid_size_x
        cell_width = pitch_width / grid_size_y
        
        # Create 2D histogram
        heatmap, xedges, yedges = np.histogram2d(
            locations_array[:, 0],  # X coordinates
            locations_array[:, 1],  # Y coordinates
            bins=[grid_size_x, grid_size_y],
            range=[[0, pitch_length], [0, pitch_width]]
        )
        
        # Normalize the heatmap
        max_count = np.max(heatmap)
        if max_count > 0:
            heatmap = heatmap / max_count
        
        # Convert to list of zones
        zones = []
        for i in range(grid_size_x):
            for j in range(grid_size_y):
                zones.append({
                    'x': float(i * cell_length),
                    'y': float(j * cell_width),
                    'width': float(cell_length),
                    'height': float(cell_width),
                    'intensity': float(heatmap[i, j])
                })
        
        return zones
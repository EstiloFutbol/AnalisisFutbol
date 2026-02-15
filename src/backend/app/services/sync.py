import asyncio
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import logging
from sqlalchemy.orm import Session
from app.config import settings
from app.models.database import get_db, Competition, Season, Match, Player, PlayerStats, PlayerHeatmap
from app.services.statsbomb import StatsBombService
from app.services.cache import cache_service

logger = logging.getLogger(__name__)

class DataSyncService:
    """Service for synchronizing data from StatsBomb to local database"""
    
    def __init__(self):
        self.statsbomb_service = StatsBombService()
        self.sync_enabled = settings.BACKGROUND_SYNC_ENABLED
        self.sync_interval = timedelta(minutes=settings.SYNC_INTERVAL_MINUTES)
        self.last_sync = None
    
    async def sync_competitions(self, db: Session, force_update: bool = False) -> int:
        """Sync competitions data"""
        try:
            logger.info("Starting competitions sync")
            
            # Get competitions from StatsBomb Open Data
            competitions_data = self.statsbomb_service.get_competitions_open_data()
            synced_count = 0
            
            for comp_data in competitions_data:
                comp_id = comp_data['competition_id']
                
                # Check if competition exists
                existing_comp = db.query(Competition).filter(
                    Competition.competition_id == comp_id
                ).first()
                
                if existing_comp and not force_update:
                    continue
                
                if existing_comp:
                    # Update existing competition
                    existing_comp.competition_name = comp_data['competition_name']
                    existing_comp.country_name = comp_data['country_name']
                    existing_comp.updated_at = datetime.utcnow()
                    comp_obj = existing_comp
                else:
                    # Create new competition
                    comp_obj = Competition(
                        competition_id=comp_id,
                        competition_name=comp_data['competition_name'],
                        country_name=comp_data['country_name']
                    )
                    db.add(comp_obj)
                
                # Sync seasons for this competition
                for season_data in comp_data['seasons']:
                    season_id = season_data['season_id']
                    
                    existing_season = db.query(Season).filter(
                        Season.season_id == season_id,
                        Season.competition_id == comp_id
                    ).first()
                    
                    if existing_season and not force_update:
                        continue
                    
                    if existing_season:
                        existing_season.season_name = season_data['season_name']
                        existing_season.updated_at = datetime.utcnow()
                    else:
                        season_obj = Season(
                            season_id=season_id,
                            season_name=season_data['season_name'],
                            competition_id=comp_id
                        )
                        db.add(season_obj)
                
                synced_count += 1
            
            db.commit()
            logger.info(f"Synced {synced_count} competitions from Open Data")
            
            # Clear competitions cache
            cache_service.clear_pattern("competitions:*")
            
            return synced_count
            
        except Exception as e:
            logger.error(f"Error syncing competitions: {e}")
            db.rollback()
            return 0
    
    async def sync_matches(self, db: Session, competition_id: int, season_id: int, force_update: bool = False) -> int:
        """Sync matches for a specific competition and season"""
        try:
            logger.info(f"Starting matches sync for competition {competition_id}, season {season_id}")
            
            # Get matches from StatsBomb Open Data with proper match_round mapping
            matches_data = self.statsbomb_service.get_matches_open_data(competition_id, season_id)
            synced_count = 0
            
            for match in matches_data:
                match_id = match.match_id
                
                # Check if match exists
                existing_match = db.query(Match).filter(
                    Match.match_id == match_id
                ).first()
                
                if existing_match and not force_update:
                    continue
                
                # Optionally load details (stadium, referee) from DB if already present
                match_detail = self.statsbomb_service.get_match_detail(match_id)
                
                match_data = {
                    'match_date': match.match_date,
                    'match_round': match.match_round,
                    'home_team': match.home_team,
                    'away_team': match.away_team,
                    'home_score': match.home_score,
                    'away_score': match.away_score,
                    'competition_id': competition_id,
                    'season_id': season_id,
                    'events_count': match_detail.events_count if match_detail else 0,
                    'stadium': match_detail.stadium if match_detail else None,
                    'referee': match_detail.referee if match_detail else None,
                }
                
                if existing_match:
                    # Update existing match
                    for key, value in match_data.items():
                        setattr(existing_match, key, value)
                    existing_match.updated_at = datetime.utcnow()
                else:
                    # Create new match
                    match_obj = Match(
                        match_id=match_id,
                        **match_data
                    )
                    db.add(match_obj)
                
                synced_count += 1
            
            db.commit()
            logger.info(f"Synced {synced_count} matches for competition {competition_id}, season {season_id}")
            
            # Clear matches cache for this competition/season
            cache_service.clear_pattern(f"matches:{competition_id}:{season_id}:*")
            
            return synced_count
            
        except Exception as e:
            logger.error(f"Error syncing matches for competition {competition_id}, season {season_id}: {e}")
            db.rollback()
            return 0
    
    async def sync_players(self, db: Session, competition_id: int, season_id: int, force_update: bool = False) -> int:
        """Sync players for a specific competition and season"""
        try:
            logger.info(f"Starting players sync for competition {competition_id}, season {season_id}")
            
            # Get players from StatsBomb
            players_data = self.statsbomb_service.get_players_by_competition(competition_id, season_id)
            synced_count = 0
            
            for player in players_data:
                player_id = player.player_id
                
                # Check if player exists
                existing_player = db.query(Player).filter(
                    Player.player_id == player_id
                ).first()
                
                if existing_player and not force_update:
                    continue
                
                player_data = {
                    'player_name': player.player_name,
                    'jersey_number': player.jersey_number,
                    'position': player.position,
                    'team_name': player.team_name,
                }
                
                if existing_player:
                    # Update existing player
                    for key, value in player_data.items():
                        setattr(existing_player, key, value)
                    existing_player.updated_at = datetime.utcnow()
                else:
                    # Create new player
                    player_obj = Player(
                        player_id=player_id,
                        **player_data
                    )
                    db.add(player_obj)
                
                synced_count += 1
            
            db.commit()
            logger.info(f"Synced {synced_count} players for competition {competition_id}, season {season_id}")
            
            # Clear players cache for this competition/season
            cache_service.clear_pattern(f"players:{competition_id}:{season_id}:*")
            
            return synced_count
            
        except Exception as e:
            logger.error(f"Error syncing players for competition {competition_id}, season {season_id}: {e}")
            db.rollback()
            return 0
    
    async def sync_player_heatmap(self, db: Session, competition_id: int, season_id: int, player_id: int, force_update: bool = False) -> bool:
        """Sync heatmap data for a specific player"""
        try:
            logger.info(f"Starting heatmap sync for player {player_id}, competition {competition_id}, season {season_id}")
            
            # Check if heatmap already exists and is recent
            existing_heatmap = db.query(PlayerHeatmap).filter(
                PlayerHeatmap.player_id == player_id,
                PlayerHeatmap.competition_id == competition_id,
                PlayerHeatmap.season_id == season_id
            ).first()
            
            if existing_heatmap and not force_update:
                # Check if heatmap is less than 24 hours old
                if existing_heatmap.updated_at > datetime.utcnow() - timedelta(hours=24):
                    logger.info(f"Heatmap for player {player_id} is up to date")
                    return True
            
            # Get heatmap data from StatsBomb
            heatmap_data = self.statsbomb_service.get_player_heat_map_data(competition_id, season_id, player_id)
            
            if not heatmap_data:
                logger.warning(f"No heatmap data found for player {player_id}")
                return False
            
            heatmap_json = json.dumps({
                'zones': heatmap_data.zones,
                'max_intensity': heatmap_data.max_intensity,
                'total_events': heatmap_data.total_events
            })
            
            if existing_heatmap:
                # Update existing heatmap
                existing_heatmap.heatmap_data = heatmap_json
                existing_heatmap.total_events = heatmap_data.total_events
                existing_heatmap.updated_at = datetime.utcnow()
            else:
                # Create new heatmap
                heatmap_obj = PlayerHeatmap(
                    player_id=player_id,
                    competition_id=competition_id,
                    season_id=season_id,
                    heatmap_data=heatmap_json,
                    total_events=heatmap_data.total_events
                )
                db.add(heatmap_obj)
            
            db.commit()
            logger.info(f"Synced heatmap for player {player_id}")
            
            # Clear heatmap cache for this player
            cache_service.delete(f"heatmap:{competition_id}:{season_id}:{player_id}")
            
            return True
            
        except Exception as e:
            logger.error(f"Error syncing heatmap for player {player_id}: {e}")
            db.rollback()
            return False
    
    async def full_sync(self, force_update: bool = False) -> Dict[str, Any]:
        """Perform a full synchronization of all data"""
        try:
            logger.info("Starting full data synchronization")
            
            db = next(get_db())
            results = {
                'competitions': 0,
                'matches': 0,
                'players': 0,
                'heatmaps': 0,
                'errors': []
            }
            
            # Sync competitions
            try:
                results['competitions'] = await self.sync_competitions(db, force_update)
            except Exception as e:
                results['errors'].append(f"Competitions sync error: {str(e)}")
            
            # Get all competitions and seasons
            competitions = db.query(Competition).all()
            
            for comp in competitions:
                seasons = db.query(Season).filter(Season.competition_id == comp.competition_id).all()
                
                for season in seasons:
                    # Sync matches
                    try:
                        matches_synced = await self.sync_matches(db, comp.competition_id, season.season_id, force_update)
                        results['matches'] += matches_synced
                    except Exception as e:
                        results['errors'].append(f"Matches sync error for comp {comp.competition_id}, season {season.season_id}: {str(e)}")
                    
                    # Sync players
                    try:
                        players_synced = await self.sync_players(db, comp.competition_id, season.season_id, force_update)
                        results['players'] += players_synced
                    except Exception as e:
                        results['errors'].append(f"Players sync error for comp {comp.competition_id}, season {season.season_id}: {str(e)}")
            
            db.close()
            
            self.last_sync = datetime.utcnow()
            logger.info(f"Full sync completed: {results}")
            
            return results
            
        except Exception as e:
            logger.error(f"Full sync error: {e}")
            return {'errors': [str(e)]}
    
    async def start_background_sync(self):
        """Start background synchronization loop"""
        if not self.sync_enabled:
            logger.info("Background sync is disabled")
            return
        
        logger.info(f"Starting background sync with interval of {self.sync_interval}")
        
        while True:
            try:
                await self.full_sync()
                await asyncio.sleep(self.sync_interval.total_seconds())
            except Exception as e:
                logger.error(f"Background sync error: {e}")
                await asyncio.sleep(300)  # Wait 5 minutes before retrying

# Global sync service instance
sync_service = DataSyncService()
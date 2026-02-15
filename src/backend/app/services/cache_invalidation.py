"""
Cache invalidation and data refresh mechanisms for EstiloFutbol.
This module provides utilities for managing cache lifecycle and data freshness.
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Set, Any
from app.config import settings
from app.services.cache import cache_service
from app.services.sync import sync_service as data_sync_service
from app.models.database import get_db, Competition, Season, Match, Player, PlayerStats, PlayerHeatmap

logger = logging.getLogger(__name__)

class CacheInvalidator:
    """Manages cache invalidation and data refresh strategies"""
    
    def __init__(self):
        self.invalidated_keys: Set[str] = set()
        self.refresh_schedules: Dict[str, datetime] = {}
    
    def invalidate_by_pattern(self, pattern: str, prefix: str = "") -> int:
        """Invalidate cache entries by pattern"""
        try:
            count = cache_service.clear_pattern(pattern, prefix)
            logger.info(f"Invalidated {count} cache entries matching pattern: {pattern}")
            return count
        except Exception as e:
            logger.error(f"Failed to invalidate cache pattern {pattern}: {e}")
            return 0
    
    def invalidate_competitions(self) -> int:
        """Invalidate all competition-related cache"""
        patterns = [
            ("competitions:*", ""),
            ("*competitions*", ""),
            ("*competition*", "")
        ]
        total_invalidated = 0
        for pattern, prefix in patterns:
            total_invalidated += self.invalidate_by_pattern(pattern, prefix)
        return total_invalidated
    
    def invalidate_matches(self, competition_id: Optional[int] = None, season_id: Optional[int] = None) -> int:
        """Invalidate match-related cache"""
        if competition_id and season_id:
            # Invalidate specific competition/season matches
            patterns = [
                (f"matches:{competition_id}:{season_id}:*", ""),
                (f"*matches:{competition_id}:{season_id}*", "")
            ]
        else:
            # Invalidate all match data
            patterns = [
                ("matches:*", ""),
                ("*matches*", ""),
                ("*match*", "")
            ]
        
        total_invalidated = 0
        for pattern, prefix in patterns:
            total_invalidated += self.invalidate_by_pattern(pattern, prefix)
        return total_invalidated
    
    def invalidate_players(self, player_id: Optional[int] = None) -> int:
        """Invalidate player-related cache"""
        if player_id:
            # Invalidate specific player
            patterns = [
                (f"players:{player_id}:*", ""),
                (f"*players:{player_id}*", ""),
                (f"*player:{player_id}*", "")
            ]
        else:
            # Invalidate all player data
            patterns = [
                ("players:*", ""),
                ("*players*", ""),
                ("*player*", "")
            ]
        
        total_invalidated = 0
        for pattern, prefix in patterns:
            total_invalidated += self.invalidate_by_pattern(pattern, prefix)
        return total_invalidated
    
    def invalidate_heatmaps(self, player_id: Optional[int] = None) -> int:
        """Invalidate heatmap-related cache"""
        if player_id:
            patterns = [
                (f"heatmaps:{player_id}:*", ""),
                (f"*heatmaps:{player_id}*", "")
            ]
        else:
            patterns = [
                ("heatmaps:*", ""),
                ("*heatmaps*", "")
            ]
        
        total_invalidated = 0
        for pattern, prefix in patterns:
            total_invalidated += self.invalidate_by_pattern(pattern, prefix)
        return total_invalidated
    
    def invalidate_all(self) -> int:
        """Invalidate all cache entries"""
        try:
            cache_service.clear_all()
            logger.info("All cache entries invalidated")
            return 1
        except Exception as e:
            logger.error(f"Failed to invalidate all cache: {e}")
            return 0

class DataRefresher:
    """Manages data refresh strategies and schedules"""
    
    def __init__(self):
        self.last_refresh_times: Dict[str, datetime] = {}
        self.refresh_intervals = {
            'competitions': timedelta(hours=24),      # Daily refresh
            'matches': timedelta(hours=6),          # Every 6 hours
            'players': timedelta(hours=12),         # Every 12 hours
            'heatmaps': timedelta(hours=8),         # Every 8 hours
            'stats': timedelta(hours=24)              # Daily refresh
        }
    
    def should_refresh(self, data_type: str, last_refresh: Optional[datetime] = None) -> bool:
        """Check if data type should be refreshed based on interval"""
        if data_type not in self.refresh_intervals:
            return False
        
        if last_refresh is None:
            # Check our records
            last_refresh = self.last_refresh_times.get(data_type)
            if last_refresh is None:
                return True  # Never refreshed
        
        interval = self.refresh_intervals[data_type]
        return datetime.now() - last_refresh >= interval
    
    async def refresh_competitions(self, force: bool = False) -> bool:
        """Refresh competition data"""
        data_type = 'competitions'
        
        if not force and not self.should_refresh(data_type):
            logger.info("Competitions data is still fresh, skipping refresh")
            return False
        
        try:
            logger.info("Refreshing competition data...")
            
            # Invalidate existing cache
            cache_invalidator = CacheInvalidator()
            cache_invalidator.invalidate_competitions()
            
            # Sync competitions to database
            await data_sync_service.sync_competitions()
            
            self.last_refresh_times[data_type] = datetime.now()
            logger.info("Competition data refreshed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to refresh competitions: {e}")
            return False
    
    async def refresh_matches(self, competition_id: int, season_id: int, force: bool = False) -> bool:
        """Refresh match data for specific competition/season"""
        data_type = f'matches:{competition_id}:{season_id}'
        
        if not force and not self.should_refresh('matches'):
            logger.info(f"Matches data for {competition_id}/{season_id} is still fresh, skipping refresh")
            return False
        
        try:
            logger.info(f"Refreshing matches for competition {competition_id}, season {season_id}...")
            
            # Invalidate existing cache
            cache_invalidator = CacheInvalidator()
            cache_invalidator.invalidate_matches(competition_id, season_id)
            
            # Sync matches to database
            await data_sync_service.sync_matches(competition_id, season_id)
            
            self.last_refresh_times['matches'] = datetime.now()
            logger.info("Match data refreshed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to refresh matches: {e}")
            return False
    
    async def refresh_players(self, competition_id: int, season_id: int, force: bool = False) -> bool:
        """Refresh player data for specific competition/season"""
        if not force and not self.should_refresh('players'):
            logger.info("Players data is still fresh, skipping refresh")
            return False
        
        try:
            logger.info(f"Refreshing players for competition {competition_id}, season {season_id}...")
            
            # Invalidate existing cache
            cache_invalidator = CacheInvalidator()
            cache_invalidator.invalidate_players()
            
            # Sync players to database
            await data_sync_service.sync_players(competition_id, season_id)
            
            self.last_refresh_times['players'] = datetime.now()
            logger.info("Player data refreshed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to refresh players: {e}")
            return False
    
    async def refresh_heatmaps(self, player_id: int, competition_id: int, season_id: int, force: bool = False) -> bool:
        """Refresh heatmap data for specific player"""
        if not force and not self.should_refresh('heatmaps'):
            logger.info(f"Heatmap data for player {player_id} is still fresh, skipping refresh")
            return False
        
        try:
            logger.info(f"Refreshing heatmaps for player {player_id}...")
            
            # Invalidate existing cache
            cache_invalidator = CacheInvalidator()
            cache_invalidator.invalidate_heatmaps(player_id)
            
            # Sync heatmaps to database
            await data_sync_service.sync_player_heatmaps(player_id, competition_id, season_id)
            
            self.last_refresh_times['heatmaps'] = datetime.now()
            logger.info("Heatmap data refreshed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to refresh heatmaps: {e}")
            return False
    
    async def refresh_all(self, force: bool = False) -> Dict[str, bool]:
        """Refresh all data types"""
        results = {}
        
        # Refresh competitions first (they're needed for other data)
        results['competitions'] = await self.refresh_competitions(force)
        
        # Get all competitions to refresh their matches and players
        db = next(get_db())
        competitions = db.query(Competition).all()
        
        for comp in competitions:
            seasons = db.query(Season).filter(Season.competition_id == comp.competition_id).all()
            for season in seasons:
                # Refresh matches
                match_result = await self.refresh_matches(comp.competition_id, season.season_id, force)
                results[f'matches_{comp.competition_id}_{season.season_id}'] = match_result
                
                # Refresh players
                player_result = await self.refresh_players(comp.competition_id, season.season_id, force)
                results[f'players_{comp.competition_id}_{season.season_id}'] = player_result
        
        # Refresh heatmaps for all players
        players = db.query(Player).all()
        for player in players:
            # Use first competition/season found
            if competitions and competitions[0].seasons:
                heatmap_result = await self.refresh_heatmaps(
                    player.player_id,
                    competitions[0].competition_id,
                    competitions[0].seasons[0].season_id,
                    force
                )
                results[f'heatmaps_{player.player_id}'] = heatmap_result
        
        return results

class CacheManager:
    """Main cache management interface"""
    
    def __init__(self):
        self.invalidator = CacheInvalidator()
        self.refresher = DataRefresher()
    
    async def invalidate_and_refresh(self, data_type: str, **kwargs) -> bool:
        """Invalidate cache and refresh data for specific type"""
        try:
            # Invalidate cache
            if data_type == 'competitions':
                self.invalidator.invalidate_competitions()
                return await self.refresher.refresh_competitions(force=True)
            
            elif data_type == 'matches':
                comp_id = kwargs.get('competition_id')
                season_id = kwargs.get('season_id')
                if comp_id and season_id:
                    self.invalidator.invalidate_matches(comp_id, season_id)
                    return await self.refresher.refresh_matches(comp_id, season_id, force=True)
            
            elif data_type == 'players':
                comp_id = kwargs.get('competition_id')
                season_id = kwargs.get('season_id')
                if comp_id and season_id:
                    self.invalidator.invalidate_players()
                    return await self.refresher.refresh_players(comp_id, season_id, force=True)
            
            elif data_type == 'heatmaps':
                player_id = kwargs.get('player_id')
                comp_id = kwargs.get('competition_id')
                season_id = kwargs.get('season_id')
                if player_id and comp_id and season_id:
                    self.invalidator.invalidate_heatmaps(player_id)
                    return await self.refresher.refresh_heatmaps(player_id, comp_id, season_id, force=True)
            
            return False
            
        except Exception as e:
            logger.error(f"Failed to invalidate and refresh {data_type}: {e}")
            return False
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        try:
            # Get cache size (approximate)
            cache_size = len(cache_service.get_all_keys() or [])
            
            # Get database stats
            db = next(get_db())
            stats = {
                'cache_size': cache_size,
                'competitions': db.query(Competition).count(),
                'seasons': db.query(Season).count(),
                'matches': db.query(Match).count(),
                'players': db.query(Player).count(),
                'player_stats': db.query(PlayerStats).count(),
                'player_heatmaps': db.query(PlayerHeatmap).count(),
                'last_refresh_times': self.refresher.last_refresh_times
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Failed to get cache stats: {e}")
            return {}

# Global cache manager instance
cache_manager = CacheManager()

# Convenience functions
async def invalidate_competitions() -> bool:
    """Invalidate competition cache and refresh data"""
    return await cache_manager.invalidate_and_refresh('competitions')

async def invalidate_matches(competition_id: int, season_id: int) -> bool:
    """Invalidate match cache and refresh data"""
    return await cache_manager.invalidate_and_refresh('matches', competition_id=competition_id, season_id=season_id)

async def invalidate_players(competition_id: int, season_id: int) -> bool:
    """Invalidate player cache and refresh data"""
    return await cache_manager.invalidate_and_refresh('players', competition_id=competition_id, season_id=season_id)

async def invalidate_heatmaps(player_id: int, competition_id: int, season_id: int) -> bool:
    """Invalidate heatmap cache and refresh data"""
    return await cache_manager.invalidate_and_refresh('heatmaps', player_id=player_id, competition_id=competition_id, season_id=season_id)

def get_cache_statistics() -> Dict[str, Any]:
    """Get comprehensive cache statistics"""
    return cache_manager.get_cache_stats()
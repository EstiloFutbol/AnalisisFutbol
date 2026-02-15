import json
import redis
from typing import Optional, Any, Dict
from datetime import datetime, timedelta
import pickle
import hashlib
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class CacheService:
    """Service for handling caching with Redis fallback to SQLite"""
    
    def __init__(self):
        self.redis_client = None
        self.use_redis = settings.REDIS_ENABLED
        
        if self.use_redis:
            try:
                # Use short timeouts to fail fast in dev when Redis is unavailable
                self.redis_client = redis.from_url(
                    settings.REDIS_URL,
                    socket_timeout=1.0,
                    socket_connect_timeout=1.0,
                    retry_on_timeout=True
                )
                # Test connection
                self.redis_client.ping()
                logger.info("Redis cache initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to connect to Redis quickly: {e}. Falling back to SQLite cache.")
                self.use_redis = False
                self._init_sqlite_cache()
        else:
            self._init_sqlite_cache()
    
    def _init_sqlite_cache(self):
        """Initialize SQLite cache if Redis is not available"""
        try:
            from app.models.database import SessionLocal, CacheEntry
            self.SessionLocal = SessionLocal
            logger.info("SQLite cache initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize SQLite cache: {e}")
            raise
    
    def _generate_cache_key(self, key: str, prefix: str = "estilo_futbol") -> str:
        """Generate a cache key with prefix"""
        return f"{prefix}:{key}"
    
    def get(self, key: str, prefix: str = "estilo_futbol") -> Optional[Any]:
        """Get value from cache"""
        cache_key = self._generate_cache_key(key, prefix)
        
        if self.use_redis and self.redis_client:
            try:
                value = self.redis_client.get(cache_key)
                if value:
                    return pickle.loads(value)
            except Exception as e:
                logger.error(f"Redis get error for key {cache_key}: {e}")
        
        # Fallback to SQLite
        try:
            from app.models.database import CacheEntry
            db = self.SessionLocal()
            cache_entry = db.query(CacheEntry).filter(CacheEntry.cache_key == cache_key).first()
            
            if cache_entry:
                if cache_entry.expires_at > datetime.utcnow():
                    result = json.loads(cache_entry.cache_value)
                    db.close()
                    return result
                else:
                    # Expired entry, remove it
                    db.delete(cache_entry)
                    db.commit()
                    db.close()
        except Exception as e:
            logger.error(f"SQLite cache get error for key {cache_key}: {e}")
        
        return None
    
    def set(self, key: str, value: Any, expire_seconds: int = None, prefix: str = "estilo_futbol") -> bool:
        """Set value in cache"""
        if expire_seconds is None:
            expire_seconds = settings.CACHE_DEFAULT_EXPIRE
        
        cache_key = self._generate_cache_key(key, prefix)
        
        if self.use_redis and self.redis_client:
            try:
                serialized_value = pickle.dumps(value)
                self.redis_client.setex(cache_key, expire_seconds, serialized_value)
                return True
            except Exception as e:
                logger.error(f"Redis set error for key {cache_key}: {e}")
        
        # Fallback to SQLite
        try:
            from app.models.database import CacheEntry
            db = self.SessionLocal()
            
            # Remove existing entry if any
            existing = db.query(CacheEntry).filter(CacheEntry.cache_key == cache_key).first()
            if existing:
                db.delete(existing)
            
            # Create new entry
            cache_entry = CacheEntry(
                cache_key=cache_key,
                cache_value=json.dumps(value, default=str),
                expires_at=datetime.utcnow() + timedelta(seconds=expire_seconds)
            )
            db.add(cache_entry)
            db.commit()
            db.close()
            return True
        except Exception as e:
            logger.error(f"SQLite cache set error for key {cache_key}: {e}")
            return False
    
    def delete(self, key: str, prefix: str = "estilo_futbol") -> bool:
        """Delete value from cache"""
        cache_key = self._generate_cache_key(key, prefix)
        
        success = False
        
        if self.use_redis and self.redis_client:
            try:
                self.redis_client.delete(cache_key)
                success = True
            except Exception as e:
                logger.error(f"Redis delete error for key {cache_key}: {e}")
        
        # Also delete from SQLite
        try:
            from app.models.database import CacheEntry
            db = self.SessionLocal()
            cache_entry = db.query(CacheEntry).filter(CacheEntry.cache_key == cache_key).first()
            if cache_entry:
                db.delete(cache_entry)
                db.commit()
                db.close()
                success = True
        except Exception as e:
            logger.error(f"SQLite cache delete error for key {cache_key}: {e}")
        
        return success
    
    def clear_pattern(self, pattern: str, prefix: str = "estilo_futbol") -> int:
        """Clear cache entries matching a pattern"""
        cache_pattern = self._generate_cache_key(pattern, prefix)
        count = 0
        
        if self.use_redis and self.redis_client:
            try:
                keys = self.redis_client.keys(cache_pattern)
                if keys:
                    count = self.redis_client.delete(*keys)
            except Exception as e:
                logger.error(f"Redis pattern delete error for pattern {cache_pattern}: {e}")
        
        # SQLite pattern matching (simplified - uses LIKE)
        try:
            from app.models.database import CacheEntry
            db = self.SessionLocal()
            
            # Convert Redis pattern to SQL LIKE pattern
            like_pattern = cache_pattern.replace("*", "%")
            entries = db.query(CacheEntry).filter(CacheEntry.cache_key.like(like_pattern)).all()
            
            for entry in entries:
                db.delete(entry)
                count += 1
            
            db.commit()
            db.close()
        except Exception as e:
            logger.error(f"SQLite pattern delete error for pattern {cache_pattern}: {e}")
        
        return count
    
    def cleanup_expired(self) -> int:
        """Clean up expired cache entries"""
        count = 0
        
        if not self.use_redis:  # Only for SQLite
            try:
                from app.models.database import CacheEntry
                db = self.SessionLocal()
                
                expired_entries = db.query(CacheEntry).filter(
                    CacheEntry.expires_at < datetime.utcnow()
                ).all()
                
                for entry in expired_entries:
                    db.delete(entry)
                    count += 1
                
                db.commit()
                db.close()
                logger.info(f"Cleaned up {count} expired cache entries")
            except Exception as e:
                logger.error(f"SQLite cache cleanup error: {e}")
        
        return count

# Global cache instance
cache_service = CacheService()
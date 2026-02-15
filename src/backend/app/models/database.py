from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, Boolean, Text, ForeignKey, Index, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func
from datetime import datetime
from app.config import settings
import json

Base = declarative_base()

class Competition(Base):
    __tablename__ = "competitions"
    
    id = Column(Integer, primary_key=True, index=True)
    competition_id = Column(Integer, unique=True, index=True, nullable=False)
    competition_name = Column(String(255), nullable=False)
    country_name = Column(String(255))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    seasons = relationship("Season", back_populates="competition", cascade="all, delete-orphan")
    matches = relationship("Match", back_populates="competition")
    
    __table_args__ = (Index('idx_competition_id', 'competition_id'),)

class Season(Base):
    __tablename__ = "seasons"
    
    id = Column(Integer, primary_key=True, index=True)
    season_id = Column(Integer, index=True, nullable=False)
    season_name = Column(String(255))
    competition_id = Column(Integer, ForeignKey("competitions.competition_id"), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    competition = relationship("Competition", back_populates="seasons")
    matches = relationship("Match", back_populates="season")
    
    __table_args__ = (Index('idx_season_competition', 'season_id', 'competition_id'),)

class Match(Base):
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, unique=True, index=True, nullable=False)
    match_date = Column(DateTime)
    match_round = Column(String(255))
    home_team = Column(String(255), nullable=False)
    away_team = Column(String(255), nullable=False)
    home_score = Column(Integer, default=0)
    away_score = Column(Integer, default=0)
    stadium = Column(String(255))
    referee = Column(String(255))
    competition_id = Column(Integer, ForeignKey("competitions.competition_id"), nullable=False)
    season_id = Column(Integer, ForeignKey("seasons.season_id"), nullable=False)
    events_count = Column(Integer, default=0)
    events_data = Column(Text)  # JSON string for event data
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    competition = relationship("Competition", back_populates="matches")
    season = relationship("Season", back_populates="matches")
    player_stats = relationship("PlayerStats", back_populates="match", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_match_competition_season', 'competition_id', 'season_id'),
        Index('idx_match_date', 'match_date'),
    )

class Player(Base):
    __tablename__ = "players"
    
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, unique=True, index=True, nullable=False)
    player_name = Column(String(255), nullable=False)
    jersey_number = Column(Integer)
    position = Column(String(255))
    team_name = Column(String(255))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    stats = relationship("PlayerStats", back_populates="player", cascade="all, delete-orphan")
    heatmap_data = relationship("PlayerHeatmap", back_populates="player", cascade="all, delete-orphan")
    
    __table_args__ = (Index('idx_player_team', 'team_name'),)

class PlayerStats(Base):
    __tablename__ = "player_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.player_id"), nullable=False)
    match_id = Column(Integer, ForeignKey("matches.match_id"), nullable=False)
    competition_id = Column(Integer, ForeignKey("competitions.competition_id"), nullable=False)
    season_id = Column(Integer, ForeignKey("seasons.season_id"), nullable=False)
    
    # Basic stats
    minutes_played = Column(Integer, default=0)
    goals = Column(Integer, default=0)
    assists = Column(Integer, default=0)
    shots = Column(Integer, default=0)
    shots_on_target = Column(Integer, default=0)
    passes = Column(Integer, default=0)
    passes_completed = Column(Integer, default=0)
    pass_accuracy = Column(Float, default=0.0)
    
    # Advanced stats
    tackles = Column(Integer, default=0)
    interceptions = Column(Integer, default=0)
    fouls_committed = Column(Integer, default=0)
    fouls_won = Column(Integer, default=0)
    yellow_cards = Column(Integer, default=0)
    red_cards = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    player = relationship("Player", back_populates="stats")
    match = relationship("Match", back_populates="player_stats")
    competition = relationship("Competition")
    season = relationship("Season")
    
    __table_args__ = (
        Index('idx_player_stats_player', 'player_id'),
        Index('idx_player_stats_match', 'match_id'),
        Index('idx_player_stats_competition_season', 'competition_id', 'season_id'),
    )

class PlayerHeatmap(Base):
    __tablename__ = "player_heatmaps"
    
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.player_id"), nullable=False)
    competition_id = Column(Integer, ForeignKey("competitions.competition_id"), nullable=False)
    season_id = Column(Integer, ForeignKey("seasons.season_id"), nullable=False)
    
    # Heatmap data as JSON
    heatmap_data = Column(Text, nullable=False)  # JSON string containing heat zones
    total_events = Column(Integer, default=0)
    pitch_length = Column(Float, default=120.0)
    pitch_width = Column(Float, default=80.0)
    grid_size_x = Column(Integer, default=12)
    grid_size_y = Column(Integer, default=8)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    player = relationship("Player", back_populates="heatmap_data")
    competition = relationship("Competition")
    season = relationship("Season")
    
    __table_args__ = (
        Index('idx_heatmap_player_competition_season', 'player_id', 'competition_id', 'season_id'),
    )

class CacheEntry(Base):
    __tablename__ = "cache_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    cache_key = Column(String(255), unique=True, index=True, nullable=False)
    cache_value = Column(Text, nullable=False)  # JSON string
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    __table_args__ = (Index('idx_cache_expires', 'expires_at'),)

# Database setup
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

"""Optimize SQLite performance with sensible PRAGMAs when applicable"""
if "sqlite" in settings.DATABASE_URL:
    @event.listens_for(engine, "connect")
    def set_sqlite_pragmas(dbapi_connection, connection_record):
        try:
            cursor = dbapi_connection.cursor()
            # Use WAL for better concurrent reads and write performance
            cursor.execute("PRAGMA journal_mode=WAL;")
            # Reduce fsync frequency while maintaining reasonable durability
            cursor.execute("PRAGMA synchronous=NORMAL;")
            # Keep temp data in memory
            cursor.execute("PRAGMA temp_store=MEMORY;")
            # Increase page cache size (~32MB). Negative sets size in KB.
            cursor.execute("PRAGMA cache_size=-32768;")
            # Enable memory-mapped I/O to improve large reads
            cursor.execute("PRAGMA mmap_size=134217728;")
            cursor.close()
        except Exception:
            # If PRAGMA application fails, continue without disrupting startup
            pass
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize the database and create all tables"""
    Base.metadata.create_all(bind=engine)
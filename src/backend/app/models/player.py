from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Player(BaseModel):
    """Player information"""
    player_id: int
    player_name: str
    jersey_number: Optional[int] = Field(None, description="Player's jersey number")
    position: Optional[str] = Field(None, description="Player's position")
    team_name: str

class PlayerEvent(BaseModel):
    """Individual player event for heat map generation"""
    event_id: str
    player_id: int
    player_name: str
    event_type: str
    location_x: float = Field(..., description="X coordinate on the pitch (0-120)")
    location_y: float = Field(..., description="Y coordinate on the pitch (0-80)")
    minute: int
    second: int
    team_name: str

class HeatMapData(BaseModel):
    """Heat map data for a player"""
    player_id: int
    player_name: str
    team_name: str
    position: Optional[str] = None
    jersey_number: Optional[int] = None
    total_events: int
    events: List[PlayerEvent]
    heat_zones: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Pre-calculated heat zones with intensity values"
    )

class PlayerStats(BaseModel):
    """Basic player statistics"""
    player_id: int
    player_name: str
    team_name: str
    position: Optional[str] = None
    jersey_number: Optional[int] = None
    matches_played: int
    total_events: int
    goals: int = 0
    assists: int = 0
    passes: int = 0
    shots: int = 0
    tackles: int = 0
    average_position_x: Optional[float] = None
    average_position_y: Optional[float] = None
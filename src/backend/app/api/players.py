from fastapi import APIRouter, HTTPException
from app.services.statsbomb import StatsBombService
from app.models.player import Player, HeatMapData
from typing import List

router = APIRouter()
statsbomb_service = StatsBombService()

@router.get("/{competition_id}/{season_id}", response_model=List[Player])
async def get_players(competition_id: int, season_id: int):
    """Get all players from a specific competition and season"""
    try:
        players = statsbomb_service.get_players_by_competition(competition_id, season_id)
        if not players:
            raise HTTPException(status_code=404, detail="No players found for this competition and season")
        return players
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching players: {str(e)}")

@router.get("/{competition_id}/{season_id}/{player_id}/heatmap", response_model=HeatMapData)
async def get_player_heatmap(competition_id: int, season_id: int, player_id: int):
    """Get heat map data for a specific player"""
    try:
        heatmap_data = statsbomb_service.get_player_heat_map_data(competition_id, season_id, player_id)
        if not heatmap_data:
            raise HTTPException(status_code=404, detail="No heat map data found for this player")
        return heatmap_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching heat map data: {str(e)}")
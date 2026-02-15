from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Optional
from app.api import auth, matches, competitions, players
from app.config import settings
from app.models.database import init_db
from app.services.sync import sync_service as data_sync_service
from app.services.cache_invalidation import cache_manager
from app.auth import get_current_user_or_api_key, get_current_active_user, get_current_admin_user
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    openapi_url=(f"{settings.API_V1_STR}/openapi.json" if settings.ENABLE_DOCS else None),
    docs_url=(f"{settings.API_V1_STR}/docs" if settings.ENABLE_DOCS else None),
    redoc_url=(f"{settings.API_V1_STR}/redoc" if settings.ENABLE_DOCS else None),
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""Include API routers first (before mounting static files)"""
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}", tags=["authentication"])

if settings.REQUIRE_AUTH:
    app.include_router(
        matches.router,
        prefix=f"{settings.API_V1_STR}",
        tags=["matches"],
        dependencies=[Depends(get_current_user_or_api_key)],
    )
    app.include_router(
        competitions.router,
        prefix=f"{settings.API_V1_STR}/competitions",
        tags=["competitions"],
        dependencies=[Depends(get_current_user_or_api_key)],
    )
    app.include_router(
        players.router,
        prefix=f"{settings.API_V1_STR}/players",
        tags=["players"],
        dependencies=[Depends(get_current_user_or_api_key)],
    )
else:
    app.include_router(matches.router, prefix=f"{settings.API_V1_STR}", tags=["matches"]) 
    app.include_router(competitions.router, prefix=f"{settings.API_V1_STR}/competitions", tags=["competitions"]) 
    app.include_router(players.router, prefix=f"{settings.API_V1_STR}/players", tags=["players"]) 

# Mount static files (frontend) - only if frontend directory exists
# This should be done AFTER API routes to avoid conflicts
frontend_path = os.path.join(os.path.dirname(__file__), "..", "..", "frontend")
if os.path.exists(frontend_path):
    # Mount static files with a specific path to avoid overriding API routes
    app.mount("/static", StaticFiles(directory=frontend_path, html=True), name="frontend")
    logger.info(f"Frontend mounted at /static")
else:
    logger.warning(f"Frontend directory not found at {frontend_path}, serving API only")

@app.on_event("startup")
async def startup_event():
    """Initialize database and start background services on startup"""
    logger.info("Starting EstiloFutbol API...")
    
    # Initialize database
    logger.info("Initializing database...")
    init_db()
    
    # Start background data synchronization if enabled
    if settings.BACKGROUND_SYNC_ENABLED:
        logger.info("Starting background data synchronization...")
        await data_sync_service.start_background_sync()
    else:
        logger.info("Background data synchronization is disabled")
    
    logger.info("EstiloFutbol API started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down EstiloFutbol API...")
    
    # Stop background synchronization
    if settings.BACKGROUND_SYNC_ENABLED:
        logger.info("Stopping background data synchronization...")
        data_sync_service.stop_background_sync()
    
    logger.info("EstiloFutbol API shutdown complete")

@app.get("/")
async def root():
    """Root endpoint that serves the frontend"""
    return {"message": "EstiloFutbol API"}

@app.get("/health")
async def health_check():
    """Health check endpoint with cache statistics"""
    # Lazy import to avoid heavy cache initialization during app startup
    from app.services.cache_invalidation import get_cache_statistics
    cache_stats = get_cache_statistics()
    return {
        "status": "healthy", 
        "cache_enabled": settings.REDIS_ENABLED, 
        "sync_enabled": settings.BACKGROUND_SYNC_ENABLED,
        "cache_stats": cache_stats
    }

@app.post("/cache/invalidate/all")
async def invalidate_all_cache(current_user=Depends(get_current_admin_user)):
    """Invalidate all cache entries"""
    try:
        from app.services.cache_invalidation import cache_manager
        count = cache_manager.invalidator.invalidate_all()
        return {"message": f"All cache entries invalidated", "count": count}
    except Exception as e:
        logger.error(f"Failed to invalidate all cache: {e}")
        raise HTTPException(status_code=500, detail="Failed to invalidate cache")

@app.post("/cache/invalidate/competitions")
async def invalidate_competitions_cache(current_user=Depends(get_current_admin_user)):
    """Invalidate competition-related cache"""
    try:
        from app.services.cache_invalidation import cache_manager
        count = cache_manager.invalidator.invalidate_competitions()
        return {"message": f"Competition cache invalidated", "count": count}
    except Exception as e:
        logger.error(f"Failed to invalidate competitions cache: {e}")
        raise HTTPException(status_code=500, detail="Failed to invalidate competitions cache")

@app.post("/cache/invalidate/matches")
async def invalidate_matches_cache(
    current_user=Depends(get_current_admin_user),
    competition_id: Optional[int] = Query(None, description="Competition ID (optional)"),
    season_id: Optional[int] = Query(None, description="Season ID (optional)")
):
    """Invalidate match-related cache"""
    try:
        from app.services.cache_invalidation import cache_manager
        count = cache_manager.invalidator.invalidate_matches(competition_id, season_id)
        return {"message": f"Match cache invalidated", "count": count}
    except Exception as e:
        logger.error(f"Failed to invalidate matches cache: {e}")
        raise HTTPException(status_code=500, detail="Failed to invalidate matches cache")

@app.post("/cache/invalidate/players")
async def invalidate_players_cache(current_user=Depends(get_current_admin_user)):
    """Invalidate player-related cache"""
    try:
        from app.services.cache_invalidation import cache_manager
        count = cache_manager.invalidator.invalidate_players()
        return {"message": f"Player cache invalidated", "count": count}
    except Exception as e:
        logger.error(f"Failed to invalidate players cache: {e}")
        raise HTTPException(status_code=500, detail="Failed to invalidate players cache")

@app.post("/cache/refresh/competitions")
async def refresh_competitions_data(current_user=Depends(get_current_admin_user)):
    """Refresh competition data from source"""
    try:
        success = await cache_manager.refresher.refresh_competitions(force=True)
        if success:
            return {"message": "Competition data refreshed successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to refresh competition data")
    except Exception as e:
        logger.error(f"Failed to refresh competitions: {e}")
        raise HTTPException(status_code=500, detail="Failed to refresh competition data")

@app.get("/cache/stats")
async def get_cache_stats(current_user=Depends(get_current_admin_user)):
    """Get cache statistics"""
    try:
        from app.services.cache_invalidation import get_cache_statistics
        stats = get_cache_statistics()
        return {"cache_statistics": stats}
    except Exception as e:
        logger.error(f"Failed to get cache statistics: {e}")
        raise HTTPException(status_code=500, detail="Failed to get cache statistics")

@app.post("/cache/refresh/matches")
async def refresh_matches_data(
    current_user=Depends(get_current_admin_user),
    competition_id: int = Query(..., description="Competition ID"),
    season_id: int = Query(..., description="Season ID")
):
    """Refresh match data for a specific competition and season"""
    try:
        success = await cache_manager.refresher.refresh_matches(competition_id, season_id, force=True)
        if success:
            return {"message": f"Matches refreshed for competition {competition_id}, season {season_id}"}
        else:
            raise HTTPException(status_code=500, detail="Failed to refresh matches")
    except Exception as e:
        logger.error(f"Failed to refresh matches for {competition_id}/{season_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to refresh matches")

@app.post("/cache/refresh/players")
async def refresh_players_data(
    current_user=Depends(get_current_admin_user),
    competition_id: int = Query(..., description="Competition ID"),
    season_id: int = Query(..., description="Season ID")
):
    """Refresh player data for a specific competition and season"""
    try:
        success = await cache_manager.refresher.refresh_players(competition_id, season_id, force=True)
        if success:
            return {"message": f"Players refreshed for competition {competition_id}, season {season_id}"}
        else:
            raise HTTPException(status_code=500, detail="Failed to refresh players")
    except Exception as e:
        logger.error(f"Failed to refresh players for {competition_id}/{season_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to refresh players")

@app.post("/cache/refresh/all")
async def refresh_all_data(current_user=Depends(get_current_admin_user)):
    """Refresh all data types (competitions, matches, players, heatmaps)"""
    try:
        results = await cache_manager.refresher.refresh_all(force=True)
        return {"message": "Full data refresh triggered", "results": results}
    except Exception as e:
        logger.error(f"Failed to refresh all data: {e}")
        raise HTTPException(status_code=500, detail="Failed to refresh all data")
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Security, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, APIKeyHeader
from app.config import settings
from app.models.auth import TokenData, User, UserInDB

# Simple password verification for development (replace with proper hashing in production)
def simple_hash(password: str) -> str:
    """Simple hash for development - replace with proper hashing in production"""
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()

# Security schemes
security = HTTPBearer()
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

# Fake user database (in production, use a real database)
fake_users_db = {
    settings.ADMIN_USERNAME: {
        "username": settings.ADMIN_USERNAME,
        "full_name": "Admin User",
        "email": "admin@estilofutbol.com",
        "hashed_password": simple_hash(settings.ADMIN_PASSWORD),
        "disabled": False,
    }
}

def verify_password(plain_password, hashed_password):
    """Verify a password against its hash"""
    return simple_hash(plain_password) == hashed_password

def get_password_hash(password):
    """Hash a password"""
    return simple_hash(password)

def get_user(db, username: str):
    """Get user from database"""
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)

def authenticate_user(fake_db, username: str, password: str):
    """Authenticate user with username and password"""
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user_from_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user_from_token)):
    """Get current active user"""
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_admin_user(current_user: User = Depends(get_current_active_user)):
    """Ensure the current user is the admin user"""
    if current_user.username != settings.ADMIN_USERNAME:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return current_user

async def verify_api_key(api_key: Optional[str] = Security(api_key_header)):
    """Verify API key"""
    if api_key is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API Key required",
            headers={"WWW-Authenticate": "ApiKey"},
        )
    if api_key != settings.API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
            headers={"WWW-Authenticate": "ApiKey"},
        )
    return api_key

# Combined authentication: either JWT token OR API key
async def get_current_user_or_api_key(request: Request):
    """Authenticate with either JWT token or API key"""
    
    # Try API key first
    api_key = request.headers.get("X-API-Key")
    if api_key:
        if api_key == settings.API_KEY:
            return {"type": "api_key", "key": api_key}
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API Key"
            )
    
    # Try JWT token
    authorization = request.headers.get("Authorization")
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials"
                )
            user = get_user(fake_users_db, username=username)
            if user is None or user.disabled:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials"
                )
            return {"type": "jwt", "user": user}
        except JWTError:
            pass
    
    # No valid authentication found
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required. Provide either a valid JWT token (Authorization: Bearer <token>) or API key (X-API-Key: <key>)",
        headers={"WWW-Authenticate": "Bearer"}
    )
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from core.config import get_settings
from core.database import get_database
from core.security import create_access_token, get_password_hash, verify_password
from models.user import Token, UserCreate, UserInDB

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate, db=Depends(get_database)) -> Token:
    existing = await db["users"].find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    hashed_password = await get_password_hash(user.password)
    user_dict = user.dict()
    user_dict.update({"hashed_password": hashed_password, "role": user.role or "user"})
    await db["users"].insert_one(user_dict)
    access_token = create_access_token({"sub": user.email})
    return Token(access_token=access_token)


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_database)) -> Token:
    user_doc = await db["users"].find_one({"email": form_data.username})
    if user_doc is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password")
    user = UserInDB(**user_doc)
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password")
    settings = get_settings()
    access_token = create_access_token({"sub": user.email}, timedelta(minutes=settings.access_token_expire_minutes))
    return Token(access_token=access_token)

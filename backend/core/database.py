from typing import AsyncGenerator

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from core.config import get_settings


_settings = get_settings()
_client: AsyncIOMotorClient | None = None


async def get_database() -> AsyncGenerator[AsyncIOMotorDatabase, None]:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(_settings.mongo_url)
    db = _client[_settings.mongo_db]
    yield db


async def close_database() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None

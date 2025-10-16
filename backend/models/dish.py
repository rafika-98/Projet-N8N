from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class DishBase(BaseModel):
    name: str
    description: str
    price: float = Field(gt=0)
    category: str = Field(regex="^(Entrées|Plats|Desserts|Boissons)$")
    image_url: str


class DishCreate(DishBase):
    pass


class DishUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    category: Optional[str] = Field(default=None, regex="^(Entrées|Plats|Desserts|Boissons)$")
    image_url: Optional[str] = None


class DishInDB(DishBase):
    id: str | None = Field(None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        json_encoders = {datetime: lambda dt: dt.isoformat()}

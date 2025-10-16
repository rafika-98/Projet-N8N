from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class OrderItem(BaseModel):
    dish_id: str
    quantity: int = Field(gt=0, le=10)


class OrderBase(BaseModel):
    customer_name: str
    contact: str
    items: List[OrderItem]
    notes: str | None = None


class OrderCreate(OrderBase):
    pass


class OrderInDB(OrderBase):
    id: str | None = Field(None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending")

    class Config:
        allow_population_by_field_name = True
        json_encoders = {datetime: lambda dt: dt.isoformat()}

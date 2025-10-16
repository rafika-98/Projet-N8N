from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class ReservationBase(BaseModel):
    name: str
    email: EmailStr
    date: str  # ISO date string
    time: str  # HH:MM
    guests: int = Field(gt=0, le=20)


class ReservationCreate(ReservationBase):
    pass


class ReservationInDB(ReservationBase):
    id: str | None = Field(None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        json_encoders = {datetime: lambda dt: dt.isoformat()}

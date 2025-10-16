from typing import List
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from core.database import get_database
from core.security import get_current_admin
from models.reservation import ReservationCreate, ReservationInDB

router = APIRouter(prefix="/reservations", tags=["Reservations"])


def serialize_reservation(doc) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.post("/", response_model=ReservationInDB, status_code=status.HTTP_201_CREATED)
async def create_reservation(reservation: ReservationCreate, db=Depends(get_database)):
    doc = reservation.dict()
    result = await db["reservations"].insert_one(doc)
    stored = await db["reservations"].find_one({"_id": result.inserted_id})
    return serialize_reservation(stored)


@router.get("/", response_model=List[ReservationInDB])
async def list_reservations(db=Depends(get_database), _: str = Depends(get_current_admin)):
    cursor = db["reservations"].find().sort("date")
    return [serialize_reservation(doc) async for doc in cursor]


@router.delete("/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reservation(reservation_id: str, db=Depends(get_database), _: str = Depends(get_current_admin)):
    if not ObjectId.is_valid(reservation_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reservation id")
    result = await db["reservations"].delete_one({"_id": ObjectId(reservation_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")
    return None

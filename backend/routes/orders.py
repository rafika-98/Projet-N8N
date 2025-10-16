from typing import List
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from core.database import get_database
from core.security import get_current_admin
from models.order import OrderCreate, OrderInDB

router = APIRouter(prefix="/orders", tags=["Orders"])


def serialize_order(doc) -> dict:
    doc["_id"] = str(doc["_id"])
    doc["items"] = [
        {"dish_id": str(item.get("dish_id")), "quantity": item.get("quantity"), "notes": item.get("notes")}
        if isinstance(item, dict)
        else item
        for item in doc.get("items", [])
    ]
    return doc


@router.post("/", response_model=OrderInDB, status_code=status.HTTP_201_CREATED)
async def create_order(order: OrderCreate, db=Depends(get_database)):
    doc = order.dict()
    doc["items"] = [{"dish_id": item.dish_id, "quantity": item.quantity} for item in order.items]
    result = await db["orders"].insert_one(doc)
    stored = await db["orders"].find_one({"_id": result.inserted_id})
    return serialize_order(stored)


@router.get("/", response_model=List[OrderInDB])
async def list_orders(db=Depends(get_database), _: str = Depends(get_current_admin)):
    cursor = db["orders"].find().sort("created_at", -1)
    return [serialize_order(doc) async for doc in cursor]


@router.patch("/{order_id}/status", response_model=OrderInDB)
async def update_order_status(order_id: str, status_value: str, db=Depends(get_database), _: str = Depends(get_current_admin)):
    if not ObjectId.is_valid(order_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid order id")
    result = await db["orders"].update_one({"_id": ObjectId(order_id)}, {"$set": {"status": status_value}})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    updated = await db["orders"].find_one({"_id": ObjectId(order_id)})
    return serialize_order(updated)

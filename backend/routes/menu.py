from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List
from bson import ObjectId

from core.database import get_database
from core.security import get_current_admin
from models.dish import DishCreate, DishInDB, DishUpdate

router = APIRouter(prefix="/menu", tags=["Menu"])


def serialize_dish(doc) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.get("/", response_model=List[DishInDB])
async def list_dishes(category: str | None = Query(default=None), db=Depends(get_database)):
    query = {"category": category} if category else {}
    cursor = db["dishes"].find(query)
    dishes = [serialize_dish(doc) async for doc in cursor]
    return dishes


@router.post("/", response_model=DishInDB, status_code=status.HTTP_201_CREATED)
async def create_dish(dish: DishCreate, db=Depends(get_database), _: str = Depends(get_current_admin)):
    doc = dish.dict()
    result = await db["dishes"].insert_one(doc)
    created = await db["dishes"].find_one({"_id": result.inserted_id})
    return serialize_dish(created)


@router.put("/{dish_id}", response_model=DishInDB)
async def update_dish(dish_id: str, dish: DishUpdate, db=Depends(get_database), _: str = Depends(get_current_admin)):
    if not ObjectId.is_valid(dish_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid dish id")
    update_data = {k: v for k, v in dish.dict(exclude_unset=True).items()}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No data provided")
    result = await db["dishes"].update_one({"_id": ObjectId(dish_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dish not found")
    updated = await db["dishes"].find_one({"_id": ObjectId(dish_id)})
    return serialize_dish(updated)


@router.delete("/{dish_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dish(dish_id: str, db=Depends(get_database), _: str = Depends(get_current_admin)):
    if not ObjectId.is_valid(dish_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid dish id")
    result = await db["dishes"].delete_one({"_id": ObjectId(dish_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dish not found")
    return None

from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import get_settings
from core.database import close_database, get_database
from core.security import get_password_hash
from models.dish import DishCreate
from routes import auth, menu, orders, reservations

settings = get_settings()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(menu.router)
app.include_router(reservations.router)
app.include_router(orders.router)


@app.on_event("startup")
async def startup_event() -> None:
    db = (await get_database().__anext__())

    admin = await db["users"].find_one({"email": settings.admin_email})
    if not admin:
        hashed_password = await get_password_hash(settings.admin_password)
        await db["users"].insert_one(
            {
                "email": settings.admin_email,
                "full_name": "Admin Le Gourmet",
                "role": "admin",
                "hashed_password": hashed_password,
            }
        )

    dishes_count = await db["dishes"].count_documents({})
    if dishes_count == 0:
        seed_dishes: List[DishCreate] = [
            DishCreate(
                name="Riz au gras",
                description="Riz parfumé aux légumes et à la viande, spécialité nigérienne.",
                price=4500,
                category="Plats",
                image_url="https://images.unsplash.com/photo-1504674900247-0877df9cc836",
            ),
            DishCreate(
                name="Brochettes de zébu",
                description="Brochettes grillées au feu de bois, marinées aux épices locales.",
                price=3500,
                category="Plats",
                image_url="https://images.unsplash.com/photo-1551183053-bf91a1d81141",
            ),
            DishCreate(
                name="Poisson braisé",
                description="Poisson du fleuve Niger, braisé avec une sauce épicée.",
                price=5000,
                category="Plats",
                image_url="https://images.unsplash.com/photo-1504674900247-0877df9cc836",
            ),
            DishCreate(
                name="Salade de niébé",
                description="Salade fraîche aux haricots niébé, tomates et oignons.",
                price=2500,
                category="Entrées",
                image_url="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17",
            ),
            DishCreate(
                name="Beignets de mil",
                description="Délicieux beignets traditionnels à base de farine de mil.",
                price=1500,
                category="Desserts",
                image_url="https://images.unsplash.com/photo-1484723091739-30a097e8f929",
            ),
            DishCreate(
                name="Tô sauce gombo",
                description="Pâte de mil accompagnée d'une sauce gombo parfumée.",
                price=4000,
                category="Plats",
                image_url="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38",
            ),
            DishCreate(
                name="Dambou",
                description="Semoule de mil aux feuilles de moringa et arachides grillées.",
                price=3800,
                category="Plats",
                image_url="https://images.unsplash.com/photo-1478145046317-39f10e56b5e9",
            ),
            DishCreate(
                name="Jus de bissap",
                description="Boisson rafraîchissante à base de fleurs d'hibiscus.",
                price=1200,
                category="Boissons",
                image_url="https://images.unsplash.com/photo-1527169402691-feff5539e52c",
            ),
            DishCreate(
                name="Thiakry",
                description="Dessert sucré à base de couscous de mil et lait caillé.",
                price=2200,
                category="Desserts",
                image_url="https://images.unsplash.com/photo-1509440159596-0249088772ff",
            ),
            DishCreate(
                name="Pastels de poisson",
                description="Chaussons frits farcis au poisson épicé.",
                price=2000,
                category="Entrées",
                image_url="https://images.unsplash.com/photo-1506368249639-73a05d6f6488",
            ),
        ]

        await db["dishes"].insert_many([dish.dict() for dish in seed_dishes])


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await close_database()


@app.get("/", tags=["Health"])  # pragma: no cover - simple endpoint
async def root():
    return {"message": "Bienvenue au Gourmet du Sahel"}

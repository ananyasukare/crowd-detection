import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.security import get_password_hash
from app.models.user import UserRole
from app.core.config import settings
import uuid
from datetime import datetime

async def setup_db():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["queue_db"]
    
    # Clear existing data (optional, for development)
    await db["users"].delete_many({})
    await db["offices"].delete_many({})
    await db["tokens"].delete_many({})
    
    # Create Super Admin
    super_admin = {
        "_id": str(uuid.uuid4()),
        "name": "Super Admin",
        "email": settings.SUPER_ADMIN_EMAIL,
        "password_hash": get_password_hash(settings.SUPER_ADMIN_PASSWORD),
        "role": UserRole.SUPER_ADMIN,
        "phone": "1234567890",
        "created_at": datetime.utcnow()
    }
    await db["users"].insert_one(super_admin)
    print(f"Super Admin created: {settings.SUPER_ADMIN_EMAIL} / {settings.SUPER_ADMIN_PASSWORD}")
    
    # Create some Offices
    offices = [
        {
            "_id": str(uuid.uuid4()),
            "name": "Central Bank",
            "branch": "Main Branch",
            "location": "New Delhi",
            "category": "Bank",
            "latitude": 28.6139,
            "longitude": 77.2090,
            "max_capacity": 100,
            "status": "open",
            "queue_length": 5,
            "estimated_wait": 30,
            "crowd_level": "medium",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Passport Seva Kendra",
            "branch": "South Delhi",
            "location": "New Delhi",
            "category": "Government",
            "latitude": 28.5355,
            "longitude": 77.2410,
            "max_capacity": 200,
            "status": "open",
            "queue_length": 15,
            "estimated_wait": 120,
            "crowd_level": "high",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    await db["offices"].insert_many(offices)
    print(f"Created {len(offices)} offices")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(setup_db())

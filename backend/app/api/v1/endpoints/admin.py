from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from app.models.token import TokenResponse, TokenStatus
from app.api.v1.deps import get_current_user, check_role
from app.models.user import UserRole, UserInDB
from datetime import datetime

router = APIRouter()

@router.get("/dashboard/{office_id}")
async def get_admin_dashboard(
    office_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserInDB = Depends(check_role(UserRole.ADMIN))
) -> Any:
    office = await db["offices"].find_one({"_id": office_id})
    if not office:
        raise HTTPException(status_code=404, detail="Office not found")
    
    # Get stats
    total_visitors = await db["tokens"].count_documents({"office_id": office_id})
    active_queue = await db["tokens"].count_documents({"office_id": office_id, "status": TokenStatus.WAITING})
    served_today = await db["tokens"].count_documents({
        "office_id": office_id, 
        "status": TokenStatus.SERVED,
        "created_at": {"$gte": datetime.utcnow().replace(hour=0, minute=0)}
    })
    
    return {
        "office": office,
        "stats": {
            "total_visitors": total_visitors,
            "active_queue": active_queue,
            "served_today": served_today,
            "avg_wait_time": office.get("estimated_wait", 0)
        }
    }

@router.post("/token/{token_id}/status")
async def update_token_status(
    token_id: str,
    new_status: TokenStatus,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserInDB = Depends(check_role(UserRole.ADMIN))
) -> Any:
    token = await db["tokens"].find_one({"_id": token_id})
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    
    await db["tokens"].update_one(
        {"_id": token_id},
        {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
    )
    
    # If served or cancelled, decrement office queue length
    if new_status in [TokenStatus.SERVED, TokenStatus.CANCELLED, TokenStatus.SKIPPED]:
        await db["offices"].update_one(
            {"_id": token["office_id"]},
            {"$inc": {"queue_length": -1}}
        )
    
    return {"message": f"Token status updated to {new_status}"}

@router.get("/queue/{office_id}", response_model=List[TokenResponse])
async def get_office_queue(
    office_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserInDB = Depends(check_role(UserRole.ADMIN))
) -> Any:
    cursor = db["tokens"].find({
        "office_id": office_id,
        "status": {"$in": [TokenStatus.WAITING, TokenStatus.SERVING]}
    }).sort("token_number", 1)
    
    tokens = await cursor.to_list(length=100)
    return [TokenResponse(**token) for token in tokens]

@router.post("/office/{office_id}/crowd")
async def update_office_crowd(
    office_id: str,
    count: int,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserInDB = Depends(check_role(UserRole.ADMIN))
) -> Any:
    level = "low"
    if count > 20: level = "high"
    elif count > 10: level = "medium"
    
    await db["offices"].update_one(
        {"_id": office_id},
        {"$set": {
            "current_crowd_count": count,
            "crowd_level": level,
            "updated_at": datetime.utcnow()
        }}
    )
    return {"message": "Crowd data updated successfully", "level": level}

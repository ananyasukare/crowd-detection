from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from app.models.token import TokenCreate, TokenResponse, TokenStatus
from app.api.v1.deps import get_current_user
from app.models.user import UserInDB
from app.services.notification_service import notification_service
import uuid
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/", response_model=TokenResponse)
async def create_token(
    token_in: TokenCreate,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> Any:
    office = await db["offices"].find_one({"_id": token_in.office_id})
    if not office:
        raise HTTPException(status_code=404, detail="Office not found")
    
    # Simple token number generation (in production use a more robust way)
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    count = await db["tokens"].count_documents({
        "office_id": token_in.office_id,
        "created_at": {"$gte": today}
    })
    token_number = count + 1
    
    # Calculate queue position (Digital waiting tokens + Live AI crowd)
    waiting_count = await db["tokens"].count_documents({
        "office_id": token_in.office_id,
        "status": TokenStatus.WAITING
    })
    
    live_crowd = office.get("current_crowd_count", 0)
    total_ahead = waiting_count + live_crowd
    
    # Wait time estimation: 5 mins per person (AI Crowd + Online Queue)
    wait_time = (total_ahead + 1) * 5 
    turn_time = datetime.utcnow() + timedelta(minutes=wait_time)
    
    token_dict = token_in.dict()
    token_dict["_id"] = str(uuid.uuid4())
    token_dict["token_number"] = token_number
    token_dict["user_id"] = current_user.id
    token_dict["status"] = TokenStatus.WAITING
    token_dict["queue_position"] = total_ahead + 1
    token_dict["estimated_turn_time"] = turn_time
    token_dict["created_at"] = datetime.utcnow()
    token_dict["alert_sent"] = False
    
    await db["tokens"].insert_one(token_dict)
    
    # Send email notification (non-blocking)
    try:
        await notification_service.send_booking_confirmation(
            email=current_user.email,
            token_number=token_number,
            office_name=office["name"]
        )
    except Exception as e:
        print(f"Failed to send email: {e}")
    
    # Update office queue length
    await db["offices"].update_one(
        {"_id": token_in.office_id},
        {"$inc": {"queue_length": 1}, "$set": {"updated_at": datetime.utcnow()}}
    )
    
    return TokenResponse(**token_dict)

@router.get("/my", response_model=List[TokenResponse])
async def read_my_tokens(
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> Any:
    cursor = db["tokens"].find({"user_id": current_user.id}).sort("created_at", -1)
    tokens = await cursor.to_list(length=100)
    return [TokenResponse(**token) for token in tokens]

@router.get("/{token_id}", response_model=TokenResponse)
async def read_token(
    token_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> Any:
    token = await db["tokens"].find_one({"_id": token_id})
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    return TokenResponse(**token)

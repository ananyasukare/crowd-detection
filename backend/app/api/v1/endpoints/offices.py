from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from app.models.office import OfficeCreate, OfficeResponse, OfficeUpdate
from app.api.v1.deps import get_current_user, check_role
from app.models.user import UserRole
import uuid
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[OfficeResponse])
async def read_offices(
    db: AsyncIOMotorDatabase = Depends(get_database),
    skip: int = 0,
    limit: int = 100,
    category: str = None
) -> Any:
    query = {}
    if category:
        query["category"] = category
    
    cursor = db["offices"].find(query).skip(skip).limit(limit)
    offices = await cursor.to_list(length=limit)
    return [OfficeResponse(**office) for office in offices]

@router.post("/", response_model=OfficeResponse, dependencies=[Depends(check_role(UserRole.SUPER_ADMIN))])
async def create_office(
    office_in: OfficeCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> Any:
    office_dict = office_in.dict()
    office_dict["_id"] = str(uuid.uuid4())
    office_dict["queue_length"] = 0
    office_dict["estimated_wait"] = 0
    office_dict["crowd_level"] = "low"
    office_dict["created_at"] = datetime.utcnow()
    office_dict["updated_at"] = datetime.utcnow()
    
    await db["offices"].insert_one(office_dict)
    return OfficeResponse(**office_dict)

@router.get("/{office_id}", response_model=OfficeResponse)
async def read_office(
    office_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> Any:
    office = await db["offices"].find_one({"_id": office_id})
    if not office:
        raise HTTPException(status_code=404, detail="Office not found")
    return OfficeResponse(**office)

from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from app.models.user import UserCreate, UserResponse, UserRole, UserInDB
from app.api.v1.deps import get_current_user, check_role
from app.core.security import get_password_hash
import uuid
from datetime import datetime

router = APIRouter()

@router.get("/admins", response_model=List[UserResponse])
async def list_admins(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserInDB = Depends(check_role(UserRole.SUPER_ADMIN))
) -> Any:
    """
    List all users with the role ADMIN.
    """
    cursor = db["users"].find({"role": UserRole.ADMIN})
    admins = await cursor.to_list(length=100)
    return [UserResponse(**admin) for admin in admins]

@router.post("/admins", response_model=UserResponse)
async def create_admin(
    user_in: UserCreate,
    office_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserInDB = Depends(check_role(UserRole.SUPER_ADMIN))
) -> Any:
    """
    Create a new administrator for a specific office.
    """
    # Check if office exists
    office = await db["offices"].find_one({"_id": office_id})
    if not office:
        raise HTTPException(status_code=404, detail="Office not found")

    # Check if email already registered
    existing_user = await db["users"].find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = user_in.dict()
    user_dict["_id"] = str(uuid.uuid4())
    user_dict["password_hash"] = get_password_hash(user_in.password)
    user_dict["role"] = UserRole.ADMIN
    user_dict["office_id"] = office_id
    user_dict["created_at"] = datetime.utcnow()
    
    # Remove plain password
    del user_dict["password"]
    
    await db["users"].insert_one(user_dict)
    user_dict["id"] = user_dict["_id"]
    return UserResponse(**user_dict)

@router.delete("/admins/{admin_id}")
async def delete_admin(
    admin_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserInDB = Depends(check_role(UserRole.SUPER_ADMIN))
) -> Any:
    """
    Delete a branch administrator account.
    """
    await db["users"].delete_one({"_id": admin_id, "role": UserRole.ADMIN})
    return {"message": "Admin deleted successfully"}

@router.put("/admins/{admin_id}", response_model=UserResponse)
async def update_admin(
    admin_id: str,
    name: str = None,
    email: str = None,
    phone: str = None,
    office_id: str = None,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserInDB = Depends(check_role(UserRole.SUPER_ADMIN))
) -> Any:
    """
    Update administrator details or reassign them to a different office.
    """
    update_data = {}
    if name: update_data["name"] = name
    if email: update_data["email"] = email
    if phone: update_data["phone"] = phone
    if office_id: update_data["office_id"] = office_id
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided for update")

    await db["users"].update_one({"_id": admin_id}, {"$set": update_data})
    updated_admin = await db["users"].find_one({"_id": admin_id})
    return UserResponse(**updated_admin)

@router.delete("/offices/{office_id}")
async def delete_office(
    office_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserInDB = Depends(check_role(UserRole.SUPER_ADMIN))
) -> Any:
    """
    Delete an office and its associated data.
    """
    await db["offices"].delete_one({"_id": office_id})
    await db["tokens"].delete_many({"office_id": office_id})
    # Optional: Unassign admins
    await db["users"].update_many({"office_id": office_id}, {"$set": {"office_id": None}})
    return {"message": "Office deleted successfully"}

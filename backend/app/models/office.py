from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class OfficeBase(BaseModel):
    name: str
    branch: str
    location: str
    category: str  # Bank, Government, Public Service
    latitude: float
    longitude: float
    max_capacity: int = 50
    status: str = "open"  # open, closed, maintenance

class OfficeCreate(OfficeBase):
    pass

class OfficeUpdate(BaseModel):
    name: Optional[str] = None
    max_capacity: Optional[int] = None
    status: Optional[str] = None
    queue_length: Optional[int] = None
    estimated_wait: Optional[int] = None
    current_crowd_count: Optional[int] = None
    crowd_level: Optional[str] = None

class OfficeInDB(OfficeBase):
    id: str = Field(alias="_id")
    queue_length: int = 0
    estimated_wait: int = 0  # minutes
    crowd_level: str = "low"  # low, medium, high
    current_crowd_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class OfficeResponse(OfficeInDB):
    pass

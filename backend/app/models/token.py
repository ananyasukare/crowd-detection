from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class TokenStatus(str, Enum):
    WAITING = "waiting"
    SERVING = "serving"
    SERVED = "served"
    CANCELLED = "cancelled"
    SKIPPED = "skipped"

class TokenBase(BaseModel):
    office_id: str
    service_type: str
    preferred_slot: Optional[datetime] = None

class TokenCreate(TokenBase):
    pass

class TokenInDB(TokenBase):
    id: str = Field(alias="_id")
    token_number: int
    user_id: str
    status: TokenStatus = TokenStatus.WAITING
    queue_position: int
    estimated_turn_time: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    alert_sent: bool = False

    class Config:
        populate_by_name = True

class TokenResponse(TokenInDB):
    pass

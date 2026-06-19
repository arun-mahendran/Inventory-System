from pydantic import BaseModel
from datetime import datetime


class ParcelCreate(BaseModel):
    tracking_number: str
    customer_id: int


class FailedDeliveryRequest(BaseModel):
    reason: str


class ParcelResponse(BaseModel):
    id: int
    tracking_number: str
    customer_id: int
    assigned_agent_id: int | None
    status: str
    failure_reason: str | None = None
    history_count: int = 0
    created_at: datetime
    class Config:
        from_attributes = True
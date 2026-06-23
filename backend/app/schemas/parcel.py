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

    # NEW FIELDS
    customer_name: str | None = None
    phone: str | None = None
    address: str | None = None
    assigned_agent_id: int | None
    status: str
    failure_reason: str | None = None
    history_count: int = 0
    out_for_delivery_at: datetime | None = None
    delivered_at: datetime | None = None
    failed_at: datetime | None = None
    created_at: datetime
    class Config:
        from_attributes = True
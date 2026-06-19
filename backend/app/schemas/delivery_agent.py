from pydantic import BaseModel
from datetime import datetime


class DeliveryAgentCreate(BaseModel):
    user_id: int
    hub_id: int
    vehicle_number: str
    pincode: str


class DeliveryAgentResponse(BaseModel):
    id: int
    user_id: int
    hub_id: int
    vehicle_number: str
    pincode: str
    current_parcel_count: int
    availability_status: str
    created_at: datetime

    class Config:
        from_attributes = True
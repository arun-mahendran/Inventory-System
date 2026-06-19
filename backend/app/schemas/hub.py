from pydantic import BaseModel
from datetime import datetime


class HubCreate(BaseModel):
    hub_name: str
    address: str
    city: str
    contact_number: str


class HubResponse(BaseModel):
    id: int
    hub_name: str
    address: str
    city: str
    contact_number: str
    created_at: datetime

    class Config:
        from_attributes = True
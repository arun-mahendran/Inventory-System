from pydantic import BaseModel
from datetime import datetime


class ParcelAssignmentHistoryResponse(
    BaseModel
):
    id: int
    parcel_id: int
    agent_id: int
    assigned_at: datetime

    class Config:
        from_attributes = True
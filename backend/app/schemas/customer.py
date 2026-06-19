from pydantic import BaseModel
from pydantic import Field

from datetime import datetime


class CustomerCreate(BaseModel):

    customer_name: str = Field(
        min_length=3,
        max_length=100
    )

    phone: str = Field(
        pattern=r"^\d{10}$"
    )

    email: str

    address: str = Field(
        min_length=3,
        max_length=255
    )

    pincode: str = Field(
        pattern=r"^\d{6}$"
    )


class CustomerResponse(BaseModel):

    id: int
    customer_name: str
    phone: str
    email: str
    address: str
    pincode: str
    created_at: datetime

    class Config:
        from_attributes = True
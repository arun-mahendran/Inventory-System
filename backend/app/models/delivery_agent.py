from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database import Base


class DeliveryAgent(Base):
    __tablename__ = "delivery_agents"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    hub_id = Column(
        Integer,
        ForeignKey("hubs.id"),
        nullable=False
    )

    vehicle_number = Column(String)

    pincode = Column(
        String,
        nullable=False
    )

    current_parcel_count = Column(
        Integer,
        default=0
    )

    availability_status = Column(
        String,
        default="Available"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
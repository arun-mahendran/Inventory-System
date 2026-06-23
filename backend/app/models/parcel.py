from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from sqlalchemy.sql import func

from app.database import Base


class Parcel(Base):
    __tablename__ = "parcels"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    tracking_number = Column(
        String,
        unique=True,
        nullable=False
    )

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    assigned_agent_id = Column(
        Integer,
        ForeignKey("delivery_agents.id"),
        nullable=True
    )

    status = Column(
        String,
        default="Received"
    )

    failure_reason = Column(
        String(255),
        nullable=True
    )

    # New Columns

    out_for_delivery_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    delivered_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    failed_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
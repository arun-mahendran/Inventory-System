from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime
)

from sqlalchemy.sql import func

from app.database import Base


class ParcelAssignmentHistory(Base):
    __tablename__ = "parcel_assignment_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    parcel_id = Column(
        Integer,
        ForeignKey("parcels.id"),
        nullable=False
    )

    agent_id = Column(
        Integer,
        ForeignKey("delivery_agents.id"),
        nullable=False
    )

    assigned_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
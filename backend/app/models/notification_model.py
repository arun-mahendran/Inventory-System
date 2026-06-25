from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    DateTime
)

from sqlalchemy.sql import func

from app.database import Base


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    agent_id = Column(
        Integer,
        ForeignKey("delivery_agents.id")
    )

    message = Column(
        String,
        nullable=False
    )

    is_read = Column(
        Boolean,
        default=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
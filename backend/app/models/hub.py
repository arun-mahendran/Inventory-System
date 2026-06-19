from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Hub(Base):
    __tablename__ = "hubs"

    id = Column(Integer, primary_key=True, index=True)
    hub_name = Column(String, nullable=False)
    address = Column(Text)
    city = Column(String)
    contact_number = Column(String)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
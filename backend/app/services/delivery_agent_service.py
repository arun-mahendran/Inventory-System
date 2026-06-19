from sqlalchemy.orm import Session

from app.models.user import User
from app.models.hub import Hub
from app.models.delivery_agent import DeliveryAgent

from app.schemas.delivery_agent import (
    DeliveryAgentCreate
)


def create_delivery_agent(
    db: Session,
    agent: DeliveryAgentCreate
):

    user = db.query(User).filter(
        User.id == agent.user_id
    ).first()

    if not user:
        raise ValueError("User not found")

    hub = db.query(Hub).filter(
        Hub.id == agent.hub_id
    ).first()

    if not hub:
        raise ValueError("Hub not found")

    db_agent = DeliveryAgent(
        user_id=agent.user_id,
        hub_id=agent.hub_id,
        vehicle_number=agent.vehicle_number,
        pincode=agent.pincode,
        current_parcel_count=0
    )

    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)

    return db_agent


def get_all_agents(db: Session):

    return db.query(
        DeliveryAgent
    ).all()


def get_agent_by_id(
    db: Session,
    agent_id: int
):

    return db.query(
        DeliveryAgent
    ).filter(
        DeliveryAgent.id == agent_id
    ).first()
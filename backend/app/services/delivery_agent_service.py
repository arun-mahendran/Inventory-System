from sqlalchemy.orm import Session
import random
import string
from app.models.user import User
from app.models.hub import Hub
from app.models.delivery_agent import DeliveryAgent

from app.schemas.delivery_agent import (
    DeliveryAgentCreate
)
from app.utils.password_generator import (
    generate_temp_password
)
from app.utils.security import (
    get_password_hash
)

from app.models.parcel import Parcel

from app.models.parcel_assignment_history import (
    ParcelAssignmentHistory
)

def generate_temp_password():

    characters = (
        string.ascii_letters +
        string.digits
    )

    return "".join(
        random.choice(characters)
        for _ in range(8)
    )


def create_delivery_agent(
    db: Session,
    agent: DeliveryAgentCreate
):

    # Check Hub

    hub = db.query(Hub).filter(
        Hub.id == agent.hub_id
    ).first()

    if not hub:
        raise ValueError(
            "Hub not found"
        )

    # Check if email already exists

    existing_user = db.query(
        User
    ).filter(
        User.email == agent.email
    ).first()

    if existing_user:
        raise ValueError(
            "Email already exists"
        )

    temp_password = generate_temp_password()

    hashed_password = get_password_hash(
        temp_password
    )

    # Create User automatically

    new_user = User(
        full_name=agent.full_name,
        email=agent.email,
        password=hashed_password,
        phone=agent.phone,
        role="DeliveryAgent",
        is_password_changed=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create Delivery Agent

    db_agent = DeliveryAgent(
        user_id=new_user.id,
        hub_id=agent.hub_id,
        vehicle_number=agent.vehicle_number,
        pincode=agent.pincode,
        current_parcel_count=0
    )

    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)

    return {
        "agent": db_agent,
        "temporary_password":
            temp_password
    }


def get_all_agents(
    db: Session
):

    agents = db.query(
        DeliveryAgent
    ).all()

    result = []

    for agent in agents:
        user = db.query(
            User
        ).filter(
            User.id == agent.user_id
        ).first()

        result.append({

            "id": agent.id,
            "user_id": agent.user_id,
            "agent_name":
                user.full_name
                if user else "N/A",
            "hub_id": agent.hub_id,
            "vehicle_number":
                agent.vehicle_number,
            "pincode":
                agent.pincode,
            "current_parcel_count":
                agent.current_parcel_count,
            "availability_status":
                agent.availability_status,
            "created_at":
                agent.created_at
        })

    return result


def get_agent_by_id(
    db: Session,
    agent_id: int
):

    return db.query(
        DeliveryAgent
    ).filter(
        DeliveryAgent.id == agent_id
    ).first()


def get_agent_parcels(
    db: Session,
    agent_id: int
):

    return (
        db.query(Parcel)
        .filter(
            Parcel.assigned_agent_id
            == agent_id
        )
        .all()
    )


def delete_delivery_agent(
    db: Session,
    agent_id: int
):

    agent = db.query(
        DeliveryAgent
    ).filter(
        DeliveryAgent.id == agent_id
    ).first()

    if not agent:
        raise ValueError(
            "Delivery Agent not found"
        )

    # Check active parcels

    active_parcels = db.query(
        Parcel
    ).filter(
        Parcel.assigned_agent_id == agent_id,

        Parcel.status.in_([
            "Assigned",
            "OutForDelivery"
        ])
    ).count()

    if active_parcels > 0:

        raise ValueError(
            "Agent has active parcels and cannot be deleted"
        )

    # Check delivery history

    history_count = db.query(
        ParcelAssignmentHistory
    ).filter(
        ParcelAssignmentHistory.agent_id
        == agent_id
    ).count()

    if history_count > 0:

        raise ValueError(
            "Agent has delivery history and cannot be deleted"
        )

    # Delete associated user

    user = db.query(
        User
    ).filter(
        User.id == agent.user_id
    ).first()

    if user:
        db.delete(user)

    db.delete(agent)

    db.commit()

    return {
        "message":
            "Delivery Agent deleted successfully"
    }
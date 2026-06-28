from sqlalchemy.orm import Session

from app.models.parcel import Parcel
from app.models.customer import Customer
from app.models.delivery_agent import DeliveryAgent
from app.models.parcel_assignment_history import (
    ParcelAssignmentHistory
)
from app.models.notification_model import Notification


def auto_assign_parcel(
    db: Session,
    parcel_id: int
):

    parcel = db.query(Parcel).filter(
        Parcel.id == parcel_id
    ).first()

    if not parcel:
        raise ValueError(
            "Parcel not found"
        )

    customer = db.query(Customer).filter(
        Customer.id == parcel.customer_id
    ).first()

    if not customer:
        raise ValueError(
            "Customer not found"
        )

    agent = db.query(
        DeliveryAgent
    ).filter(
        DeliveryAgent.pincode == customer.pincode,
        DeliveryAgent.availability_status == "Available"
    ).order_by(
        DeliveryAgent.current_parcel_count.asc()
    ).first()

    if not agent:

        raise ValueError(
            "No delivery service available for this location"
        )

    parcel.assigned_agent_id = agent.id
    parcel.status = "Assigned"

    notification = Notification(
        agent_id=agent.id,
        message=f"New Parcel Assigned: {parcel.tracking_number}"
    )

    db.add(notification)

    history = ParcelAssignmentHistory(
        parcel_id=parcel.id,
        agent_id=agent.id
    )

    db.add(history)

    agent.current_parcel_count += 1
    
    if agent.current_parcel_count >= 10:
        agent.availability_status = "Busy"
    else:
        agent.availability_status = "Available"

    db.commit()
    db.refresh(parcel)

    return {
        "parcel_id": parcel.id,
        "agent_id": agent.id,
        "status": parcel.status
    }
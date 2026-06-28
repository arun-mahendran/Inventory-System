from sqlalchemy.orm import Session

from app.models.parcel import Parcel
from app.models.customer import Customer

from datetime import datetime

from app.schemas.parcel import ParcelCreate

from app.services.assignment_engine import (
    auto_assign_parcel
)
from app.models.delivery_agent import DeliveryAgent
from app.models.parcel_assignment_history import (
    ParcelAssignmentHistory
)
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException


def create_parcel(
    db: Session,
    parcel: ParcelCreate
):

    customer = db.query(Customer).filter(
        Customer.phone == parcel.phone
    ).first()

    if customer:

        customer.customer_name = (
            parcel.customer_name
        )

        customer.email = (
            parcel.email
        )

        customer.address = (
            parcel.address
        )

        customer.pincode = (
            parcel.pincode
        )

        db.flush()

    customer_pincode = parcel.pincode

    
    agent = db.query(
        DeliveryAgent
    ).filter(
        DeliveryAgent.pincode == customer_pincode,
        DeliveryAgent.availability_status == "Available"
    ).first()

    if not agent:

        raise HTTPException(
            status_code=400,
            detail="No delivery service available for this location"
        )
        
        
    if not customer:
    
            customer = Customer(
                customer_name=parcel.customer_name,
                phone=parcel.phone,
                email=parcel.email,
                address=parcel.address,
                pincode=parcel.pincode
            )
    
            db.add(customer)
    
            db.flush()

    db_parcel = Parcel(
        tracking_number=parcel.tracking_number,
        customer_id=customer.id,
        amount=parcel.amount,
        payment_method=parcel.payment_method,
        payment_status=parcel.payment_status
    )

    try:

        db.add(db_parcel)

        db.commit()

        db.refresh(customer)

        db.refresh(db_parcel)

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Tracking Number already exists"
        )

    auto_assign_parcel(
        db,
        db_parcel.id
    )

    db.refresh(db_parcel)

    return db_parcel


def get_all_parcels(
    db: Session,
    status: str = None,
    agent_id: int = None,
    customer_id: int = None
):

    query = db.query(Parcel)

    if status:
        query = query.filter(
            Parcel.status == status
        )

    if agent_id:
        query = query.filter(
            Parcel.assigned_agent_id == agent_id
        )

    if customer_id:
        query = query.filter(
            Parcel.customer_id == customer_id
        )

    parcels = query.all()

    for parcel in parcels:

        parcel.history_count = len(
            db.query(
                ParcelAssignmentHistory
            ).filter(
                ParcelAssignmentHistory.parcel_id
                == parcel.id
            ).all()
        )

        if parcel.customer:

            parcel.customer_name = (
                parcel.customer.customer_name
            )

            parcel.phone = (
                parcel.customer.phone
            )

            parcel.address = (
                parcel.customer.address
            )

    return parcels


def get_parcel_by_id(
    db: Session,
    parcel_id: int
):

    parcel = db.query(
        Parcel
    ).filter(
        Parcel.id == parcel_id
    ).first()

    if parcel and parcel.customer:

        parcel.customer_name = (
            parcel.customer.customer_name
        )

        parcel.phone = (
            parcel.customer.phone
        )

        parcel.address = (
            parcel.customer.address
        )

    return parcel


def assign_parcel_to_agent(
    db: Session,
    parcel_id: int
):
    return auto_assign_parcel(
        db,
        parcel_id
    )


def mark_out_for_delivery(
    db: Session,
    parcel_id: int
):

    parcel = db.query(Parcel).filter(
        Parcel.id == parcel_id
    ).first()

    if not parcel:
        raise HTTPException(
            status_code=404,
            detail="Parcel not found"
        )

    parcel.status = "OutForDelivery"

    parcel.out_for_delivery_at = datetime.now()

    db.commit()
    db.refresh(parcel)

    return parcel


def mark_delivered(
    db: Session,
    parcel_id: int,
):

    parcel = db.query(Parcel).filter(
        Parcel.id == parcel_id
    ).first()

    if not parcel:
        raise HTTPException(
            status_code=404,
            detail="Parcel not found"
        )

    parcel.status = "Delivered"

    parcel.delivered_at = datetime.now()

    if parcel.assigned_agent_id:

        agent = db.query(
            DeliveryAgent
        ).filter(
            DeliveryAgent.id ==
            parcel.assigned_agent_id
        ).first()

        if agent:

            if agent.current_parcel_count > 0:
                agent.current_parcel_count -= 1

            if agent.current_parcel_count < 10:
                agent.availability_status = (
                    "Available"
                )
            else:
                agent.availability_status = (
                    "Busy"
                )

    db.commit()
    db.refresh(parcel)

    return parcel

def mark_failed_delivery(
    db: Session,
    parcel_id: int,
    reason: str,
):

    parcel = db.query(Parcel).filter(
        Parcel.id == parcel_id
    ).first()

    if not parcel:
        raise HTTPException(
            status_code=404,
            detail="Parcel not found"
        )


    parcel.status = "FailedDelivery"

    parcel.failed_at = datetime.now()

    parcel.failure_reason = reason

    if parcel.assigned_agent_id:

        agent = db.query(
            DeliveryAgent
        ).filter(
            DeliveryAgent.id ==
            parcel.assigned_agent_id
        ).first()

        if agent:

            if agent.current_parcel_count > 0:
                agent.current_parcel_count -= 1

            if agent.current_parcel_count < 10:
                agent.availability_status = (
                    "Available"
                )
            else:
                agent.availability_status = (
                    "Busy"
                )

    db.commit()
    db.refresh(parcel)

    return parcel


def get_parcel_by_tracking_number(
    db: Session,
    tracking_number: str
):

    parcel = db.query(Parcel).filter(
        Parcel.tracking_number == tracking_number
    ).first()

    if not parcel:
        raise ValueError(
            "Parcel not found"
        )

    if parcel.customer:

        parcel.customer_name = (
            parcel.customer.customer_name
        )

        parcel.phone = (
            parcel.customer.phone
        )

        parcel.address = (
            parcel.customer.address
        )

    return parcel


def reassign_failed_parcel(
    db: Session,
    parcel_id: int
):

    parcel = db.query(
        Parcel
    ).filter(
        Parcel.id == parcel_id
    ).first()

    if not parcel:
        raise ValueError(
            "Parcel not found"
        )

    if parcel.status != "FailedDelivery":
        raise ValueError(
            "Only failed parcels can be reassigned"
        )

    customer = db.query(
        Customer
    ).filter(
        Customer.id == parcel.customer_id
    ).first()

    if not customer:
        raise ValueError(
            "Customer not found"
        )

    previous_agent_ids = db.query(
        ParcelAssignmentHistory.agent_id
    ).filter(
        ParcelAssignmentHistory.parcel_id
        == parcel_id
    ).all()

    previous_agent_ids = [
        row[0]
        for row in previous_agent_ids
    ]

    agent = db.query(
        DeliveryAgent
    ).filter(
        DeliveryAgent.pincode
        == customer.pincode,
        DeliveryAgent.availability_status
        == "Available"
    ).order_by(
        DeliveryAgent.current_parcel_count.asc()
    ).first()

    if not agent:
        raise ValueError(
            "No alternative delivery agent available"
        )

    parcel.assigned_agent_id = agent.id
    parcel.status = "Assigned"
    parcel.failure_reason = None

    history = ParcelAssignmentHistory(
        parcel_id=parcel.id,
        agent_id=agent.id
    )

    db.add(history)

    agent.current_parcel_count += 1

    if agent.current_parcel_count >= 10:
        agent.availability_status = (
            "Busy"
        )

    db.commit()

    return {
        "parcel_id": parcel.id,
        "agent_id": agent.id,
        "status": parcel.status
    }


def get_parcel_history(
    db: Session,
    parcel_id: int
):

    return db.query(
        ParcelAssignmentHistory
    ).filter(
        ParcelAssignmentHistory.parcel_id
        == parcel_id
    ).order_by(
        ParcelAssignmentHistory.assigned_at
    ).all()


def collect_payment(
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

    parcel.payment_status = "Paid"

    db.commit()

    db.refresh(parcel)

    return parcel
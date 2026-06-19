from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.parcel import Parcel
from app.models.delivery_agent import DeliveryAgent
from app.models.user import User
from sqlalchemy import func


def get_dashboard_summary(
    db: Session
):

    total_customers = db.query(Customer).count()
    total_parcels = db.query(Parcel).count()
    received_parcels = db.query(Parcel).filter(Parcel.status == "Received").count()
    assigned_parcels = db.query(Parcel).filter(Parcel.status == "Assigned").count()
    out_for_delivery_parcels = db.query(Parcel).filter(Parcel.status == "OutForDelivery").count()
    delivered_parcels = db.query(Parcel).filter(Parcel.status == "Delivered").count()
    failed_parcels = db.query(Parcel).filter(Parcel.status == "FailedDelivery").count()
    available_agents = db.query(DeliveryAgent).filter(DeliveryAgent.availability_status == "Available").count()
    busy_agents = db.query(DeliveryAgent).filter(DeliveryAgent.availability_status == "Busy").count()

    return {
        "total_customers": total_customers,
        "total_parcels": total_parcels,
        "received_parcels": received_parcels,
        "assigned_parcels": assigned_parcels,
        "out_for_delivery_parcels":
            out_for_delivery_parcels,
        "delivered_parcels":
            delivered_parcels,
        "failed_parcels":
            failed_parcels,
        "available_agents":
            available_agents,
        "busy_agents":
            busy_agents
    }


def get_agent_performance(
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

        active_parcels = db.query(
            Parcel
        ).filter(
            Parcel.assigned_agent_id == agent.id,
            Parcel.status.in_([
                "Assigned",
                "OutForDelivery"
            ])
        ).count()

        delivered_parcels = db.query(
            Parcel
        ).filter(
            Parcel.assigned_agent_id == agent.id,
            Parcel.status == "Delivered"
        ).count()

        failed_parcels = db.query(
            Parcel
        ).filter(
            Parcel.assigned_agent_id == agent.id,
            Parcel.status == "FailedDelivery"
        ).count()

        total_completed = (
            delivered_parcels +
            failed_parcels
        )

        success_rate = 0

        if total_completed > 0:
            success_rate = round(
                (
                    delivered_parcels /
                    total_completed
                ) * 100,
                2
            )

        result.append(
            {
                "agent_id": agent.id,
                "agent_name": user.full_name,
                "active_parcels": active_parcels,
                "delivered_parcels": delivered_parcels,
                "failed_parcels": failed_parcels,
                "success_rate": success_rate
            }
        )

    return result



def get_top_agent(
    db: Session
):

    performance = get_agent_performance(db)

    if not performance:
        return None

    top_agent = max(
        performance,
        key=lambda x: (
            x["success_rate"],
            x["delivered_parcels"]
        )
    )

    return top_agent


def get_worst_agent(
    db: Session
):

    performance = get_agent_performance(db)

    if not performance:
        return None

    worst_agent = min(
        performance,
        key=lambda x: (
            x["success_rate"],
            -x["failed_parcels"]
        )
    )

    return {
        "agent_id": worst_agent["agent_id"],
        "agent_name": worst_agent["agent_name"],
        "failed_parcels": worst_agent["failed_parcels"],
        "success_rate": worst_agent["success_rate"]
    }


def get_delivery_metrics(
    db: Session
):

    delivered_parcels = db.query(
        Parcel
    ).filter(
        Parcel.status == "Delivered"
    ).count()

    failed_parcels = db.query(
        Parcel
    ).filter(
        Parcel.status == "FailedDelivery"
    ).count()

    total_completed = (
        delivered_parcels +
        failed_parcels
    )

    success_rate = 0
    failure_rate = 0

    if total_completed > 0:

        success_rate = round(
            (
                delivered_parcels /
                total_completed
            ) * 100,
            2
        )

        failure_rate = round(
            (
                failed_parcels /
                total_completed
            ) * 100,
            2
        )

    return {
        "total_completed": total_completed,
        "delivered_parcels": delivered_parcels,
        "failed_parcels": failed_parcels,
        "success_rate": success_rate,
        "failure_rate": failure_rate
    }


def get_pincode_wise_parcels(
    db: Session
):

    result = (
        db.query(
            Customer.pincode,
            func.count(
                Parcel.id
            ).label(
                "parcel_count"
            )
        )
        .join(
            Parcel,
            Parcel.customer_id
            == Customer.id
        )
        .group_by(
            Customer.pincode
        )
        .order_by(
            func.count(
                Parcel.id
            ).desc()
        )
        .all()
    )

    return [
        {
            "pincode": row.pincode,
            "parcel_count": row.parcel_count
        }
        for row in result
    ]


def get_parcels_by_pincode(
    db: Session,
    pincode: str
):

    result = (
        db.query(
            Parcel
        )
        .join(
            Customer,
            Customer.id
            == Parcel.customer_id
        )
        .filter(
            Customer.pincode == pincode
        )
        .all()
    )

    return result
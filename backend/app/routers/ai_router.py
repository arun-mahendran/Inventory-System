from fastapi import APIRouter, Depends

from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.parcel import Parcel
from app.models.customer import Customer
from app.models.delivery_agent import DeliveryAgent

from ai.gemini_service import ask_delivery_ai

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


class AIRequest(BaseModel):
    question: str


@router.post("/ask")
def ask_ai(
    request: AIRequest,
    db: Session = Depends(get_db)
):

    total_parcels = db.query(Parcel).count()

    delivered = db.query(Parcel).filter(
        Parcel.status == "Delivered"
    ).count()

    failed = db.query(Parcel).filter(
        Parcel.status == "FailedDelivery"
    ).count()

    out_for_delivery = db.query(Parcel).filter(
        Parcel.status == "OutForDelivery"
    ).count()

    assigned = db.query(Parcel).filter(
        Parcel.status == "Assigned"
    ).count()

    received = db.query(Parcel).filter(
        Parcel.status == "Received"
    ).count()

    total_customers = db.query(Customer).count()

    total_agents = db.query(DeliveryAgent).count()

    success_rate = 0

    if total_parcels > 0:
        success_rate = round(
            (delivered / total_parcels) * 100,
            2
        )

    status_counts = {
        "Received": received,
        "Assigned": assigned,
        "Out For Delivery": out_for_delivery,
        "Delivered": delivered,
        "Failed Delivery": failed
    }

    highest_status = max(
        status_counts,
        key=status_counts.get
    )

    context = f"""
    You are an AI assistant for a parcel delivery company.

    Current Delivery Statistics:

    Total Parcels: {total_parcels}

    Received Parcels: {received}

    Assigned Parcels: {assigned}

    Out For Delivery Parcels: {out_for_delivery}

    Delivered Parcels: {delivered}

    Failed Deliveries: {failed}

    Total Customers: {total_customers}

    Total Delivery Agents: {total_agents}

    Delivery Success Rate: {success_rate}%

    Status With Highest Parcels: {highest_status}

    Answer professionally and use only the above statistics.
    """

    answer = ask_delivery_ai(
        context,
        request.question
    )

    return {
        "answer": answer
    }
from fastapi import APIRouter, Depends

from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.parcel import Parcel
from app.models.customer import Customer
from app.models.delivery_agent import DeliveryAgent
print("AI_ROUTER_START")
try:
    from ai.gemini_service import ask_delivery_ai
    print("AI_SERVICE_IMPORTED")
except Exception as e:
    print("AI IMPORT ERROR:", repr(e))
    raise
print("AI_SERVICE_IMPORTED")

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


class AIRequest(BaseModel):
    question: str
    

def preprocess_question(
    question: str
):

    question = question.lower()

    synonyms = {

        "received parcels": [
            "received",
            "arrived",
            "incoming",
            "new parcels",
            "orders received"
        ],

        "assigned parcels": [
            "assigned",
            "allocated",
            "allocated parcels",
            "agent assigned"
        ],

        "out for delivery parcels": [
            "out for delivery",
            "on the way",
            "in transit",
            "currently delivering",
            "delivery in progress"
        ],

        "delivered parcels": [
            "delivered",
            "completed deliveries",
            "successful deliveries",
            "completed parcels"
        ],

        "failed deliveries": [
            "failed",
            "undelivered",
            "delivery failures",
            "failed attempts"
        ],

        "total customers": [
            "customers",
            "users",
            "clients"
        ],

        "delivery agents": [
            "agents",
            "drivers",
            "couriers"
        ]
    }

    for canonical_term, words in synonyms.items():

        for word in words:

            if word in question:

                question += (
                    f" ({canonical_term})"
                )

                break

    return question


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
    You are an intelligent AI assistant for a parcel delivery company.

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

    Instructions:

    - Answer professionally and clearly.
    - Use business-friendly language.
    - Understand different ways users may ask the same question.
    - Treat "arrived", "incoming", "new parcels", and "orders received" as Received Parcels.
    - Treat "on the way", "in transit", and "delivery in progress" as Out For Delivery Parcels.
    - Treat "successful deliveries" and "completed deliveries" as Delivered Parcels.
    - Treat "failed attempts" and "undelivered parcels" as Failed Deliveries.
    - Never invent data.
    - Use only the statistics provided above.
    - If information is unavailable, politely state that the data is not available in the current system.
    - If users ask analytical questions, provide insights based on the statistics.

    Examples:

    User: How many parcels arrived today?
    Assistant: There are currently {received} received parcels.

    User: How many shipments are on the way?
    Assistant: There are currently {out_for_delivery} parcels out for delivery.

    User: Which status contains the most parcels?
    Assistant: The status with the highest number of parcels is {highest_status}.

    User: What is the delivery success rate?
    Assistant: The current delivery success rate is {success_rate}%.
    """

    processed_question = (
        preprocess_question(
            request.question
        )
    )

    answer = ask_delivery_ai(
        context,
        processed_question
    )

    return {
        "answer": answer
    }
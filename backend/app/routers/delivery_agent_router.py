from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.delivery_agent import (
    DeliveryAgentCreate,
    DeliveryAgentResponse
)

from app.services.delivery_agent_service import (
    create_delivery_agent,
    get_all_agents,
    get_agent_by_id
)

from app.core.dependencies import (
    get_current_user
)

from app.utils.dependencies import get_db

from app.services.delivery_agent_service import (
    get_agent_parcels
)
from app.models.parcel import Parcel

from app.core.dependencies import (
    get_current_admin,
    get_current_agent
)


router = APIRouter(
    prefix="/delivery-agents",
    tags=["Delivery Agents"]
)


@router.post("/")
def create_agent(
    agent: DeliveryAgentCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    try:
        return create_delivery_agent(
            db,
            agent
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get(
    "/",
    response_model=list[DeliveryAgentResponse]
)
def get_agents(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    return get_all_agents(db)


@router.get(
    "/{agent_id}",
    response_model=DeliveryAgentResponse
)
def get_agent(
    agent_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    return get_agent_by_id(
        db,
        agent_id
    )


@router.get(
    "/{agent_id}/parcels"
)
def get_parcels_of_agent(
    agent_id: int,
    db: Session = Depends(get_db),
    current_agent=Depends(get_current_agent)
):

    if (
        current_agent["user_id"]
        != agent_id
    ):

        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    return get_agent_parcels(
        db,
        agent_id
    )


@router.get("/tracking/{tracking_number}")
def track_parcel(
    tracking_number: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    parcel = db.query(Parcel).filter(
        Parcel.tracking_number == tracking_number
    ).first()

    if not parcel:
        raise HTTPException(
            status_code=404,
            detail="Parcel not found"
        )

    return parcel
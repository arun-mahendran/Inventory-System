from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.delivery_agent import (
    DeliveryAgentCreate,
    DeliveryAgentResponse
)

from app.services.delivery_agent_service import (
    create_delivery_agent,
    get_all_agents,
    get_agent_by_id,
    delete_delivery_agent,
    get_agent_parcels
)

from app.utils.dependencies import get_db

from app.models.parcel import Parcel


router = APIRouter(
    prefix="/delivery-agents",
    tags=["Delivery Agents"]
)


@router.post("/")
def create_agent(
    agent: DeliveryAgentCreate,
    db: Session = Depends(get_db)
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
    search: str = None,
    hub_id: int = None,
    db: Session = Depends(get_db)
):
    return get_all_agents(
        db,
        search,
        hub_id
    )


@router.get(
    "/{agent_id}",
    response_model=DeliveryAgentResponse
)
def get_agent(
    agent_id: int,
    db: Session = Depends(get_db)
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
    db: Session = Depends(get_db)
):
    return get_agent_parcels(
        db,
        agent_id
    )


@router.get(
    "/tracking/{tracking_number}"
)
def track_parcel(
    tracking_number: str,
    db: Session = Depends(get_db)
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


@router.delete("/{agent_id}")
def delete_agent(
    agent_id: int,
    db: Session = Depends(get_db)
):

    try:

        return delete_delivery_agent(
            db,
            agent_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
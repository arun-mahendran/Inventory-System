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

from app.utils.dependencies import get_db


router = APIRouter(
    prefix="/delivery-agents",
    tags=["Delivery Agents"]
)


@router.post("/", response_model=DeliveryAgentResponse)
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


@router.get("/", response_model=list[DeliveryAgentResponse])
def get_agents(
    db: Session = Depends(get_db)
):
    return get_all_agents(db)


@router.get("/{agent_id}",
            response_model=DeliveryAgentResponse)
def get_agent(
    agent_id: int,
    db: Session = Depends(get_db)
):
    return get_agent_by_id(
        db,
        agent_id
    )
from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.schemas.dashboard import (
    DashboardSummary,
    AgentPerformance,
    TopAgent,
    WorstAgent,
    DeliveryMetrics
)

from app.services.dashboard_service import (
    get_dashboard_summary,
    get_agent_performance,
    get_top_agent,
    get_worst_agent,
    get_delivery_metrics,
    get_pincode_wise_parcels,
    get_recent_parcels,
    get_parcels_by_pincode
)

from app.utils.dependencies import get_db


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "/summary",
    response_model=DashboardSummary
)
def dashboard_summary(
    db: Session = Depends(get_db)
):
    return get_dashboard_summary(db)


@router.get(
    "/agent-performance",
    response_model=list[AgentPerformance]
)
def agent_performance(
    db: Session = Depends(get_db)
):
    return get_agent_performance(db)


@router.get(
    "/top-agent",
    response_model=TopAgent
)
def top_agent(
    db: Session = Depends(get_db)
):
    return get_top_agent(db)


@router.get(
    "/worst-agent",
    response_model=WorstAgent
)
def worst_agent(
    db: Session = Depends(get_db)
):
    return get_worst_agent(db)


@router.get(
    "/delivery-metrics",
    response_model=DeliveryMetrics
)
def delivery_metrics(
    db: Session = Depends(get_db)
):
    return get_delivery_metrics(db)


@router.get(
    "/recent-parcels"
)
def recent_parcels(
    db: Session = Depends(get_db)
):
    return get_recent_parcels(db)


@router.get(
    "/pincode-analytics"
)
def pincode_analytics(
    db: Session = Depends(get_db)
):
    return get_pincode_wise_parcels(db)


@router.get(
    "/pincode/{pincode}"
)
def parcels_by_pincode(
    pincode: str,
    db: Session = Depends(get_db)
):
    return get_parcels_by_pincode(
        db,
        pincode
    )
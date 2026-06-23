from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from typing import Optional

from app.schemas.parcel import (
    ParcelCreate,
    ParcelResponse,
    FailedDeliveryRequest
)

from app.schemas.parcel_assignment_history import (
    ParcelAssignmentHistoryResponse
)

from app.services.parcel_service import (
    create_parcel,
    get_all_parcels,
    get_parcel_by_id,
    get_parcel_by_tracking_number,
    get_parcel_history,
    assign_parcel_to_agent,
    mark_out_for_delivery,
    mark_delivered,
    mark_failed_delivery,
    reassign_failed_parcel
)

from app.utils.dependencies import get_db

from app.core.dependencies import (
    get_current_admin,
    get_current_agent,
    get_current_user
)


router = APIRouter(
    prefix="/parcels",
    tags=["Parcels"]
)


@router.post(
    "/",
    response_model=ParcelResponse
)
def create_new_parcel(
    parcel: ParcelCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    try:
        return create_parcel(
            db,
            parcel
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get(
    "/",
    response_model=list[ParcelResponse]
)
def get_parcels(
    status: Optional[str] = None,
    agent_id: Optional[int] = None,
    customer_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    return get_all_parcels(
        db,
        status,
        agent_id,
        customer_id
    )


@router.get(
    "/tracking/{tracking_number}",
    response_model=ParcelResponse
)
def get_parcel_by_tracking(
    tracking_number: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        return get_parcel_by_tracking_number(
            db,
            tracking_number
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.get(
    "/{parcel_id}/history",
    response_model=list[
        ParcelAssignmentHistoryResponse
    ]
)
def parcel_history(
    parcel_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    return get_parcel_history(
        db,
        parcel_id
    )


@router.get(
    "/{parcel_id}",
    response_model=ParcelResponse
)
def get_parcel(
    parcel_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    parcel = get_parcel_by_id(
        db,
        parcel_id
    )

    if not parcel:
        raise HTTPException(
            status_code=404,
            detail="Parcel not found"
        )

    return parcel


@router.post(
    "/{parcel_id}/auto-assign"
)
def auto_assign(
    parcel_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    try:
        return assign_parcel_to_agent(
            db,
            parcel_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.patch(
    "/{parcel_id}/out-for-delivery",
    response_model=ParcelResponse
)
def update_out_for_delivery(
    parcel_id: int,
    db: Session = Depends(get_db),
    current_agent=Depends(get_current_agent)
):
    try:

        return mark_out_for_delivery(
            db,
            parcel_id,
            current_agent["user_id"]
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.patch(
    "/{parcel_id}/delivered",
    response_model=ParcelResponse
)
def update_delivered(
    parcel_id: int,
    db: Session = Depends(get_db),
    current_agent=Depends(get_current_agent)
):
    try:

        return mark_delivered(
            db,
            parcel_id,
            current_agent["user_id"]
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.patch(
    "/{parcel_id}/failed",
    response_model=ParcelResponse
)
def update_failed_delivery(
    parcel_id: int,
    request: FailedDeliveryRequest,
    db: Session = Depends(get_db),
    current_agent=Depends(get_current_agent)
):
    try:

        return mark_failed_delivery(
            db,
            parcel_id,
            request.reason,
            current_agent["user_id"]
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post(
    "/{parcel_id}/reassign"
)
def reassign_parcel(
    parcel_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    try:
        return reassign_failed_parcel(
            db,
            parcel_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
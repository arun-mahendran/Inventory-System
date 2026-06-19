from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.schemas.hub import HubCreate
from app.schemas.hub import HubResponse

from app.services.hub_service import (
    create_hub,
    get_all_hubs,
    get_hub_by_id,
    delete_hub
)

from app.utils.dependencies import get_db

router = APIRouter(
    prefix="/hubs",
    tags=["Hubs"]
)


@router.post("/", response_model=HubResponse)
def create_new_hub(
    hub: HubCreate,
    db: Session = Depends(get_db)
):
    return create_hub(db, hub)


@router.get("/", response_model=list[HubResponse])
def get_hubs(
    db: Session = Depends(get_db)
):
    return get_all_hubs(db)


@router.get("/{hub_id}", response_model=HubResponse)
def get_hub(
    hub_id: int,
    db: Session = Depends(get_db)
):
    return get_hub_by_id(db, hub_id)


@router.delete("/{hub_id}")
def remove_hub(
    hub_id: int,
    db: Session = Depends(get_db)
):
    delete_hub(db, hub_id)

    return {
        "message": "Hub deleted successfully"
    }
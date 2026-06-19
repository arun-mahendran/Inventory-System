from sqlalchemy.orm import Session

from app.models.hub import Hub
from app.schemas.hub import HubCreate


def create_hub(db: Session, hub: HubCreate):

    db_hub = Hub(
        hub_name=hub.hub_name,
        address=hub.address,
        city=hub.city,
        contact_number=hub.contact_number
    )

    db.add(db_hub)
    db.commit()
    db.refresh(db_hub)

    return db_hub


def get_all_hubs(db: Session):

    return db.query(Hub).all()


def get_hub_by_id(db: Session, hub_id: int):

    return db.query(Hub).filter(
        Hub.id == hub_id
    ).first()


def delete_hub(db: Session, hub_id: int):

    hub = db.query(Hub).filter(
        Hub.id == hub_id
    ).first()

    if hub:
        db.delete(hub)
        db.commit()

    return hub
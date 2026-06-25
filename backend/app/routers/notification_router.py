from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.notification_model import Notification


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("/{agent_id}")
def get_notifications(
    agent_id: int,
    db: Session = Depends(get_db)
):

    notifications = (

        db.query(Notification)

        .filter(
            Notification.agent_id == agent_id
        )

        .order_by(
            Notification.created_at.desc()
        )

        .all()
    )

    return notifications


@router.put("/{agent_id}/read")
def mark_as_read(
    agent_id: int,
    db: Session = Depends(get_db)
):

    notifications = (
        db.query(Notification)
        .filter(
            Notification.agent_id == agent_id,
            Notification.is_read == False
        )
        .all()
    )

    for notification in notifications:

        notification.is_read = True

    db.commit()

    return {
        "message": "Notifications marked as read"
    }
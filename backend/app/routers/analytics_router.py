from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.parcel import Parcel
from app.models.customer import Customer
from sqlalchemy import func

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/summary")
def analytics_summary(
    db: Session = Depends(get_db)
):

    total_parcels = db.query(Parcel).count()

    delivered = db.query(Parcel).filter(
        Parcel.status == "Delivered"
    ).count()

    failed = db.query(Parcel).filter(
        Parcel.status == "FailedDelivery"
    ).count()

    active_zones = db.query(
        Customer.pincode
    ).distinct().count()

    return {
        "totalParcels": total_parcels,
        "delivered": delivered,
        "failed": failed,
        "activeZones": active_zones
    }


@router.get("/top-zones")
def get_top_zones(
    db: Session = Depends(get_db)
):

    zones = (

        db.query(
            Customer.pincode,
            func.count(Parcel.id).label("parcels")
        )

        .join(
            Parcel,
            Parcel.customer_id == Customer.id
        )

        .group_by(
            Customer.pincode
        )

        .order_by(
            func.count(Parcel.id).desc()
        )

        .limit(5)

        .all()

    )

    return [

        {
            "pincode": zone.pincode,
            "parcels": zone.parcels
        }

        for zone in zones

    ]
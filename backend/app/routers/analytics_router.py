from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db

from app.models.parcel import Parcel
from app.models.customer import Customer

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/top-zones")
def get_top_zones(
    db: Session = Depends(get_db)
):

    zones = (

        db.query(
            Customer.pincode,
            func.count(Parcel.id)
        )

        .join(
            Parcel,
            Parcel.customer_id == Customer.id
        )

        .group_by(Customer.pincode)

        .order_by(
            func.count(Parcel.id).desc()
        )

        .limit(5)

        .all()
    )

    return [

        {
            "pincode": zone[0],
            "parcels": zone[1]
        }

        for zone in zones
    ]
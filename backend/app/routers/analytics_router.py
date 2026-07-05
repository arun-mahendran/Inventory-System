from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.parcel import Parcel
from app.models.customer import Customer
from sqlalchemy import func
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

def apply_date_filter(query, column, start, end):

    if start:
        start_date = datetime.fromisoformat(start)
        query = query.filter(column >= start_date)

    if end:
        end_date = datetime.fromisoformat(end) + timedelta(days=1)
        query = query.filter(column < end_date)

    return query


@router.get("/summary")
def analytics_summary(
    start: str = None,
    end: str = None,
    db: Session = Depends(get_db)
):
    parcel_query = db.query(Parcel)

    parcel_query = apply_date_filter(
        parcel_query,
        Parcel.created_at,
        start,
        end
    )

    total_parcels = parcel_query.count()

    delivered = parcel_query.filter(
        Parcel.status == "Delivered"
    ).count()

    failed = parcel_query.filter(
        Parcel.status == "FailedDelivery"
    ).count()

    active_zones = (
        db.query(Customer.pincode)
        .join(Parcel, Parcel.customer_id == Customer.id)
    )

    active_zones = apply_date_filter(
        active_zones,
        Parcel.created_at,
        start,
        end
    )

    active_zones = active_zones.distinct().count()

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

@router.get("/insights")
def get_insights(db: Session = Depends(get_db)):

    total = db.query(Parcel).count()

    delivered = db.query(Parcel).filter(
        Parcel.status == "Delivered"
    ).count()

    failed = db.query(Parcel).filter(
        Parcel.status == "FailedDelivery"
    ).count()

    success_rate = (
        round((delivered / total) * 100, 1)
        if total > 0 else 0
    )

    top_zone = db.query(
        Customer.pincode,
        func.count(Parcel.id).label("count")
    ).join(
        Parcel,
        Parcel.customer_id == Customer.id
    ).group_by(
        Customer.pincode
    ).order_by(
        func.count(Parcel.id).desc()
    ).first()

    failure_reason = db.query(
        Parcel.failure_reason,
        func.count(Parcel.id).label("count")
    ).filter(
        Parcel.failure_reason != None
    ).group_by(
        Parcel.failure_reason
    ).order_by(
        func.count(Parcel.id).desc()
    ).first()

    pending = db.query(Parcel).filter(
        Parcel.status.in_([
            "Received",
            "Assigned",
            "OutForDelivery"
        ])
    ).count()

    return {

        "success_rate":
            success_rate,

        "top_zone":
            top_zone.pincode
            if top_zone else "N/A",

        "failure_reason":
            failure_reason.failure_reason
            if failure_reason else "No failures",

        "pending":
            pending
    }


@router.get("/delivery-trend")
def delivery_trend(db: Session = Depends(get_db)):

    seven_days_ago = datetime.now() - timedelta(days=6)

    results = (
        db.query(
            func.date(Parcel.delivered_at).label("date"),
            func.count(Parcel.id).label("count")
        )
        .filter(
            Parcel.status == "Delivered",
            Parcel.delivered_at != None,
            Parcel.delivered_at >= seven_days_ago
        )
        .group_by(
            func.date(Parcel.delivered_at)
        )
        .all()
    )

    # Convert DB results into dictionary
    parcel_data = {}

    for row in results:

        parcel_data[row.date.strftime("%d %b")] = row.count

    # Always return last 7 days
    trend = []

    for i in range(7):

        current_day = (
            seven_days_ago + timedelta(days=i)
        ).strftime("%d %b")

        trend.append({
            "date": current_day,
            "parcels": parcel_data.get(
                current_day,
                0
            )
        })

    return trend
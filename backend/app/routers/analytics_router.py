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
    start: str = None,
    end: str = None,
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
    )

    zones = apply_date_filter(
        zones,
        Parcel.created_at,
        start,
        end
    )

    zones = (
        zones
        .group_by(Customer.pincode)
        .order_by(func.count(Parcel.id).desc())
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
def get_insights(
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

    total = parcel_query.count()

    delivered = parcel_query.filter(
        Parcel.status == "Delivered"
    ).count()

    failed = parcel_query.filter(
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
    )

    top_zone = apply_date_filter(
        top_zone,
        Parcel.created_at,
        start,
        end
    )

    top_zone = top_zone.group_by(
        Customer.pincode
    ).order_by(
        func.count(Parcel.id).desc()
    ).first()

    failure_reason = db.query(
        Parcel.failure_reason,
        func.count(Parcel.id).label("count")
    )

    failure_reason = apply_date_filter(
        failure_reason,
        Parcel.created_at,
        start,
        end
    )

    failure_reason = failure_reason.filter(
        Parcel.failure_reason != None
    ).group_by(
        Parcel.failure_reason
    ).order_by(
        func.count(Parcel.id).desc()
    ).first()

    pending = parcel_query.filter(
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
def delivery_trend(
    start: str = None,
    end: str = None,
    db: Session = Depends(get_db)
):

    if start and end:
        start_date = datetime.fromisoformat(start)
        end_date = datetime.fromisoformat(end)
    else:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=6)

    results = (
        db.query(
            func.date(Parcel.delivered_at).label("date"),
            func.count(Parcel.id).label("count")
        )
        .filter(
            Parcel.status == "Delivered",
            Parcel.delivered_at != None,
            Parcel.delivered_at >= start_date,
            Parcel.delivered_at < end_date + timedelta(days=1)
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

    days = (end_date.date() - start_date.date()).days + 1

    for i in range(days):

        current_day = (
            start_date + timedelta(days=i)
        ).strftime("%d %b")

        trend.append({
            "date": current_day,
            "parcels": parcel_data.get(current_day, 0)
        })

    return trend
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer
)

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

from reportlab.lib.units import inch

from app.database import get_db
from app.models.parcel import Parcel

router = APIRouter(
    prefix="/agent-reports",
    tags=["Agent Reports"]
)


@router.get("/{agent_id}/download-pdf")
def download_agent_history_pdf(
    agent_id: int,
    db: Session = Depends(get_db)
):

    parcels = db.query(Parcel).filter(
        Parcel.assigned_agent_id == agent_id,
        Parcel.status.in_(
            ["Delivered", "FailedDelivery"]
        )
    ).all()

    file_path = (
        f"agent_{agent_id}_history.pdf"
    )

    doc = SimpleDocTemplate(file_path)

    styles = getSampleStyleSheet()

    elements = []

    elements.append(
        Paragraph(
            "Delivery History Report",
            styles["Title"]
        )
    )

    elements.append(
        Spacer(1, 0.3 * inch)
    )

    data = [[
        "Tracking No",
        "Customer ID",
        "Status",
        "Date",
        "Reason"
    ]]

    for parcel in parcels:

        completed_date = (
            parcel.delivered_at
            or parcel.failed_at
        )

        data.append([
            parcel.tracking_number,
            str(parcel.customer_id),
            parcel.status,
            str(completed_date.date())
            if completed_date
            else "-",
            parcel.failure_reason or "-"
        ])

    table = Table(data)

    table.setStyle(
        TableStyle([
            ("BACKGROUND",
             (0, 0),
             (-1, 0),
             colors.blue),

            ("TEXTCOLOR",
             (0, 0),
             (-1, 0),
             colors.white),

            ("GRID",
             (0, 0),
             (-1, -1),
             1,
             colors.black)
        ])
    )

    elements.append(table)

    doc.build(elements)

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=file_path
    )
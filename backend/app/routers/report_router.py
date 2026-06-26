from fastapi import APIRouter
from fastapi import Depends
from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

from app.utils.dependencies import get_db
from app.models.parcel import Parcel

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import (
    getSampleStyleSheet
)

from reportlab.lib.units import inch


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/download-pdf")
def download_pdf_report(
    db: Session = Depends(get_db)
):

    total_parcels = db.query(
        Parcel
    ).count()

    delivered = db.query(
        Parcel
    ).filter(
        Parcel.status == "Delivered"
    ).count()

    failed = db.query(
        Parcel
    ).filter(
        Parcel.status == "FailedDelivery"
    ).count()

    pending = total_parcels - (
        delivered + failed
    )

    success_rate = 0

    if total_parcels > 0:

        success_rate = round(
            (delivered / total_parcels) * 100,
            2
        )

    file_path = "delivery_report.pdf"

    doc = SimpleDocTemplate(
        file_path
    )

    styles = getSampleStyleSheet()

    elements = []

    elements.append(
        Paragraph(
            "Final Mile Delivery Hub Report",
            styles["Title"]
        )
    )

    elements.append(
        Spacer(1, 0.3 * inch)
    )

    elements.append(
        Paragraph(
            f"Total Parcels: {total_parcels}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"Delivered Parcels: {delivered}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"Failed Deliveries: {failed}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"Pending Deliveries: {pending}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"Success Rate: {success_rate}%",
            styles["Normal"]
        )
    )

    doc.build(elements)

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename="delivery_report.pdf"
    )
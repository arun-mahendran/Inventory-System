from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File
)

from sqlalchemy.orm import Session

from app.utils.dependencies import (
    get_db
)

from app.services.bulk_import_service import (
    import_parcels_from_excel
)

router = APIRouter(
    prefix="/bulk-import",
    tags=["Bulk Import"]
)


@router.post("/")
def bulk_import(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    return import_parcels_from_excel(
        db,
        file
    )
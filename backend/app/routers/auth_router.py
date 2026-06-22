from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.orm import Session
from app.schemas.auth import (
    LoginRequest,
    TokenResponse
)
from app.services.auth_service import (
    login_user
)
from app.utils.dependencies import (
    get_db
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db)
):

    try:

        return login_user(
            db=db,
            email=credentials.email,
            password=credentials.password
        )

    except ValueError as e:

        raise HTTPException(
            status_code=401,
            detail=str(e)
        )

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Internal Server Error"
        )
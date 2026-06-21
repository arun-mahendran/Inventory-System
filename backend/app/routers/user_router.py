from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.schemas.user import (
    UserCreate,
    UserResponse,
    ChangePasswordRequest
)

from app.services.user_service import (
    create_user,
    get_all_users,
    get_user_by_id,
    delete_user,
    update_password
)

from app.utils.dependencies import get_db


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/", response_model=UserResponse)
def create_new_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    try:
        return create_user(
            db,
            user
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get("/", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db)
):
    return get_all_users(db)


@router.get(
    "/{user_id}",
    response_model=UserResponse
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    return get_user_by_id(
        db,
        user_id
    )


@router.delete("/{user_id}")
def remove_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    delete_user(
        db,
        user_id
    )

    return {
        "message": "User deleted successfully"
    }


@router.patch(
    "/{user_id}/change-password"
)
def change_password(
    user_id: int,
    request: ChangePasswordRequest,
    db: Session = Depends(get_db)
):
    return update_password(
        db,
        user_id,
        request.new_password
    )
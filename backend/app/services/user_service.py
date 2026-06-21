from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate

from app.core.security import hash_password
from app.utils.security import (get_password_hash)


def create_user(db: Session, user: UserCreate):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise ValueError(
            "Email already registered"
        )

    db_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
        phone=user.phone
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def get_all_users(db: Session):

    return db.query(User).all()


def get_user_by_id(
    db: Session,
    user_id: int
):

    return db.query(User).filter(
        User.id == user_id
    ).first()


def delete_user(
    db: Session,
    user_id: int
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user:
        db.delete(user)
        db.commit()

    return user


def update_password(
    db: Session,
    user_id: int,
    new_password: str
):

    user = db.query(
        User
    ).filter(
        User.id == user_id
    ).first()

    if not user:
        raise ValueError(
            "User not found"
        )

    user.password = (
        get_password_hash(
            new_password
        )
    )

    user.is_password_changed = True

    db.commit()

    return {
        "message":
            "Password updated"
    }
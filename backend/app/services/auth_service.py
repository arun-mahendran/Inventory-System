from sqlalchemy.orm import Session

from app.models.user import User

from app.core.security import (
    verify_password
)

from app.core.jwt import (
    create_access_token
)


def login_user(
    db: Session,
    email: str,
    password: str
):

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise ValueError(
            "Invalid email or password"
        )

    if not verify_password(
        password,
        user.password
    ):
        raise ValueError(
            "Invalid email or password"
        )

    token = create_access_token(
        {
            "sub": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
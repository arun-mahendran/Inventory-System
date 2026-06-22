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

    # Check if user exists

    if not user:

        raise ValueError(
            "Invalid email or password"
        )

    # Verify password

    if not verify_password(
        password,
        user.password
    ):

        raise ValueError(
            "Invalid email or password"
        )

    # Create JWT token

    token = create_access_token(
        {
            "sub": user.email,
            "role": user.role,
            "user_id": user.id
        }
    )

    # Return login response
    return {

        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "full_name":
            user.full_name,
        "user_id":
            user.id,
        "change_password":
            (
                user.role ==
                "DeliveryAgent"
                and
                not user.is_password_changed
            )

    }
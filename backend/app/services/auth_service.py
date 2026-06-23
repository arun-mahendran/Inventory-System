from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import (
    verify_password
)
from app.core.jwt import (
    create_access_token
)

from app.models.delivery_agent import (
    DeliveryAgent
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

    delivery_agent = None

    if user.role == "DeliveryAgent":

        delivery_agent = db.query(
            DeliveryAgent
        ).filter(
            DeliveryAgent.user_id == user.id
        ).first()

    token = create_access_token(
        {
            "sub": user.email,
            "role": user.role,
            "user_id": user.id
        }
    )

    return {

        "access_token": token,

        "token_type": "bearer",

        "role": user.role,

        "full_name":
            user.full_name,

        "user_id":
            user.id,

        "delivery_agent_id":
            delivery_agent.id
            if delivery_agent
            else None,

        "change_password":
            (
                user.role ==
                "DeliveryAgent"
                and
                not user.is_password_changed
            )

    }
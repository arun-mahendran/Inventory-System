from fastapi import Depends
from fastapi import HTTPException

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from jose import jwt
from jose import JWTError

from app.core.jwt import (
    SECRET_KEY,
    ALGORITHM
)


security = HTTPBearer()


def get_current_user(
    credentials:
    HTTPAuthorizationCredentials
    = Depends(security)
):

    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials"
    )

    try:

        token = credentials.credentials

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")
        role = payload.get("role")
        user_id = payload.get("user_id")

        if email is None:

            raise credentials_exception

        return {
            "email": email,
            "role": role,
            "user_id": user_id
        }

    except JWTError:

        raise credentials_exception


def get_current_admin(
    current_user=Depends(
        get_current_user
    )
):

    if (
        current_user["role"]
        != "Admin"
    ):

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user


def get_current_agent(
    current_user=Depends(
        get_current_user
    )
):

    if (
        current_user["role"]
        != "DeliveryAgent"
    ):

        raise HTTPException(
            status_code=403,
            detail="Agent access required"
        )

    return current_user
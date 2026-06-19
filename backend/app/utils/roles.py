from fastapi import Depends
from fastapi import HTTPException

from app.utils.auth import get_current_user


def require_admin(
    user=Depends(get_current_user)
):

    if user["role"] != "Admin":

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return user


def require_hub_manager(
    user=Depends(get_current_user)
):

    if user["role"] not in [
        "Admin",
        "HubManager"
    ]:

        raise HTTPException(
            status_code=403,
            detail="Hub Manager access required"
        )

    return user


def require_hub_employee(
    user=Depends(get_current_user)
):

    if user["role"] not in [
        "Admin",
        "HubManager",
        "HubEmployee"
    ]:

        raise HTTPException(
            status_code=403,
            detail="Hub Employee access required"
        )

    return user


def require_delivery_agent(
    user=Depends(get_current_user)
):

    if user["role"] not in [
        "Admin",
        "DeliveryAgent"
    ]:

        raise HTTPException(
            status_code=403,
            detail="Delivery Agent access required"
        )

    return user
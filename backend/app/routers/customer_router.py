from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.customer import (
    CustomerCreate,
    CustomerResponse
)

from app.services.customer_service import (
    create_customer,
    get_all_customers,
    get_customer_by_id,
    delete_customer
)

from app.utils.dependencies import get_db



router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.post("/", response_model=CustomerResponse)
def create_new_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db),
):
    return create_customer(db, customer)


@router.get("/", response_model=list[CustomerResponse])
def get_customers(
    db: Session = Depends(get_db),
):
    return get_all_customers(db)


@router.get(
    "/{customer_id}",
    response_model=CustomerResponse
)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    return get_customer_by_id(
        db,
        customer_id
    )


@router.delete("/{customer_id}")
def remove_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    delete_customer(
        db,
        customer_id
    )

    return {
        "message": "Customer deleted successfully"
    }
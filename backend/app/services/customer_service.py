from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate


def create_customer(
    db: Session,
    customer: CustomerCreate
):

    db_customer = Customer(
        customer_name=customer.customer_name,
        phone=customer.phone,
        email=customer.email,
        address=customer.address,
        pincode=customer.pincode
    )

    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)

    return db_customer


def get_all_customers(
    db: Session,
    search: str = None
):

    query = db.query(Customer)

    if search:

        query = query.filter(

            or_(

                Customer.customer_name.ilike(
                    f"%{search}%"
                ),

                Customer.phone.ilike(
                    f"%{search}%"
                ),

                Customer.email.ilike(
                    f"%{search}%"
                )

            )

        )

    return query.all()


def get_customer_by_id(
    db: Session,
    customer_id: int
):

    return db.query(Customer).filter(
        Customer.id == customer_id
    ).first()


def delete_customer(
    db: Session,
    customer_id: int
):

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if customer:
        db.delete(customer)
        db.commit()

    return customer
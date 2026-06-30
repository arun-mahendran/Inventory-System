from fastapi import FastAPI
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import User

from app.routers.user_router import router as user_router
from app.routers.auth_router import router as auth_router
from app.routers.hub_router import router as hub_router
from app.routers.customer_router import router as customer_router
from app.routers.delivery_agent_router import (
    router as delivery_agent_router
)
from app.routers.parcel_router import (
    router as parcel_router
)
from app.routers.dashboard_router import (
    router as dashboard_router
)
from app.models.notification_model import Notification
from app.models.parcel_assignment_history import (
    ParcelAssignmentHistory
)

from app.utils.auth import get_current_user
from app.utils.roles import require_admin
from app.routers import ai_router
from app.routers import analytics_router
from app.routers import notification_router
from app.routers import report_router
from app.routers import (agent_report_router)
from app.routers import (bulk_import_router)


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Final Mile Delivery Hub Management System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://inventory-system-zyywmiod.onslate.in"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(hub_router)
app.include_router(customer_router)
app.include_router(delivery_agent_router)
app.include_router(parcel_router)
app.include_router(dashboard_router)
app.include_router(ai_router.router)
app.include_router(analytics_router.router)
app.include_router(notification_router.router)
app.include_router(report_router.router)
app.include_router(agent_report_router.router)
app.include_router(bulk_import_router.router)


# Protected Route
@app.get("/protected")
def protected_route(
    user=Depends(get_current_user)
):
    return {
        "message": "Access Granted",
        "user": user
    }


# Admin Route
@app.get("/admin-only")
def admin_only_route(
    user=Depends(require_admin)
):
    return {
        "message": "Welcome Admin",
        "user": user
    }


# Home
@app.get("/")
def home():
    return {
        "message": "Final Mile Delivery Hub API Running"
    }


# Database Test
@app.get("/db-test")
def db_test():
    try:
        connection = engine.connect()
        connection.close()
        return {
            "message": "Database Connected Successfully"
        }
    except Exception as e:
        return {
            "error": str(e)
        }
import sys

print("===== PYTHON =====")
print(sys.version)

import passlib
print("PASSLIB:", passlib.__version__)

import bcrypt
print("BCRYPT:", getattr(bcrypt, "__version__", "UNKNOWN"))
print("BCRYPT MODULE:", bcrypt.__file__)

print("\n===== IMPORT TESTS =====")

import app.database
print("DATABASE OK")

import app.routers.auth_router
print("AUTH ROUTER OK")

import app.routers.user_router
print("USER ROUTER OK")

import app.routers.customer_router
print("CUSTOMER ROUTER OK")

import app.routers.delivery_agent_router
print("DELIVERY ROUTER OK")

import app.main
print("MAIN OK")

print("\n===== PASSLIB TEST =====")

from passlib.context import CryptContext

pwd = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

test_hash = "$2b$12$sqwf/Fgh6M363Lzi1lMjs.lBBOLpiWFz0bovbGSjqkQhWaR2pyk6S"

try:
    print("PASSLIB VERIFY:", pwd.verify("Admin123", test_hash))
except Exception as e:
    print("PASSLIB ERROR:", repr(e))

print("\n===== BCRYPT TEST =====")

try:
    print(
        "BCRYPT VERIFY:",
        bcrypt.checkpw(
            b"Admin123",
            test_hash.encode()
        )
    )
except Exception as e:
    print("BCRYPT ERROR:", repr(e))

print("\n===== DEBUG COMPLETE =====")
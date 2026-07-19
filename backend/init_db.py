from app.database import Base, engine
from app.config import DATABASE_URL
import app.models

print("DATABASE_URL:")
print(DATABASE_URL)
print()

print("Engine URL:")
print(engine.url)
print()

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Done!")
"""One-time script to create all tables on a fresh Neon database."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base
from app.models.user import User
from app.models.resume import Resume
from app.models.job import Job
from app.models.application import Application

print("Creating all tables on:", engine.url)
Base.metadata.create_all(bind=engine)
print("Done! All tables created successfully.")

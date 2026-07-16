from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Job(Base):

    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    department = Column(String)

    location = Column(String)

    employment_type = Column(String)

    experience_required = Column(String)

    description = Column(Text)

    required_skills = Column(Text)

    status = Column(String, default="Open")

    applicants = Column(Integer, default=0)

    created_by = Column(Integer, ForeignKey("users.id"))

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    creator = relationship("User", back_populates="created_jobs")
    job_applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
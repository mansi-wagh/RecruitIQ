from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, default="Under review")
    match_score = Column(Integer, default=0)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())

    candidate = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="job_applications")



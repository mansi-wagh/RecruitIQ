from sqlalchemy import Column, Integer, String, Text
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

    created_by = Column(Integer)
from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Job(Base):

    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    description = Column(Text)

    required_skills = Column(Text)

    experience_required = Column(Integer)

    created_by = Column(Integer)
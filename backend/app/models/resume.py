from sqlalchemy import Column, Integer, String
from app.database import Base


class Resume(Base):

    __tablename__ = "resumes"

    id = Column(

        Integer,

        primary_key=True,

        index=True

    )

    user_id = Column(Integer)

    resume_path = Column(String)
from pydantic import BaseModel
from typing import Optional


class JobCreate(BaseModel):
    title: str
    department: Optional[str] = ""
    location: Optional[str] = ""
    employment_type: Optional[str] = "Full-time"
    description: Optional[str] = ""
    required_skills: Optional[str] = ""
    experience_required: Optional[str] = ""
    education_required: Optional[str] = ""


class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[str] = None
    experience_required: Optional[str] = None
    education_required: Optional[str] = None
    status: Optional[str] = None


class JobResponse(BaseModel):
    id: int
    title: str
    department: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[str] = None
    experience_required: Optional[str] = None
    education_required: Optional[str] = None
    status: Optional[str] = "Open"
    applicants: int = 0
    created_by: Optional[int] = None

    class Config:
        from_attributes = True
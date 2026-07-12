from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class CandidateResumeResponse(BaseModel):
    id: int
    resume_path: str

    model_config = {
        "from_attributes": True
    }


class CandidateResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    model_config = {
        "from_attributes": True
    }


class CandidateDetailResponse(CandidateResponse):
    resumes: list[CandidateResumeResponse] = Field(default_factory=list)


class DashboardStats(BaseModel):
    total_candidates: int
    total_jobs: int
    open_jobs: int
    avg_match_score: Optional[float] = None  # Not stored in DB; reserved for future AI integration

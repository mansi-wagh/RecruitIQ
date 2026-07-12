from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ApplicationCreate(BaseModel):
    job_id: int


class ApplicationResponse(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    status: str
    match_score: int
    applied_at: datetime

    class Config:
        from_attributes = True


class CandidateApplicationResponse(BaseModel):
    id: int
    job_id: int
    job_title: str
    company: str
    status: str
    match_score: int
    applied_at: datetime

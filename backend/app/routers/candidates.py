from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.job import Job
from app.models.resume import Resume
from app.models.user import User
from app.schemas.candidate import CandidateDetailResponse, CandidateResponse, DashboardStats
from app.auth.jwt_handler import get_current_user, get_current_hr


router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"],
)


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hr)
):
    """Aggregate KPIs for the HR dashboard from PostgreSQL."""
    total_candidates = (
        db.query(func.count(User.id))
        .filter(func.lower(User.role) == "candidate")
        .scalar() or 0
    )

    total_jobs = db.query(func.count(Job.id)).scalar() or 0

    open_jobs = (
        db.query(func.count(Job.id))
        .filter(func.lower(Job.status) == "open")
        .scalar() or 0
    )

    return DashboardStats(
        total_candidates=total_candidates,
        total_jobs=total_jobs,
        open_jobs=open_jobs,
        avg_match_score=None,  # Requires AI analysis pipeline; not stored per-candidate yet
    )


@router.get("/", response_model=List[CandidateResponse])
def get_candidates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hr)
):
    return (
        db.query(User)
        .filter(func.lower(User.role) == "candidate")
        .order_by(User.id.desc())
        .all()
    )


@router.get("/{candidate_id}", response_model=CandidateDetailResponse)
def get_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.lower() == "candidate" and current_user.id != candidate_id:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: You can only view your own candidate profile"
        )

    candidate = (
        db.query(User)
        .filter(User.id == candidate_id, func.lower(User.role) == "candidate")
        .first()
    )

    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")

    candidate.resumes = (
        db.query(Resume)
        .filter(Resume.user_id == candidate_id)
        .order_by(Resume.id.desc())
        .all()
    )

    return candidate


@router.delete("/{candidate_id}")
def delete_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hr)
):
    candidate = (
        db.query(User)
        .filter(User.id == candidate_id, func.lower(User.role) == "candidate")
        .first()
    )

    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")

    db.query(Resume).filter(Resume.user_id == candidate_id).delete()
    db.delete(candidate)
    db.commit()

    return {"message": "Candidate deleted successfully"}


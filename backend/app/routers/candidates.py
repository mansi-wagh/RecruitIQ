from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.resume import Resume
from app.models.user import User
from app.schemas.candidate import CandidateDetailResponse, CandidateResponse


router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"],
)


@router.get("/", response_model=List[CandidateResponse])
def get_candidates(db: Session = Depends(get_db)):
    return (
        db.query(User)
        .filter(func.lower(User.role) == "candidate")
        .order_by(User.id.desc())
        .all()
    )


@router.get("/{candidate_id}", response_model=CandidateDetailResponse)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
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
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
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

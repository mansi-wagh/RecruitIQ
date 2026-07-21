import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List

from app.logger import logger

from app.database import get_db
from app.models.job import Job
from app.models.resume import Resume
from app.models.user import User
from app.models.application import Application
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
    """Dashboard stats: total candidates, jobs, open positions, avg match score."""
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

    avg_score_res = (
        db.query(func.avg(Application.match_score))
        .filter(Application.match_score > 0)
        .scalar()
    )
    avg_match_score = float(avg_score_res) if avg_score_res is not None else 0.0

    return DashboardStats(
        total_candidates=total_candidates,
        total_jobs=total_jobs,
        open_jobs=open_jobs,
        avg_match_score=avg_match_score,
    )


@router.get("/", response_model=List[CandidateResponse])
def get_candidates(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hr)
):
    apps = (
        db.query(Application, User)
        .join(User, User.id == Application.candidate_id)
        .order_by(Application.applied_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    applied_candidate_ids = [app.candidate_id for app, _ in apps]
    non_applied_candidates = (
        db.query(User)
        .filter(
            func.lower(User.role) == "candidate",
            ~User.id.in_(applied_candidate_ids) if applied_candidate_ids else True
        )
        .order_by(User.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    response_list = []

    for app, u in apps:
        resume = db.query(Resume).filter(Resume.user_id == u.id).order_by(Resume.id.desc()).first()
        job = db.query(Job).filter(Job.id == app.job_id).first()
        job_title = job.title if job else "Unknown Position"

        response_list.append(
            CandidateResponse(
                id=f"{u.id}_{app.id}",
                candidate_id=u.id,
                name=u.name,
                email=u.email,
                role=job_title,
                status=app.status,
                match_score=app.match_score,
                experience="Has Resume" if resume else "No Resume",
                applied_at=app.applied_at.strftime("%Y-%m-%d"),
                skills=[],
                resume_path=resume.resume_path if resume else None
            )
        )

    for u in non_applied_candidates:
        resume = db.query(Resume).filter(Resume.user_id == u.id).order_by(Resume.id.desc()).first()

        response_list.append(
            CandidateResponse(
                id=f"{u.id}_0",
                candidate_id=u.id,
                name=u.name,
                email=u.email,
                role="Registered",
                status="New",
                match_score=0,
                experience="Has Resume" if resume else "No Resume",
                applied_at="Registered",
                skills=[],
                resume_path=resume.resume_path if resume else None
            )
        )

    return response_list


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

    resumes = (
        db.query(Resume)
        .filter(Resume.user_id == candidate_id)
        .order_by(Resume.id.desc())
        .all()
    )

    skills = []
    experience_desc = "Not provided"
    if resumes and os.path.exists(resumes[0].resume_path):
        try:
            from app.services.resume_parser import parse_resume
            from app.services.resume_information_extractor import ResumeExtractor
            resume_text = parse_resume(resumes[0].resume_path)
            extractor = ResumeExtractor(resume_text)
            extracted_data = extractor.extract_all()
            skills = extracted_data.get("skills", [])
            exp_list = extracted_data.get("experience", [])
            if exp_list:
                experience_desc = exp_list[0]
        except Exception as e:
            logger.error("Error parsing resume in candidate detail: %s", e, exc_info=True)

    latest_app = (
        db.query(Application)
        .filter(Application.candidate_id == candidate_id)
        .order_by(Application.applied_at.desc())
        .first()
    )

    apps = (
        db.query(Application, Job)
        .join(Job, Job.id == Application.job_id)
        .filter(Application.candidate_id == candidate_id)
        .order_by(Application.applied_at.desc())
        .all()
    )
    applications_list = [
        {
            "id": app_record.id,
            "job_id": job.id,
            "job_title": job.title,
            "company": job.department or "RecruitIQ",
            "status": app_record.status,
            "match_score": app_record.match_score,
            "applied_at": app_record.applied_at.strftime("%Y-%m-%d")
        }
        for app_record, job in apps
    ]

    resumes_list = [
        {
            "id": r.id,
            "resume_path": r.resume_path.replace("\\", "/") if r.resume_path else ""
        }
        for r in resumes
    ]

    return {
        "id": str(candidate.id),
        "candidate_id": candidate.id,
        "name": candidate.name,
        "email": candidate.email,
        "role": candidate.role,
        "status": latest_app.status if latest_app else "New",
        "match_score": latest_app.match_score if latest_app else 0,
        "experience": experience_desc,
        "applied_at": latest_app.applied_at.strftime("%Y-%m-%d") if latest_app else "Registered",
        "skills": skills,
        "resumes": resumes_list,
        "applications": applications_list
    }


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


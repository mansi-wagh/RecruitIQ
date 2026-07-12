from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import os

from app.database import get_db
from app.models.application import Application
from app.models.job import Job
from app.models.resume import Resume
from app.models.user import User
from app.schemas.application import ApplicationCreate, CandidateApplicationResponse
from app.auth.jwt_handler import get_current_user, get_current_hr
from app.services.matching_engine import MatchingEngine
from app.services.resume_parser import parse_resume
from app.services.resume_information_extractor import ResumeExtractor

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.post("/", response_model=CandidateApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_to_job(
    req: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit an application to a job. Calculates match score automatically if candidate has a resume."""
    # 1. Fetch job
    job = db.query(Job).filter(Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # 2. Check duplicate application
    existing = (
        db.query(Application)
        .filter(Application.candidate_id == current_user.id, Application.job_id == req.job_id)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You have already applied to this job"
        )

    # 3. Calculate match score
    match_score = 0
    resume_rec = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.id.desc())
        .first()
    )

    if resume_rec and os.path.exists(resume_rec.resume_path):
        try:
            resume_text = parse_resume(resume_rec.resume_path)
            extractor = ResumeExtractor(resume_text)
            extracted_data = extractor.extract_all()

            # Construct dictionaries
            resume_dict = {
                "skills": extracted_data.get("skills", []),
                "education": extracted_data.get("education", []),
                "experience": extracted_data.get("experience", []),
                "projects": extracted_data.get("projects", []),
                "certifications": extracted_data.get("certifications", []),
            }

            job_skills = [s.strip() for s in (job.required_skills or "").split(",") if s.strip()]
            job_dict = {
                "skills": job_skills,
                "experience": job.experience_required or "",
                "education": "Bachelor's"
            }

            engine = MatchingEngine(resume_dict, job_dict)
            match_res = engine.match()
            match_score = int(match_res.get("overall_score", 0))
        except Exception as e:
            print(f"Error calculating match score: {e}")

    # 4. Save application
    app_record = Application(
        candidate_id=current_user.id,
        job_id=req.job_id,
        status="Under review",
        match_score=match_score
    )

    # Increment job applicants counter
    job.applicants = (job.applicants or 0) + 1

    db.add(app_record)
    db.commit()
    db.refresh(app_record)

    return CandidateApplicationResponse(
        id=app_record.id,
        job_id=job.id,
        job_title=job.title,
        company=job.department or "RecruitIQ",
        status=app_record.status,
        match_score=app_record.match_score,
        applied_at=app_record.applied_at
    )


@router.get("/", response_model=List[CandidateApplicationResponse])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all applications submitted by the logged-in candidate."""
    apps = (
        db.query(Application, Job)
        .join(Job, Job.id == Application.job_id)
        .filter(Application.candidate_id == current_user.id)
        .order_by(Application.applied_at.desc())
        .all()
    )

    result = []
    for app_record, job in apps:
        result.append(
            CandidateApplicationResponse(
                id=app_record.id,
                job_id=job.id,
                job_title=job.title,
                company=job.department or "RecruitIQ",
                status=app_record.status,
                match_score=app_record.match_score,
                applied_at=app_record.applied_at
            )
        )
    return result


@router.get("/hr", response_model=List[CandidateApplicationResponse])
def get_all_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hr)
):
    """Retrieve all applications across all candidates for HR dashboard metrics."""
    apps = (
        db.query(Application, Job)
        .join(Job, Job.id == Application.job_id)
        .order_by(Application.applied_at.desc())
        .all()
    )

    result = []
    for app_record, job in apps:
        result.append(
            CandidateApplicationResponse(
                id=app_record.id,
                job_id=job.id,
                job_title=job.title,
                company=job.department or "RecruitIQ",
                status=app_record.status,
                match_score=app_record.match_score,
                applied_at=app_record.applied_at
            )
        )
    return result

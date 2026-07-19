from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import os

from app.logger import logger

from app.database import get_db
from app.models.application import Application
from app.models.job import Job
from app.models.resume import Resume
from app.models.user import User
from app.schemas.application import ApplicationCreate, CandidateApplicationResponse, ApplicationStatusUpdate
from app.auth.jwt_handler import get_current_user, get_current_hr
from app.services.matching_engine import MatchingEngine
from app.services.resume_parser import parse_resume
from app.services.resume_information_extractor import ResumeExtractor

router = APIRouter(prefix="/applications", tags=["Applications"])


def async_score_application(application_id: int):
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        app_record = db.query(Application).filter(Application.id == application_id).first()
        if not app_record:
            logger.error("Background scoring failed: Application %d not found", application_id)
            return

        candidate = db.query(User).filter(User.id == app_record.candidate_id).first()
        job = db.query(Job).filter(Job.id == app_record.job_id).first()

        if not candidate or not job:
            logger.error("Background scoring failed: Candidate or Job not found for application %d", application_id)
            return

        resume_rec = (
            db.query(Resume)
            .filter(Resume.user_id == candidate.id)
            .order_by(Resume.id.desc())
            .first()
        )

        if resume_rec:
            import tempfile
            from app.services.storage_service import StorageService
            storage_service = StorageService()
            suffix = os.path.splitext(resume_rec.resume_path)[1].lower()
            with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temp_file:
                temp_path = temp_file.name
            try:
                storage_service.download_file(resume_rec.resume_path, temp_path)
                resume_text = parse_resume(temp_path)
                extractor = ResumeExtractor(resume_text)
                extracted_data = extractor.extract_all()
            except Exception as e:
                logger.error("Error downloading or parsing resume for scoring: %s", e, exc_info=True)
                return
            finally:
                if os.path.exists(temp_path):
                    try:
                        os.remove(temp_path)
                    except Exception:
                        pass
            try:

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
                    "education": job.education_required or ""
                }

                engine = MatchingEngine(resume_dict, job_dict)
                match_res = engine.match()
                match_score = int(match_res.get("overall_score", 0))

                app_record.match_score = match_score
                db.commit()
                logger.info("Asynchronously scored application %d: score %d", application_id, match_score)
            except Exception as e:
                logger.error("Error in background scoring for application %d: %s", application_id, e, exc_info=True)
    finally:
        db.close()


@router.post("/", response_model=CandidateApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_to_job(
    req: ApplicationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit an application to a job. Calculates match score asynchronously in the background."""
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

    # 3. Save application with score 0
    app_record = Application(
        candidate_id=current_user.id,
        job_id=req.job_id,
        status="Under review",
        match_score=0
    )

    # Increment job applicants counter
    job.applicants = (job.applicants or 0) + 1

    db.add(app_record)
    db.commit()
    db.refresh(app_record)

    # 4. Enqueue background task
    background_tasks.add_task(async_score_application, app_record.id)

    return CandidateApplicationResponse(
        id=app_record.id,
        job_id=job.id,
        job_title=job.title,
        company=job.department or "RecruitIQ",
        status=app_record.status,
        match_score=app_record.match_score,
        applied_at=app_record.applied_at,
        candidate_id=current_user.id,
        candidate_name=current_user.name,
        candidate_email=current_user.email
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
                applied_at=app_record.applied_at,
                candidate_id=current_user.id,
                candidate_name=current_user.name,
                candidate_email=current_user.email
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
        db.query(Application, Job, User)
        .join(Job, Job.id == Application.job_id)
        .join(User, User.id == Application.candidate_id)
        .order_by(Application.applied_at.desc())
        .all()
    )

    result = []
    for app_record, job, user in apps:
        result.append(
            CandidateApplicationResponse(
                id=app_record.id,
                job_id=job.id,
                job_title=job.title,
                company=job.department or "RecruitIQ",
                status=app_record.status,
                match_score=app_record.match_score,
                applied_at=app_record.applied_at,
                candidate_id=user.id,
                candidate_name=user.name,
                candidate_email=user.email
            )
        )
    return result


@router.delete("/{application_id}")
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hr)
):
    """Delete a specific job application from PostgreSQL."""
    app_record = db.query(Application).filter(Application.id == application_id).first()
    if not app_record:
        raise HTTPException(status_code=404, detail="Application not found")

    job = db.query(Job).filter(Job.id == app_record.job_id).first()
    if job and job.applicants and job.applicants > 0:
        job.applicants -= 1

    db.delete(app_record)
    db.commit()
    return {"message": "Application deleted successfully"}


@router.patch("/{application_id}/status", response_model=CandidateApplicationResponse)
def update_application_status(
    application_id: int,
    req: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hr)
):
    """Update a specific job application status by HR."""
    app_record = db.query(Application).filter(Application.id == application_id).first()
    if not app_record:
        raise HTTPException(status_code=404, detail="Application not found")

    job = db.query(Job).filter(Job.id == app_record.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job associated with application not found")

    candidate = db.query(User).filter(User.id == app_record.candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate associated with application not found")

    app_record.status = req.status
    db.commit()
    db.refresh(app_record)

    return CandidateApplicationResponse(
        id=app_record.id,
        job_id=job.id,
        job_title=job.title,
        company=job.department or "RecruitIQ",
        status=app_record.status,
        match_score=app_record.match_score,
        applied_at=app_record.applied_at,
        candidate_id=candidate.id,
        candidate_name=candidate.name,
        candidate_email=candidate.email
    )


import json
import os
from pathlib import Path

from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.resume import Resume
from app.models.job import Job
from app.models.user import User
from app.services.feature_extractor import FeatureExtractor
from app.services.llm_service import LLMService
from app.services.matching_engine import MatchingEngine
from app.services.predictor import Predictor
from app.services.resume_information_extractor import ResumeExtractor
from app.auth.jwt_handler import get_current_user
from app.auth.rate_limiter import ai_limiter

router = APIRouter(
    prefix="/ai",
    tags=["AI Analysis"],
)

feature_extractor = FeatureExtractor()
predictor = Predictor()
llm_service = LLMService()

PROJECT_ROOT = Path(__file__).resolve().parents[1]

RESUME_FILE = PROJECT_ROOT / "datasets" / "parsed_resumes.json"
JOB_FILE = PROJECT_ROOT / "datasets" / "parsed_jobs.json"


def load_json(path: Path):
    with open(path, "r", encoding="utf-8", errors="replace") as file:
        return json.load(file)


@router.get("/resumes")
def list_resumes(
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Return a list of candidates from the DB who have uploaded resumes."""
    candidates_with_resumes = (
        db.query(User)
        .join(Resume, Resume.user_id == User.id)
        .filter(func.lower(User.role) == "candidate")
        .order_by(User.id.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "resume_name": str(c.id),
            "resume_category": c.name,
        }
        for c in candidates_with_resumes
    ]


@router.get("/jobs")
def list_jobs(
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Return a list of jobs from the DB."""
    jobs = db.query(Job).order_by(Job.id.desc()).limit(limit).all()
    return [
        {
            "job_id": str(j.id),
            "title": j.title,
            "company": j.department or "RecruitIQ",
            "location": j.location or "Remote",
        }
        for j in jobs
    ]


@router.post("/analyze", dependencies=[Depends(ai_limiter)])
async def analyze(
    resume_name: str,
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # In DB mode, resume_name refers to Candidate's DB ID
    try:
        candidate_id = int(resume_name)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid candidate ID in resume_name"
        )

    candidate = db.query(User).filter(User.id == candidate_id, func.lower(User.role) == "candidate").first()
    if candidate is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found",
        )

    resume_record = db.query(Resume).filter(Resume.user_id == candidate_id).order_by(Resume.id.desc()).first()
    if resume_record is None:
        raise HTTPException(
            status_code=400,
            detail=f"Candidate {candidate.name} has no uploaded resume files"
        )

    try:
        job_db_id = int(job_id)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid job ID format"
        )

    job_record = db.query(Job).filter(Job.id == job_db_id).first()
    if job_record is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    import tempfile
    from app.services.storage_service import StorageService
    storage_service = StorageService()
    
    suffix = os.path.splitext(resume_record.resume_path)[1].lower()
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temp_file:
        temp_path = temp_file.name

    try:
        storage_service.download_file(resume_record.resume_path, temp_path)
        from app.services.resume_parser import parse_resume
        resume_text = parse_resume(temp_path)
        extractor = ResumeExtractor(resume_text)
        extracted_data = extractor.extract_all()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse or extract resume: {str(e)}"
        )
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass

    # Reconstruct resume dictionary
    resume_dict = {
        "resume_name": f"Candidate_{candidate.id}",
        "skills": extracted_data.get("skills", []),
        "education": extracted_data.get("education", []),
        "experience": extracted_data.get("experience", []),
        "projects": extracted_data.get("projects", []),
        "certifications": extracted_data.get("certifications", []),
        "personal_info": {
            "name": candidate.name,
            "email": candidate.email
        }
    }

    # Reconstruct job dictionary
    skills_list = [s.strip() for s in (job_record.required_skills or "").split(",") if s.strip()]
    job_dict = {
        "job_id": str(job_record.id),
        "title": job_record.title,
        "description": job_record.description or "",
        "skills": skills_list,
        "experience": job_record.experience_required or "",
        "education": job_record.education_required or ""
    }

    # Execute ML / matching engine
    matcher = MatchingEngine(resume_dict, job_dict)
    match = matcher.match()

    features = feature_extractor.extract(resume_dict, job_dict, precomputed_match=match)
    prediction = predictor.predict(features)

    import asyncio
    (
        candidate_summary,
        skill_gap,
        interview_questions,
        resume_suggestions,
    ) = await asyncio.gather(
        llm_service.generate_candidate_summary_async(resume_dict, prediction),
        llm_service.generate_skill_gap_async(
            match.get("matched_skills", []),
            match.get("missing_skills", [])
        ),
        llm_service.generate_interview_questions_async(
            match.get("missing_skills", [])
        ),
        llm_service.generate_resume_suggestions_async(
            match.get("missing_skills", [])
        )
    )

    return {
        "prediction": prediction,
        "features": features,
        "matched_skills": match.get("matched_skills", []),
        "missing_skills": match.get("missing_skills", []),
        "candidate_summary": candidate_summary,
        "skill_gap_analysis": skill_gap,
        "interview_questions": interview_questions,
        "resume_suggestions": resume_suggestions,
    }
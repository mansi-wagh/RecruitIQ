from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
import os
import shutil
from uuid import uuid4
from app.services.resume_information_extractor import ResumeExtractor
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.resume import Resume
from app.models.user import User
from app.auth.jwt_handler import get_current_user


router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


@router.post("/upload")
def upload_resume(

    resume: UploadFile = File(...),

    candidate_id: int | None = Form(default=None),

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):
    if current_user.role.lower() == "candidate" and candidate_id is not None and candidate_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Candidates can only upload their own resumes"
        )

    file_name = os.path.basename(resume.filename or "")
    extension = os.path.splitext(file_name)[1].lower()

    if extension not in {".pdf", ".docx"}:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX resumes are allowed"
        )

    candidate = None
    if candidate_id is not None:
        candidate = (
            db.query(User)
            .filter(User.id == candidate_id, func.lower(User.role) == "candidate")
            .first()
        )

        if candidate is None:
            raise HTTPException(
                status_code=404,
                detail="Candidate not found"
            )

    upload_folder = "uploads/resumes"

    os.makedirs(
        upload_folder,
        exist_ok=True
    )

    stored_file_name = f"{uuid4().hex}_{file_name}"

    file_path = os.path.join(

        upload_folder,

        stored_file_name

    ).replace("\\", "/")

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(

            resume.file,

            buffer

        )

    if candidate is not None:
        existing_resume = (
            db.query(Resume)
            .filter(Resume.user_id == candidate.id)
            .first()
        )

        if existing_resume is None:
            existing_resume = Resume(
                user_id=candidate.id,
                resume_path=file_path
            )
            db.add(existing_resume)
        else:
            existing_resume.resume_path = file_path

        db.commit()
        db.refresh(existing_resume)

    return {

        "message": "Resume uploaded successfully",

        "file_name": file_name,

        "resume_path": file_path

    }

@router.post("/extract")
def extract_resume(
    filename: str,
    current_user: User = Depends(get_current_user)
):
    # Make sure filename is safe
    safe_name = os.path.basename(filename)
    if safe_name != filename or ".." in filename:
        raise HTTPException(
            status_code=400,
            detail="Invalid filename"
        )

    from app.services.resume_parser import parse_resume

    path = os.path.join("uploads", "resumes", safe_name)

    if not os.path.exists(path):
        raise HTTPException(
            status_code=404,
            detail="Resume file not found"
        )

    resume_text = parse_resume(path)

    extractor = ResumeExtractor(resume_text)

    return extractor.extract_all()


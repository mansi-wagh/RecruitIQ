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

    # Check file size (max 5MB)
    MAX_SIZE = 5 * 1024 * 1024
    contents = resume.file.read(MAX_SIZE + 1)
    if len(contents) > MAX_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds the 5MB limit"
        )
    # Reset file pointer
    resume.file.seek(0)

    # Verify file signature (magic bytes)
    magic_bytes = contents[:4]
    if extension == ".pdf" and not magic_bytes.startswith(b"%PDF"):
        raise HTTPException(
            status_code=400,
            detail="Invalid PDF file: signature does not match PDF format"
        )
    elif extension == ".docx" and not magic_bytes.startswith(b"PK\x03\x04"):
        raise HTTPException(
            status_code=400,
            detail="Invalid DOCX file: signature does not match ZIP/Office open XML format"
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

    stored_file_name = f"{uuid4().hex}_{file_name}"
    db_file_path = f"resumes/{stored_file_name}"

    from app.services.storage_service import StorageService
    storage_service = StorageService()
    try:
        storage_service.upload_file(resume.file, db_file_path)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload file to storage: {str(e)}"
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
                resume_path=db_file_path
            )
            db.add(existing_resume)
        else:
            existing_resume.resume_path = db_file_path

        db.commit()
        db.refresh(existing_resume)

    return {
        "message": "Resume uploaded successfully",
        "file_name": file_name,
        "resume_path": db_file_path
    }

@router.post("/extract")
def extract_resume(
    filename: str,
    current_user: User = Depends(get_current_user)
):
    safe_name = os.path.basename(filename)
    if safe_name != filename or ".." in filename:
        raise HTTPException(
            status_code=400,
            detail="Invalid filename"
        )

    from app.services.storage_service import StorageService
    import tempfile
    storage_service = StorageService()
    
    # Try both path formats
    object_name = f"resumes/{safe_name}"
    if not storage_service.file_exists(object_name):
        object_name = safe_name
        if not storage_service.file_exists(object_name):
            # Check local file directly
            local_path = os.path.join("uploads", "resumes", safe_name)
            if not os.path.exists(local_path):
                raise HTTPException(
                    status_code=404,
                    detail="Resume file not found in storage"
                )

    suffix = os.path.splitext(safe_name)[1].lower()
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temp_file:
        temp_path = temp_file.name

    try:
        storage_service.download_file(object_name, temp_path)
        from app.services.resume_parser import parse_resume
        resume_text = parse_resume(temp_path)
        extractor = ResumeExtractor(resume_text)
        return extractor.extract_all()
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


from fastapi import APIRouter, UploadFile, File
import os
import shutil

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

@router.post("/upload")
def upload_resume(
    resume: UploadFile = File(...)
):

    upload_folder = "uploads/resumes"

    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(
        upload_folder,
        resume.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            resume.file,
            buffer
        )

    return {
        "message": "Resume uploaded successfully",
        "file_name": resume.filename
    }
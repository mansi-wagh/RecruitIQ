from fastapi import APIRouter, UploadFile, File
from app.services.resume_parser import parse_resume
# from app.services.skill_extractor import extract_skills
import os
import shutil
from app.services.resume_parser import parse_resume
from app.services.resume_information_extractor import ResumeExtractor


router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


@router.post("/upload")
def upload_resume(

    resume: UploadFile = File(...)

):

    upload_folder = "uploads/resumes"

    os.makedirs(
        upload_folder,
        exist_ok=True
    )

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

@router.post("/parse")
def parse_uploaded_resume(filename: str):

    file_path = f"uploads/resumes/{filename}"

    resume_text = parse_resume(file_path)

    skills = extract_skills(resume_text)

    return {
        "filename": filename,
        "skills": skills
    }

@router.post("/extract")
def extract_resume(filename: str):

    path = f"uploads/resumes/{filename}"

    resume_text = parse_resume(path)

    extractor = ResumeExtractor(

        resume_text

    )

    return extractor.extract_all()
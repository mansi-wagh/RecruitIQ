from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.job import Job
from app.schemas.job import JobCreate

router = APIRouter(

    prefix="/jobs",

    tags=["Jobs"]

)

@router.get("/")
def get_jobs(

    db: Session = Depends(get_db)

):

    jobs = db.query(Job).all()

    return jobs

@router.post("/")
def create_job(

    job: JobCreate,

    db: Session = Depends(get_db)

):

    new_job = Job(

        title=job.title,

        description=job.description,

        required_skills=job.required_skills,

        experience_required=job.experience_required,

        created_by=1

    )

    db.add(new_job)

    db.commit()

    db.refresh(new_job)

    return {

        "message": "Job Created",

        "id": new_job.id

    }

@router.get("/{job_id}")
def get_job(

    job_id: int,

    db: Session = Depends(get_db)

):

    job = db.query(Job).filter(

        Job.id == job_id

    ).first()

    return job

@router.put("/{job_id}")
def update_job(
    job_id: int,
    updated_job: JobCreate,
    db: Session = Depends(get_db)
):

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if job is None:
        return {
            "message": "Job not found"
        }

    job.title = updated_job.title
    job.description = updated_job.description
    job.required_skills = updated_job.required_skills
    job.experience_required = updated_job.experience_required

    db.commit()
    db.refresh(job)

    return {
        "message": "Job updated successfully",
        "job": job
    }

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db)
):

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if job is None:
        return {
            "message": "Job not found"
        }

    db.delete(job)
    db.commit()

    return {
        "message": "Job deleted successfully"
    }
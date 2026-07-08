from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.job import Job
from app.schemas.job import JobCreate, JobUpdate, JobResponse


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


@router.get("/", response_model=List[JobResponse])
def get_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    return jobs


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post("/", response_model=JobResponse, status_code=201)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    new_job = Job(
        title=job.title,
        department=job.department,
        location=job.location,
        employment_type=job.employment_type,
        description=job.description,
        required_skills=job.required_skills,
        experience_required=job.experience_required,
        status="Open",
        applicants=0,
        created_by=1,
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job


@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    updated_job: JobUpdate,
    db: Session = Depends(get_db),
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    # Only update fields that were explicitly provided
    update_data = updated_job.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)
    return job


@router.delete("/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully"}
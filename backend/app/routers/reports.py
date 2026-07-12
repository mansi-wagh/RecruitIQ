from collections import Counter
from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.job import Job
from app.auth.jwt_handler import get_current_hr
from app.models.user import User

router = APIRouter(prefix="/reports", tags=["Reports"])


# ── Response schemas ──────────────────────────────────────────────────────────

class SkillCount(BaseModel):
    skill: str
    value: int


class StatusCount(BaseModel):
    name: str
    value: int


class DepartmentCount(BaseModel):
    department: str
    value: int


class ApplicantsPerJob(BaseModel):
    title: str
    applicants: int


class ChartsResponse(BaseModel):
    skill_distribution: List[SkillCount]
    job_status_distribution: List[StatusCount]
    jobs_by_department: List[DepartmentCount]
    applicants_per_job: List[ApplicantsPerJob]


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.get("/charts", response_model=ChartsResponse)
def get_chart_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hr)
):
    """
    Aggregate all four report chart datasets from the PostgreSQL jobs table.

    - skill_distribution    : top skills across all job required_skills fields
    - job_status_distribution: count of Open / Draft / Closed jobs
    - jobs_by_department    : job count per department
    - applicants_per_job    : top 8 jobs by applicant count
    """
    jobs: list[Job] = db.query(Job).all()

    # ── 1. Skill distribution ─────────────────────────────────────────────────
    # required_skills is a comma-separated string, e.g. "Python, FastAPI, AWS"
    skill_counter: Counter = Counter()
    for job in jobs:
        if job.required_skills:
            for raw in job.required_skills.split(","):
                skill = raw.strip()
                if skill:
                    skill_counter[skill] += 1

    skill_distribution = [
        SkillCount(skill=skill, value=count)
        for skill, count in skill_counter.most_common(10)
    ]

    # ── 2. Job status distribution ────────────────────────────────────────────
    status_counter: Counter = Counter()
    for job in jobs:
        status = (job.status or "Open").capitalize()
        status_counter[status] += 1

    job_status_distribution = [
        StatusCount(name=name, value=count)
        for name, count in status_counter.most_common()
    ]

    # ── 3. Jobs by department ─────────────────────────────────────────────────
    dept_counter: Counter = Counter()
    for job in jobs:
        dept = (job.department or "Other").strip() or "Other"
        dept_counter[dept] += 1

    jobs_by_department = [
        DepartmentCount(department=dept, value=count)
        for dept, count in dept_counter.most_common(8)
    ]

    # ── 4. Applicants per job (top 8 by applicant count) ─────────────────────
    sorted_jobs = sorted(jobs, key=lambda j: j.applicants or 0, reverse=True)[:8]
    applicants_per_job = [
        ApplicantsPerJob(title=job.title, applicants=job.applicants or 0)
        for job in sorted_jobs
    ]

    return ChartsResponse(
        skill_distribution=skill_distribution,
        job_status_distribution=job_status_distribution,
        jobs_by_department=jobs_by_department,
        applicants_per_job=applicants_per_job,
    )

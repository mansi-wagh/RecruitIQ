from collections import Counter
from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.job import Job
from app.auth.jwt_handler import get_current_hr
from app.models.user import User
from app.models.application import Application

router = APIRouter(prefix="/reports", tags=["Reports"])




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


@router.get("/charts", response_model=ChartsResponse)
def get_chart_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hr)
):
    jobs = db.query(Job).all()

    # Get skill frequency
    skill_counter = Counter()
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

    # Get jobs count by status
    status_counter = Counter()
    for job in jobs:
        status = (job.status or "Open").capitalize()
        status_counter[status] += 1

    job_status_distribution = [
        StatusCount(name=name, value=count)
        for name, count in status_counter.most_common()
    ]

    # Get jobs count by department
    dept_counter = Counter()
    for job in jobs:
        dept = (job.department or "Other").strip() or "Other"
        dept_counter[dept] += 1

    jobs_by_department = [
        DepartmentCount(department=dept, value=count)
        for dept, count in dept_counter.most_common(8)
    ]

    # Pre-aggregate application counts to prevent N+1 queries
    app_counts = dict(
        db.query(Application.job_id, func.count(Application.id))
        .group_by(Application.job_id)
        .all()
    )

    apps_per_job_list = []
    for job in jobs:
        count = app_counts.get(job.id, 0)
        count = max(count, job.applicants or 0)
        apps_per_job_list.append(
            ApplicantsPerJob(title=job.title, applicants=count)
        )
    applicants_per_job = sorted(apps_per_job_list, key=lambda x: x.applicants, reverse=True)[:8]

    return ChartsResponse(
        skill_distribution=skill_distribution,
        job_status_distribution=job_status_distribution,
        jobs_by_department=jobs_by_department,
        applicants_per_job=applicants_per_job,
    )


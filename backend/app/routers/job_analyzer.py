from fastapi import APIRouter

from app.schemas.job_analysis import JobAnalysisRequest

from app.services.job_description_parser import JobDescriptionParser

router = APIRouter(

    prefix="/jobs",

    tags=["Job Analysis"]

)


@router.post("/analyze")

def analyze_job(

    job: JobAnalysisRequest

):

    parser = JobDescriptionParser(

        job.description

    )

    return parser.extract_all()
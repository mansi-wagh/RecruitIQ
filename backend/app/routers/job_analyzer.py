from fastapi import APIRouter, Depends

from app.schemas.job_analysis import JobAnalysisRequest

from app.services.job_description_parser import JobDescriptionParser
from app.auth.jwt_handler import get_current_hr
from app.models.user import User

router = APIRouter(

    prefix="/jobs",

    tags=["Job Analysis"]

)


@router.post("/analyze")

def analyze_job(

    job: JobAnalysisRequest,

    current_user: User = Depends(get_current_hr)

):

    parser = JobDescriptionParser(

        job.description

    )

    return parser.extract_all()
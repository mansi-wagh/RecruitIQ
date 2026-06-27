from fastapi import APIRouter

from app.schemas.matching import MatchRequest

from app.services.matching_engine import MatchingEngine

router = APIRouter(

    prefix="/matching",

    tags=["Matching"]

)


@router.post("/score")

def match_resume_job(

    request: MatchRequest

):

    engine = MatchingEngine(

        request.resume,

        request.job

    )

    return engine.match()
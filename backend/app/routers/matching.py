from fastapi import APIRouter, Depends

from app.schemas.matching import MatchRequest

from app.services.matching_engine import MatchingEngine
from app.auth.jwt_handler import get_current_user
from app.models.user import User

router = APIRouter(

    prefix="/matching",

    tags=["Matching"]

)


@router.post("/score")

def match_resume_job(

    request: MatchRequest,

    current_user: User = Depends(get_current_user)

):

    engine = MatchingEngine(

        request.resume,

        request.job

    )

    return engine.match()
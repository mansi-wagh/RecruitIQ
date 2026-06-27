from pydantic import BaseModel


class MatchRequest(BaseModel):

    resume: dict

    job: dict


class MatchResponse(BaseModel):

    matched_skills: list[str]

    missing_skills: list[str]

    skill_score: float

    education_score: float

    experience_score: float

    overall_score: float
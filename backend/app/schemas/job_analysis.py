from pydantic import BaseModel


class JobAnalysisRequest(BaseModel):

    description: str


class JobAnalysisResponse(BaseModel):

    title: str

    skills: list[str]

    education: list[str]

    experience: str
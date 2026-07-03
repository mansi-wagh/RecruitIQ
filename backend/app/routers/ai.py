import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.services.feature_extractor import FeatureExtractor
from app.services.llm_service import LLMService
from app.services.matching_engine import MatchingEngine
from app.services.predictor import Predictor

router = APIRouter(
    prefix="/ai",
    tags=["AI Analysis"],
)

feature_extractor = FeatureExtractor()
predictor = Predictor()
llm_service = LLMService()

PROJECT_ROOT = Path(__file__).resolve().parents[1]

RESUME_FILE = PROJECT_ROOT / "datasets" / "parsed_resumes.json"
JOB_FILE = PROJECT_ROOT / "datasets" / "parsed_jobs.json"


def load_json(path: Path):
    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


@router.post("/analyze")
def analyze(
    resume_name: str,
    job_id: str,
):
    resumes = load_json(RESUME_FILE)
    jobs = load_json(JOB_FILE)

    resume = next(
        (
            r
            for r in resumes
            if r["resume_name"] == resume_name
        ),
        None,
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    job = next(
        (
            j
            for j in jobs
            if str(j["job_id"]) == str(job_id)
        ),
        None,
    )

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    matcher = MatchingEngine(
        resume,
        job,
    )

    match = matcher.match()

    features = feature_extractor.extract(
        resume,
        job,
    )

    prediction = predictor.predict(
        features,
    )

    candidate_summary = (
        llm_service.generate_candidate_summary(
            resume,
            prediction,
        )
    )

    skill_gap = (
        llm_service.generate_skill_gap(
            match.get("matched_skills", []),
            match.get("missing_skills", []),
        )
    )

    interview_questions = (
        llm_service.generate_interview_questions(
            match.get("missing_skills", []),
        )
    )

    resume_suggestions = (
        llm_service.generate_resume_suggestions(
            match.get("missing_skills", []),
        )
    )

    return {
        "prediction": prediction,
        "features": features,
        "matched_skills": match.get(
            "matched_skills",
            [],
        ),
        "missing_skills": match.get(
            "missing_skills",
            [],
        ),
        "candidate_summary": candidate_summary,
        "skill_gap_analysis": skill_gap,
        "interview_questions": interview_questions,
        "resume_suggestions": resume_suggestions,
    }
from fastapi import APIRouter, HTTPException
import json
from pathlib import Path

from app.services.feature_extractor import FeatureExtractor
from app.services.predictor import Predictor


router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)

predictor = Predictor()
feature_extractor = FeatureExtractor()


PROJECT_ROOT = Path(__file__).resolve().parents[3]

RESUME_FILE = (
    PROJECT_ROOT
    / "backend"
    / "app"
    / "datasets"
    / "parsed_resumes.json"
)

JOB_FILE = (
    PROJECT_ROOT
    / "backend"
    / "app"
    / "datasets"
    / "parsed_jobs.json"
)


def load_json(path):

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


@router.post("/")
def predict(
    resume_name: str,
    job_id: str
):

    resumes = load_json(RESUME_FILE)

    jobs = load_json(JOB_FILE)

    resume = next(

        (
            item
            for item in resumes
            if item["resume_name"] == resume_name
        ),

        None

    )

    if resume is None:

        raise HTTPException(

            status_code=404,

            detail="Resume not found"

        )

    job = next(

        (
            item
            for item in jobs
            if str(item["job_id"]) == str(job_id)
        ),

        None

    )

    if job is None:

        raise HTTPException(

            status_code=404,

            detail="Job not found"

        )

    features = feature_extractor.extract(
        resume,
        job
    )

    prediction = predictor.predict(
        features
    )

    return {
        "resume_name": resume_name,
        "job_id": job_id,
        "features": features,
        "prediction": prediction
    }
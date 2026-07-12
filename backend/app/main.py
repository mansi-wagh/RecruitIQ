from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models.user import User
from app.models.application import Application

from app.routers.auth import router as auth_router
from app.routers.candidates import router as candidate_router
from app.routers.jobs import router as job_router
from app.routers.resume import router as resume_router
from app.routers.job_analyzer import router as job_analyzer_router
from app.routers.matching import router as matching_router
from app.routers.prediction import router as prediction_router
from app.routers.ai import router as ai_router
from app.routers.reports import router as reports_router
from app.routers.assistant import router as assistant_router
from app.routers.applications import router as applications_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RecruitIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8081",
        "http://127.0.0.1:8081",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(candidate_router)
app.include_router(job_analyzer_router)
app.include_router(job_router)
app.include_router(resume_router)
app.include_router(matching_router)
app.include_router(prediction_router)
app.include_router(ai_router)
app.include_router(reports_router)
app.include_router(assistant_router)
app.include_router(applications_router)


@app.get("/")
def home():
    return {"message": "RecruitIQ API Running"}


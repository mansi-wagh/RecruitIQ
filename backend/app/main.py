from fastapi import FastAPI
from app.routers.auth import router as auth_router
from app.database import Base, engine
from app.models.user import User
from app.routers.jobs import router as job_router
from app.routers.resume import router as resume_router


Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="RecruitIQ API"
)

app.include_router(auth_router)
app.include_router(job_router)
app.include_router(resume_router)

@app.get("/")
def home():

    return {
        "message": "RecruitIQ API Running"
    }


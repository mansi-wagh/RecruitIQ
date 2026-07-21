from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

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

from app.config import CORS_ORIGINS


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-load ML models and ChromaDB in background thread
    import asyncio
    from app.logger import logger

    def init_resources():
        import time
        logger.info("Loading resources in background...")
        start_time = time.perf_counter()
        try:
            from app.rag.retriever import DocumentRetriever
            # Load retriever (triggers embedding model + ChromaDB)
            DocumentRetriever()
            elapsed = time.perf_counter() - start_time
            logger.info(f"[{elapsed:.1f}s] Resources loaded")
        except Exception as e:
            logger.error("Failed to load resources: %s", e, exc_info=True)

    # Run in background so server starts immediately
    asyncio.create_task(asyncio.to_thread(init_resources))
    
    yield


app = FastAPI(title="RecruitIQ API", lifespan=lifespan)


@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}


uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(uploads_dir, exist_ok=True)

@app.get("/uploads/resumes/{filename:path}")
def serve_resume(filename: str):
    import os
    from fastapi.responses import RedirectResponse, FileResponse
    from fastapi import HTTPException
    from app.services.storage_service import StorageService

    # Try local file first
    local_path = os.path.join(uploads_dir, "resumes", filename)
    if os.path.exists(local_path):
        return FileResponse(local_path)
    
    # Handle nested path
    if filename.startswith("resumes/"):
        stripped = filename.replace("resumes/", "", 1)
        local_path_stripped = os.path.join(uploads_dir, "resumes", stripped)
        if os.path.exists(local_path_stripped):
            return FileResponse(local_path_stripped)

    # Fallback: cloud storage signed URL
    storage_service = StorageService()
    if storage_service.enabled:
        signed_url = storage_service.generate_signed_url(filename)
        if signed_url:
            return RedirectResponse(url=signed_url)

    raise HTTPException(status_code=404, detail="Resume file not found")

app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
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


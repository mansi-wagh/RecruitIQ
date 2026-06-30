from app.services.feature_extractor import FeatureExtractor

resume = {
    "skills": ["Python", "FastAPI", "SQL"],
    "education": ["B.Tech Computer Science"],
    "experience": ["2 years Python Developer"],
    "projects": ["RecruitIQ using FastAPI and XGBoost"],
    "certifications": ["AWS Cloud Practitioner"],
}

job = {
    "skills": ["Python", "FastAPI", "Docker", "SQL"],
    "education": ["B.Tech"],
    "experience": ["2 years"],
    "title": "Backend Developer",
    "description": "Looking for a Python FastAPI developer."
}

extractor = FeatureExtractor()

print(extractor.extract(resume, job))
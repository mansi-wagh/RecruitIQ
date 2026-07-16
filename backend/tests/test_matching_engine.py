import pytest
from app.services.matching_engine import MatchingEngine


def test_matching_engine_skills():
    resume = {"skills": ["python", "js", "docker"]}
    job = {"skills": ["python", "java", "docker"]}
    
    engine = MatchingEngine(resume, job)
    matched, missing, score = engine.skill_matching()
    
    assert "Python" in matched
    assert "Docker" in matched
    assert "Java" in missing
    assert score == 66.67


def test_matching_engine_education():
    resume_grad = {"education": ["B.Tech in Computer Science"]}
    job_grad = {"education": "B.Tech required"}
    job_master = {"education": "Master's degree preferred"}
    
    engine1 = MatchingEngine(resume_grad, job_grad)
    assert engine1.education_matching() == 100.0
    
    engine2 = MatchingEngine(resume_grad, job_master)
    assert engine2.education_matching() == 75.0


def test_matching_engine_experience():
    resume = {"experience": ["3+ years of experience as Software Engineer"]}
    job_require_5 = {"experience": "5+ years required"}
    job_require_2 = {"experience": "2 years required"}
    
    engine1 = MatchingEngine(resume, job_require_5)
    assert engine1.experience_matching() == 60.0
    
    engine2 = MatchingEngine(resume, job_require_2)
    assert engine2.experience_matching() == 100.0


def test_project_matching():
    resume = {
        "projects": ["Built a web app with Python and React for candidate portal tracking."]
    }
    job = {
        "skills": ["python", "react", "c#"]
    }
    engine = MatchingEngine(resume, job)
    res = engine.project_matching()
    assert "Python" in res["matched_projects"]
    assert "React" in res["matched_projects"]
    assert res["project_score"] == 66.67


def test_certification_matching():
    resume = {
        "certifications": ["AWS Certified Solutions Architect", "Docker Certified Associate"]
    }
    engine = MatchingEngine(resume, {})
    res = engine.certification_matching()
    assert "AWS" in res["matched_certifications"]
    assert "Docker" in res["matched_certifications"]
    assert res["certification_score"] == 40


def test_overall_match():
    resume = {
        "skills": ["python", "js"],
        "education": ["B.Tech"],
        "experience": ["3 years"],
        "projects": ["Python project"],
        "certifications": ["AWS"]
    }
    job = {
        "skills": ["python", "js", "java"],
        "education": "B.Tech",
        "experience": "3 years"
    }
    engine = MatchingEngine(resume, job)
    match = engine.match()
    assert match["overall_score"] > 0
    assert match["confidence"] in ["High", "Medium", "Low"]
    assert match["recommendation"] in ["Excellent Match", "Highly Recommended", "Recommended", "Consider", "Not Recommended"]

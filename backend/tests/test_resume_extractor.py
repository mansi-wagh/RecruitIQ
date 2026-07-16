import pytest
from app.services.resume_information_extractor import ResumeExtractor


def test_resume_extractor_name_email_phone():
    text = "Mansi Wagh\nemail: mansi@gmail.com\nphone: 9876543210\nSoftware Engineer"
    extractor = ResumeExtractor(text)
    
    assert extractor.extract_name() == "Mansi Wagh"
    assert extractor.extract_email() == "mansi@gmail.com"
    assert extractor.extract_phone() == "9876543210"


def test_resume_extractor_skills():
    text = "Skills: Python, JavaScript, Docker, Kubernetes"
    extractor = ResumeExtractor(text)
    skills = extractor.extract_skills()
    
    assert "Python" in skills
    assert "JavaScript" in skills
    assert "Docker" in skills


def test_resume_extractor_education_experience():
    text = """
    Mansi Wagh
    Education:
    B.Tech in Computer Science, GPA: 9.2
    Experience:
    Intern at TechCorp doing Python development (1+ year)
    Projects:
    Developed a recruitment assistant using Gemini Pro
    """
    extractor = ResumeExtractor(text)
    
    edu = extractor.extract_education()
    assert any("B.Tech" in e for e in edu)
    
    exp = extractor.extract_experience()
    assert any("Intern" in x for x in exp)
    
    proj = extractor.extract_projects()
    assert any("recruitment" in p.lower() for p in proj)

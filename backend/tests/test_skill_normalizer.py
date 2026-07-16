import pytest
from app.services.skill_normalizer import SkillNormalizer


def test_normalize_skill():
    normalizer = SkillNormalizer()
    
    assert normalizer.normalize_skill("python") == "Python"
    assert normalizer.normalize_skill("Python") == "Python"
    
    assert normalizer.normalize_skill("  javascript  ") == "JavaScript"
    
    assert normalizer.normalize_skill("js") == "JavaScript"
    assert normalizer.normalize_skill("reactjs") == "React"
    
    assert normalizer.normalize_skill("some-weird-skill") == "Some-Weird-Skill"
    assert normalizer.normalize_skill("") == ""


def test_get_category():
    normalizer = SkillNormalizer()
    assert normalizer.get_category("python") == "Languages"
    assert normalizer.get_category("react") == "Libraries/Frameworks"
    assert normalizer.get_category("docker") == "Tools/DevOps"
    assert normalizer.get_category("unknown-skill") == "Unknown"


def test_normalize_list():
    normalizer = SkillNormalizer()
    skills = ["js", "python", "ReactJS", "python", "unknown"]
    normalized = normalizer.normalize_list(skills)
    
    assert normalized == ["JavaScript", "Python", "React", "Unknown"]


def test_normalize_with_category():
    normalizer = SkillNormalizer()
    skills = ["js", "python"]
    res = normalizer.normalize_with_category(skills)
    assert res == [
        {"skill": "JavaScript", "category": "Languages"},
        {"skill": "Python", "category": "Languages"}
    ]

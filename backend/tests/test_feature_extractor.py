import pytest
from app.services.feature_extractor import FeatureExtractor


def test_clean_text():
    assert FeatureExtractor._clean_text("  hello   world  ") == "hello world"
    assert FeatureExtractor._clean_text(None) == ""
    assert FeatureExtractor._clean_text("NaN") == ""
    assert FeatureExtractor._clean_text("none") == ""


def test_clean_list():
    assert FeatureExtractor._clean_list(["  hello ", "world", None]) == ["hello", "world"]
    assert FeatureExtractor._clean_list(None) == []


def test_education_rank():
    assert FeatureExtractor.education_rank(["B.Tech in CS"]) == 3
    assert FeatureExtractor.education_rank(["M.Tech in CSE", "B.Tech"]) == 4
    assert FeatureExtractor.education_rank(["PhD in AI"]) == 5
    assert FeatureExtractor.education_rank(["High school"]) == 0


def test_experience_years():
    assert FeatureExtractor.experience_years(["3+ years of experience"]) == 3
    assert FeatureExtractor.experience_years(["5 years at Google", "2 years at MS"]) == 5
    assert FeatureExtractor.experience_years(["no experience"]) == 0


def test_tokenize():
    tokens = FeatureExtractor.tokenize("Python and JavaScript developer")
    assert "python" in tokens
    assert "javascript" in tokens
    assert "and" not in tokens


def test_jaccard():
    set1 = {"python", "sql"}
    set2 = {"python", "java"}
    assert FeatureExtractor.jaccard(set1, set2) == 1/3
    assert FeatureExtractor.jaccard(set1, set()) == 0.0


def test_is_technical_job():
    assert FeatureExtractor._is_technical_job("Software Engineer", "Develop apps", "Python, Java")
    assert not FeatureExtractor._is_technical_job("Accountant", "Manage books", "Accounting")


def test_calculate_technical_job_score():
    score = FeatureExtractor.calculate_technical_job_score(
        "Software Engineer",
        "Looking for Python developer",
        "Python, git"
    )
    assert score > 0

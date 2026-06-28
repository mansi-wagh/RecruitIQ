import json
import random
import re
import sys
from collections import defaultdict
from pathlib import Path

import pandas as pd

# ==========================================================
# PATHS AND IMPORTS
# ==========================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]
BACKEND_ROOT = PROJECT_ROOT / "backend"

if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.services.matching_engine import MatchingEngine  # noqa: E402
from app.services.skill_normalizer import SkillNormalizer  # noqa: E402

DATASET_FOLDER = BACKEND_ROOT / "app" / "datasets"
RESUME_FILE = DATASET_FOLDER / "parsed_resumes.json"
JOB_FILE = DATASET_FOLDER / "parsed_jobs.json"
OUTPUT_FILE = DATASET_FOLDER / "matching_dataset.csv"

# ==========================================================
# CONFIGURATION
# ==========================================================

RANDOM_SEED = 42

TARGET_MIN_ROWS = 3_000
TARGET_MAX_ROWS = 8_000

MAX_STRONG_CANDIDATES_PER_RESUME = 70
MAX_HARD_NEGATIVES_PER_RESUME = 50
MAX_CANDIDATE_POOL_PER_RESUME = 700

MAX_INDEX_TERM_FRACTION = 0.20
MAX_INDEX_TERM_DOCS = 25_000

OUTPUT_COLUMNS = [
    "resume_name",
    "job_id",
    "company",
    "title",
    "matched_skill_count",
    "missing_skill_count",
    "resume_skill_count",
    "job_skill_count",
    "skill_overlap_ratio",
    "experience_gap",
    "education_gap",
    "project_match_count",
    "certification_match_count",
    "skill_score",
    "education_score",
    "experience_score",
    "project_score",
    "certification_score",
    "overall_score",
    "confidence",
    "recommendation",
    "matched_skills",
    "missing_skills",
    "retrieval_score",
    "title_similarity",
    "keyword_similarity",
    "technical_job_score",
    "label",
]

STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "have",
    "in", "is", "it", "of", "on", "or", "our", "that", "the", "their", "this",
    "to", "we", "with", "you", "your", "job", "role", "work", "team", "company",
    "description", "candidate", "applicant", "experience", "skills", "required",
    "responsibilities",
}

EDUCATION_RANKS = {
    "phd": 5,
    "doctorate": 5,
    "master": 4,
    "m.tech": 4,
    "mtech": 4,
    "m.e": 4,
    "mca": 4,
    "b.tech": 3,
    "btech": 3,
    "bachelor": 3,
    "b.e": 3,
    "be": 3,
    "degree": 3,
    "diploma": 2,
    "12th": 1,
}

# ==========================================================
# TECHNICAL JOB FILTERS
# ==========================================================

BLACKLIST_OBVIOUS_NON_TECH = [
    "bookkeeper", "bookkeeping", "cpa", "accountant", "accounting", "tax", "payroll", "auditor", "billing", "controller",
    "nurse", "nursing", "doctor", "physician", "therapist", "counselor", "clinical", "patient care", "medical", "dentist", "dental", "pharmacy", "pharmacist", "veterinarian", "clinic", "healthcare", "pediatric", "hospital",
    "receptionist", "administrative assistant", "admin assistant", "secretary", "office assistant", "clerk",
    "sales executive", "sales coordinator", "sales representative", "sales associate", "retail", "cashier", "teller", "merchandising", "broker", "agent",
    "marketing coordinator", "marketing specialist", "marketing manager", "brand ambassador",
    "lawyer", "attorney", "paralegal", "legal", "litigation",
    "chef", "cook", "kitchen", "bartender", "server", "waiter", "waitress", "food", "restaurant", "barista",
    "teacher", "tutor", "daycare", "nanny", "babysitter", "educator", "academic", "professor", "school",
    "construction worker", "laborer", "general labor", "mover", "junk hauler", "driver", "warehouse worker", "forklift", "painter", "plumber", "hvac", "electrician", "mechanic", "carpenter",
    "worship", "pastor", "church", "worship leader", "coach", "fitness", "salon", "barber", "stylist", "esthetician"
]

WHITELIST_TECH_TITLES = [
    "software", "developer", "engineer", "programmer", "coding", "web", "backend", "frontend", "fullstack", "full-stack", "devops", "cloud", "sre", "platform", "infrastructure",
    "data", "ml", "ai", "machine learning", "artificial intelligence", "deep learning", "nlp", "computer vision", "analytics", "bi", "sql", "database", "dba",
    "it", "information technology", "system", "systems", "network", "cybersecurity", "cyber", "security",
    "computer", "computational", "computing", "scrum", "agile", "product manager", "product owner", "architect", "tech", "technology",
    "qa", "quality assurance", "tester", "testing", "analyst", "solution architect", "sde", "mobile developer"
]

TECH_KEYWORDS = [
    "python", "java", "javascript", "c#", "c++", "golang", "ruby", "php", "rust", "typescript", "swift", "kotlin", "scala",
    "react", "angular", "vue", "node", "django", "flask", "spring", "dotnet", "fastapi",
    "aws", "azure", "gcp", "docker", "kubernetes", "linux", "git", "sql", "nosql", "mongodb", "postgres", "mysql", "oracle",
    "machine learning", "deep learning", "nlp", "tensorflow", "pytorch", "scikit-learn", "keras", "spark", "hadoop", "pandas", "numpy",
    "agile", "scrum", "ci/cd", "devops", "cloud", "security", "network", "api", "rest", "graphql", "microservices"
]

NON_TECH_SKILLS = {
    "communication", "leadership", "management", "teamwork", "organization", "writing", "speaking", "english", 
    "presentation", "customer service", "sales", "retail", "marketing", "finance", "legal", "health", 
    "make", "go", "move", "less", "time management", "problem solving", "critical thinking", "attention to detail", 
    "work ethic", "collaboration", "adaptability", "active listening", "negotiation", "conflict resolution", 
    "decision making", "interpersonal", "creativity", "flexibility", "patience", "empathy", "coaching", "business", "planning", "scheduling",
    "microsoft office", "excel", "word", "powerpoint", "office", "outlook"
}

STRONG_TECH_TITLE_TERMS = ["software", "developer", "engineer", "sde", "architect", "programmer"]
PHYSICAL_ENGINEERING_TERMS = ["building", "hvac", "maintenance", "civil", "structural", "mechanical"]

FALSE_POSITIVE_SKILL_INDICATORS = {
    "amazon neptune": ["neptune"],
    "apache solr": ["solr"],
    "cri-o": ["cri-o"],
    "model evaluation": ["model evaluation", "evaluation metric"],
    "ios sdk": ["ios sdk", "ios-sdk"],
    "reverse engineering": ["reverse engineering", "reverse engineer", "disassembly", "ghidra", "ida pro"],
    "automated testing": ["automated testing", "test automation", "selenium", "cypress", "junit", "pytest"],
    "integration testing": ["integration testing", "integration test"],
    "exploratory testing": ["exploratory testing", "exploratory test"],
    "branching strategy": ["branching strategy", "git branch", "git flow"],
}


def has_word(text, word):
    return re.search(r"\b" + re.escape(word) + r"\b", text) is not None


def has_any_word(text, words):
    return any(has_word(text, word) for word in words)


def is_true_technical_skill(skill, text):
    skill_lower = skill.lower()
    text_lower = text.lower()

    if skill_lower in NON_TECH_SKILLS:
        return False

    if skill_lower in FALSE_POSITIVE_SKILL_INDICATORS:
        indicators = FALSE_POSITIVE_SKILL_INDICATORS[skill_lower]
        return any(indicator in text_lower for indicator in indicators)

    return True


def is_technical_job(title, description, skills_desc, skills_list=None):
    title = str(title or "").lower().strip()
    description = str(description or "").lower().strip()
    skills_desc = str(skills_desc or "").lower().strip()
    full_text = description + " " + skills_desc

    if not title:
        return False

    for word in BLACKLIST_OBVIOUS_NON_TECH:
        if has_word(title, word):
            if any(term in title for term in STRONG_TECH_TITLE_TERMS):
                if any(term in title for term in PHYSICAL_ENGINEERING_TERMS):
                    return False
                continue
            return False

    title_tech = has_any_word(title, WHITELIST_TECH_TITLES)
    skills_tech = any(is_true_technical_skill(s, full_text) for s in skills_list) if skills_list is not None else False
    desc_tech = has_any_word(full_text, TECH_KEYWORDS)

    return title_tech or skills_tech or desc_tech


def calculate_technical_job_score(title, description, skills_desc):
    title = str(title or "").lower().strip()
    description = str(description or "").lower().strip()
    skills_desc = str(skills_desc or "").lower().strip()
    combined = title + " " + description + " " + skills_desc

    matches = sum(1 for keyword in TECH_KEYWORDS if has_word(combined, keyword))
    title_matches = sum(1 for keyword in WHITELIST_TECH_TITLES if has_word(title, keyword))

    score = (matches * 8) + (title_matches * 20)
    return float(min(100.0, score))

# ==========================================================
# JSON LOADING AND BASIC CLEANUP
# ==========================================================

def load_json(path):
    with open(path, "r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, list):
        raise ValueError(f"Expected a list in {path}, got {type(data).__name__}")

    return data


def clean_text(value):
    if value is None:
        return ""

    text = str(value).strip()
    if text.lower() in {"", "nan", "none", "null"}:
        return ""

    return re.sub(r"\s+", " ", text)


def clean_list(value):
    if value is None:
        return []

    values = value if isinstance(value, list) else [value]
    cleaned = []

    for item in values:
        text = clean_text(item)
        if text:
            cleaned.append(text)

    return cleaned


def sanitize_records(records, list_fields):
    sanitized = []

    for record in records:
        if not isinstance(record, dict):
            continue

        item = dict(record)
        for field in list_fields:
            item[field] = clean_list(item.get(field, []))

        sanitized.append(item)

    return sanitized


def load_resumes():
    resumes = sanitize_records(
        load_json(RESUME_FILE),
        ["skills", "education", "experience", "projects", "certifications"],
    )

    print(f"Loaded resumes : {len(resumes)}")
    return resumes


def load_jobs():
    raw_jobs = load_json(JOB_FILE)
    
    filtered_raw = []
    skipped_count = 0
    for r in raw_jobs:
        title = r.get("title", "")
        description = r.get("description", "") or " ".join(r.get("skills", []))
        skills_desc = " ".join(r.get("skills", []))
        skills_list = r.get("skills", [])
        if is_technical_job(title, description, skills_desc, skills_list):
            filtered_raw.append(r)
        else:
            skipped_count += 1

    jobs = sanitize_records(
        filtered_raw,
        ["skills", "education"],
    )

    print(f"Loaded jobs    : {len(jobs)} (Skipped {skipped_count} non-technical roles)")
    return jobs

# ==========================================================
# PROFILE CREATION
# ==========================================================

def tokenize(text):
    tokens = re.findall(r"[a-z0-9][a-z0-9+#.\-]*", clean_text(text).lower())
    return {
        token
        for token in tokens
        if token not in STOP_WORDS and (len(token) > 2 or token in {"c", "r"})
    }


def normalize_skills(skills, normalizer):
    normalized = normalizer.normalize_list(clean_list(skills))
    return {skill.lower().strip() for skill in normalized if clean_text(skill)}


def education_rank(value):
    text = " ".join(clean_list(value)).lower()
    rank = 0

    for keyword, score in EDUCATION_RANKS.items():
        if keyword in text:
            rank = max(rank, score)

    return rank


def experience_years(value):
    text = " ".join(clean_list(value)).lower()
    matches = re.findall(r"(\d+)\+?\s*(?:year|yr)", text)

    if not matches:
        return 0

    return max(int(match) for match in matches)


def first_experience_title(resume):
    for item in clean_list(resume.get("experience", [])):
        tokens = tokenize(item)
        if tokens:
            return item[:160]

    return ""


def make_resume_profile(resume, index, normalizer):
    name = clean_text(resume.get("resume_name")) or f"resume_{index}"
    personal_info = resume.get("personal_info") or {}
    headline = clean_text(personal_info.get("name")) or first_experience_title(resume)

    keyword_text = " ".join(
        clean_list(resume.get("skills", []))
        + clean_list(resume.get("education", []))
        + clean_list(resume.get("experience", []))[:8]
        + clean_list(resume.get("projects", []))
        + clean_list(resume.get("certifications", []))[:8]
    )

    return {
        "index": index,
        "id": name,
        "record": resume,
        "skills": normalize_skills(resume.get("skills", []), normalizer),
        "title_tokens": tokenize(headline),
        "keyword_tokens": set(sorted(tokenize(keyword_text))[:120]),
        "education_rank": education_rank(resume.get("education", [])),
        "experience_years": experience_years(resume.get("experience", [])),
        "projects_text": " ".join(clean_list(resume.get("projects", []))).lower()
    }


def make_job_profile(job, index, normalizer):
    job_id = clean_text(job.get("job_id")) or f"job_{index}"
    title = clean_text(job.get("title"))

    description = job.get("description", "")
    skills_desc = " ".join(job.get("skills", []))

    keyword_text = " ".join(
        [title[:600], clean_text(job.get("experience")), description]
        + clean_list(job.get("skills", []))
        + clean_list(job.get("education", []))
    )

    return {
        "index": index,
        "id": job_id,
        "record": job,
        "title": title,
        "description": description,
        "skills_desc": skills_desc,
        "skills": normalize_skills(job.get("skills", []), normalizer),
        "title_tokens": tokenize(title[:220]),
        "keyword_tokens": set(sorted(tokenize(keyword_text))[:120]),
        "education_rank": education_rank(job.get("education", [])),
        "experience_years": experience_years(job.get("experience", "")),
    }


def build_profiles(resumes, jobs):
    normalizer = SkillNormalizer()

    resume_profiles = [
        make_resume_profile(resume, index, normalizer)
        for index, resume in enumerate(resumes)
    ]
    job_profiles = [
        make_job_profile(job, index, normalizer)
        for index, job in enumerate(jobs)
    ]

    return resume_profiles, job_profiles

# ==========================================================
# JOB INDEXING
# ==========================================================

def experience_bucket(years):
    if years <= 0:
        return 0
    if years <= 2:
        return 1
    if years <= 5:
        return 2
    if years <= 8:
        return 3
    return 4


def build_job_indexes(job_profiles):
    indexes = {
        "skills": defaultdict(list),
        "title": defaultdict(list),
        "keywords": defaultdict(list),
        "education": defaultdict(list),
        "experience": defaultdict(list),
    }

    for profile in job_profiles:
        job_index = profile["index"]

        for skill in profile["skills"]:
            indexes["skills"][skill].append(job_index)

        for token in profile["title_tokens"]:
            indexes["title"][token].append(job_index)

        for token in profile["keyword_tokens"]:
            indexes["keywords"][token].append(job_index)

        indexes["education"][profile["education_rank"]].append(job_index)
        indexes["experience"][experience_bucket(profile["experience_years"])].append(job_index)

    return indexes


def term_is_selective(term, index, total_jobs):
    document_count = len(index.get(term, []))
    if document_count == 0:
        return False

    max_docs = min(MAX_INDEX_TERM_DOCS, max(1, int(total_jobs * MAX_INDEX_TERM_FRACTION)))
    return document_count <= max_docs


def add_index_hits(scores, terms, index, total_jobs, weight, max_terms):
    selective_terms = [
        term
        for term in terms
        if term_is_selective(term, index, total_jobs)
    ]
    selective_terms.sort(key=lambda term: len(index[term]))

    for term in selective_terms[:max_terms]:
        for job_index in index[term]:
            scores[job_index] += weight


def add_limited_bucket_hits(scores, job_indexes, weight, limit):
    if not job_indexes:
        return

    for job_index in job_indexes[:limit]:
        scores[job_index] += weight


def collect_candidate_jobs(resume_profile, job_profiles, indexes):
    total_jobs = len(job_profiles)
    retrieval_scores = defaultdict(float)

    add_index_hits(
        retrieval_scores,
        resume_profile["skills"],
        indexes["skills"],
        total_jobs,
        weight=5.0,
        max_terms=14,
    )

    add_index_hits(
        retrieval_scores,
        resume_profile["title_tokens"],
        indexes["title"],
        total_jobs,
        weight=2.5,
        max_terms=10,
    )

    add_index_hits(
        retrieval_scores,
        resume_profile["keyword_tokens"],
        indexes["keywords"],
        total_jobs,
        weight=1.0,
        max_terms=16,
    )

    resume_education_rank = resume_profile["education_rank"]
    compatible_education = [
        rank
        for rank in range(0, resume_education_rank + 1)
    ] or [0]

    for rank in compatible_education:
        add_limited_bucket_hits(
            retrieval_scores,
            indexes["education"].get(rank, []),
            weight=0.25,
            limit=75,
        )

    resume_bucket = experience_bucket(resume_profile["experience_years"])
    compatible_experience = [bucket for bucket in range(0, resume_bucket + 1)] or [0]

    for bucket in compatible_experience:
        add_limited_bucket_hits(
            retrieval_scores,
            indexes["experience"].get(bucket, []),
            weight=0.25,
            limit=75,
        )

    if not retrieval_scores:
        return []

    ranked = sorted(
        retrieval_scores,
        key=lambda job_index: retrieval_scores[job_index],
        reverse=True,
    )

    return ranked[:MAX_CANDIDATE_POOL_PER_RESUME]

# ==========================================================
# PREFILTER AND RANKING
# ==========================================================

def safe_ratio(numerator, denominator, default=0.0):
    if denominator == 0:
        return default
    return numerator / denominator


def jaccard(left, right):
    if not left or not right:
        return 0.0

    return len(left & right) / len(left | right)


def education_compatibility(resume_rank, job_rank):
    if job_rank == 0:
        return 1.0
    if resume_rank >= job_rank:
        return 1.0
    return resume_rank / job_rank if job_rank else 1.0


def experience_compatibility(resume_years, job_years):
    if job_years == 0:
        return 1.0
    return min(resume_years / job_years, 1.0)


def retrieval_features(resume_profile, job_profile):
    skill_overlap = len(resume_profile["skills"] & job_profile["skills"])
    skill_overlap_ratio = safe_ratio(skill_overlap, len(job_profile["skills"]))
    
    title_similarity = jaccard(
        resume_profile["title_tokens"],
        job_profile["title_tokens"],
    )
    keyword_similarity = jaccard(
        resume_profile["keyword_tokens"],
        job_profile["keyword_tokens"],
    )
    edu_compat = education_compatibility(
        resume_profile["education_rank"],
        job_profile["education_rank"],
    )
    exp_compat = experience_compatibility(
        resume_profile["experience_years"],
        job_profile["experience_years"],
    )
    
    resume_projects_text = resume_profile["projects_text"]
    matched_project_skills = [
        skill
        for skill in job_profile["skills"]
        if skill.lower() in resume_projects_text
    ]
    project_similarity = safe_ratio(len(matched_project_skills), len(job_profile["skills"]))

    return {
        "skill_overlap": float(skill_overlap),
        "skill_overlap_ratio": skill_overlap_ratio,
        "title_similarity": title_similarity,
        "education_compatibility": edu_compat,
        "experience_compatibility": exp_compat,
        "project_similarity": project_similarity,
        "keyword_similarity": keyword_similarity,
    }


def weighted_retrieval_score(resume_profile, job_profile):
    features = retrieval_features(resume_profile, job_profile)

    return (
        features["skill_overlap_ratio"] * 0.30
        + features["title_similarity"] * 0.20
        + features["education_compatibility"] * 0.15
        + features["experience_compatibility"] * 0.15
        + features["project_similarity"] * 0.15
        + features["keyword_similarity"] * 0.05
    )


def select_jobs_for_matching(resume_profile, job_profiles, candidate_indexes):
    scored = [
        (
            job_index,
            weighted_retrieval_score(resume_profile, job_profiles[job_index]),
        )
        for job_index in candidate_indexes
    ]
    scored.sort(key=lambda item: item[1], reverse=True)
    score_lookup = dict(scored)

    strong_candidates = [
        job_index
        for job_index, score in scored
        if score >= 0.18
    ][:MAX_STRONG_CANDIDATES_PER_RESUME]
    strong_candidate_set = set(strong_candidates)

    hard_negatives = [
        job_index
        for job_index, score in scored
        if 0.04 <= score < 0.18
    ][:MAX_HARD_NEGATIVES_PER_RESUME]

    if len(strong_candidates) < 10:
        for job_index, _ in scored[:min(10, len(scored))]:
            if job_index not in strong_candidates:
                strong_candidates.append(job_index)

    selected = []
    seen = set()

    for job_index in strong_candidates + hard_negatives:
        if job_index in seen:
            continue

        seen.add(job_index)
        selected.append({
            "job_index": job_index,
            "retrieval_score": score_lookup.get(job_index, 0.0),
            "selection_type": (
                "strong_candidate"
                if job_index in strong_candidate_set
                else "hard_negative_candidate"
            ),
        })

    return selected

# ==========================================================
# MATCHING AND LABELING
# ==========================================================

def create_label(match_result):
    skill = float(match_result.get("skill_score", 0))
    education = float(match_result.get("education_score", 0))
    experience = float(match_result.get("experience_score", 0))
    project = float(match_result.get("project_score", 0))
    certification = float(match_result.get("certification_score", 0))
    overall = float(match_result.get("overall_score", 0))

    matched_skills = match_result.get("matched_skills", [])
    matched_projects = match_result.get("matched_project_skills", [])
    matched_certifications = match_result.get("matched_certifications", [])

    label_score = (
        skill * 0.40
        + experience * 0.25
        + education * 0.15
        + project * 0.12
        + certification * 0.08
    )

    has_skill_evidence = skill >= 10 and len(matched_skills) > 0
    has_basic_fit = experience >= 40 and education >= 40
    has_supporting_evidence = (
        project >= 20
        or certification >= 20
        or len(matched_projects) > 0
        or len(matched_certifications) > 0
    )

    if has_skill_evidence and has_basic_fit and label_score >= 40:
        return 1

    if skill >= 25 and experience >= 70 and education >= 60 and overall >= 35:
        return 1

    if has_skill_evidence and has_supporting_evidence and overall >= 45:
        return 1

    return 0


def create_row(resume_profile, job_profile, result, retrieval_score, selection_type):
    resume = resume_profile["record"]
    job = job_profile["record"]
    
    matched_skills = clean_list(result.get("matched_skills", []))
    missing_skills = clean_list(result.get("missing_skills", []))
    matched_projects = clean_list(result.get("matched_project_skills", []))
    matched_certifications = clean_list(result.get("matched_certifications", []))
    
    resume_skill_count = len(resume_profile["skills"])
    job_skill_count = len(job_profile["skills"])
    matched_skill_count = len(matched_skills)
    missing_skill_count = len(missing_skills)
    
    skill_overlap_ratio = round(safe_ratio(matched_skill_count, job_skill_count), 4)

    experience_gap = max(job_profile["experience_years"] - resume_profile["experience_years"], 0)
    education_gap = max(job_profile["education_rank"] - resume_profile["education_rank"], 0)
    
    project_match_count = len(matched_projects)
    certification_match_count = len(matched_certifications)
    
    label = create_label(result)

    features = retrieval_features(resume_profile, job_profile)
    technical_job_score = calculate_technical_job_score(
        job_profile["title"],
        job_profile["description"],
        job_profile["skills_desc"]
    )

    return {
        "resume_name": clean_text(resume.get("resume_name")),
        "job_id": clean_text(job.get("job_id")),
        "company": clean_text(job.get("company")),
        "title": clean_text(job.get("title")),
        
        "matched_skill_count": matched_skill_count,
        "missing_skill_count": missing_skill_count,
        "resume_skill_count": resume_skill_count,
        "job_skill_count": job_skill_count,
        "skill_overlap_ratio": skill_overlap_ratio,
        "experience_gap": experience_gap,
        "education_gap": education_gap,
        "project_match_count": project_match_count,
        "certification_match_count": certification_match_count,
        
        "skill_score": result.get("skill_score", 0),
        "education_score": result.get("education_score", 0),
        "experience_score": result.get("experience_score", 0),
        "project_score": result.get("project_score", 0),
        "certification_score": result.get("certification_score", 0),
        "overall_score": result.get("overall_score", 0),
        "confidence": result.get("confidence", ""),
        "recommendation": result.get("recommendation", ""),
        
        "matched_skills": ", ".join(matched_skills),
        "missing_skills": ", ".join(missing_skills),
        "retrieval_score": round(retrieval_score, 4),
        "title_similarity": round(features["title_similarity"], 4),
        "keyword_similarity": round(features["keyword_similarity"], 4),
        "technical_job_score": technical_job_score,
        
        "label": label,
        
        "_retrieval_score": retrieval_score,
        "_selection_type": selection_type,
        "_is_hard_negative": (
            label == 0
            and (
                matched_skill_count > 0
                or selection_type == "hard_negative_candidate"
                or retrieval_score >= 0.08
            )
        ),
    }


def match_pair(resume, job):
    engine = MatchingEngine(resume, job)
    return engine.match()


def negative_priority(row):
    return (
        1 if row.get("_is_hard_negative") else 0,
        row.get("_retrieval_score", 0),
        row.get("matched_skill_count", 0),
    )


def balance_dataset(rows):
    if not rows:
        return rows

    rng = random.Random(RANDOM_SEED)

    by_resume = defaultdict(list)
    for row in rows:
        by_resume[row["resume_name"]].append(row)

    selected_set = set()
    selected_rows = []

    def add_row(row):
        key = (row["resume_name"], row["job_id"])
        if key not in selected_set:
            selected_set.add(key)
            selected_rows.append(row)
            return True
        return False

    for resume_rows in by_resume.values():
        positives = [r for r in resume_rows if r["label"] == 1]
        negatives = [r for r in resume_rows if r["label"] == 0]

        negatives.sort(key=negative_priority, reverse=True)

        neg_idx = 0
        for pos_row in positives:
            add_row(pos_row)

            paired_count = 0
            while neg_idx < len(negatives) and paired_count < 2:
                neg_row = negatives[neg_idx]
                if add_row(neg_row):
                    paired_count += 1
                neg_idx += 1

        if not positives:
            for neg_row in negatives[:8]:
                add_row(neg_row)

    remaining_rows = [r for r in rows if (r["resume_name"], r["job_id"]) not in selected_set]
    remaining_pos = [r for r in remaining_rows if r["label"] == 1]
    remaining_neg = [r for r in remaining_rows if r["label"] == 0]

    remaining_pos.sort(key=lambda r: r.get("_retrieval_score", 0), reverse=True)
    remaining_neg.sort(key=negative_priority, reverse=True)

    pos_count = sum(1 for r in selected_rows if r["label"] == 1)
    neg_count = sum(1 for r in selected_rows if r["label"] == 0)

    total_avail_pos = pos_count + len(remaining_pos)
    total_avail_neg = neg_count + len(remaining_neg)

    valid_configs = []
    for N in range(TARGET_MIN_ROWS, TARGET_MAX_ROWS + 1):
        min_pos = int(0.40 * N)
        max_pos = int(0.60 * N)
        
        lower_bound = max(min_pos, N - total_avail_neg)
        upper_bound = min(max_pos, total_avail_pos)
        
        if lower_bound <= upper_bound:
            target_pos = N // 2
            if target_pos < lower_bound:
                n_pos = lower_bound
            elif target_pos > upper_bound:
                n_pos = upper_bound
            else:
                n_pos = target_pos
                
            n_neg = N - n_pos
            
            size_loss = abs(N - 5000)
            ratio_loss = abs(n_pos / N - 0.50) * 10000
            loss = size_loss + ratio_loss
            
            valid_configs.append((loss, N, n_pos, n_neg))

    if valid_configs:
        valid_configs.sort(key=lambda x: x[0])
        _, best_size, best_pos_target, best_neg_target = valid_configs[0]
        print(f"Balancing Target - Size: {best_size}, Positives: {best_pos_target}, Negatives: {best_neg_target}")
    else:
        print("Warning: Could not satisfy 40-60 split bounds. Falling back to direct sizing.")
        best_size = min(TARGET_MAX_ROWS, max(TARGET_MIN_ROWS, len(selected_rows)))
        best_pos_target = int(best_size * 0.5)
        best_neg_target = best_size - best_pos_target

    current_pos_rows = [r for r in selected_rows if r["label"] == 1]
    current_neg_rows = [r for r in selected_rows if r["label"] == 0]

    if len(current_pos_rows) > best_pos_target:
        current_pos_rows.sort(key=lambda r: r.get("_retrieval_score", 0), reverse=True)
        current_pos_rows = current_pos_rows[:best_pos_target]
    elif len(current_pos_rows) < best_pos_target:
        needed = best_pos_target - len(current_pos_rows)
        current_pos_rows.extend(remaining_pos[:needed])

    if len(current_neg_rows) > best_neg_target:
        current_neg_rows.sort(key=negative_priority, reverse=True)
        current_neg_rows = current_neg_rows[:best_neg_target]
    elif len(current_neg_rows) < best_neg_target:
        needed = best_neg_target - len(current_neg_rows)
        current_neg_rows.extend(remaining_neg[:needed])

    final_balanced = current_pos_rows + current_neg_rows
    rng.shuffle(final_balanced)

    deduped = []
    seen_pairs = set()
    for row in final_balanced:
        pair = (row["resume_name"], row["job_id"])
        if pair not in seen_pairs:
            seen_pairs.add(pair)
            deduped.append(row)

    print(f"Balancing result - Final size: {len(deduped)}")
    return deduped

# ==========================================================
# DATASET BUILDING
# ==========================================================

def build_dataset(resume_limit=None, job_limit=None):
    resumes = load_resumes()
    jobs = load_jobs()

    if resume_limit is not None:
        resumes = resumes[:resume_limit]

    if job_limit is not None:
        jobs = jobs[:job_limit]

    print()
    print("=" * 70)
    print("Generating Matching Dataset")
    print("=" * 70)
    print(f"Resume Count        : {len(resumes)}")
    print(f"Job Count           : {len(jobs)}")
    print("Candidate Strategy  : smarter retrieval + compatibility ranking")
    print()

    resume_profiles, job_profiles = build_profiles(resumes, jobs)
    indexes = build_job_indexes(job_profiles)

    rows = []
    pair_keys = set()
    attempted_matches = 0

    for position, resume_profile in enumerate(resume_profiles, start=1):
        candidate_indexes = collect_candidate_jobs(resume_profile, job_profiles, indexes)
        selected_indexes = select_jobs_for_matching(
            resume_profile,
            job_profiles,
            candidate_indexes,
        )

        print(
            f"[{position}/{len(resume_profiles)}] "
            f"{resume_profile['id']} -> "
            f"{len(selected_indexes)} selected from {len(candidate_indexes)} candidates"
        )

        for selected in selected_indexes:
            job_index = selected["job_index"]
            job_profile = job_profiles[job_index]
            pair_key = (resume_profile["id"], job_profile["id"])

            if pair_key in pair_keys:
                continue

            pair_keys.add(pair_key)
            attempted_matches += 1

            try:
                result = match_pair(
                    resume_profile["record"],
                    job_profile["record"],
                )
                rows.append(
                    create_row(
                        resume_profile,
                        job_profile,
                        result,
                        selected["retrieval_score"],
                        selected["selection_type"],
                    )
                )
            except Exception as error:
                print(
                    f"Skipped pair {resume_profile['id']} -> "
                    f"{job_profile['id']}: {error}"
                )

    print()
    print(f"MatchingEngine calls : {attempted_matches}")
    print(f"Raw dataset rows     : {len(rows)}")

    balanced_rows = balance_dataset(rows)

    print(f"Balanced rows        : {len(balanced_rows)}")
    print("=" * 70)

    return balanced_rows

# ==========================================================
# SAVING AND STATISTICS
# ==========================================================

def save_dataset(rows):
    df = pd.DataFrame(rows, columns=OUTPUT_COLUMNS)
    df = df.sample(frac=1, random_state=RANDOM_SEED).reset_index(drop=True)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT_FILE, index=False, encoding="utf-8")

    print()
    print("=" * 70)
    print("Dataset Saved Successfully")
    print("=" * 70)
    print(f"Location : {OUTPUT_FILE}")
    print(f"Rows     : {len(df)}")
    print(f"Columns  : {len(df.columns)}")

    return df


def print_dataset_statistics(df):
    total_rows = len(df)
    positive_labels = int((df["label"] == 1).sum()) if total_rows else 0
    negative_labels = int((df["label"] == 0).sum()) if total_rows else 0

    print()
    print("=" * 70)
    print("Dataset Statistics")
    print("=" * 70)
    print(f"Total rows            : {total_rows}")
    print(f"Positive labels       : {positive_labels}")
    print(f"Negative labels       : {negative_labels}")
    print(f"Average overall score : {df['overall_score'].mean():.2f}" if total_rows else "Average overall score : 0.00")
    print(f"Average skill score   : {df['skill_score'].mean():.2f}" if total_rows else "Average skill score   : 0.00")
    print()
    print("Unique resumes:", df["resume_name"].nunique())
    print("Unique jobs:", df["job_id"].nunique())
    print("Unique companies:", df["company"].nunique())
    print("Unique titles:", df["title"].nunique())
    print("Average matched skills:", df["matched_skill_count"].mean())
    print("Average missing skills:", df["missing_skill_count"].mean())
    print("Average retrieval score:", df["retrieval_score"].mean())
    print()
    print("Label distribution")
    print(df["label"].value_counts(normalize=True).mul(100).round(2).astype(str) + "%")

# ==========================================================
# MAIN
# ==========================================================

if __name__ == "__main__":
    dataset = build_dataset()
    dataframe = save_dataset(dataset)
    print_dataset_statistics(dataframe)

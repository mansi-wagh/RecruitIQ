from pathlib import Path
import json
import time
import re
from collections import Counter

import pandas as pd

# ==========================================================
# PATHS
# ==========================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]
BACKEND_ROOT = PROJECT_ROOT / "backend"

import sys
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.services.job_description_parser import JobDescriptionParser

JOB_FILE = (
    PROJECT_ROOT
    / "dataset"
    / "Job Postings Dataset"
    / "postings.csv"
)

OUTPUT_FOLDER = (
    PROJECT_ROOT
    / "backend"
    / "app"
    / "datasets"
)

OUTPUT_FOLDER.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE = OUTPUT_FOLDER / "parsed_jobs.json"

# ==========================================================
# TECHNICAL JOB FILTER DEFINITIONS
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

STRONG_TECH_TITLE_TERMS = ["software", "developer", "engineer", "sde", "architect", "programmer"]
PHYSICAL_ENGINEERING_TERMS = ["building", "hvac", "maintenance", "civil", "structural", "mechanical"]

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


def get_blacklist_reason(title_lower):
    for word in BLACKLIST_OBVIOUS_NON_TECH:
        if not has_word(title_lower, word):
            continue

        if any(term in title_lower for term in STRONG_TECH_TITLE_TERMS):
            if any(term in title_lower for term in PHYSICAL_ENGINEERING_TERMS):
                return f"Blacklisted ({word}) + physical engineering"
            continue

        return f"Blacklisted ({word})"

    return ""


def is_technical_job(title_lower, full_text, skills):
    full_text_lower = full_text.lower()
    title_tech = has_any_word(title_lower, WHITELIST_TECH_TITLES)
    skills_tech = any(is_true_technical_skill(skill, full_text) for skill in skills)
    desc_tech = has_any_word(full_text_lower, TECH_KEYWORDS)

    return title_tech or skills_tech or desc_tech

# ==========================================================
# LOAD JOBS
# ==========================================================

def load_jobs(limit=200):
    print("=" * 70)
    print("RecruitIQ Job Loader")
    print("=" * 70)

    print("Loading CSV...")
    df = pd.read_csv(JOB_FILE, nrows=limit)

    jobs = []
    kept_titles = []
    skipped_titles = []
    skip_reasons = Counter()
    skills_lengths = []

    start = time.time()
    total = len(df)

    for index, row in df.iterrows():
        title = str(row.get("title", "")).strip()
        title_lower = title.lower()
        description = str(row.get("description", ""))
        skills_desc = str(row.get("skills_desc", ""))
        full_text = description + "\n" + skills_desc

        skip_reason = get_blacklist_reason(title_lower)
        if skip_reason:
            skipped_titles.append(title)
            skip_reasons[skip_reason] += 1
            continue

        try:
            parser = JobDescriptionParser(full_text)
            job_json = parser.extract_all()

            if is_technical_job(title_lower, full_text, job_json.get("skills", [])):
                job_json["title"] = str(title).strip()
                job_json["job_id"] = int(row["job_id"])
                job_json["company"] = str(row.get("company_name", ""))
                job_json["location"] = str(row.get("location", ""))
                job_json["work_type"] = str(row.get("formatted_work_type", ""))
                job_json["experience_level"] = str(row.get("formatted_experience_level", ""))

                jobs.append(job_json)
                kept_titles.append(title)
                skills_lengths.append(len(job_json.get("skills", [])))
            else:
                skipped_titles.append(title)
                skip_reasons["No Technical Signals"] += 1

        except Exception as e:
            skipped_titles.append(title)
            skip_reasons["Parser Exception"] += 1
            print(f"Error parsing job ID {row.get('job_id')}: {e}")

    end = time.time()

    print("\n" + "=" * 70)
    print("Job Loading Statistics")
    print("=" * 70)
    print(f"Jobs loaded             : {len(jobs)}")
    print(f"Jobs skipped            : {total - len(jobs)}")
    
    print("\nReasons for skipping:")
    for reason, count in skip_reasons.most_common():
        print(f"  - {reason}: {count}")
        
    print("\nTop detected technical titles:")
    title_counts = Counter(kept_titles)
    for title_name, count in title_counts.most_common(10):
        print(f"  - {title_name}: {count}")
        
    print("\nTop skipped titles:")
    skipped_counts = Counter(skipped_titles)
    for title_name, count in skipped_counts.most_common(10):
        print(f"  - {title_name}: {count}")
        
    avg_skills = sum(skills_lengths) / len(skills_lengths) if skills_lengths else 0.0
    print(f"\nAverage skills per job  : {avg_skills:.2f}")
    print("=" * 70)
    print(f"Time Taken              : {round(end - start, 2)} sec")

    return jobs

# ==========================================================
# SAVE JSON
# ==========================================================

def save_jobs(jobs):
    with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
        json.dump(jobs, file, indent=4, ensure_ascii=False)
    print(f"\nSaved to\n{OUTPUT_FILE}")

# ==========================================================
# PUBLIC
# ==========================================================

def build_job_dataset(limit=200):
    jobs = load_jobs(limit)
    save_jobs(jobs)
    return jobs

# ==========================================================
# MAIN
# ==========================================================

if __name__ == "__main__":
    jobs = build_job_dataset(limit=200)
    print("\n")
    print("=" * 70)
    print(f"Parsed Jobs : {len(jobs)}")
    print("=" * 70)

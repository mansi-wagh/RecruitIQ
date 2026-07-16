import re
from typing import Any, Dict, Iterable, List, Set

from app.services.matching_engine import MatchingEngine
from app.services.skill_normalizer import SkillNormalizer


class FeatureExtractor:
    """Computes ML features that must match dataset generation exactly."""

    STOP_WORDS = {
        "a",
        "an",
        "and",
        "are",
        "as",
        "at",
        "be",
        "by",
        "for",
        "from",
        "has",
        "have",
        "in",
        "is",
        "it",
        "of",
        "on",
        "or",
        "our",
        "that",
        "the",
        "their",
        "this",
        "to",
        "we",
        "with",
        "you",
        "your",
        "job",
        "role",
        "work",
        "team",
        "company",
        "description",
        "candidate",
        "applicant",
        "experience",
        "skills",
        "required",
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

    TECH_KEYWORDS = [
        "python",
        "java",
        "javascript",
        "c#",
        "c++",
        "golang",
        "ruby",
        "php",
        "rust",
        "typescript",
        "swift",
        "kotlin",
        "scala",
        "react",
        "angular",
        "vue",
        "node",
        "django",
        "flask",
        "spring",
        "dotnet",
        "fastapi",
        "aws",
        "azure",
        "gcp",
        "docker",
        "kubernetes",
        "linux",
        "git",
        "sql",
        "nosql",
        "mongodb",
        "postgres",
        "mysql",
        "oracle",
        "machine learning",
        "deep learning",
        "nlp",
        "tensorflow",
        "pytorch",
        "scikit-learn",
        "keras",
        "spark",
        "hadoop",
        "pandas",
        "numpy",
        "agile",
        "scrum",
        "ci/cd",
        "devops",
        "cloud",
        "security",
        "network",
        "api",
        "rest",
        "graphql",
        "microservices",
    ]

    BLACKLIST_OBVIOUS_NON_TECH = [
        "bookkeeper",
        "bookkeeping",
        "cpa",
        "accountant",
        "accounting",
        "tax",
        "payroll",
        "auditor",
        "billing",
        "controller",
        "nurse",
        "nursing",
        "doctor",
        "physician",
        "therapist",
        "counselor",
        "clinical",
        "patient care",
        "medical",
        "dentist",
        "dental",
        "pharmacy",
        "pharmacist",
        "veterinarian",
        "clinic",
        "healthcare",
        "pediatric",
        "hospital",
        "receptionist",
        "administrative assistant",
        "admin assistant",
        "secretary",
        "office assistant",
        "clerk",
        "sales executive",
        "sales coordinator",
        "sales representative",
        "sales associate",
        "retail",
        "cashier",
        "teller",
        "merchandising",
        "broker",
        "agent",
        "marketing coordinator",
        "marketing specialist",
        "marketing manager",
        "brand ambassador",
        "lawyer",
        "attorney",
        "paralegal",
        "legal",
        "litigation",
        "chef",
        "cook",
        "kitchen",
        "bartender",
        "server",
        "waiter",
        "waitress",
        "food",
        "restaurant",
        "barista",
        "teacher",
        "tutor",
        "daycare",
        "nanny",
        "babysitter",
        "educator",
        "academic",
        "professor",
        "school",
        "construction worker",
        "laborer",
        "general labor",
        "mover",
        "junk hauler",
        "driver",
        "warehouse worker",
        "forklift",
        "painter",
        "plumber",
        "hvac",
        "electrician",
        "mechanic",
        "carpenter",
        "worship",
        "pastor",
        "church",
        "worship leader",
        "coach",
        "fitness",
        "salon",
        "barber",
        "stylist",
        "esthetician",
    ]

    WHITELIST_TECH_TITLES = [
        "software",
        "developer",
        "engineer",
        "programmer",
        "coding",
        "web",
        "backend",
        "frontend",
        "fullstack",
        "full-stack",
        "devops",
        "cloud",
        "sre",
        "platform",
        "infrastructure",
        "data",
        "ml",
        "ai",
        "machine learning",
        "artificial intelligence",
        "deep learning",
        "nlp",
        "computer vision",
        "analytics",
        "bi",
        "sql",
        "database",
        "dba",
        "it",
        "information technology",
        "system",
        "systems",
        "network",
        "cybersecurity",
        "cyber",
        "security",
        "computer",
        "computational",
        "computing",
        "scrum",
        "agile",
        "product manager",
        "product owner",
        "architect",
        "tech",
        "technology",
        "qa",
        "quality assurance",
        "tester",
        "testing",
        "analyst",
        "solution architect",
        "sde",
        "mobile developer",
    ]

    NON_TECH_SKILLS = {
        "communication",
        "leadership",
        "management",
        "teamwork",
        "organization",
        "writing",
        "speaking",
        "english",
        "presentation",
        "customer service",
        "sales",
        "retail",
        "marketing",
        "finance",
        "legal",
        "health",
        "make",
        "go",
        "move",
        "less",
        "time management",
        "problem solving",
        "critical thinking",
        "attention to detail",
        "work ethic",
        "collaboration",
        "adaptability",
        "active listening",
        "negotiation",
        "conflict resolution",
        "decision making",
        "interpersonal",
        "creativity",
        "flexibility",
        "patience",
        "empathy",
        "coaching",
        "business",
        "planning",
        "scheduling",
        "microsoft office",
        "excel",
        "word",
        "powerpoint",
        "office",
        "outlook",
    }

    FALSE_POSITIVE_SKILL_INDICATORS = {
        "amazon neptune": ["neptune"],
        "apache solr": ["solr"],
        "cri-o": ["cri-o"],
        "model evaluation": ["model evaluation", "evaluation metric"],
        "ios sdk": ["ios sdk", "ios-sdk"],
        "reverse engineering": [
            "reverse engineering",
            "reverse engineer",
            "disassembly",
            "ghidra",
            "ida pro",
        ],
        "automated testing": [
            "automated testing",
            "test automation",
            "selenium",
            "cypress",
            "junit",
            "pytest",
        ],
        "integration testing": ["integration testing", "integration test"],
        "exploratory testing": ["exploratory testing", "exploratory test"],
        "branching strategy": ["branching strategy", "git branch", "git flow"],
    }

    STRONG_TECH_TITLE_TERMS = ["software", "developer", "engineer", "sde", "architect", "programmer"]
    PHYSICAL_ENGINEERING_TERMS = ["building", "hvac", "maintenance", "civil", "structural", "mechanical"]

    WHITELIST_TECH_TITLES_SET = set(WHITELIST_TECH_TITLES)

    def __init__(self):
        self._normalizer = SkillNormalizer()

    @staticmethod
    def _clean_text(value: Any) -> str:
        if value is None:
            return ""
        text = str(value).strip()
        if text.lower() in {"", "nan", "none", "null"}:
            return ""
        return re.sub(r"\s+", " ", text)

    @classmethod
    def _clean_list(cls, value: Any) -> List[str]:
        if value is None:
            return []
        values = value if isinstance(value, list) else [value]
        cleaned: List[str] = []
        for item in values:
            text = cls._clean_text(item)
            if text:
                cleaned.append(text)
        return cleaned

    @staticmethod
    def _safe_ratio(numerator: float, denominator: float, default: float = 0.0) -> float:
        if denominator == 0:
            return default
        return numerator / denominator

    @classmethod
    def tokenize(cls, text: Any) -> Set[str]:
        cleaned = cls._clean_text(text).lower()
        tokens = re.findall(r"[a-z0-9][a-z0-9+#.\-]*", cleaned)
        return {
            token
            for token in tokens
            if token not in cls.STOP_WORDS and (len(token) > 2 or token in {"c", "r"})
        }

    @staticmethod
    def jaccard(left: Set[str], right: Set[str]) -> float:
        if not left or not right:
            return 0.0
        return len(left & right) / len(left | right)

    @classmethod
    def education_rank(cls, value: Iterable[Any]) -> int:
        text = " ".join(cls._clean_list(value)).lower()
        rank = 0
        for keyword, score in cls.EDUCATION_RANKS.items():
            if keyword in text:
                rank = max(rank, score)
        return rank

    @classmethod
    def experience_years(cls, value: Any) -> int:
        text = " ".join(cls._clean_list(value)).lower()
        matches = re.findall(r"(\d+)\+?\s*(?:year|yr)", text)
        if not matches:
            return 0
        return max(int(match) for match in matches)

    @classmethod
    def _has_word(cls, text: str, word: str) -> bool:
        return re.search(r"\b" + re.escape(word) + r"\b", text) is not None

    @classmethod
    def _has_any_word(cls, text: str, words: Iterable[str]) -> bool:
        return any(cls._has_word(text, word) for word in words)

    @classmethod
    def _is_technical_job(cls, title: str, description: str, skills_desc: str, skills_list=None) -> bool:
        title = str(title or "").lower().strip()
        description = str(description or "").lower().strip()
        skills_desc = str(skills_desc or "").lower().strip()
        full_text = description + " " + skills_desc

        if not title:
            return False

        for word in cls.BLACKLIST_OBVIOUS_NON_TECH:
            if cls._has_word(title, word):
                if any(term in title for term in cls.STRONG_TECH_TITLE_TERMS):
                    if any(term in title for term in cls.PHYSICAL_ENGINEERING_TERMS):
                        return False
                    continue
                return False

        title_tech = cls._has_any_word(title, cls.WHITELIST_TECH_TITLES)
        skills_tech = any(
            cls._is_true_technical_skill(s, full_text) for s in skills_list
        ) if skills_list is not None else False
        desc_tech = cls._has_any_word(full_text, cls.TECH_KEYWORDS)

        return title_tech or skills_tech or desc_tech

    @classmethod
    def _is_true_technical_skill(cls, skill: str, text: str) -> bool:
        skill_lower = skill.lower()
        text_lower = text.lower()

        if skill_lower in cls.NON_TECH_SKILLS:
            return False

        if skill_lower in cls.FALSE_POSITIVE_SKILL_INDICATORS:
            indicators = cls.FALSE_POSITIVE_SKILL_INDICATORS[skill_lower]
            return any(indicator in text_lower for indicator in indicators)

        return True

    @classmethod
    def calculate_technical_job_score(cls, title: Any, description: Any, skills_desc: Any) -> float:
        title = str(title or "").lower().strip()
        description = str(description or "").lower().strip()
        skills_desc = str(skills_desc or "").lower().strip()
        combined = title + " " + description + " " + skills_desc

        matches = sum(1 for keyword in cls.TECH_KEYWORDS if cls._has_word(combined, keyword))
        title_matches = sum(1 for keyword in cls.WHITELIST_TECH_TITLES if cls._has_word(title, keyword))

        score = (matches * 8) + (title_matches * 20)
        return float(min(100.0, score))

    def _normalize_skills_for_profile(self, skills: Any) -> Set[str]:
        normalized = self._normalizer.normalize_list(self._clean_list(skills))
        return {skill.lower().strip() for skill in normalized if self._clean_text(skill)}

    @classmethod
    def _first_experience_title(cls, resume: Dict[str, Any]) -> str:
        for item in cls._clean_list(resume.get("experience", [])):
            tokens = cls.tokenize(item)
            if tokens:
                return item[:160]
        return ""

    def make_resume_profile(self, resume: Dict[str, Any]) -> Dict[str, Any]:
        name = self._clean_text(resume.get("resume_name")) or "resume"

        personal_info = resume.get("personal_info") or {}

        headline = self._first_experience_title(resume)

        if not headline:
            headline = self._clean_text(
                personal_info.get("name")
    )

        keyword_text = " ".join(
            self._clean_list(resume.get("skills", []))
            + self._clean_list(resume.get("education", []))
            + self._clean_list(resume.get("experience", []))[:8]
            + self._clean_list(resume.get("projects", []))
            + self._clean_list(resume.get("certifications", []))[:8]
        )

        return {
            "id": name,

            "record": resume,
            "skills": self._normalize_skills_for_profile(resume.get("skills", [])),
            "title_tokens": self.tokenize(headline),
            "keyword_tokens": set(sorted(self.tokenize(keyword_text))[:120]),
            "education_rank": self.education_rank(resume.get("education", [])),
            "experience_years": self.experience_years(resume.get("experience", [])),
            "projects_text": " ".join(self._clean_list(resume.get("projects", []))).lower(),
        }

    def make_job_profile(self, job: Dict[str, Any]) -> Dict[str, Any]:
        job_id = self._clean_text(job.get("job_id")) or "job"
        title = self._clean_text(job.get("title"))

        description = self._clean_text(job.get("description"))
        skills_desc = " ".join(
            self._clean_list(
                job.get("skills")
    )
)


        keyword_text = " ".join(
            [title[:600], self._clean_text(job.get("experience")), description]
            + self._clean_list(job.get("skills", []))
            + self._clean_list(job.get("education", []))
        )

        return {

            "id": job_id,
            "record": job,
            "title": title,
            "description": description,
            "skills_desc": skills_desc,
            "skills": self._normalize_skills_for_profile(job.get("skills", [])),
            "title_tokens": self.tokenize(title[:220]),
            "keyword_tokens": set(sorted(self.tokenize(keyword_text))[:120]),
            "education_rank": self.education_rank(job.get("education", [])),
            "experience_years": self.experience_years(job.get("experience", "")),
        }

    def retrieval_features(self, resume_profile: Dict[str, Any], job_profile: Dict[str, Any]) -> Dict[str, Any]:
        skill_overlap = len(resume_profile["skills"] & job_profile["skills"])
        skill_overlap_ratio = self._safe_ratio(skill_overlap, len(job_profile["skills"]))

        title_similarity = self.jaccard(resume_profile["title_tokens"], job_profile["title_tokens"])
        keyword_similarity = self.jaccard(resume_profile["keyword_tokens"], job_profile["keyword_tokens"])

        edu_compat = self._education_compatibility(resume_profile["education_rank"], job_profile["education_rank"])
        exp_compat = self._experience_compatibility(resume_profile["experience_years"], job_profile["experience_years"])

        resume_projects_text = resume_profile["projects_text"]
        matched_project_skills = [
            skill
            for skill in job_profile["skills"]
            if skill.lower() in resume_projects_text
        ]
        project_similarity = self._safe_ratio(len(matched_project_skills), len(job_profile["skills"]))

        return {
            "skill_overlap": float(skill_overlap),
            "skill_overlap_ratio": skill_overlap_ratio,
            "title_similarity": title_similarity,
            "education_compatibility": edu_compat,
            "experience_compatibility": exp_compat,
            "project_similarity": project_similarity,
            "keyword_similarity": keyword_similarity,
        }

    @staticmethod
    def _education_compatibility(resume_rank: int, job_rank: int) -> float:
        if job_rank == 0:
            return 1.0
        if resume_rank >= job_rank:
            return 1.0
        return resume_rank / job_rank if job_rank else 1.0

    @staticmethod
    def _experience_compatibility(resume_years: int, job_years: int) -> float:
        if job_years == 0:
            return 1.0
        return min(resume_years / job_years, 1.0)

    def weighted_retrieval_score(self, resume_profile: Dict[str, Any], job_profile: Dict[str, Any]) -> float:
        features = self.retrieval_features(resume_profile, job_profile)
        return (
            features["skill_overlap_ratio"] * 0.30
            + features["title_similarity"] * 0.20
            + features["education_compatibility"] * 0.15
            + features["experience_compatibility"] * 0.15
            + features["project_similarity"] * 0.15
            + features["keyword_similarity"] * 0.05
        )

    def extract(self, resume: Dict[str, Any], job: Dict[str, Any], precomputed_match: Dict[str, Any] = None) -> Dict[str, Any]:
        if precomputed_match is not None:
            match = precomputed_match
        else:
            engine = MatchingEngine(resume, job)
            match = engine.match()

        matched_skills = match.get("matched_skills", [])
        missing_skills = match.get("missing_skills", [])

        matched_skill_count = len(matched_skills)
        missing_skill_count = len(missing_skills)
        resume_skill_count = len(resume.get("skills", []))
        job_skill_count = len(job.get("skills", []))

        resume_profile = self.make_resume_profile(resume)
        job_profile = self.make_job_profile(job)


        retrieval = self.retrieval_features(resume_profile, job_profile)
        retrieval_score = round(self.weighted_retrieval_score(resume_profile, job_profile), 4)

        # Label-style compatibility gaps (must match dataset creation)
        experience_gap = max(job_profile["experience_years"] - resume_profile["experience_years"], 0)
        education_gap = max(job_profile["education_rank"] - resume_profile["education_rank"], 0)

        # Use MatchingEngine evidence counts
        project_match_count = len(match.get("matched_project_skills", []))
        certification_match_count = len(match.get("matched_certifications", []))

        features = {
            "matched_skill_count": matched_skill_count,
            "missing_skill_count": missing_skill_count,
            "resume_skill_count": resume_skill_count,
            "job_skill_count": job_skill_count,
            "skill_overlap_ratio": round(retrieval["skill_overlap_ratio"], 4),
            "experience_gap": experience_gap,
            "education_gap": education_gap,
            "project_match_count": project_match_count,
            "certification_match_count": certification_match_count,
            "retrieval_score": retrieval_score,
            "title_similarity": round(retrieval["title_similarity"], 4),
            "keyword_similarity": round(retrieval["keyword_similarity"], 4),
            "technical_job_score": self.calculate_technical_job_score(
                job_profile["title"],
                job_profile["description"],
                job_profile["skills_desc"],
            ),
        }

        return features


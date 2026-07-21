import re
import pandas as pd
from pathlib import Path


class ResumeExtractor:

    _skills_cache = None

    # Section header keywords mapped to section names
    SECTION_HEADERS = {
        "experience": [
            "experience", "work experience", "professional experience",
            "work history", "employment history", "employment",
            "career history", "internship", "internships",
        ],
        "education": [
            "education", "academic background", "academic qualifications",
            "qualifications", "academic details", "educational background",
            "educational qualifications",
        ],
        "skills": [
            "skills", "technical skills", "key skills", "core competencies",
            "competencies", "technologies", "tech stack",
            "tools & technologies", "tools and technologies",
            "programming skills", "professional skills", "tools",
        ],
        "projects": [
            "projects", "academic projects", "personal projects",
            "key projects", "major projects", "project work",
            "project experience",
        ],
        "certifications": [
            "certifications", "certification", "certificates",
            "professional certifications", "licenses & certifications",
            "licenses and certifications",
        ],
        "summary": [
            "summary", "objective", "career objective",
            "professional summary", "profile", "about me", "about",
        ],
        "achievements": [
            "achievements", "awards", "honors", "accomplishments",
            "awards & achievements", "awards and achievements",
            "hackathons", "competitions", "positions of responsibility",
            "positions of responsibility & achievements", "leadership",
            "extra-curricular", "extracurricular", "extracurricular activities",
            "co-curricular", "co curricular", "cocurricular",
            "volunteering", "volunteer experience",
        ],
        "interests": [
            "interests", "hobbies", "hobbies & interests",
        ],
        "references": [
            "references",
        ],
        "languages": [
            "languages",
        ],
        "contact": [
            "contact", "contact info", "contact information",
            "contact details", "personal details", "personal information",
        ],
    }

    def __init__(self, text):
        self.text = text
        self.lines = [
            line.strip()
            for line in text.split("\n")
            if line.strip()
        ]
        self._sections = self._detect_sections()

    # -------------------------

    def _detect_sections(self):
        """Split resume lines into sections based on header keywords."""
        # Flat lookup: variant_text -> section_name
        all_variants = {}
        for section_name, variants in self.SECTION_HEADERS.items():
            for v in variants:
                all_variants[v] = section_name

        sections = {}
        current_section = "header"
        sections[current_section] = []

        for line in self.lines:
            # Clean decorative characters
            cleaned = re.sub(r'[:\-–—|•=*#_~]', '', line).strip()
            # Remove leading numbers like "1. Education"
            cleaned = re.sub(r'^\d+[.\)]\s*', '', cleaned).strip()
            lower = cleaned.lower()

            # Match section header
            matched_section = None
            if len(cleaned) < 60:
                # Exact match first
                if lower in all_variants:
                    matched_section = all_variants[lower]
                else:
                    # Fallback: startswith match (e.g. "PROJECTS Nashik")
                    for variant, section_name in all_variants.items():
                        if len(variant) >= 4 and lower.startswith(variant) and (
                            len(lower) == len(variant)
                            or not lower[len(variant)].isalpha()
                        ):
                            matched_section = section_name
                            break

            if matched_section is not None:
                current_section = matched_section
                if current_section not in sections:
                    sections[current_section] = []
            else:
                sections.setdefault(current_section, []).append(line)

        return sections

    # -------------------------

    @staticmethod
    def _clean_section_lines(lines):
        """Remove noise lines (emails, phone numbers, leaked headers) from section content."""
        noise_headers = {
            "contact", "contact info", "contact information",
            "linkedin", "github", "portfolio", "website",
        }
        cleaned = []
        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue
            lower = stripped.lower()

            # Skip email-only lines
            if re.fullmatch(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', stripped):
                continue

            # Skip phone-only lines
            digits = re.sub(r'\D', '', stripped)
            if len(stripped) < 20 and 10 <= len(digits) <= 13 and len(digits) > len(stripped) * 0.5:
                continue

            # Skip leaked header words
            cleaned_lower = re.sub(r'[:\-–—|•=*#_~]', '', lower).strip()
            if cleaned_lower in noise_headers:
                continue

            cleaned.append(stripped)
        return cleaned

    # -------------------------

    def extract_name(self):
        email = self.extract_email()
        email_prefix = email.split("@")[0].lower() if email else ""

        blacklist = {
            "ranked", "top", "teams", "team", "sunhacks", "hackathon", "qualified", "phase",
            "mastermind", "competition", "ambassador", "volunteer", "intern", "developer",
            "engineer", "student", "experience", "education", "projects", "skills",
            "certifications", "achievements", "summary", "contact", "profile", "curriculum",
            "vitae", "resume", "university", "college", "institute", "school", "department",
            "hackeramp", "codeclash", "smart", "india", "techfest", "fair", "international",
            "audit", "research", "foundation", "hsc", "class", "percentage", "cgpa",
            "b.tech", "btech", "mtech", "bachelor", "master", "diploma", "associate",
            "lead", "manager", "leadsutra", "genoscope", "skills:", "tech:"
        }

        candidates = []

        for index, line in enumerate(self.lines[:35]):
            cleaned = re.sub(r'[^a-zA-Z\s.-]', '', line).strip()
            words = cleaned.split()

            if 2 <= len(words) <= 4:
                lower_words = [w.lower() for w in words]

                # Skip blacklisted words
                if any(w in blacklist for w in lower_words):
                    continue

                # Skip lines with numbers, emails, URLs
                if re.search(r'[\d@+:/|\\]', line):
                    continue

                # Skip long lines
                if len(line) > 45:
                    continue

                score = 10 - index

                if line.isupper():
                    score += 15
                elif all(w[0].isupper() for w in words if len(w) > 0):
                    score += 10

                if email_prefix:
                    matched = sum(1 for w in lower_words if w in email_prefix or (len(w) >= 3 and w in email_prefix))
                    score += matched * 20

                candidates.append((score, line))

        if candidates:
            candidates.sort(key=lambda x: x[0], reverse=True)
            return candidates[0][1]

        for line in self.lines[:20]:
            cleaned = re.sub(r'[^a-zA-Z\s]', '', line).strip()
            words = cleaned.split()
            if 2 <= len(words) <= 4 and not re.search(r'[\d@+:/|\\]', line):
                if not any(w.lower() in blacklist for w in words):
                    return line
        return ""

    # -------------------------

    def extract_email(self):
        pattern = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
        match = re.search(pattern, self.text)
        return match.group() if match else ""

    # -------------------------

    def extract_phone(self):
        patterns = [
            r"(?:\+?\d{1,3}[\s\-\.]*)?\(?\d{2,5}\)?[\s\-\.]*\d{3,5}[\s\-\.]*\d{3,5}\b",
            r"\+?\d{1,3}[\s\-\.]*\d{10}\b",
            r"\b\d{10,12}\b",
        ]
        for pattern in patterns:
            match = re.search(pattern, self.text)
            if match:
                phone = match.group().strip()
                digits = re.sub(r"\D", "", phone)
                if 10 <= len(digits) <= 13:
                    return phone
        return ""

    # -------------------------

    def extract_skills(self):
        if ResumeExtractor._skills_cache is None:
            skills_file = (
                Path(__file__).resolve().parent.parent
                / "data"
                / "skills.csv"
            )
            skills_df = pd.read_csv(skills_file)
            ResumeExtractor._skills_cache = skills_df["canonical"].dropna().tolist()

        skill_list = ResumeExtractor._skills_cache
        found = []

        lower_text = self.text.lower()

        for skill in skill_list:
            pattern = r"\b" + re.escape(skill.lower()) + r"\b"
            if re.search(pattern, lower_text):
                    found.append(skill)

        return sorted(list(set(found)))

    # -------------------------

    def extract_education(self):
        # Section-based detection
        section_lines = self._sections.get("education", [])
        if section_lines:
            return self._clean_section_lines(section_lines)

        # Fallback: keyword matching
        education = []
        keywords = [
            "b.tech", "b.e", "m.tech", "bachelor", "master", "degree",
            "cgpa", "gpa", "bsc", "b.sc", "mba", "b.a", "m.s", "m.sc",
            "mca", "bca", "associate", "high school", "diploma", "phd",
            "doctorate", "university", "college", "institute",
        ]

        for line in self.lines:
            for keyword in keywords:
                if keyword in line.lower():
                    education.append(line)
                    break

        return self._clean_section_lines(education)

    # -------------------------

    def extract_experience(self):
        # Section-based detection
        section_lines = self._sections.get("experience", [])
        if section_lines:
            return self._clean_section_lines(section_lines)

        # Fallback: trigger-based logic
        experience = []
        capture = False
        stop_words = [
            "projects", "education", "technical skills", "certifications",
            "skills", "achievements", "awards", "interests", "hobbies",
            "references", "languages",
        ]

        for line in self.lines:
            lower = line.lower()
            if "internship" in lower or "experience" in lower:
                capture = True
                continue
            if capture:
                if any(word in lower for word in stop_words):
                    break
                experience.append(line)

        return self._clean_section_lines(experience)

    # -------------------------

    def extract_projects(self):
        # Section-based detection
        section_lines = self._sections.get("projects", [])
        if section_lines:
            return self._clean_section_lines(section_lines)

        # Fallback: trigger-based logic
        projects = []
        capture = False
        stop_words = [
            "certifications", "achievements", "education",
            "skills", "experience", "awards", "interests",
            "hobbies", "references", "languages",
        ]

        for line in self.lines:
            lower = line.lower()
            if "project" in lower:
                capture = True
                continue
            if capture:
                if any(word in lower for word in stop_words):
                    break
                projects.append(line)

        return self._clean_section_lines(projects)

    # -------------------------

    def extract_certifications(self):
        # Section-based detection
        section_lines = self._sections.get("certifications", [])
        if section_lines:
            return self._clean_section_lines(section_lines)

        # Fallback: trigger-based logic
        certifications = []
        capture = False
        stop_words = [
            "projects", "achievements", "education",
            "skills", "experience", "awards", "interests",
            "hobbies", "references", "languages",
        ]

        for line in self.lines:
            lower = line.lower()
            if "certification" in lower:
                capture = True
                continue
            if capture:
                if any(word in lower for word in stop_words):
                    break
                certifications.append(line)

        return self._clean_section_lines(certifications)

    # -------------------------

    def extract_all(self):
        return {
            "personal_info": {
                "name": self.extract_name(),
                "email": self.extract_email(),
                "phone": self.extract_phone()
            },
            "skills": self.extract_skills(),
            "education": self.extract_education(),
            "experience": self.extract_experience(),
            "projects": self.extract_projects(),
            "certifications": self.extract_certifications()
        }
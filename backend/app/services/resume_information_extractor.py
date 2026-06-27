import re
import pandas as pd


class ResumeExtractor:

    def __init__(self, text):

        self.text = text

        self.lines = [

            line.strip()

            for line in text.split("\n")

            if line.strip()

        ]

    # -------------------------

    def extract_name(self):

        for line in self.lines:

            if len(line.split()) >= 2:

                return line

        return ""

    # -------------------------

    def extract_email(self):

        pattern = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"

        match = re.search(pattern, self.text)

        return match.group() if match else ""

    # -------------------------

    def extract_phone(self):

        pattern = r"\b\d{10}\b"

        match = re.search(pattern, self.text)

        return match.group() if match else ""

    # -------------------------

    def extract_skills(self):

        skills_df = pd.read_csv(

            "app/data/skills.csv"

        )

        skill_list = skills_df["skill"].dropna().tolist()

        found = []

        lower_text = self.text.lower()

        for skill in skill_list:

            if skill.lower() in lower_text:

                found.append(skill)

        return sorted(list(set(found)))

    # -------------------------

    def extract_education(self):

        education = []

        keywords = [

            "b.tech",

            "b.e",

            "m.tech",

            "bachelor",

            "master",

            "degree",

            "cgpa"

        ]

        for line in self.lines:

            for keyword in keywords:

                if keyword in line.lower():

                    education.append(line)

                    break

        return education

    # -------------------------

    def extract_experience(self):

        experience = []

        capture = False

        stop_words = [

            "projects",

            "education",

            "technical skills",

            "certifications"

        ]

        for line in self.lines:

            lower = line.lower()

            if "internship" in lower or "experience" in lower:

                capture = True

                continue

            if capture:

                if any(

                    word in lower

                    for word in stop_words

                ):

                    break

                experience.append(line)

        return experience

    # -------------------------

    def extract_projects(self):

        projects = []

        capture = False

        stop_words = [

            "certifications",

            "achievements",

            "education"

        ]

        for line in self.lines:

            lower = line.lower()

            if "project" in lower:

                capture = True

                continue

            if capture:

                if any(

                    word in lower

                    for word in stop_words

                ):

                    break

                projects.append(line)

        return projects

    # -------------------------

    def extract_certifications(self):

        certifications = []

        capture = False

        stop_words = [

            "projects",

            "achievements"

        ]

        for line in self.lines:

            lower = line.lower()

            if "certification" in lower:

                capture = True

                continue

            if capture:

                if any(

                    word in lower

                    for word in stop_words

                ):

                    break

                certifications.append(line)

        return certifications

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
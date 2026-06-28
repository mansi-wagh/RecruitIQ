import re

from app.services.skill_normalizer import SkillNormalizer


class JobDescriptionParser:

    def __init__(self, text):

        self.text = text if text else ""
        self.lower_text = self.text.lower()

        self.normalizer = SkillNormalizer()

    # ----------------------------------------

    def extract_title(self):

        for line in self.text.split("\n"):

            line = line.strip()

            if line:

                return line

        return ""

    # ----------------------------------------

    def extract_skills(self):

        found = set()

        for alias, info in self.normalizer._skill_map.items():

            pattern = r"\b" + re.escape(alias) + r"\b"

            if re.search(pattern, self.lower_text):

                found.add(info["canonical"])

        return sorted(found)

    # ----------------------------------------

    def extract_education(self):

        keywords = [

            "b.tech",
            "b.e",
            "bachelor",
            "master",
            "m.tech",
            "phd",
            "degree"

        ]

        education = []

        for word in keywords:

            if word in self.lower_text:

                education.append(word)

        return list(set(education))

    # ----------------------------------------

    def extract_experience(self):

        pattern = r"\d+\+?\s*(?:years?|yrs?)"

        match = re.search(pattern, self.lower_text)

        if match:

            return match.group()

        return ""

    # ----------------------------------------

    def extract_all(self):

        return {

            "title": self.extract_title(),

            "skills": self.extract_skills(),

            "education": self.extract_education(),

            "experience": self.extract_experience()

        }
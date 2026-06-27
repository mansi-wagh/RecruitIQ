import re
import pandas as pd


class JobDescriptionParser:

    def __init__(self, text):

        self.text = text

        self.lower_text = text.lower()

    def extract_title(self):

        lines = self.text.split("\n")

        for line in lines:

            if line.strip():

                return line.strip()

        return ""

    def extract_skills(self):

        df = pd.read_csv("app/data/skills.csv")

        skills = df["skill"].dropna().tolist()

        result = []

        for skill in skills:

            if skill.lower() in self.lower_text:

                result.append(skill)

        return sorted(list(set(result)))

    def extract_education(self):

        education = []

        keywords = [

            "b.tech",

            "bachelor",

            "master",

            "degree",

            "m.tech"

        ]

        for keyword in keywords:

            if keyword in self.lower_text:

                education.append(keyword)

        return education

    def extract_experience(self):

        pattern = r"\d+\+?\s*years?"

        match = re.search(

            pattern,

            self.lower_text

        )

        if match:

            return match.group()

        return ""

    def extract_all(self):

        return {

            "title": self.extract_title(),

            "skills": self.extract_skills(),

            "education": self.extract_education(),

            "experience": self.extract_experience()

        }
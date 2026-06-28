import re
from pathlib import Path

import pandas as pd


class SkillNormalizer:

    _skill_map = None

    def __init__(self):

        if SkillNormalizer._skill_map is None:
            SkillNormalizer._skill_map = self._load_skills()

    # --------------------------------------------------

    def _load_skills(self):

        skill_map = {}

        project_root = Path(__file__).resolve().parents[3]

        skills_file = (
            project_root
            / "dataset"
            / "skills"
            / "skills.csv"
        )

        print(f"Loading skills from: {skills_file}")

        df = pd.read_csv(skills_file)

        for _, row in df.iterrows():

            category = str(row["category"]).strip()

            canonical = str(row["canonical"]).strip()

            aliases = str(row["aliases"]).strip()

            if canonical == "" or canonical.lower() == "nan":
                continue

            skill_map[canonical.lower()] = {
                "canonical": canonical,
                "category": category
            }

            if aliases and aliases.lower() != "nan":

                for alias in aliases.split(","):

                    alias = alias.strip().lower()

                    if alias:

                        skill_map[alias] = {
                            "canonical": canonical,
                            "category": category
                        }

        print(f"Loaded {len(skill_map)} skill aliases")

        return skill_map

    # --------------------------------------------------

    def normalize_skill(self, skill):

        if not skill:
            return ""

        skill = skill.lower().strip()

        skill = re.sub(r"\s+", " ", skill)

        result = SkillNormalizer._skill_map.get(skill)

        if result:

            return result["canonical"]

        return skill.title()

    # --------------------------------------------------

    def get_category(self, skill):

        if not skill:
            return "Unknown"

        skill = skill.lower().strip()

        skill = re.sub(r"\s+", " ", skill)

        result = SkillNormalizer._skill_map.get(skill)

        if result:

            return result["category"]

        return "Unknown"

    # --------------------------------------------------

    def normalize_list(self, skills):

        normalized = []

        seen = set()

        for skill in skills:

            canonical = self.normalize_skill(skill)

            if canonical and canonical not in seen:

                normalized.append(canonical)

                seen.add(canonical)

        return normalized

    # --------------------------------------------------

    def normalize_with_category(self, skills):

        normalized = []

        seen = set()

        for skill in skills:

            canonical = self.normalize_skill(skill)

            if canonical in seen:
                continue

            normalized.append({
                "skill": canonical,
                "category": self.get_category(skill)
            })

            seen.add(canonical)

        return normalized
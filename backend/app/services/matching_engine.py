import re

from app.services.skill_normalizer import SkillNormalizer


class MatchingEngine:

    def __init__(self, resume, job):
        self.resume = resume
        self.job = job
        self.normalizer = SkillNormalizer()

    def skill_matching(self):
        resume_skills = set(
            self.normalizer.normalize_list(
                self.resume.get("skills", [])
            )
        )

        job_skills = set(
            self.normalizer.normalize_list(
                self.job.get("skills", [])
            )
        )

        matched = list(
            resume_skills.intersection(job_skills)
        )

        missing = list(
            job_skills - resume_skills
        )

        if len(job_skills) == 0:
            score = 0
        else:
            score = round(
                len(matched) /
                len(job_skills) *
                100,
                2
            )

        return matched, missing, score

    # -----------------------------

    def education_matching(self):
        from app.services.feature_extractor import FeatureExtractor

        resume_education = " ".join(
            self.resume.get("education", [])
        ).lower()

        job_education = str(
            self.job.get("education", "")
        ).lower()

        resume_level = 0
        job_level = 0

        for key, value in FeatureExtractor.EDUCATION_RANKS.items():
            if key in resume_education:
                resume_level = max(resume_level, value)

        for key, value in FeatureExtractor.EDUCATION_RANKS.items():
            if key in job_education:
                job_level = max(job_level, value)

        if job_level == 0:
            return 100

        if resume_level >= job_level:
            return 100

        score = (
            resume_level /
            job_level
        ) * 100

        return round(score, 2)

    # -----------------------------

    def experience_matching(self):
        resume_experience = self.resume.get("experience", [])

        total_years = 0

        for exp in resume_experience:
            exp = exp.lower()
            match = re.search(r'(\d+)\+?\s*year', exp)
            if match:
                total_years += int(match.group(1))

        job_experience = str(
            self.job.get("experience", "")
        ).lower()

        job_match = re.search(
            r'(\d+)\+?\s*year',
            job_experience
        )

        if job_match:
            required_years = int(
                job_match.group(1)
            )
        else:
            required_years = 0

        if required_years == 0:
            return 100

        score = min(
            (total_years / required_years) * 100,
            100
        )

        return round(score, 2)

    # -----------------------------

    # def overall_score(self, skill, education, experience):
    #     score = (
    #         skill * 0.60 +
    #         education * 0.20 +
    #         experience * 0.20
    #     )
    #     return round(score, 2)

    # -----------------------------

    def project_matching(self):
        projects = self.resume.get("projects", [])
        project_text = " ".join(projects).lower()

        job_skills = self.normalizer.normalize_list(
            self.job.get("skills", [])
        )

        matched_projects = []

        for skill in job_skills:
            if skill.lower() in project_text:
                matched_projects.append(skill)

        if len(job_skills) == 0:
            score = 100
        else:
            score = (
                len(matched_projects)
                /
                len(job_skills)
            ) * 100

        return {
            "matched_projects": matched_projects,
            "project_score": round(score, 2)
        }

    def certification_matching(self):
        certifications = self.resume.get(
            "certifications",
            []
        )
        cert_text = " ".join(
            certifications
        ).lower()

        # Job-specific required skills and text
        job_skills = set(
            self.normalizer.normalize_list(
                self.job.get("skills", [])
            )
        )
        job_text = (
            str(self.job.get("title", "")) + " " + str(self.job.get("description", ""))
        ).lower()

        matched = set()

        # 1. Match certifications against job required skills
        for skill in job_skills:
            if skill.lower() in cert_text:
                matched.add(skill.title())

        # 2. Match certifications against standard industry certs relevant to the job or general tech
        preferred = [
            "aws", "azure", "google cloud", "gcp", "oracle", "python", "java",
            "docker", "kubernetes", "cka", "cissp", "pmp", "scrum", "terraform",
            "cisco", "ccna", "comptia"
        ]
        for cert in preferred:
            if cert in cert_text:
                matched.add(cert.upper() if len(cert) <= 4 else cert.title())

        matched_list = sorted(list(matched))

        if not certifications:
            score = 0.0
        elif matched_list:
            score = min(len(matched_list) * 25.0, 100.0)
        else:
            # Candidate has certifications listed, baseline partial match credit
            score = 50.0

        return {
            "matched_certifications": matched_list,
            "certification_score": round(score, 2)
        }

    def match(self):
        matched, missing, skill_score = self.skill_matching()
        education_score = self.education_matching()
        experience_score = self.experience_matching()
        project = self.project_matching()
        certification = self.certification_matching()

        overall = self.calculate_overall_score(
            skill_score,
            education_score,
            experience_score,
            project["project_score"],
            certification["certification_score"]
        )

        return {
            "matched_skills": matched,
            "missing_skills": missing,
            "matched_project_skills": project["matched_projects"],
            "matched_certifications": certification["matched_certifications"],
            "skill_score": skill_score,
            "education_score": education_score,
            "experience_score": experience_score,
            "project_score": project["project_score"],
            "certification_score": certification["certification_score"],
            "overall_score": overall,
            "confidence": self.confidence(overall),
            "recommendation": self.recommendation(overall)
        }

    def calculate_overall_score(
        self,
        skill,
        education,
        experience,
        project,
        certification
    ):
        overall = (
            skill * 0.45 +
            education * 0.15 +
            experience * 0.20 +
            project * 0.10 +
            certification * 0.10
        )
        return round(overall, 2)

    def recommendation(self, score):
        if score >= 90:
            return "Excellent Match"
        elif score >= 80:
            return "Highly Recommended"
        elif score >= 70:
            return "Recommended"
        elif score >= 50:
            return "Consider"
        return "Not Recommended"

    def confidence(self, score):
        if score >= 85:
            return "High"
        elif score >= 65:
            return "Medium"
        return "Low"
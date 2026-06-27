class DatasetGenerator:

    def create_record(self, resume, job, match):

        resume_skill_count = len(
            resume.get("skills", [])
        )

        job_skill_count = len(
            job.get("skills", [])
        )

        matched_skill_count = len(
            match.get("matched_skills", [])
        )

        missing_skill_count = len(
            match.get("missing_skills", [])
        )

        return {

            "resume_skill_count": resume_skill_count,

            "job_skill_count": job_skill_count,

            "matched_skill_count": matched_skill_count,

            "missing_skill_count": missing_skill_count,

            "skill_score": match.get(
                "skill_score",
                0
            ),

            "education_score": match.get(
                "education_score",
                0
            ),

            "experience_score": match.get(
                "experience_score",
                0
            ),

            "overall_score": match.get(
                "overall_score",
                0
            ),

            "label": 1 if match.get(
                "overall_score",
                0
            ) >= 80 else 0

        }
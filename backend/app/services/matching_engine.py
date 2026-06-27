class MatchingEngine:

    def __init__(self, resume, job):

        self.resume = resume

        self.job = job

    # -----------------------------

    def skill_matching(self):

        resume_skills = set(

            map(

                str.lower,

                self.resume.get("skills", [])

            )

        )

        job_skills = set(

            map(

                str.lower,

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

        resume_education = str(

            self.resume.get(

                "education",

                ""

            )

        ).lower()

        job_education = str(

            self.job.get(

                "education",

                ""

            )

        ).lower()

        if (

            "b.tech" in resume_education

            or

            "bachelor" in resume_education

        ):

            return 100

        return 50

    # -----------------------------

    def experience_matching(self):

        resume_exp = len(

            self.resume.get(

                "experience",

                []

            )

        )

        job_exp = str(

            self.job.get(

                "experience",

                ""

            )

        )

        if "2" in job_exp:

            required = 2

        elif "3" in job_exp:

            required = 3

        else:

            required = 1

        score = min(

            resume_exp /

            required *

            100,

            100

        )

        return round(score, 2)

    # -----------------------------

    def overall_score(

        self,

        skill,

        education,

        experience

    ):

        score = (

            skill * 0.60 +

            education * 0.20 +

            experience * 0.20

        )

        return round(score, 2)

    # -----------------------------

    def match(self):

       matched, missing, skill_score = self.skill_matching()

       education_score = self.education_matching()

       experience_score = self.experience_matching()

       overall_score = self.overall_score(
        skill_score,
        education_score,
        experience_score
    )

       return {

        "matched_skills": matched,

        "missing_skills": missing,

        "skill_score": skill_score,

        "education_score": education_score,

        "experience_score": experience_score,

        "overall_score": overall_score

    }

        
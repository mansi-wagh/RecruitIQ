"""
Prompt templates for RecruitIQ.
"""


def candidate_summary_prompt(
    resume: dict,
    prediction: dict,
    context: str,
) -> str:
    experience_list = resume.get("experience", [])
    projects_list = resume.get("projects", [])
    education_list = resume.get("education", [])

    return f"""
You are an experienced HR recruiter reviewing an applicant.
You must analyze the candidate's profile and output your evaluation as a structured JSON object.

==============================
COMPANY RECRUITMENT POLICIES & KNOWLEDGE
==============================
{context}

==============================
CANDIDATE PROFILE DETAILS
==============================
Name: {resume.get("personal_info", {}).get("name", "Candidate")}
Email: {resume.get("personal_info", {}).get("email", "")}
Phone: {resume.get("personal_info", {}).get("phone", "")}

Skills:
{resume.get("skills", [])}

Education Details:
{education_list}

Work Experience:
{experience_list}

Project Work:
{projects_list}

==============================
MACHINE LEARNING MATCH STATS
==============================
{prediction}

==============================
INSTRUCTIONS
==============================
You must output a JSON object matching this schema:
{{
  "candidate_summary": "Provide a brief professional paragraph summarizing their qualifications and background.",
  "strengths": ["List 2-4 key technical or professional strengths based on their experience and skills."],
  "weaknesses": ["List 1-3 gaps, weaknesses, or areas of concern compared to company expectations."],
  "hiring_recommendation": "A concise hiring verdict or decision suggestion."
}}

Do not hallucinate facts. Rely only on the profile data and company knowledge guidelines. Output only the JSON.
"""


def skill_gap_prompt(
    matched_skills,
    missing_skills,
    context,
):
    return f"""
You are an HR training coordinator mapping candidate competency gaps.
You must analyze the candidate's skills and output your analysis as a structured JSON object.

==============================
COMPANY POLICIES
==============================
{context}

==============================
CANDIDATE SKILLS
==============================
Matched Skills: {matched_skills}
Missing Skills: {missing_skills}

==============================
INSTRUCTIONS
==============================
Analyze the missing competencies and recommend an upskilling path.
You must output a JSON object matching this schema:
{{
  "strengths_analysis": "A brief overview of their solid skills.",
  "weaknesses_analysis": "A brief overview of what missing skills imply for this role.",
  "learning_roadmap": ["Step-by-step training or resource recommendations to acquire the missing skills."]
}}

Output only the JSON.
"""


def interview_questions_prompt(
    missing_skills,
    context,
):
    return f"""
You are a technical interviewer drafting questions to test a candidate on their missing skills.
You must output your questions as a structured JSON object.

==============================
COMPANY INTERVIEW GUIDE
==============================
{context}

==============================
TARGET SKILLS TO EVALUATE
==============================
{missing_skills}

==============================
INSTRUCTIONS
==============================
Generate exactly one medium-difficulty question per target skill.
You must output a JSON object matching this schema:
{{
  "questions": [
    {{
      "skill": "name of the skill",
      "question": "technical question targeting this skill"
    }}
  ]
}}

Output only the JSON.
"""


def resume_improvement_prompt(
    missing_skills,
    context,
):
    return f"""
You are a resume counselor giving recommendations on how to write a better resume.
You must output your feedback as a structured JSON object.

==============================
COMPANY RESUME GUIDELINES
==============================
{context}

==============================
CANDIDATE MISSING SKILLS
==============================
{missing_skills}

==============================
INSTRUCTIONS
==============================
Suggest concrete resume formatting or content improvements to highlight missing skills.
You must output a JSON object matching this schema:
{{
  "suggestions": [
    "Formatting recommendation 1",
    "Content mapping recommendation 2",
    "Skill display recommendation 3"
  ]
}}

Output only the JSON.
"""
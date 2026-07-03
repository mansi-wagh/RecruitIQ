"""
Prompt templates for RecruitIQ.
"""


def candidate_summary_prompt(
    resume: dict,
    prediction: dict,
    context: str,
) -> str:

    return f"""
You are an experienced HR recruiter.

Use ONLY the information below.

==============================
COMPANY KNOWLEDGE
==============================

{context}

==============================
RESUME
==============================

Skills:
{resume.get("skills", [])}

Prediction:
{prediction}

==============================

Write:

1. Candidate Summary

2. Strengths

3. Weaknesses

4. Hiring Recommendation

Do not hallucinate.
Do not invent company policies.
"""


def skill_gap_prompt(
    matched_skills,
    missing_skills,
    context,
):

    return f"""
Company Knowledge

{context}

Matched Skills

{matched_skills}

Missing Skills

{missing_skills}

Explain:

- Strengths
- Weaknesses
- Learning roadmap

Use company policies whenever possible.
"""


def interview_questions_prompt(
    missing_skills,
    context,
):

    return f"""
Company Interview Guide

{context}

Generate interview questions for:

{missing_skills}

Medium difficulty.

One question per skill.
"""


def resume_improvement_prompt(
    missing_skills,
    context,
):

    return f"""
Company Resume Guidelines

{context}

Candidate Missing Skills

{missing_skills}

Suggest resume improvements.

Return bullet points only.
"""
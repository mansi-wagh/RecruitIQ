# RecruitIQ Company Overview (Recruitment Platform)

## Purpose
Provide an internal-friendly overview of RecruitIQ’s mission, how the platform supports recruiters, and how AI is used responsibly. This document helps interviewers, recruiters, and downstream agents understand the system’s boundaries.

## Scope
Applies to:

- Recruiters and hiring managers using RecruitIQ recommendations
- Engineers integrating AI and RAG features

## Main Content
### 1. Mission and role in hiring
RecruitIQ is an AI-powered recruitment platform designed to:

- support recruiters with consistent candidate evaluation guidance
- help standardize interview preparation based on competency models
- improve candidate experience through clear, structured workflows

RecruitIQ is explicitly a **decision-support system**.

- RecruitIQ may recommend:
  - interview questions to validate competency coverage
  - resume improvements for clarity of evidence
  - structured summaries of hiring rationales
- Human leaders decide:
  - who advances
  - interview scheduling
  - final offers
  - rejections

### 2. How AI decision support works at a high level
RecruitIQ uses:

- retrieval over a knowledge base (RAG)
- embeddings to find relevant policy and interview guidance
- prompts to generate structured summaries and question suggestions

Document ingestion:

- files in knowledge base folders are chunked for semantic retrieval
- retrieved text is inserted into LLM prompts

### 3. Guardrails and human review requirements
RecruitIQ requires human review before decisions are made.

Operational guardrails:

- AI outputs must be treated as drafts or hypotheses
- low-confidence outputs require additional verification
- overrides must be documented in the decision log

### 4. Principles for responsible AI hiring
RecruitIQ emphasizes:

- fairness and evidence-based evaluation
- transparency and explainability
- bias mitigation practices
- privacy and least-privilege prompt handling

### 5. Intended stakeholders
RecruitIQ serves:

- recruiters and TA teams for screening support
- hiring managers and panels for interview preparation and scoring support
- HR operations for policy consistency
- candidates through consistent communications

### 6. Continuous improvement
RecruitIQ improves via:

- feedback from panel outcomes
- calibration of competency mappings
- refinement of knowledge base content and retrieval quality

## Best Practices
- Keep policy and interview guides updated as practices evolve.
- Calibrate rubrics across panels to reduce variance.

## Examples
### Example: AI suggests a skill gap
- Recruiter uses the suggestion to add targeted technical probing.
- Candidate performance during interview determines the final decision.

## Summary
RecruitIQ provides decision-support for recruitment through retrieval-based AI guidance. Human leaders retain authority, and responsible AI principles guide how AI suggestions are interpreted and documented.


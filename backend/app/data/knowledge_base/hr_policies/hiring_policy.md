# RecruitIQ Hiring Policy (Decision-Support)

## Purpose
Define how RecruitIQ supports the hiring process using AI recommendations while ensuring that final decisions remain human-led. This policy standardizes responsibilities, evaluation criteria, documentation, and escalation paths so candidates are treated consistently and fairly.

## Scope
Applies to:

- Recruiters, hiring managers, interviewers, and panel members
- Engineering, product, data, and operations hiring workflows
- Use of AI features in RecruitIQ that provide match scores, confidence signals, and skill-gap summaries

This document covers the *process* and *decision rules*, not country-specific legal requirements.

## Main Content
### 1. Role of AI in the hiring lifecycle
RecruitIQ functions as a **decision-support system**.

- RecruitIQ may generate:
  - AI match score and candidate fit signals
  - interview question suggestions based on skill gaps
  - resume improvement suggestions
- RecruitIQ does **not** make final hiring decisions.

Human decision authority is required for:

- moving candidates to interviews
- extending offers
- rejecting candidates

### 2. Eligibility and intake requirements
Before evaluation begins, recruiters must confirm:

- the role is active and has an approved job description
- evaluation criteria are aligned with the role’s competencies
- required screening fields are present (e.g., years of experience baseline, skill list, domain constraints)

### 3. Candidate evaluation criteria
RecruitIQ uses multiple signals that should be interpreted together:

- **Role-relevant skills overlap**
- **Evidence quality** (e.g., project depth, scope, measurable impact)
- **Experience duration** relative to expectations
- **Interview performance** against the same competency model

Operational definitions:

- **AI Match Score**: a relative indicator of how closely a candidate’s resume signals align with the role’s competency model.
- **AI Confidence Signal**: an internal quality indicator reflecting how strongly retrieved evidence supports the recommendation.

These signals must be treated as *inputs*, not proof.

### 4. Decision rules for recruiter actions
Recruiters should follow these guidelines when using AI output:

- If the AI Match Score is **high**:
  - ensure interview scheduling is justified by competency coverage
  - verify that evidence is consistent (no unexplained mismatches)
- If the AI Match Score is **medium**:
  - require technical assessment or structured interview probing for missing/uncertain areas
- If the AI Match Score is **low**:
  - still allow consideration when the candidate shows credible alternate evidence (e.g., equivalent project scope)

### 5. Human override requirements
Human override is mandatory in scenarios such as:

- AI recommendation conflicts with verifiable candidate-provided evidence
- critical skill coverage cannot be substantiated
- resume contains ambiguous or inconsistent claims that require clarification

When overriding AI output, recruiters must document:

- the reason for override
- the supporting evidence reviewed
- the revised next step (e.g., assessment, additional interview loop)

### 6. Documentation and auditability
For each stage, ensure records include:

- source of the job competency model
- summary of recruiter rationale
- interview panel notes and scoring
- AI artifacts used (match score and interpretation summary)

### 7. Consistency and calibration
RecruitIQ teams must periodically calibrate:

- scoring rubrics
- mapping of resume skills to competency categories
- interpretation of AI confidence signals

Calibration reduces drift and ensures comparability across panels.

## Best Practices
- Use the same competency categories across screening and interviews.
- Treat AI explanations as *starting points* for evidence review.
- Schedule assessments when either:
  - candidate skills are uncertain, or
  - the role has high-risk scope requirements.
- Keep a “decision log” that explains why AI recommendations were accepted or overridden.

## Examples
### Example 1: High match, but evidence is thin
- AI Match Score: high
- Recruiter action:
  - request a portfolio link or work sample
  - confirm REST/SQL depth during interview
- Outcome: proceed to interview only after substantiation

### Example 2: Low match, strong evidence of equivalence
- AI Match Score: low
- Recruiter action:
  - treat the candidate as eligible for assessment due to credible project scope
  - ask targeted questions to validate core competencies
- Outcome: interview loop if assessment meets minimum thresholds

## Summary
RecruitIQ supports hiring with AI recommendations (match score, confidence signals, and suggested questions). All final outcomes must be human-led, evidence-based, documented, and calibrated. Recruiters are expected to interpret AI as decision-support and override AI when evidence or candidate context requires a different decision path.


# RecruitIQ Technical Guide: FastAPI (Interview Evidence)

## Purpose
Guide interviewers in evaluating FastAPI proficiency for backend services. Focus areas include API design, validation boundaries, error handling, and operational readiness.

## Scope
Applies to:

- Backend roles building REST APIs with FastAPI
- Panels assessing API correctness, clarity, and reliability

## Main Content
### 1. Core FastAPI competencies
Interviewers should assess:

- API design:
  - route structure and naming
  - request/response modeling
- Validation boundaries:
  - data validation and constraints
- Error handling:
  - consistent error responses
  - safe error messages
- Testing approach:
  - unit tests for endpoints
  - integration testing for request flows
- Documentation habits:
  - accurate OpenAPI schemas and examples

### 2. Evidence-seeking question patterns
- “How do you model request and response objects in FastAPI?”
- “Describe a time you designed error handling for an API. How did you test it?”
- “Explain how you ensure backward compatibility for a changing endpoint.”

### 3. Strong evidence indicators
Strong answers typically show:

- validation prevents downstream issues (e.g., constraints, types, clear failure behavior)
- consistent patterns for errors and status codes
- tests and how they verified correctness
- documentation that reduces integration ambiguity

### 4. AI decision-support boundaries
RecruitIQ AI may suggest missing FastAPI topics based on skill-gap signals.

Allowed use:

- use suggestions to select targeted interview questions

Not allowed use:

- accepting AI summaries as proof of proficiency without candidate explanations
- using AI outputs to “fill in” missing evidence

Override rule:

- if a candidate demonstrates equivalent API design practices (even without naming FastAPI), interviewers may award proficiency consistent with the rubric.

### 5. Best practices for interviewers
- Probe boundary behavior (e.g., invalid inputs, missing fields, unexpected payload shapes).
- Ask how they tested and how they prevented regressions.
- Ask how they designed the developer experience via docs and examples.

## Examples
### Example: Validation depth
A strong candidate explains:

- request model constraints
- how error responses are formatted
- test cases for invalid payloads
- how they ensured schema evolution with minimal breaking changes

## Summary
This FastAPI guide defines evidence-based evaluation for API design, validation, error handling, testing, and documentation. RecruitIQ AI assists question targeting, while interviewers validate competence through human-led scoring.


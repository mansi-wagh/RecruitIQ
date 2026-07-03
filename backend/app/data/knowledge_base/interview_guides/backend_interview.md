# RecruitIQ Backend Interview Guide

## Purpose
Provide a competency-based backend interview guide for evaluating candidates who build services, APIs, and data access layers. RecruitIQ AI may suggest questions based on missing skills, but panels must score using observed evidence.

## Scope
Applies to:

- Backend engineering roles (Python/Java, REST APIs, SQL)
- Interview panels assessing architecture, reliability, and data correctness

## Main Content
### 1. Core competencies for backend roles
Typical competencies include:

- API design and REST fundamentals
- data modeling and SQL proficiency
- service reliability (error handling, idempotency)
- performance considerations (caching, query optimization)
- testing discipline and code quality

### 2. Interview loop structure
Recommended sequence:

- system overview discussion
- implementation scenario (API + data access)
- reliability/performance trade-off discussion
- testing and debugging walkthrough

### 3. AI-supported preparation
RecruitIQ may use company guide content and missing-skill inputs to suggest questions.

Interviewers may:

- select questions aligned to the rubric
- use follow-ups to probe depth and validation methods

Interviewers must not:

- accept AI statements as proof of capability
- treat resume gaps as definitive without evidence from the interview

### 4. Question framework (examples)
Architecture:

- “Describe a service you built end-to-end. What were the major components and why?”

API design:

- “How do you model pagination and filtering? What failure modes do you consider?”

SQL and data correctness:

- “Write or explain a query pattern for deduplication or aggregation. How do you validate correctness?”

Reliability:

- “Explain how you handle retries and idempotency in distributed systems.”

Testing:

- “How do you structure unit vs integration tests for a data-driven API?”

### 5. Scoring rubric guidance
Strong answers include:

- correctness and practical understanding
- explicit trade-offs (latency vs consistency, complexity vs maintainability)
- evidence of debugging methods
- testability and operational awareness

Scoring should include:

- technical accuracy
- clarity of reasoning
- depth of experience
- evidence-based outcomes

### 6. AI confidence and human override
If RecruitIQ provides a confidence signal:

- low confidence requires additional validation questions
- high confidence still uses rubric scoring and evidence

Override if:

- the candidate provides credible experience not captured in resume
- AI skill-gap mapping conflicts with live problem solving

## Best Practices
- Use a consistent scenario to compare candidates.
- Ask for “before/after” for reliability or performance improvements.
- Require evidence of testing and monitoring practices.

## Examples
### Example scenario: “Design a reporting endpoint”
Probe for:

- query plan awareness
- pagination semantics
- caching strategy
- validation tests

## Summary
The backend interview guide defines competencies, a structured loop, evidence-based scoring, and decision-support usage of RecruitIQ AI suggestions.


# RecruitIQ Coding Standards (Quality and Consistency)

## Purpose
Provide coding standards to ensure consistent implementation quality and maintainability. These standards guide interview questions for engineering roles and define how candidates should explain engineering decisions.

## Scope
Applies to:

- Engineering teams building backend and frontend services
- Interviewers assessing code quality and engineering habits

## Main Content
### 1. General principles
Coding standards should support:

- readability (clear structure and naming)
- correctness (tests and edge cases)
- maintainability (modular design and minimal coupling)
- security-by-default (safe handling of data, inputs, and secrets)

### 2. Review and documentation
Expectations:

- All non-trivial changes require review.
- Changes include documentation updates when behavior changes.
- PR descriptions state:
  - problem statement
  - approach and trade-offs
  - test plan and results

### 3. Testing standards
Minimum expectations:

- unit tests for core logic
- integration tests for API/data paths
- regression tests for bugs fixed

Interview probing:

- candidates should explain what they tested and why.

### 4. Code style guidelines (operational)
Candidates should follow team style conventions, including:

- consistent formatting and linting
- typed interfaces where appropriate
- explicit error handling

### 5. API and data correctness
For backend services:

- stable API contracts and versioning practices
- validation at boundaries
- correctness checks for data transformations

### 6. Performance and reliability
Standard practices:

- avoid unnecessary computations
- use caching when beneficial and measured
- design for graceful degradation and timeouts

### 7. Security and privacy
Minimum expectations:

- avoid logging sensitive information
- protect secrets using approved mechanisms
- treat user inputs as untrusted

### 8. Best practices for explainability
Engineers should be able to explain:

- why a design was chosen
- how correctness is verified
- what trade-offs were accepted

This directly improves AI-assisted recruiting transparency when interviewers ask for rationale.

## Best Practices
- Prefer smaller PRs with clear scope.
- Provide reproducible tests.

## Examples
### Example: PR description template
- Problem: ...
- Approach: ...
- Trade-offs: ...
- Tests: ...
- Rollout: ...

## Summary
RecruitIQ coding standards emphasize readability, correctness, testing discipline, maintainability, and security. Interviewers should assess whether candidates can explain engineering decisions and verification strategies, using structured evidence-based evaluation.


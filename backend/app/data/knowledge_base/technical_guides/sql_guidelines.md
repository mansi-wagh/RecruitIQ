# RecruitIQ Technical Guide: SQL (Interview Evidence)

## Purpose
Provide criteria for evaluating SQL competency in interviews. The guide focuses on correctness, reasoning, and practical data handling.

## Scope
Applies to:

- Backend roles requiring SQL for data access
- Data engineering and analytics roles where SQL correctness matters

## Main Content
### 1. Core SQL competencies
Interviewers should assess:

- Query correctness:
  - joins, aggregations, grouping semantics
  - filtering logic and deduplication
- Performance reasoning:
  - indexing concepts and query plan awareness
- Data modeling understanding:
  - schema design basics and constraints
- Data reliability:
  - handling nulls, edge cases, and data quality checks

### 2. Evidence-seeking question patterns
- “Explain how you would write a query for deduplication. How do you validate correctness?”
- “Walk through how you diagnose slow queries. What signals do you inspect first?”
- “How do you ensure aggregations are correct when joining multiple tables?”

### 3. Evidence quality checklist
Strong answers include:

- clear description of expected results
- validation approach (sample data, tests, reconciliation)
- discussion of null/edge case handling
- trade-offs between simplicity and performance

### 4. AI decision-support boundaries
RecruitIQ AI may suggest missing SQL topics.

Allowed:

- choose targeted follow-ups (e.g., window functions, joins, indexing reasoning)

Not allowed:

- accepting AI summaries as proof of SQL proficiency without candidate explanations

Override rule:

- if candidate demonstrates correct reasoning and validation strategy, do not penalize due to missing keywords.

## Best Practices
- Probe for correctness: “How do you test it?”
- Ask about reasoning rather than only syntax.

## Examples
### Example: Query validation
- Candidate describes using controlled datasets and comparing outputs against a known baseline before deploying.

## Summary
This SQL guide supports evidence-based assessment of correctness, performance reasoning, and data reliability. RecruitIQ AI assists question targeting, but interviewers validate proficiency using rubric scoring and candidate explanations.


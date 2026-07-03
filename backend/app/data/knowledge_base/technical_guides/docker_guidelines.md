# RecruitIQ Technical Guide: Docker (Interview Evidence)

## Purpose
Provide interview evidence expectations for Docker competency. The guide emphasizes reproducibility, dependency management, and operational reasoning.

## Scope
Applies to:

- Backend and platform roles where containerization is expected
- Panels evaluating build/release reliability and environment consistency

## Main Content
### 1. Core Docker competencies
Assess:

- Image concepts:
  - layers and caching
- Dockerfile practices:
  - minimal base images
  - deterministic builds
- Container runtime reasoning:
  - environment variables and configuration
- Security basics:
  - non-root execution where applicable
- Debugging and troubleshooting:
  - inspecting builds, logs, and runtime behavior

### 2. Evidence-seeking question patterns
- “Describe a Dockerfile you wrote. How did you optimize build speed and correctness?”
- “How do you manage environment configuration across dev/staging/prod?”
- “Explain a problem you debugged in a containerized environment.”

### 3. Strong evidence indicators
- Candidate demonstrates reproducibility and deterministic build thinking.
- Candidate can explain trade-offs in base images and caching.
- Candidate references security and safe configuration practices.

### 4. AI decision-support boundaries
RecruitIQ AI may suggest missing containerization topics.

Allowed:

- targeted question selection and follow-up probing

Required:

- validation through candidate explanation and evidence stories

Override rule:

- if candidate demonstrates equivalent environment consistency practices without Docker wording, credit the competency.

## Best Practices
- Ask for a real build/release example.
- Probe for operational debugging methodology.

## Examples
### Example: Build optimization
- Candidate explains using dependency caching and multi-stage builds to reduce image size.

## Summary
This Docker guide supports evidence-based evaluation for reproducibility, configuration, security basics, and troubleshooting. RecruitIQ AI helps target questions; interviewers validate competence through human-led rubric scoring.


# RecruitIQ Technology Stack (RecruitIQ Engineering)

## Purpose
Document the technologies used in RecruitIQ to help recruiters and interviewers align technical evaluation with real systems. This also supports AI-generated interview question guidance when the missing skills reflect stack gaps.

## Scope
Applies to:

- Recruiters, hiring managers, and interview panels
- Engineering candidates evaluating fit

## Main Content
### 1. Backend and API services
RecruitIQ backend services are typically structured around:

- a web API layer for resume intake, job analysis, and candidate matching
- authentication and secure access controls
- retrieval-augmented generation (RAG) components

Programming language guidance for common roles:

- Python-based services are common for RAG pipelines and analysis modules

### 2. RAG components
RecruitIQ uses a knowledge base with:

- policy and interview guides stored as `.md` and `.txt`
- a chunking strategy that produces semantically retrievable segments
- embeddings for vector search
- a retriever that returns top-k relevant chunks

Operational note:

- AI prompts instruct the model to use retrieved context only.

### 3. LLM provider abstraction
RecruitIQ supports multiple LLM providers through a provider factory.

- The application generates prompts with RAG context.
- Provider responses are treated as drafts requiring structured handling.

### 4. Data and storage
RecruitIQ typically maintains:

- structured candidate and job data models
- vector database content for knowledge base retrieval
- training datasets for matching models

### 5. Frontend
The frontend is typically responsible for:

- role browsing and application UX
- candidate status tracking
- recruiter dashboards for evidence and recommendations

### 6. Infrastructure and deployment
Operational stack guidance:

- containerization for consistent environments
- orchestration for scaling and reliability
- cloud services for storage, compute, and logging

### 7. How stack influences interview evaluation
Interview questions should assess:

- how candidates build maintainable services
- how they design APIs and handle data correctness
- how they reason about reliability and performance
- how they understand RAG systems: chunking, retrieval quality, prompt boundaries

## Best Practices
- Avoid overfitting interview questions to current stack features; emphasize transferable principles.
- When assessing stack-specific knowledge, ask for reasoning and trade-offs.

## Examples
### Example: RAG-focused interview probe
- “How would you troubleshoot low retrieval relevance? What signals would you check first?”

## Summary
RecruitIQ technology stack documentation aligns recruiting evaluation with the platform’s real systems. It emphasizes RAG principles, provider abstraction, evidence-based prompt boundaries, and engineering standards that map to role competency expectations.


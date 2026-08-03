<div align="center">

# RecruitIQ

AI recruitment platform — resume parsing, vector search, and automated applicant tracking.

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_RAG-FF6F61?style=for-the-badge)
![XGBoost](https://img.shields.io/badge/XGBoost-ML_Scoring-228B22?style=for-the-badge)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-LLM-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## Table of Contents

- [What this is](#what-this-is)
- [Why I built it](#why-i-built-it)
- [Features](#features)
- [Dataset](#dataset)
- [Architecture](#architecture)
- [Setup Guide](#setup-guide)
- [API Documentation](#api-documentation)
- [What I learned / What was hard](#what-i-learned--what-was-hard)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## What this is

RecruitIQ is a full-stack recruitment platform I built to replace keyword-matching resume filters with something that actually understands candidates. It parses PDF and DOCX resumes using PyMuPDF, embeds candidate profiles into ChromaDB for semantic search, scores job fit with XGBoost, and uses Google Gemini to generate candidate summaries and interview questions.

The backend is FastAPI + PostgreSQL with JWT-based RBAC. The frontend is React 19 + TypeScript + Tailwind. Docker Compose ties it together.

---

## Why I built it

During placement prep I kept hearing from seniors that HR tools either reject good resumes on keywords or pass everything through and waste recruiter time. I wanted to see if vector similarity + a trained classifier actually does better than keyword matching. Turns out it does — but making XGBoost generalize across different job domains was harder than I expected. Built the full stack myself to understand where the pipeline actually breaks down.

---

## Features

- **Resume Parsing** — Extracts skills, experience, and contact details from PDF and DOCX files via PyMuPDF.
- **Semantic Search (RAG)** — Candidate profiles embedded into ChromaDB using `sentence-transformers/all-MiniLM-L6-v2` for context-aware matching, not just keyword overlap.
- **Match Scoring** — XGBoost classifier calculates a candidate-to-job fit percentage.
- **Gemini LLM Assistant** — Generates candidate summaries, skill gap reports, and screening questions using Google Gemini 1.5/2.0.
- **RBAC + JWT Auth** — Separate dashboards and workflows for Candidate and Recruiter/Admin roles.
- **ATS Pipeline** — Tracks application states: Applied → Under Review → Shortlisted → Rejected → Hired.
- **Analytics Dashboard** — Applicant volume, skill distribution, and hiring stage conversion charts.

---

## 📊 Dataset

### Dataset Overview

RecruitIQ uses curated Kaggle resume and job posting datasets to train the XGBoost classifier and seed the ChromaDB vector store. The data covers IT, Engineering, Finance, Healthcare, and Management domains.

### Dataset Source

| Dataset | Purpose | Source |
|:---|:---|:---|
| Resume Dataset | Skill extraction & XGBoost training | [Kaggle Resume Dataset](https://www.kaggle.com/datasets/gauravduttakiit/resume-dataset) |
| Job Postings Dataset | Job requirement parsing & ChromaDB seeding | [Kaggle Job Postings](https://www.kaggle.com/datasets/arshkon/linkedin-job-postings) |

### Dataset Structure

| Feature | Description |
|:---|:---|
| `Category` | Industry domain (e.g., Data Science, Software Engineering, HR) |
| `Resume_text` | Cleaned full-text content from candidate resumes |
| `Skills` | Extracted technical and soft skill vector list |
| `Experience` | Years of relevant experience |
| `Job_Title` | Job posting title |
| `Job_Description` | Full requirements and responsibilities |

### Data Preprocessing

1. **Text Extraction** — Raw text pulled from PDF/DOCX files using `fitz` (PyMuPDF) and `docx`.
2. **Cleaning & Normalization** — Lowercased, special characters removed, stop-words stripped via NLTK.
3. **Embedding** — Cleaned text vectorized with `sentence-transformers/all-MiniLM-L6-v2`, stored in ChromaDB.
4. **Feature Encoding** — Categorical features and skill vectors encoded for XGBoost training (`feature_columns.pkl`).

### Dataset Statistics

| Stat | Count |
|:---|:---|
| Total Resumes | 2,400+ |
| Total Job Postings | 1,000+ |
| Unique Skill Taxonomies | 500+ |
| Train / Test Split | 80% / 20% |

To populate vector embeddings and seed the database:

```bash
python backend/app/scripts/seed_db.py
```

---

## 🏗️ Architecture

### System Architecture

React 19 frontend talks to a FastAPI backend over REST. PostgreSQL handles relational data (users, jobs, applications). ChromaDB stores vector embeddings. XGBoost scores candidate-job fit. Gemini handles the natural language generation layer.

```mermaid
graph TD
    UI["React 19 Frontend (Vite + Tailwind)"] -->|JWT Auth API Requests| API["FastAPI Backend Router"]
    
    subgraph Data & Storage Layer
        API --> DB["PostgreSQL (SQLAlchemy)"]
        API --> VEC["ChromaDB Vector Store"]
    end
    
    subgraph Intelligence & ML Engine
        API --> PARSER["PyMuPDF / docx Parser"]
        API --> XGB["XGBoost Match Classifier"]
        API --> RAG["LangChain / Sentence-Transformers"]
        RAG --> GEMINI["Google Gemini LLM API"]
    end
    
    DB --> UI
    GEMINI --> UI
```

### User Journey

```mermaid
flowchart LR
    A["User Authentication"] --> B{"User Role?"}
    
    B -->|Candidate| C["Upload PDF/DOCX Resume"]
    C --> D["View Extracted Skills & Profile"]
    D --> E["Browse Open Jobs & Apply"]
    E --> F["Track Application Status"]

    B -->|Recruiter| G["Post New Job Requirement"]
    G --> H["View Candidate RAG Match Scores"]
    H --> I["Generate Gemini AI Skill Summaries"]
    I --> J["Update ATS Status (Shortlist / Hire)"]
```

### Pipeline Flow

```mermaid
flowchart TD
    A["Candidate Uploads Resume"] --> B["PyMuPDF Extract Raw Text"]
    B --> C["Extract Skills & Work Experience"]
    C --> D["Generate Sentence Embeddings"]
    D --> E["Store Embedding in ChromaDB"]
    E --> F["XGBoost Predict Match Score against Job"]
    F --> G["Gemini LLM Synthesize Candidate Summary"]
    G --> H["Save Application Record in PostgreSQL"]
    H --> I["Render Candidate on Recruiter Dashboard"]
```

### ER Diagram

```mermaid
erDiagram
    USER {
        int id PK
        string name
        string email UK
        string password_hash
        string role
        datetime created_at
    }

    JOB {
        int id PK
        string title
        string department
        string location
        string employment_type
        string experience_required
        string education_required
        text description
        text required_skills
        string status
        int applicants
        int created_by FK
        datetime created_at
    }

    RESUME {
        int id PK
        int user_id FK
        string resume_path
        datetime created_at
    }

    APPLICATION {
        int id PK
        int candidate_id FK
        int job_id FK
        string status
        int match_score
        datetime applied_at
    }

    USER ||--o{ JOB : "creates"
    USER ||--o{ RESUME : "uploads"
    USER ||--o{ APPLICATION : "submits"
    JOB ||--o{ APPLICATION : "receives"
```

### Component Interaction

```mermaid
graph LR
    subgraph Client Layer
        FE["React UI Components"]
    end

    subgraph Service Layer
        AUTH_SVC["AuthService (JWT)"]
        JOB_SVC["JobService"]
        AI_SVC["AIService (XGBoost + Gemini)"]
        RAG_SVC["RAGService (ChromaDB)"]
    end

    subgraph Infrastructure
        PG["PostgreSQL"]
        CHROMA["ChromaDB"]
        GEMINI_API["Gemini Cloud API"]
    end

    FE -->|Authenticate| AUTH_SVC
    FE -->|Manage Jobs & Apps| JOB_SVC
    FE -->|Screen Candidate| AI_SVC

    AUTH_SVC --> PG
    JOB_SVC --> PG
    AI_SVC --> CHROMA
    AI_SVC --> GEMINI_API
    RAG_SVC --> CHROMA
```

---

## ⚙️ Setup Guide

### Prerequisites

| Software | Version | Required |
|:---|:---|:---|
| Python | 3.11+ | ✅ |
| Node.js / Bun | 18+ (Bun 1.1+) | ✅ |
| PostgreSQL | 15+ | ✅ |
| Docker | 20.10+ | Optional |

### Project Structure

```text
RecruitIQ/
├── backend/
│   ├── app/
│   │   ├── auth/           # JWT & password hashing
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── routers/        # FastAPI endpoint controllers
│   │   ├── schemas/        # Pydantic validation schemas
│   │   ├── services/       # Resume parser, XGBoost & ChromaDB services
│   │   ├── main.py         # FastAPI entrypoint
│   │   └── database.py     # PostgreSQL connection session
│   ├── alembic/            # Migration scripts
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # UI layouts, modals, tables
│   │   ├── pages/          # Candidate and Recruiter dashboard views
│   │   └── services/       # Axios API client handlers
│   ├── package.json
│   └── vite.config.ts
├── dataset/                # Seed resume & job CSVs
├── ml/                     # Training notebooks & model files
├── docker-compose.yml
└── requirements.txt
```

### Environment Variables

Copy `.env.example` to `.env` in the backend directory:

| Variable | Description | Default | Required |
|:---|:---|:---|:---|
| `DATABASE_URL` | PostgreSQL connection URI | `postgresql://postgres:postgres@localhost:5432/recruitiq_db` | ✅ |
| `SECRET_KEY` | JWT signing key | `generate-random-32-byte-hex` | ✅ |
| `ALGORITHM` | JWT algorithm | `HS256` | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | `your-gemini-key` | ✅ |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:3000,http://localhost:5173` | ✅ |

### Installation

#### Backend

```bash
cd backend
python -m venv venv
# Linux/macOS: source venv/bin/activate
# Windows:     venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env  # Set DATABASE_URL and GEMINI_API_KEY

python create_tables.py
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend
npm install        # or: bun install
npm run dev
```

### Quick Start (Docker)

```bash
git clone https://github.com/mansi-wagh/RecruitIQ.git
cd RecruitIQ
docker-compose up --build
```

App runs at `http://localhost:5173`. Register as **Recruiter** to post jobs or **Candidate** to upload a resume and test matching.

---

## 📡 API Documentation

### Authentication

JWT Bearer Token auth. Call `/api/auth/login` to get an `access_token`, then pass it as:
`Authorization: Bearer <token>`

Roles: `Candidate`, `Recruiter`, `Admin`

### Endpoints

| Method | Endpoint | Description | Role |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Get JWT token | Public |
| `POST` | `/api/resumes/upload` | Upload PDF/DOCX resume | Candidate |
| `GET` | `/api/jobs` | List open job postings | Candidate / Recruiter |
| `POST` | `/api/jobs` | Post a new job | Recruiter / Admin |
| `POST` | `/api/applications` | Apply for a job | Candidate |
| `GET` | `/api/applications` | View applicant pipeline & scores | Recruiter |
| `POST` | `/api/ai/predict` | Get XGBoost match score | Recruiter |
| `POST` | `/api/ai/chat` | Query candidate via Gemini RAG | Recruiter |

### Error Codes

| Code | Meaning |
|:---|:---|
| `200` | Success |
| `400` | Bad Request — invalid payload or missing file |
| `401` | Unauthorized — missing or expired JWT |
| `403` | Forbidden — role not authorized |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example: Match Score

```bash
curl -X POST http://localhost:8000/api/ai/predict \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"candidate_id": 12, "job_id": 4}'
```

```json
{
  "success": true,
  "match_score": 88,
  "recommendation": "Strong Match",
  "key_matching_skills": ["Python", "FastAPI", "PostgreSQL", "Docker"],
  "missing_skills": ["Kubernetes"]
}
```

### Deployment

```bash
docker-compose up -d --build
```

- Frontend: `http://localhost:5173`
- API Docs (Swagger): `http://localhost:8000/docs`

---

## Some challenges 

Getting XGBoost to generalize across domains (tech vs healthcare vs finance resumes) took way more feature engineering than expected the initial model was basically just memorizing the most common tech keywords. Also, ChromaDB's cold-start behavior when the vector store is empty caused some confusing 500 errors early on that took a while to trace back to the embedding step.

---

## Known Limitations

Gemini API latency makes the candidate summary generation slow anywhere from 3 to 8 seconds per request depending on resume length. It works fine for demo purposes but would need async queuing (Celery or similar) before this could handle real recruiter volume. Also, the XGBoost model was trained on Kaggle resume data which skews heavily toward tech roles, so match scores for non-tech domains are less reliable.

---

## Future Improvements

- AI Video Interview Screening — speech-to-text + sentiment analysis for preliminary rounds
- Multi-LLM support — swap between OpenAI GPT-4o, Claude, and Gemini
- LinkedIn OAuth import — auto-fill candidate profiles
- Automated interview scheduling — Google Calendar / Outlook integration
- Async job queue — Celery + Redis for non-blocking Gemini calls
- Mobile app — React Native for candidate-side tracking

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">
Built with FastAPI, React 19, PostgreSQL, ChromaDB, XGBoost, and Google Gemini
</div>

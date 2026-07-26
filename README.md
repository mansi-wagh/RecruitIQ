<div align="center">

# 🤖 RecruitIQ

> AI-powered recruitment platform for intelligent resume screening, vector-based candidate matching, and automated applicant tracking.

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_RAG-FF6F61?style=for-the-badge)
![XGBoost](https://img.shields.io/badge/XGBoost-ML_Scoring-228B22?style=for-the-badge)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-LLM-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Dataset](#-dataset)
- [Architecture](#-architecture)
- [Setup Guide](#-setup-guide)
- [API Documentation](#-api-documentation)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 📖 Project Overview

Recruiters waste hundreds of hours manually parsing unstructured PDF/DOCX resumes, causing delayed hiring cycles, unconscious screening bias, and missed top-tier candidates due to inefficient keyword-matching tools.

**RecruitIQ** automates talent acquisition by integrating document parsing, predictive Machine Learning, and RAG (Retrieval-Augmented Generation). It uses PyMuPDF for parsing, Sentence-Transformers and ChromaDB for semantic vector search, an XGBoost classifier for candidate match scoring, and Google Gemini LLM to generate candidate summaries and tailored interview questions.

---

## ✨ Key Features

- **Automated Resume Parsing** — Extracts structured skills, experience, and contact details from PDF and DOCX documents via PyMuPDF.
- **Semantic Vector Search (RAG)** — Embeds candidate profiles into ChromaDB using `Sentence-Transformers` for context-aware semantic searching.
- **Predictive Match Scoring** — Calculates candidate-job fit percentages using a trained XGBoost ML classification model.
- **Gemini LLM Assistant** — Leverages Google Gemini 1.5/2.0 to generate executive candidate summaries, skill gap reports, and screening questions.
- **Role-Based Access Control (RBAC)** — Offers customized dashboards and workflows for Candidate and Recruiter/Admin roles with JWT authentication.
- **Applicant Tracking System (ATS)** — Manages job application states (*Applied*, *Under Review*, *Shortlisted*, *Rejected*, *Hired*).
- **Recruitment Analytics** — Provides interactive visualization metrics on applicant volume, top skills distribution, and hiring stage conversion.

---

## 📊 Dataset

### 7.1 Dataset Overview

RecruitIQ utilizes curated Kaggle Resume and Job Posting datasets to train its ML classification models and seed the semantic vector store. The dataset contains thousands of anonymized resume texts paired with job descriptions across IT, Engineering, Finance, Healthcare, and Management sectors.

### 7.2 Dataset Source

| Dataset | Purpose | Source |
|:---|:---|:---|
| Resume Dataset | Skill extraction & XGBoost model training | [Kaggle Resume Dataset](https://www.kaggle.com/datasets) |
| Job Postings Dataset | Job requirement parsing & ChromaDB vector seeding | [Kaggle Job Postings](https://www.kaggle.com/datasets) |

### 7.3 Dataset Structure

| Feature | Description |
|:---|:---|
| `Category` | Industry domain (e.g., Data Science, Software Engineering, HR) |
| `Resume_text` | Cleaned full-text content extracted from candidate resumes |
| `Skills` | Extracted technical and soft skills vector list |
| `Experience` | Years of relevant industry experience |
| `Job_Title` | Designated job posting title |
| `Job_Description` | Full text requirements and responsibilities for open roles |

### 7.4 Data Preprocessing

1. **Document Text Extraction** — Extracted raw text from PDF/DOCX files using `fitz` (PyMuPDF) and `docx`.
2. **Text Cleaning & Normalization** — Converted text to lowercase, removed special characters, and stripped stop-words using NLTK.
3. **Embedding Serialization** — Vectorized cleaned text using `sentence-transformers/all-MiniLM-L6-v2` and stored vectors in ChromaDB.
4. **Feature Encoding** — Categorical features and skill vectors encoded for XGBoost classification training (`feature_columns.pkl`).

### 7.5 Dataset Statistics

- **Total Resumes**: 2,400+
- **Total Job Postings**: 1,000+
- **Unique Skill Taxonomies**: 500+
- **Train/Test Split**: 80% / 20%

### 7.6 Dataset Download

Datasets are stored in the local `dataset/` directory. To populate vector embeddings and database seeds, run:

```bash
python backend/app/scripts/seed_db.py
```

---

## 🏗️ Architecture

### 8.1 System Architecture

RecruitIQ follows a modern decoupled architecture. The React 19 frontend communicates over HTTP REST with a FastAPI backend. PostgreSQL manages relational persistence (Users, Jobs, Applications), ChromaDB handles vector embeddings for RAG search, an XGBoost model evaluates candidate match scores, and Google Gemini handles natural language synthesis.

```mermaid
graph TD
    UI["🌐 React 19 Frontend (Vite + Tailwind)"] -->|JWT Auth API Requests| API["🔀 FastAPI Backend Router"]
    
    subgraph Data & Storage Layer
        API --> DB["🗄️ PostgreSQL Database (SQLAlchemy)"]
        API --> VEC["🧮 ChromaDB Vector Store"]
    end
    
    subgraph Intelligence & ML Engine
        API --> PARSER["📄 PyMuPDF / docx Parser"]
        API --> XGB["🌲 XGBoost Match Classifier"]
        API --> RAG["🔍 LangChain / Sentence-Transformers"]
        RAG --> GEMINI["🤖 Google Gemini LLM API"]
    end
    
    DB --> UI
    GEMINI --> UI
```

### 8.2 User Journey

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

### 8.3 Pipeline Flow

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

### 8.4 ER Diagram

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

### 8.5 Component Interaction

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

### 8.1 Prerequisites

| Software | Version | Required |
|:---|:---|:---|
| Python | 3.11+ | ✅ |
| Node.js / Bun | 18+ (Bun 1.1+) | ✅ |
| PostgreSQL | 15+ | ✅ |
| Docker | 20.10+ | Optional |

### 8.2 Project Structure

```text
RecruitIQ/
├── backend/
│   ├── app/
│   │   ├── auth/           # JWT & password hashing utilities
│   │   ├── models/         # SQLAlchemy ORM database models
│   │   ├── routers/        # FastAPI endpoint controllers
│   │   ├── schemas/        # Pydantic data validation schemas
│   │   ├── services/       # Resume parser, XGBoost & ChromaDB services
│   │   ├── main.py         # FastAPI application entrypoint
│   │   └── database.py     # PostgreSQL connection session
│   ├── alembic/            # Database migration scripts
│   └── requirements.txt    # Backend Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # UI layouts, modals, and tables
│   │   ├── pages/          # Candidate and Recruiter dashboard views
│   │   └── services/       # Axios API client handlers
│   ├── package.json        # Frontend Node dependencies
│   └── vite.config.ts      # Vite configuration
├── dataset/                # Seed resume & job dataset CSVs
├── ml/                     # ML training notebooks & model serialization
├── docker-compose.yml      # Orchestration spec
└── requirements.txt        # Root requirements manifest
```

### 8.3 Environment Variables

Copy `.env.example` to `.env` in the backend directory:

| Variable | Description | Default | Required |
|:---|:---|:---|:---|
| `DATABASE_URL` | PostgreSQL connection URI | `postgresql://postgres:postgres@localhost:5432/recruitiq_db` | ✅ |
| `SECRET_KEY` | JWT signature key | `generate-random-32-byte-hex` | ✅ |
| `ALGORITHM` | JWT signing algorithm | `HS256` | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | `your-gemini-key` | ✅ |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:3000,http://localhost:5173` | ✅ |

### 8.4 Installation Guide

#### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Linux/macOS: source venv/bin/activate
# Windows: venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env  # Configure your DATABASE_URL and GEMINI_API_KEY

# Initialize database
python create_tables.py
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
# or: bun install

npm run dev
```

### 8.5 Five-Minute Quick Start

1. Ensure PostgreSQL is running and a database named `recruitiq_db` is created.
2. Clone the repo: `git clone https://github.com/your-username/RecruitIQ.git`
3. Launch via Docker Compose (easiest option):
   ```bash
   docker-compose up --build
   ```
4. Access the web app at `http://localhost:5173`.
5. Register a **Recruiter** account to post jobs, or a **Candidate** account to upload a resume and test AI matching!

---

## 📡 API Documentation

### 9.1 Authentication

RecruitIQ uses **JWT Bearer Token** authentication. Upon calling `/api/auth/login`, an `access_token` is returned and passed in the HTTP Authorization header: `Authorization: Bearer <token>`.

Available roles: `Candidate`, `Recruiter`, `Admin`.

### 9.2 API Endpoints

| Method | Endpoint | Description | Role |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate & receive JWT token | Public |
| `POST` | `/api/resumes/upload` | Upload PDF/DOCX resume file | Candidate |
| `GET` | `/api/jobs` | List all open job postings | Candidate / Recruiter |
| `POST` | `/api/jobs` | Post a new job requirement | Recruiter / Admin |
| `POST` | `/api/applications` | Apply for a job posting | Candidate |
| `GET` | `/api/applications` | View applicant pipeline & match scores | Recruiter |
| `POST` | `/api/ai/predict` | Calculate XGBoost match score | Recruiter |
| `POST` | `/api/ai/chat` | Query candidate via Gemini RAG chatbot | Recruiter |

### 9.3 Error Responses

| Code | Meaning |
|:---|:---|
| `200` | Success |
| `400` | Bad Request — invalid payload format or missing file |
| `401` | Unauthorized — missing or expired JWT token |
| `403` | Forbidden — user role unauthorized for action |
| `404` | Not Found — job or applicant record does not exist |
| `500` | Internal Server Error |

### 9.4 Usage Guide

Example request to calculate AI candidate match score:

```bash
curl -X POST http://localhost:8000/api/ai/predict \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": 12,
    "job_id": 4
  }'
```

Example JSON response:

```json
{
  "success": true,
  "match_score": 88,
  "recommendation": "Strong Match",
  "key_matching_skills": ["Python", "FastAPI", "PostgreSQL", "Docker"],
  "missing_skills": ["Kubernetes"]
}
```

### 9.5 Deployment Guide

Deploy using **Docker Compose** for full-stack production:

```bash
docker-compose up -d --build
```

- Frontend: `http://localhost:3000` (or `http://localhost:5173`)
- Backend API Docs: `http://localhost:8000/docs`

---

## 🚀 Future Improvements

- 📹 **AI Video Interview Screening** — Implement automated speech-to-text and sentiment analysis for preliminary video interviews
- 🤖 **Multi-LLM Support** — Allow switching between OpenAI GPT-4o, Anthropic Claude 3.5, and Google Gemini
- 🌐 **LinkedIn Profile Import** — Auto-populate candidate profiles directly via OAuth LinkedIn integration
- 📅 **Automated Interview Scheduler** — Calendar integration (Google Calendar / Outlook) for interview booking
- 📊 **Advanced Diversity Analytics** — Unbiased screening analytics reporting for HR compliance
- 🔔 **Real-Time WebSockets & Notifications** — Instant notifications for candidate status updates and interview invites
- 🏢 **Multi-Tenant Enterprise Workspaces** — Support isolated multi-organization company workspaces
- 📱 **Mobile Native Application** — React Native app for candidate job application tracking

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using FastAPI, React 19, PostgreSQL, ChromaDB, XGBoost, and Google Gemini AI**

</div>

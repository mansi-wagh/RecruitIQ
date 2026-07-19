<p align="center">
  <img src="https://raw.githubusercontent.com/mansi-wagh/RecruitIQ/main/frontend/public/logo.png" alt="RecruitIQ Logo" width="120px" onerror="this.src='https://placehold.co/120x120?text=RIQ'"/>
</p>

<h1 align="center">RecruitIQ</h1>

<p align="center">
  <strong>AI-powered recruitment platform that matches candidates to jobs using XGBoost scoring and RAG-based LLM analysis</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python Version"/>
  <img src="https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Framework"/>
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI Backend"/>
  <img src="https://img.shields.io/badge/Google%20Gemini-1.5%20Flash-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini LLM"/>
  <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase Cloud"/>
  <img src="https://img.shields.io/badge/Vercel-Hosting-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Hosting"/>
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL DB"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License"/>
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" alt="Live Deploy Status"/>
  <img src="https://img.shields.io/badge/Developer-Solo-brightgreen?style=for-the-badge" alt="Solo Developer"/>
</p>

---

## 📌 Navigation

- [What is RecruitIQ](#-what-is-recruitiq)
- [Why RecruitIQ](#-why-recruitiq)
- [Core Features](#-core-features)
- [System Architecture](#-system-architecture)
- [ML Pipeline](#-ml-pipeline)
- [Database Schema](#-database-schema)
- [How It Works](#-how-it-works)
- [Challenges & Optimizations](#-challenges--optimizations)
- [Screenshots](#-screenshots)
- [Quickstart Guide](#-quickstart-guide)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Roadmap](#-roadmap)
- [Developer Section](#-developer-section)
- [License](#-license)

---

## 🔍 What is RecruitIQ

RecruitIQ addresses the primary bottleneck in modern talent acquisition: the high manual effort required to screen thousands of applicant resumes and match them against complex technical job descriptions. Keyword-based filters regularly pass unqualified candidates who copy job requirements, while filtering out qualified applicants who use alternative phrasing. 

RecruitIQ replaces manual screening with an automated, data-driven pipeline. It extracts structured skills, education histories, experience metrics, and certifications from PDF/DOCX resumes. Using these extracted entities, it engineers 13 distinct feature vectors representing candidate-job alignment and passes them to a trained XGBoost classifier to compute a deterministic compatibility score. 

To complement this statistical scoring, RecruitIQ executes asynchronous queries to Google Gemini 1.5 Flash to perform qualitative analysis, identifying specific skill gaps, outlining resume improvement areas, and generating tailored interview questions to probe weaker qualifications. Recruiters are also equipped with a retrieval-augmented generation (RAG) chat assistant to query corporate policy and hiring guideline documents.

---

## 💡 Why RecruitIQ

RecruitIQ helps recruiters make data-backed hiring decisions and answer specific candidate evaluation questions:
* **Match Quality Evaluation:** Which candidates have a technical skill overlap exceeding 85% and satisfy the exact minimum years of experience required?
* **Gap Analysis:** What specific database, cloud, or programming language skills listed in the job description are missing from the applicant's profile?
* **Verification Prep:** What specific, technical interview questions should we ask this candidate to probe and verify their self-declared experience in senior-level competencies?
* **Funnel Conversion:** How are candidates distributed across our active recruitment pipeline (Applied → Screening → Interview → Offer)?
* **Policy Compliance:** Does a candidate's profile satisfy internal hiring policies regarding remote work eligibility or degree requirements?

---

## ✨ Core Features

| Icon | Feature Name | Description |
|:---:|:---|:---|
| 🤖 | **XGBoost Match Scoring** | Classifies and scores candidate compatibility using a custom XGBoost model trained on 13 feature-engineered overlap parameters (such as skill overlap ratio, experience gap, education gap, project/certification match counts, title and keyword similarities). |
| 📄 | **spaCy NLP Resume Parsing** | Extracts structured fields (skills, education, projects, certifications, history) using spaCy NLP models and regular expressions from uploaded PDF/DOCX resumes. |
| 💬 | **RAG HR Assistant** | RAG conversational assistant powered by LangChain and ChromaDB vector store referencing internal corporate policies and guides. |
| 🌐 | **Dual Portal** | Tailored dashboards and interfaces for HR Recruiters (jobs, candidate insights, metrics, assistant) and Candidates (job hunting, resume upload, application tracking). |
| 📊 | **Application Pipeline** | Pipeline workflow to transition applications through Applied, Screening, Interview, and Offer stages. |
| 📈 | **Hiring Analytics Dashboard** | Renders interactive metrics, KPIs, and hiring funnel trends using Postgres database statistics and Recharts. |
| 🔐 | **JWT RBAC Auth** | Strict stateless JWT authentication with separate route privileges for candidates and HR personnel. |
| ⚡ | **Gemini Match Insights** | Asynchronous generation of candidate summaries, skill gap assessments, and custom interview questions using Google Gemini 1.5 Flash. |

---

## 🏗️ System Architecture

RecruitIQ runs on a decoupled client-server architecture. The frontend React application communicates with the FastAPI gateway using HTTPS and token-based JWT bearer authentication. The FastAPI server connects to Supabase PostgreSQL via SQLAlchemy ORM, queries a local ChromaDB instance for policy documents, executes XGBoost predictions on locally loaded model parameters, and makes API calls to Google Gemini.

```mermaid
flowchart TB
    subgraph Frontend ["Frontend (Vercel)"]
        SPA["React 18 SPA (Vite + React Router)"]
        Charts["Analytics (Recharts)"]
        SPA --> Charts
    end

    subgraph Security ["Security Layer"]
        JWT["JWT Bearer Authorization"]
    end

    subgraph Backend ["Backend (Render)"]
        API["FastAPI Gateway"]
        Router["APIRouter (Auth, Jobs, Resume, AI, Assistant)"]
        API --> Router
    end

    subgraph AI_Engine ["AI & Machine Learning Engine"]
        spaCy["spaCy Parser (NLP Entity Extraction)"]
        XGB["XGBoost Match Scoring (13-Feature Classifier)"]
        Gemini["Google Gemini 1.5 Flash (Summary & Interview Generation)"]
    end

    subgraph Storage_DB ["Storage & Database"]
        Postgres[("PostgreSQL Database (Supabase SQL / ORM via SQLAlchemy)")]
        ChromaDB[("ChromaDB Vector Store (Policy Document Embeddings)")]
        Files[("Temp Storage / Resume Files")]
    end

    SPA -- HTTPS Requests + JWT --> Security
    Security --> API
    Router --> spaCy
    Router --> XGB
    Router --> Gemini
    Router --> Postgres
    Router --> ChromaDB
    Router --> Files
```

---

## 📈 ML Pipeline

The machine learning pipeline processes unstructured resume files to generate statistical scores and qualitative, LLM-driven feedback in a unified run.

```mermaid
flowchart TD
    A["Candidate Resume (PDF/DOCX)"] -->|PyMuPDF Text Extraction| B["Raw Resume Text"]
    B -->|spaCy Entity Extraction| C["Structured Resume Profile (Skills, Experience, Projects)"]
    Job["Job Description (Title, Required Skills, Exp)"] -->|Parsing & Structuring| D["Structured Job Profile"]
    C & D -->|Feature Engineering Engine| E["Engineered Features (13-Dimensions)"]
    
    subgraph Feature_Engineering ["Feature Engineering (13 Parameters)"]
        E1["matched_skill_count"]
        E2["missing_skill_count"]
        E3["skill_overlap_ratio"]
        E4["experience_gap"]
        E5["education_gap"]
        E6["project_match_count"]
        E7["certification_match_count"]
        E8["retrieval_score (Weighted)"]
        E9["title_similarity (Semantic)"]
    end
    
    E --> Feature_Engineering
    Feature_Engineering --> F["XGBoost Predictor (xgboost_model.pkl)"]
    F -->|Binary Classification + Probabilities| G["Match Probability & Recommendation Output"]
    
    G --> H["Google Gemini 1.5 Flash LLM Service"]
    H -->|Asynchronous asyncio.gather Execution| I["Summary, Skill Gap Analysis & Custom Interview Questions"]
```

---

## 🗄️ Database Schema

The relational database layer is managed through SQLAlchemy ORM, structuring the relationship between recruiters, candidates, jobs, applications, and uploaded resume assets.

```mermaid
erDiagram
    users {
        int id PK
        string name
        string email UK
        string password_hash
        string role
        datetime created_at
    }
    resumes {
        int id PK
        int user_id FK
        string resume_path
        datetime created_at
    }
    jobs {
        int id PK
        string title
        string department
        string location
        string employment_type
        string experience_required
        string description
        string required_skills
        string status
        int applicants
        int created_by FK
        datetime created_at
        datetime updated_at
    }
    applications {
        int id PK
        int candidate_id FK
        int job_id FK
        string status
        int match_score
        datetime applied_at
    }

    users ||--o{ resumes : "uploads"
    users ||--o{ jobs : "creates"
    users ||--o{ applications : "submits"
    jobs ||--o{ applications : "receives"
```

---

## 🛠️ How It Works

The platform coordinates candidate uploads, parsing, match scoring, and recruiter workflows in a structured process:

1. **Profile Registration & Resume Upload:** A candidate registers on the portal and uploads a resume in PDF or DOCX format. The file is saved securely to Supabase storage.
2. **Deterministic Extraction:** PyMuPDF extracts raw text, and the spaCy-based parsing module filters this text against structured taxonomies to extract specific skills, certifications, degrees, projects, and work history blocks.
3. **Feature Generation & Classification:** When the candidate applies for a job posting, the backend compares the candidate's parsed parameters against the recruiter's job requirements. It constructs a 13-dimensional feature vector (calculating ratios, overlaps, experience gaps, and semantic similarities) and feeds it to the trained XGBoost model. The model computes a decimal matching probability and outputs a recommendation state.
4. **GenAI Insight Generation:** In parallel to the classification scoring, the application executes asynchronous API calls to Google Gemini 1.5 Flash. It passes the candidate profile and requirements to produce a qualitative profile summary, an analysis of technical gaps, suggestions for profile improvement, and custom interview questions target-aligned with the applicant's weak areas.
5. **Recruiter Review & Pipeline Management:** The recruiter logs into the HR Recruiter portal, views overall application metrics on the Recharts-based analytics dashboard, inspects individual candidates (reviewing both the XGBoost score and Gemini-generated insights), uses the RAG chat assistant to verify policy compliance, and moves candidates through pipeline stages (Applied → Screening → Interview → Offer).

---

## ⚡ Challenges & Optimizations

This section outlines major engineering constraints encountered during deployment and the technical optimizations implemented to resolve them.

### 1. Render Free Tier Cold Starts (Latency & Timeouts)
* **Problem:** Under Render's free hosting tier, web service instances automatically spin down to a dormant state after 15 minutes of inactivity. When a user accessed the RecruitIQ landing page after this sleep period, the server initialization caused a 4 to 5-minute cold start delay, leading to connection timeouts on the frontend client.
* **Root Cause:** Render suspends the container during dormancy. The boot phase is slowed down because the application must load large Python wheels (pandas, scikit-learn, XGBoost, and standard libraries) into memory when the container starts.
* **Fix Applied:** Configured an external, high-frequency keep-alive ping loop using a free monitoring service (cron-job.org). The monitor sends an HTTP GET request to the `/health` endpoint every 14 minutes. This prevents the container from entering a sleeping state, keeping the server memory hot. To improve user experience during manual deployments or hard restarts, the React client frontend was updated with skeleton UI loaders and explicit warm-up indicators informing the user of active backend server spin-up.

### 2. Local ChromaDB Startup OOM Spikes
* **Problem:** Under tight hosting constraints, the backend gateway frequently encountered system Out-Of-Memory (OOM) errors during startup or deployment updates. The application container crashed and restarted repeatedly.
* **Root Cause:** The Render free tier restricts RAM usage to 512MB. By default, local ChromaDB instances load their entire vector collections from SQLite files into memory on initialization. This memory usage, combined with the memory footprint of importing machine learning models (XGBoost, spaCy, and Pandas), regularly exceeded the 512MB RAM ceiling.
* **Resolution/Mitigation:** 
  * *Immediate Mitigation:* Modified the application startup flow to decouple ChromaDB initialization. The document retriever is lazy-loaded on the first `/assistant/chat` request, rather than on server boot. The vector collection scope was also restricted to essential documents.
  * *Planned Migration:* Designing a migration path to Supabase `pgvector`. By storing embedding vectors as native database columns in the external Supabase instance, the application can perform cosine similarity search via raw SQL execution. This removes the local ChromaDB database process and vector memory footprint from the FastAPI container entirely, offloading vector computation to the database provider.

### 3. Per-Request GenerativeModel Initialization Overhead
* **Problem:** Initial performance testing of candidate analyses showed processing latencies of 8 to 10 seconds per resume evaluation. This caused slow rendering on the frontend and increased API thread blockages.
* **Root Cause:** The LLM service was instantiating a new `google.generativeai.GenerativeModel` object inside each endpoint call. This forced the application to establish a new network connection, pull Google API metadata, and perform credentials handshakes for every request.
* **Fix Applied:** Refactored the backend architecture to initialize the `GenerativeModel` object once as a global singleton at application startup. The `LLMService` is instantiated at the module level. Individual API routes access this pre-warmed singleton instance. This eliminated connection handshake overheads and reduced LLM execution latency to 2-3 seconds per analysis.

---

## 📸 Screenshots

<p align="center">
  <strong>HR Recruiter Dashboard</strong><br/>
  <img src="https://raw.githubusercontent.com/mansi-wagh/RecruitIQ/main/Readme/hr_dashboard.png" alt="HR Dashboard Screenshot" width="85%" onerror="this.src='https://placehold.co/800x400?text=HR+Recruiter+Dashboard'"/>
</p>

<p align="center">
  <strong>AI Matching & Analysis Insights</strong><br/>
  <img src="https://raw.githubusercontent.com/mansi-wagh/RecruitIQ/main/Readme/ai_analysis.png" alt="AI Analysis Screenshot" width="85%" onerror="this.src='https://placehold.co/800x400?text=AI+Analysis'"/>
</p>

<p align="center">
  <strong>Candidate Application Feed</strong><br/>
  <img src="https://raw.githubusercontent.com/mansi-wagh/RecruitIQ/main/Readme/candidate_portal.png" alt="Candidate Portal Screenshot" width="85%" onerror="this.src='https://placehold.co/800x400?text=Candidate+Portal'"/>
</p>

<p align="center">
  <strong>Policy-Grounded HR Chat Assistant</strong><br/>
  <img src="https://raw.githubusercontent.com/mansi-wagh/RecruitIQ/main/Readme/hr_assistant.png" alt="HR Assistant Screenshot" width="85%" onerror="this.src='https://placehold.co/800x400?text=HR+Assistant'"/>
</p>

---

## 🚀 Quickstart Guide

### Prerequisite Checklist
* **Python**: Version 3.11+
* **Node.js**: Version 18+ (npm or bun package manager)
* **PostgreSQL**: Version 15+ (Local instance or Supabase/Neon URL)

### 1. Clone the Repository
```bash
git clone https://github.com/mansi-wagh/RecruitIQ.git
cd RecruitIQ
```

### 2. Backend Setup
1. Navigate to the backend directory and create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   ```
2. Activate the virtual environment:
   * **Windows (Command Prompt / PowerShell):**
     ```powershell
     .\venv\Scripts\activate
     ```
   * **macOS / Linux:**
     ```bash
     source venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create an environment configuration file:
   Copy `.env.example` to `.env` and fill in the required database credentials, JWT secret keys, and Gemini API keys:
   ```bash
   cp .env.example .env
   ```
5. Apply database migrations to create tables:
   ```bash
   python -m alembic upgrade head
   ```
6. Start the FastAPI development server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create a frontend environment variables configuration:
   Create a file named `.env.local` inside the `frontend/` directory and configure the API gateway address:
   ```text
   VITE_API_URL=http://127.0.0.1:8000
   ```
4. Start the local React Vite development server:
   ```bash
   npm run dev
   ```

### 4. Portals Access
* **Candidate Portal:** Open `http://localhost:5173/` in your browser. Register/Login as a "Candidate" to upload resumes and apply to jobs.
* **HR Portal:** Open `http://localhost:5173/login/hr` in your browser. Register/Login as a "HR Recruiter" to create jobs, view applicant lists, trigger ML match runs, and access the RAG chat assistant.

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Required | Description | Example / Default |
|:---|:---:|:---|:---|
| `DATABASE_URL` | Yes | Connection string for PostgreSQL database | `postgresql://user:pass@host:5432/db` |
| `SECRET_KEY` | Yes | Cryptographic key used to sign JWT authentication tokens | `your-cryptographic-random-secret-key-32-bytes` |
| `ALGORITHM` | Yes | Hashing algorithm for JWT signature | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Yes | Expiration lifetime of the issued JWT token in minutes | `60` |
| `GEMINI_API_KEY` | Yes | API Key to request Gemini LLM completions | `AIzaSyD-YourGeminiKeyHere...` |
| `LLM_PROVIDER` | No | Selected LLM backend provider | `gemini` |
| `CORS_ORIGINS` | Yes | Comma-separated list of origins allowed to cross-reference API | `http://localhost:5173,http://127.0.0.1:5173` |
| `SUPABASE_URL` | Yes | Supabase URL for file bucket interactions | `https://yourproj.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY`| Yes | Secure service role key for Supabase administrative actions | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...` |
| `SUPABASE_BUCKET` | Yes | Supabase Storage bucket target for candidate resumes | `resumes` |

### Frontend Configuration (`frontend/.env.local`)

| Variable | Required | Description | Example / Default |
|:---|:---:|:---|:---|
| `VITE_API_URL` | Yes | Root URL pointing to the active FastAPI backend instance | `http://127.0.0.1:8000` |

---

## 📁 Project Structure

```text
RecruitIQ/
├── backend/
│   ├── app/
│   │   ├── auth/           # JWT token generation, verification, and RBAC middleware
│   │   ├── chroma_db/      # Policy vectors files directory
│   │   ├── data/           # Parsed data schema CSV references (skills.csv)
│   │   ├── datasets/       # Local evaluation arrays and reference text files
│   │   ├── llm/            # Gemini API integration wrapper & prompt templates
│   │   ├── models/         # SQLAlchemy model definitions (user, job, application, resume)
│   │   ├── rag/            # Vector indexing and PDF text chunk retrievers
│   │   ├── routers/        # FastAPI HTTP path endpoint handlers (ai, auth, jobs, applications)
│   │   ├── schemas/        # Pydantic schemas for request validation & response serialization
│   │   ├── scripts/        # Data extraction scripts and database bootstrap tools
│   │   ├── services/       # XGBoost match predictors and spaCy text entity parsers
│   │   ├── config.py       # Global environment variable load settings
│   │   ├── database.py     # SQLAlchemy session maker & database connection configurations
│   │   └── main.py         # Entry point initialization for FastAPI app
│   ├── migrations/         # Alembic database tables history schemas
│   ├── requirements.txt    # Python packages registry
│   └── alembic.ini         # Database migration configuration file
└── frontend/
    ├── src/
    │   ├── assets/         # Deployed static graphics and brand images
    │   ├── components/     # Reusable layout interfaces (UI blocks, sidebar, buttons)
    │   ├── hooks/          # React hooks managing global queries & mutations
    │   ├── lib/            # Axios API instances configured with auth interceptors
    │   ├── routes/         # TanStack routes managing candidate & recruiter views
    │   ├── routeTree.gen.ts# Auto-compiled routes map
    │   ├── router.tsx      # Main application router mount
    │   └── styles.css      # Styling rules
    └── package.json        # Node dependency configuration manifest
```

---

## 🔌 API Reference

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|:---:|:---|:---:|:---|
| `POST` | `/auth/register` | Public | Registers a new account (HR Recruiter or Candidate role) |
| `POST` | `/auth/login` | Public | Authenticates credentials and returns a stateless bearer JWT token |
| `GET` | `/auth/me` | JWT | Retrieves profile data of the currently logged-in user |
| `PUT` | `/auth/me` | JWT | Updates user profile name, email, or password securely |
| `POST` | `/auth/forgot-password` | Public | Generates a temporary reset password for emergency recovery |

### Job Management Endpoints

| Method | Endpoint | Auth | Description |
|:---:|:---|:---:|:---|
| `GET` | `/jobs` | JWT | Lists all jobs available in the database |
| `GET` | `/jobs/{job_id}` | JWT | Retrieves full detail configuration of a specific job |
| `POST` | `/jobs` | JWT (HR) | Creates a new job posting |
| `PUT` | `/jobs/{job_id}` | JWT (HR) | Updates parameters of an existing job posting |
| `DELETE` | `/jobs/{job_id}` | JWT (HR) | Removes a job posting and cascade deletes related applications |

### Resume Parsing & Storage

| Method | Endpoint | Auth | Description |
|:---:|:---|:---:|:---|
| `POST` | `/resume/upload` | JWT | Uploads candidate resume file (PDF/DOCX) to Supabase Storage |
| `POST` | `/resume/extract` | JWT | Parses text and returns structured properties extracted from the file |

### Candidate Application & Analytics

| Method | Endpoint | Auth | Description |
|:---:|:---|:---:|:---|
| `POST` | `/applications/` | JWT | Submits a new job application linking candidate profile to a job |
| `GET` | `/applications/` | JWT | Lists all job applications submitted by the logged-in candidate |
| `GET` | `/applications/hr` | JWT (HR) | Lists all applications across all jobs for the HR portal |
| `DELETE` | `/applications/{application_id}` | JWT | Cancels or removes an application |
| `PATCH` | `/applications/{application_id}/status` | JWT (HR) | Updates the state of an application (Applied → Screening → Interview → Offer) |
| `GET` | `/candidates/` | JWT (HR) | Retrieves a list of candidates registered in the system |
| `GET` | `/candidates/stats` | JWT (HR) | Computes overall hiring performance metrics and status KPIs |
| `GET` | `/candidates/{id}` | JWT (HR) | Retrieves specific details and resumes profile of a candidate |
| `DELETE` | `/candidates/{id}` | JWT (HR) | Removes candidate profile and cascade deletes related applications |
| `GET` | `/reports/charts` | JWT (HR) | Computes timeseries counts and application metrics for Recharts charts |

### AI Analysis & RAG Assistant

| Method | Endpoint | Auth | Description |
|:---:|:---|:---:|:---|
| `GET` | `/ai/resumes` | JWT (HR) | Lists candidate ids having active parsed resumes uploaded |
| `GET` | `/ai/jobs` | JWT (HR) | Lists job ids available for comparative matching |
| `POST` | `/ai/analyze` | JWT (HR) | Executes XGBoost match scoring and Gemini LLM gap/interview evaluation |
| `POST` | `/assistant/chat` | JWT (HR) | Submits user queries to RAG Assistant querying policy files in ChromaDB |

---

## 🗺️ Roadmap

- [x] **Relational Core Integration:** Configure Supabase PostgreSQL DB with database migrations managed via Alembic.
- [x] **RBAC Security Guarding:** Secure frontend routes and backend APIs using stateless JWT authentication with Candidate vs. HR role boundary enforcement.
- [x] **Asynchronous GenAI Analysis:** Process resume-to-job gap analysis, customized interview questions, and candidates summaries using Gemini 1.5 Flash singletons in parallel tasks.
- [x] **RAG Chat Integration:** Boot-load local company policy documents into a ChromaDB vector store for conversational HR questions.
- [x] **Data-Driven Match Classification:** Train a 13-feature XGBoost classifier to compute statistical compatibility recommendations.
- [ ] **Vector Store Migration:** Move embeddings repository from local ChromaDB to Supabase `pgvector` to resolve memory limits and prevent OOMs under 512MB RAM constraints.
- [ ] **Bulk Resume Import:** Support processing directories of resumes in background queue tasks with progress tracking logs.
- [ ] **Custom Assessment Criteria:** Allow recruiters to dynamically adjust feature weights in the XGBoost predictor directly from the UI.
- [ ] **Automated Candidate Alerts:** Trigger email notifications via SendGrid/Resend when a candidate's pipeline status transitions to "Interview" or "Offer".

---

## 👨‍💻 Developer Section

RecruitIQ was conceptualized, designed, built, and deployed independently by a solo developer. 

The scope of this project required full-stack ownership across several engineering disciplines:
* **System Architecture:** Decoupling frontend static assets hosting from API containers, implementing stateless token-based authorization protocols, and configuring database connection pools.
* **Machine Learning Pipeline:** Designing the feature engineering pipeline, generating training datasets of matches, training and evaluating an XGBoost binary classifier, and integrating Google Gemini's generative models within asynchronous task flows.
* **Database Design:** Establishing relational database models, writing Alembic migrations schemas, and designing RAG indexing paths.
* **Frontend Engineering:** Creating dashboards in React, managing routing states with TanStack Router, creating charts with Recharts, and writing client state query hooks.
* **DevOps & Cloud Deployments:** Deploying and configuring environments on Render and Vercel, integrating Supabase storage, setting up cron-based keep-alive loops to bypass host system sleep rules, and resolving container-level memory allocations under free-tier limits.

---

## 📄 License

This project is licensed under the terms of the MIT License. See the [LICENSE](LICENSE) file for details.
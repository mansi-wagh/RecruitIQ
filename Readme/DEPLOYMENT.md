# RecruitIQ 100% Free Production Deployment Guide

This guide details how to deploy the entire **RecruitIQ** recruitment platform (React Frontend + FastAPI Backend + PostgreSQL Database) for **100% free** using modern serverless hosting providers.

---

## The 100% Free Hosting Stack

We will use the following free tiers to deploy RecruitIQ:
1. **Database**: **Supabase** or **Neon** (Free Serverless PostgreSQL)
2. **Backend Services**: **Render** or **Koyeb** (Free Serverless Python Hosting)
3. **Frontend Application**: **Vercel** or **Netlify** (Free Static React/Vite Hosting)

---

## Step 1: Deploy a Free PostgreSQL Database

We will deploy a managed PostgreSQL database instance using Neon.

1. Create a free account at [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2. Create a new project called `recruitiq-db`.
3. In the Neon dashboard, navigate to **Connection String** and copy the URI.
   * It will look like: `postgresql://alex:password@ep-cool-snowflake-12345.us-east-2.aws.neon.tech/neondb?sslmode=require`
   * Save this connection string safely — you will need it for the backend environment setup.

---

## Step 2: Deploy the FastAPI Backend (Render)

Render provides a completely free tier for server instances running Python/FastAPI.

### 1. Preparations
Ensure your backend has the requirements listed inside [backend/requirements.txt](file:///d:/Projects/RecruitIQ/backend/requirements.txt).

### 2. Set Up Render Web Service
1. Create a free account at [Render.com](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the following parameters:
   * **Name**: `recruitiq-backend`
   * **Root Directory**: `backend`
   * **Environment**: `Python`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   * **Instance Type**: `Free`

### 3. Add Environment Variables
Click **Environment** in the Render sidebar and add the following variables:
* `DATABASE_URL` = *[Your Neon/Supabase Connection String from Step 1]*
* `JWT_SECRET_KEY` = `generate_any_random_string_secret`
* `GEMINI_API_KEY` = *[Your Google Gemini API Key]*
* `CORS_ORIGINS` = `https://recruitiq-frontend.vercel.app` (Your frontend URL once deployed)

### 4. Deploy and Verify
* Render will trigger a build from your GitHub commit.
* Once the build completes, your backend API will be live at `https://recruitiq-backend.onrender.com`.
* Open `https://recruitiq-backend.onrender.com/health` in your browser. It should return `{"status": "healthy"}`.

---

## Step 3: Run Database Migrations

You must create the tables in your free online database:

1. Open your terminal in the `backend/` directory of your project.
2. Update the `DATABASE_URL` inside your local `backend/.env` file temporarily to match the online Neon database URL.
3. Run the Alembic upgrade command:
   ```bash
   python -m alembic upgrade head
   ```
4. Verify the tables are created in Neon's dashboard under the **Tables** tab.

---

## Step 4: Deploy the React Frontend (Vercel)

Vercel is the industry-standard free hosting platform for Vite/React applications.

1. Create a free account at [Vercel.com](https://vercel.com).
2. Click **Add New** -> **Project** and select your RecruitIQ GitHub repository.
3. Configure the Project settings:
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Add the following **Environment Variable**:
   * `VITE_API_URL` = `https://recruitiq-backend.onrender.com` (Your deployed Render backend URL)
5. Click **Deploy**.

Vercel will build and serve your app. Your RecruitIQ platform is now **fully deployed and operational online for 100% free**!


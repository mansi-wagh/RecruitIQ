FROM python:3.11-slim as builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY app/ app/
RUN mkdir -p uploads/resumes

# Pre-download SentenceTransformer model and build/index ChromaDB database at build time.
# This prevents runtime downloading and full document indexing latency on Render container start.
# We use dummy environment variables to prevent import-time config validation failures.
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy SECRET_KEY=dummy python -c "from app.rag.retriever import DocumentRetriever; DocumentRetriever()"

EXPOSE 8000
ENV PORT=8000
ENV HOST=0.0.0.0

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

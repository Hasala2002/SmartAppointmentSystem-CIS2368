# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
# - postgresql-client: provides pg_isready used to wait for the DB to be ready
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Install Python dependencies first to maximize Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application source. .dockerignore keeps secrets like
# .env and editor cruft out of the image.
COPY . .

# Expose API port
EXPOSE 8000

# Healthcheck uses Python (already in the image) instead of curl so we don't
# need to install extra packages.
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD python -c "import urllib.request,sys; sys.exit(0) if urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=5).status==200 else sys.exit(1)" || exit 1

# Wait for Postgres, run schema/admin bootstrap, seed baseline data, then
# launch uvicorn. seed.py is idempotent (ON CONFLICT DO NOTHING) so it's safe
# to run on every container start.
CMD ["sh", "-c", "echo 'Starting API service...' && \
    echo 'Waiting for PostgreSQL at '\"${DB_HOST:-db}\":\"${DB_PORT:-5432}\"'...' && \
    until pg_isready -h \"${DB_HOST:-db}\" -p \"${DB_PORT:-5432}\" -U \"${DB_USER:-postgres}\"; do sleep 2; done && \
    echo 'PostgreSQL is up - initializing database' && \
    python init_db.py && \
    echo 'Seeding baseline data...' && \
    python seed.py && \
    echo 'Starting uvicorn server...' && \
    exec uvicorn main:app --host 0.0.0.0 --port 8000"]

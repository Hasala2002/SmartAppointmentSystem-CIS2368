#!/bin/bash
set -e

echo "Starting API service..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
until pg_isready -h "${DB_HOST:-db}" -p "${DB_PORT:-5432}" -U "${DB_USER:-postgres}"; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up - initializing database"

# Run database initialization script
python init_db.py

echo "Starting uvicorn server..."
# Start the FastAPI application
exec uvicorn main:app --host 0.0.0.0 --port 8000

# Smart Appointment System

A full-stack appointment booking and queue management system.

## Tech Stack

| Layer    | Technology                       |
| -------- | -------------------------------- |
| Frontend | React, TypeScript, Mantine, Vite |
| Backend  | Python, FastAPI                  |
| Database | PostgreSQL (AWS RDS)             |
| Monorepo | Turborepo                        |

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL database

### Installation

```bash
# Install Node dependencies
yarn

# Setup Python virtual environment
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

### Environment Variables

Copy the example env file and add your database connection:

```bash
cp apps/api/.env.example apps/api/.env
```

### Development

```bash
# Run both frontend and backend
yarn dev

# Frontend only (http://localhost:5173)
yarn dev --filter=web

# Backend only (http://localhost:8000)
yarn dev --filter=api
```

### API Health Check

```
GET http://localhost:8000/health
```

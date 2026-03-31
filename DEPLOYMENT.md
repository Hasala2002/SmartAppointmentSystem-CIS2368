# Deployment Guide - Coolify with Caddy

This guide will help you deploy the Smart Appointment System to Coolify with Caddy as a reverse proxy.

## Prerequisites

- Coolify instance running
- Domain names pointing to your server
- DNS A/AAAA records configured for your domains

## Domain Setup

You'll need **three subdomains**:
- `api.yourdomain.com` - Backend API
- `app.yourdomain.com` - Customer web portal
- `admin.yourdomain.com` - Admin dashboard

### DNS Configuration

Point all three domains to your Coolify server's IP address:

```
A    api.yourdomain.com      -> YOUR_SERVER_IP
A    app.yourdomain.com      -> YOUR_SERVER_IP
A    admin.yourdomain.com    -> YOUR_SERVER_IP
```

## Deployment Steps

### 1. Create Environment File

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Database Configuration
# Use your Neon/external DB URL, or for local: postgresql://postgres:password@db:5432/appointmentdb
DATABASE_URL=postgresql://neondb_owner:your_password@your-host.neon.tech/neondb?sslmode=require
DB_PASSWORD=CHANGE_THIS_TO_SECURE_PASSWORD

# Domain Configuration
API_DOMAIN=api.yourdomain.com
WEB_DOMAIN=app.yourdomain.com
ADMIN_DOMAIN=admin.yourdomain.com

# SSL Certificate Email
ACME_EMAIL=your-email@example.com

# JWT Configuration
JWT_SECRET_KEY=GENERATE_A_STRONG_SECRET_KEY_HERE
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Application Environment
APP_ENV=production
DEBUG=false

# CORS (will auto-configure based on domains)
CORS_ORIGINS=["https://app.yourdomain.com","https://admin.yourdomain.com"]
```

### 2. Deploy to Coolify

#### Option A: Via Git Repository

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. In Coolify, create a new project
3. Select "Docker Compose" as the deployment type
4. Connect your Git repository
5. Set the environment variables from your `.env` file in Coolify's UI
6. Deploy!

#### Option B: Via Docker Compose Directly

1. Upload your project files to the Coolify server
2. In Coolify, create a new "Docker Compose" resource
3. Point it to your `docker-compose.yml` file
4. Configure environment variables in Coolify's UI
5. Deploy!

### 3. Verify Deployment

Once deployed, verify each service:

- **API**: `https://api.yourdomain.com/health`
- **Web**: `https://app.yourdomain.com`
- **Admin**: `https://admin.yourdomain.com`

## Architecture

```
                           ┌─────────────┐
                           │   Caddy     │
                           │  (Port 80)  │
                           │  (Port 443) │
                           └──────┬──────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
        ┌───────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
        │     API      │  │     Web     │  │    Admin    │
        │  (FastAPI)   │  │   (React)   │  │   (React)   │
        │  Port 8000   │  │   Port 80   │  │   Port 80   │
        └───────┬──────┘  └─────────────┘  └─────────────┘
                │
        ┌───────▼──────┐
        │  PostgreSQL  │
        │  Port 5432   │
        └──────────────┘
```

## Features

✅ **Automatic HTTPS**: Caddy automatically provisions and renews SSL certificates via Let's Encrypt  
✅ **HTTP/3 Support**: Modern protocol support  
✅ **Gzip Compression**: Automatic compression for better performance  
✅ **Security Headers**: Built-in security headers (X-Frame-Options, etc.)  
✅ **Database Initialization**: Schema automatically applied on first run  
✅ **Health Checks**: All services have health checks configured  
✅ **Persistent Storage**: Database data persists across restarts  

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | Full database connection URL | - | **Yes** |
| `DB_PASSWORD` | Database password (for local db) | `postgres` | No |
| `API_DOMAIN` | API domain | - | **Yes** |
| `WEB_DOMAIN` | Web app domain | - | **Yes** |
| `ADMIN_DOMAIN` | Admin app domain | - | **Yes** |
| `ACME_EMAIL` | Email for SSL certs | - | **Yes** |
| `JWT_SECRET_KEY` | JWT signing key | - | **Yes** |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` | No |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry | `30` | No |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token expiry | `7` | No |
| `APP_ENV` | Environment | `production` | No |
| `DEBUG` | Debug mode | `false` | No |

## Troubleshooting

### SSL Certificate Issues

If SSL certificates aren't provisioning:
1. Verify DNS records are pointing to your server
2. Ensure ports 80 and 443 are accessible
3. Check Caddy logs: `docker compose logs caddy`
4. Verify `ACME_EMAIL` is set correctly

### Database Connection Issues

If the API can't connect to the database:
1. Check database logs: `docker compose logs db`
2. Verify `DATABASE_URL` is correctly formatted
3. Ensure the database container is healthy: `docker compose ps`

### CORS Issues

If you get CORS errors:
1. Verify `CORS_ORIGINS` includes your frontend domains with `https://`
2. Ensure domains match exactly (no trailing slashes)
3. Restart the API container after changing CORS settings

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api
docker compose logs -f caddy
docker compose logs -f db
```

## Updating the Application

```bash
# Pull latest changes (if using Git)
git pull

# Rebuild and restart
docker compose down
docker compose up -d --build
```

## Backup Database

```bash
# Create backup
docker compose exec db pg_dump -U postgres appointment_system > backup.sql

# Restore backup
docker compose exec -T db psql -U postgres appointment_system < backup.sql
```

## Scaling

To scale services (web/admin):

```bash
docker compose up -d --scale web=3 --scale admin=2
```

Caddy will automatically load balance between instances.

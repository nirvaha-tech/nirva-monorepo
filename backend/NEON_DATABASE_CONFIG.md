# Neon Database Configuration

Your production database is now configured and synced with Neon PostgreSQL.

## ✅ Migration Status

- **Current Version**: `732a9cab3950` (head)
- **Database**: Neon PostgreSQL (eu-central-1)
- **Connection Type**: Pooled (via PgBouncer)

## Connection Details

### For Application Use (Recommended - with connection pooling):

```bash
DATABASE_URL=postgresql+asyncpg://neondb_owner:npg_06TefxnrECmd@ep-super-truth-agjsq2st-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### For Direct Connection (Admin operations, migrations):

```bash
DATABASE_URL=postgresql+asyncpg://neondb_owner:npg_06TefxnrECmd@ep-super-truth-agjsq2st.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### Individual Parameters:

```bash
POSTGRES_SERVER=ep-super-truth-agjsq2st-pooler.c-2.eu-central-1.aws.neon.tech
POSTGRES_USER=neondb_owner
POSTGRES_PASSWORD=npg_06TefxnrECmd
POSTGRES_DB=neondb
POSTGRES_PORT=5432
```

## Environment Setup

### Local Development

Create a `.env` file in the `backend/` directory:

```env
# Neon PostgreSQL (Production)
DATABASE_URL=postgresql+asyncpg://neondb_owner:npg_06TefxnrECmd@ep-super-truth-agjsq2st-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

# CORS
BACKEND_CORS_ORIGINS=http://localhost:3000,https://your-domain.com

# Project
PROJECT_NAME=Nirvahatech API
VERSION=1.0.0
API_V1_STR=/api/v1
```

### Vercel Deployment

Add these environment variables in your Vercel project settings:

1. Go to: Project → Settings → Environment Variables
2. Add:
   - `DATABASE_URL` = `postgresql+asyncpg://neondb_owner:npg_06TefxnrECmd@ep-super-truth-agjsq2st-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require`
   - `BACKEND_CORS_ORIGINS` = `https://your-frontend-domain.com`

## Running Future Migrations

When you create new migrations:

```bash
cd backend
source .venv/bin/activate

# Set database URL
export DATABASE_URL="postgresql+asyncpg://neondb_owner:npg_06TefxnrECmd@ep-super-truth-agjsq2st-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Check current state
alembic current

# Run new migrations
alembic upgrade head
```

Or use the convenience script:

```bash
./migrate.sh production
```

## Database Schema

The `leads` table is now created with:

- **id**: Primary key (auto-increment)
- **name**: String (255), required
- **email**: String (255), required, indexed
- **company**: String (255), required, indexed
- **job_title**: String (255), required
- **phone**: String (50), optional
- **project_description**: Text, required
- **created_at**: Timestamp, required, indexed
- **updated_at**: Timestamp, required

## Neon Dashboard

Access your database dashboard at: https://console.neon.tech

Features available:
- SQL Editor for querying
- Monitoring and metrics
- Backups and point-in-time recovery
- Branching for development

## Testing the Connection

Test your database connection:

```bash
cd backend
source .venv/bin/activate

# Set the database URL
export DATABASE_URL="postgresql+asyncpg://neondb_owner:npg_06TefxnrECmd@ep-super-truth-agjsq2st-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Start the API
uvicorn app.main:app --reload
```

Then test the health endpoint:
```bash
curl http://localhost:8000/health
```

## Security Notes

⚠️ **Important**: 
- Never commit `.env` files to version control
- Rotate credentials if accidentally exposed
- Use environment variables in production
- The credentials shown here should be rotated after initial setup

## Support

- **Neon Documentation**: https://neon.tech/docs
- **Alembic Documentation**: https://alembic.sqlalchemy.org/
- **FastAPI Database**: https://fastapi.tiangolo.com/tutorial/sql-databases/


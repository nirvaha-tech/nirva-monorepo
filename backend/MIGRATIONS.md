# Database Migrations Guide

This guide explains how to manage database migrations for the Nirvahatech backend.

## Overview

We use **Alembic** for database migrations. Alembic is a lightweight database migration tool for SQLAlchemy.

## Quick Start

### Local Development

To run migrations on your local database:

```bash
cd backend
source .venv/bin/activate
./migrate.sh local
```

### Production

To run migrations on production database:

```bash
cd backend
source .venv/bin/activate

# Set production database credentials
export POSTGRES_SERVER="your-production-db.postgres.database.azure.com"
export POSTGRES_USER="your_user"
export POSTGRES_PASSWORD="your_password"
export POSTGRES_DB="nirvahatech_prod"
export POSTGRES_PORT="5432"

# Run migrations
./migrate.sh production
```

Alternatively, you can set the full database URL directly:

```bash
export DATABASE_URL="postgresql+asyncpg://user:pass@host:5432/dbname"
./migrate.sh production
```

## Manual Migration Commands

### Check Current Database Version

```bash
alembic current
```

### View Migration History

```bash
alembic history --indicate-current
```

### Upgrade to Latest Version

```bash
alembic upgrade head
```

### Upgrade/Downgrade to Specific Version

```bash
alembic upgrade <revision_id>
alembic downgrade <revision_id>
```

### Downgrade One Version

```bash
alembic downgrade -1
```

## Creating New Migrations

### Auto-generate Migration (Recommended)

When you modify models, generate a migration automatically:

```bash
alembic revision --autogenerate -m "description of changes"
```

### Create Empty Migration

To create a custom migration:

```bash
alembic revision -m "description of changes"
```

Then edit the generated file in `alembic/versions/` to add your migration logic.

## Current Migrations

### 732a9cab3950 - Create Leads Table (2025-11-15)

Creates the initial `leads` table with the following schema:

- **id**: Primary key (auto-increment)
- **name**: String(255), required
- **email**: String(255), required, indexed
- **company**: String(255), required, indexed
- **job_title**: String(255), required
- **phone**: String(50), optional
- **project_description**: Text, required
- **created_at**: DateTime, required, indexed
- **updated_at**: DateTime, required

**Indexes:**
- Primary key on `id`
- Index on `email`
- Index on `created_at`
- Composite index on `email` and `created_at`
- Index on `company`

## Production Database Setup

### Option 1: Using Vercel Postgres

If using Vercel Postgres:

1. Get your database connection string from Vercel dashboard
2. Set it as an environment variable:
   ```bash
   export DATABASE_URL="your_vercel_postgres_url"
   ```

### Option 2: Using External PostgreSQL

1. Set up PostgreSQL database (Azure, AWS RDS, etc.)
2. Configure environment variables:
   ```bash
   export POSTGRES_SERVER="your-db-host.com"
   export POSTGRES_USER="your_user"
   export POSTGRES_PASSWORD="your_password"
   export POSTGRES_DB="nirvahatech"
   export POSTGRES_PORT="5432"
   ```

### Option 3: Direct Connection via Alembic

Edit `alembic.ini` temporarily or use environment override:

```bash
alembic -x dbUrl="postgresql+asyncpg://user:pass@host:5432/db" upgrade head
```

## Troubleshooting

### "Can't locate revision identified by"

This usually means the database's migration state is out of sync. Check:

```bash
alembic current
alembic history
```

### "Could not connect to database"

Verify your database credentials and that the database server is accessible:

```bash
psql -h $POSTGRES_SERVER -U $POSTGRES_USER -d $POSTGRES_DB
```

### "Module not found" Errors

Ensure you're in the virtual environment and dependencies are installed:

```bash
source .venv/bin/activate
pip install -r requirements.txt
```

### Missing `greenlet` Module

If you see "No module named 'greenlet'":

```bash
pip install greenlet
```

## Database Connection Format

The connection string format for PostgreSQL with async support:

```
postgresql+asyncpg://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

Example:
```
postgresql+asyncpg://myuser:mypass@localhost:5432/nirvahatech
```

## Best Practices

1. **Always review auto-generated migrations** before applying them
2. **Test migrations on local/staging** before production
3. **Back up production database** before running migrations
4. **Never edit applied migrations** - create a new migration instead
5. **Use descriptive migration messages** for clarity
6. **Version control all migrations** in git

## CI/CD Integration

For automated deployments, add migration step to your pipeline:

```bash
# In your deployment script
cd backend
source .venv/bin/activate
alembic upgrade head
```

## Support

For issues or questions, contact the DevOps team or refer to:
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)


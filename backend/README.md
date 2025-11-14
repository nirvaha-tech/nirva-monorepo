# Nirvahatech Backend API

Enterprise-grade FastAPI backend for DevOps and Cloud Infrastructure lead management.

## 🚀 Features

- **FastAPI Framework**: Modern, fast (high-performance) web framework
- **Async/Await**: Fully asynchronous request handling
- **PostgreSQL Database**: Robust data persistence with Neon PostgreSQL
- **Type Safety**: Full type hints with Pydantic models
- **Database Migrations**: Alembic for version-controlled schema changes
- **API Documentation**: Auto-generated OpenAPI (Swagger) docs
- **CORS Support**: Configurable cross-origin resource sharing
- **Production Ready**: Designed for deployment on Vercel/serverless

## 📋 Requirements

- Python 3.11+
- Poetry 1.5+ (for dependency management)
- PostgreSQL 14+ (or Neon PostgreSQL)

## 🛠️ Installation

### 1. Install Poetry

If you don't have Poetry installed:

```bash
# macOS/Linux/WSL
curl -sSL https://install.python-poetry.org | python3 -

# Or with pip (not recommended)
pip install poetry

# Or with Homebrew (macOS)
brew install poetry
```

### 2. Clone the repository

```bash
git clone https://github.com/nirvaha-tech/nirva-monorepo.git
cd nirva-monorepo/backend
```

### 3. Install dependencies

```bash
# Install all dependencies (including dev)
poetry install

# Or install only production dependencies
poetry install --only main

# Activate the virtual environment
poetry shell
```

### 4. Configure environment variables

Create a `.env` file:

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname

# API Settings
PROJECT_NAME=Nirvahatech API
VERSION=1.0.0
API_V1_STR=/api/v1

# CORS
BACKEND_CORS_ORIGINS=http://localhost:3000,https://your-domain.com

# PostgreSQL (if not using DATABASE_URL)
POSTGRES_SERVER=your-db-host.com
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=neondb
POSTGRES_PORT=5432
```

### 5. Run database migrations

```bash
# Using the convenience script
./migrate.sh local

# Or using Make
make migrate

# Or manually with Poetry
poetry run alembic upgrade head
```

## 🚦 Running the Application

### Development Mode

```bash
# Using Make (recommended)
make run

# Or with Poetry directly
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

```bash
# Using Make
make run-prod

# Or with Poetry
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Using Docker

```bash
docker-compose up -d
```

## 📚 API Documentation

Once the server is running, access:

- **Interactive API docs (Swagger UI)**: http://localhost:8000/docs
- **Alternative API docs (ReDoc)**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🧪 Testing

### Run all tests

```bash
# Using Make
make test

# Or with Poetry
poetry run pytest
```

### Run with coverage

```bash
# Using Make
make test

# Or with Poetry
poetry run pytest --cov=app --cov-report=html
```

### Run tests without coverage (faster)

```bash
make test-fast
```

### Run specific test file

```bash
poetry run pytest tests/test_leads.py
```

## 🗄️ Database Management

### Check database schema

```bash
make db-check
# or
poetry run python check_db_schema.py
```

### Test database connection

```bash
make db-test
# or
poetry run python test_db_insert.py
```

### Create migration

```bash
make migration msg="description of changes"
# or
poetry run alembic revision --autogenerate -m "description of changes"
```

### Apply migrations

```bash
make migrate
# or
poetry run alembic upgrade head
```

### Rollback migration

```bash
make migrate-down
# or
poetry run alembic downgrade -1
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/   # API endpoint handlers
│   │       └── router.py    # API router configuration
│   ├── core/
│   │   └── config.py        # Application configuration
│   ├── db/
│   │   ├── base.py          # Database base class
│   │   └── session.py       # Database session management
│   ├── models/              # SQLAlchemy models
│   │   └── lead.py
│   └── schemas/             # Pydantic schemas
│       └── lead.py
├── alembic/                 # Database migrations
│   ├── versions/
│   └── env.py
├── tests/                   # Test files
├── requirements.txt         # Production dependencies
├── requirements-dev.txt     # Development dependencies
├── pyproject.toml          # Modern Python project config
├── setup.py                # Package setup
└── README.md               # This file
```

## 🔒 Security

- All database credentials should be stored in environment variables
- Never commit `.env` files to version control
- Use strong passwords for production databases
- Enable SSL for database connections
- Review `SECURITY.md` for more details

## 🚀 Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Configure environment variables in Vercel dashboard
3. Deploy: `vercel --prod`

### Docker

```bash
docker build -t nirvahatech-backend .
docker run -p 8000:8000 nirvahatech-backend
```

### Traditional Server

```bash
# Using gunicorn with uvicorn workers
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

## 📊 API Endpoints

### Health Check

```bash
GET /health
```

### Leads Management

```bash
POST /api/v1/leads
GET /api/v1/leads
GET /api/v1/leads/{id}
```

Example request:

```bash
curl -X POST http://localhost:8000/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Tech Corp",
    "job_title": "CTO",
    "phone": "+1-555-0100",
    "project_description": "Need help with Kubernetes infrastructure"
  }'
```

## 🛠️ Development

### Adding Dependencies

```bash
# Add a production dependency
poetry add <package-name>

# Add a development dependency
poetry add -G dev <package-name>

# Remove a dependency
poetry remove <package-name>

# Update dependencies
poetry update
```

### Code Formatting

```bash
# Format code with Black and isort
make format

# Or manually
poetry run black app/
poetry run isort app/

# Check formatting without changing files
make format-check
```

### Code Quality

```bash
# Run linters
make lint

# Run security checks
make security

# Run all pre-commit hooks
make pre-commit
```

### Type Checking

```bash
poetry run mypy app/
```

### Pre-commit Hooks

```bash
# Install hooks
make pre-commit-install
# or
poetry run pre-commit install

# Run all hooks
make pre-commit
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PROJECT_NAME` | API project name | Nirvahatech API |
| `VERSION` | API version | 1.0.0 |
| `API_V1_STR` | API v1 prefix | /api/v1 |
| `BACKEND_CORS_ORIGINS` | Allowed CORS origins (comma-separated) | localhost:3000 |

## 📖 Additional Documentation

- [Database Migrations Guide](MIGRATIONS.md)
- [Neon Database Configuration](NEON_DATABASE_CONFIG.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

## 🤝 Support

For issues, questions, or contributions:

- Create an issue: [GitHub Issues](https://github.com/nirvaha-tech/nirva-monorepo/issues)
- Email: engineering@nirvahatech.com

## 📄 License

Copyright (c) 2024 Nirvahatech. All rights reserved.
This software is proprietary and confidential.

## 🏗️ Built With

- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
- [SQLAlchemy](https://www.sqlalchemy.org/) - SQL toolkit and ORM
- [Pydantic](https://pydantic-docs.helpmanual.io/) - Data validation
- [Alembic](https://alembic.sqlalchemy.org/) - Database migrations
- [Uvicorn](https://www.uvicorn.org/) - ASGI server
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Neon](https://neon.tech/) - Serverless PostgreSQL

---

Made with ❤️ by the Nirvahatech Engineering Team


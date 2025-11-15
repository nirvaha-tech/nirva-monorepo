# Docker Setup for Nirvahatech Backend

This guide explains how to use Docker and Docker Compose with Poetry for the Nirvahatech backend.

## 📋 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

## 🏗️ Docker Images

### Production Image (`Dockerfile`)

Multi-stage build optimized for production:
- **Stage 1 (builder)**: Installs Poetry and dependencies
- **Stage 2 (runtime)**: Minimal runtime image with only production dependencies
- Uses non-root user for security
- Includes health checks
- Size-optimized with layer caching

### Development Image (`Dockerfile.dev`)

Development-friendly image with:
- Poetry installed for adding/updating dependencies
- All dependencies (including dev tools)
- Hot-reload support
- PostgreSQL client tools
- Git and Make for development

## 🚀 Quick Start

### Production Mode

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Development Mode

```bash
# Build and start dev services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f backend

# Rebuild after dependency changes
docker-compose -f docker-compose.dev.yml up -d --build

# Stop services
docker-compose -f docker-compose.dev.yml down
```

## 🛠️ Common Tasks

### Building Images

```bash
# Build production image
docker build -t nirvahatech-backend:latest backend/

# Build development image
docker build -t nirvahatech-backend:dev -f backend/Dockerfile.dev backend/

# Using Make (from backend directory)
cd backend
make docker-build
```

### Running Containers

```bash
# Run production container
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql+asyncpg://..." \
  nirvahatech-backend:latest

# Run with environment file
docker run -p 8000:8000 --env-file .env nirvahatech-backend:latest

# Using Make
make docker-run
```

### Managing Dependencies

#### Adding a Dependency

```bash
# Start a shell in the container
docker-compose -f docker-compose.dev.yml exec backend bash

# Inside container
poetry add <package-name>

# Rebuild image with new dependencies
docker-compose -f docker-compose.dev.yml up -d --build
```

#### Updating Dependencies

```bash
# Update poetry.lock
docker-compose -f docker-compose.dev.yml exec backend poetry update

# Rebuild
docker-compose -f docker-compose.dev.yml up -d --build
```

### Database Migrations

```bash
# Run migrations
docker-compose exec backend poetry run alembic upgrade head

# Create a new migration
docker-compose exec backend poetry run alembic revision --autogenerate -m "description"

# Check migration status
docker-compose exec backend poetry run alembic current
```

### Accessing the Container

```bash
# Production
docker-compose exec backend bash

# Development
docker-compose -f docker-compose.dev.yml exec backend bash

# Run commands without shell
docker-compose exec backend poetry run python check_db_schema.py
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=nirvahatech

# Backend
BACKEND_CORS_ORIGINS=http://localhost:3000,https://your-domain.com
```

### Docker Compose Services

#### Production (`docker-compose.yml`)

- **postgres**: PostgreSQL 16 database
- **backend**: FastAPI backend (optimized)
- **frontend**: Next.js frontend

#### Development (`docker-compose.dev.yml`)

- **postgres**: PostgreSQL 16 database (dev)
- **backend**: FastAPI backend (with dev tools and hot-reload)

## 📊 Multi-Stage Build Explained

### Stage 1: Builder

```dockerfile
FROM python:3.11-slim as builder
# Install Poetry
# Copy dependency files
# Install dependencies with Poetry
```

**Purpose**: Install dependencies in an isolated environment

### Stage 2: Runtime

```dockerfile
FROM python:3.11-slim as runtime
# Copy virtual environment from builder
# Copy application code
# Run as non-root user
```

**Purpose**: Create minimal production image with only runtime needs

## 🔍 Health Checks

The production image includes health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health', timeout=5)" || exit 1
```

Check health status:

```bash
docker ps
# or
docker inspect --format='{{.State.Health.Status}}' nirvahatech-backend
```

## 🎯 Best Practices

### 1. Layer Caching

Dependencies are copied and installed before the application code:
```dockerfile
COPY pyproject.toml poetry.lock ./
RUN poetry install --only main
COPY . .
```

This ensures Docker reuses the dependency layer when only code changes.

### 2. .dockerignore

Exclude unnecessary files from the build context:
```
__pycache__/
.venv/
*.pyc
.env
```

### 3. Non-Root User

Run the application as a non-root user:
```dockerfile
RUN useradd -m -u 1000 appuser
USER appuser
```

### 4. Poetry Cache

Clear Poetry cache after installation:
```dockerfile
RUN poetry install --only main && rm -rf $POETRY_CACHE_DIR
```

### 5. Volume Mounts for Development

Mount source code for hot-reload in development:
```yaml
volumes:
  - ./backend:/app
```

## 🐛 Troubleshooting

### Poetry Installation Fails

```bash
# Rebuild without cache
docker-compose build --no-cache backend
```

### Dependency Conflicts

```bash
# Remove and recreate containers
docker-compose down -v
docker-compose up -d --build
```

### Permission Issues

```bash
# Fix ownership (run on host)
sudo chown -R $USER:$USER backend/
```

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Check health status
docker inspect nirvahatech-backend | grep -A 10 Health
```

### Database Connection Issues

```bash
# Verify database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test connection from backend container
docker-compose exec backend psql -h postgres -U postgres -d nirvahatech
```

## 📝 Makefile Commands

From the `backend/` directory:

```bash
make docker-build         # Build production image
make docker-run           # Run production container
make docker-compose-up    # Start all services
make docker-compose-down  # Stop all services
```

## 🔐 Security Considerations

1. **Never commit `.env` files** with real credentials
2. **Use Docker secrets** for production deployments
3. **Run as non-root user** (already configured)
4. **Keep base images updated** regularly
5. **Scan images for vulnerabilities**:
   ```bash
   docker scan nirvahatech-backend:latest
   ```

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Poetry in Docker](https://python-poetry.org/docs/faq/#is-poetry-compatible-with-docker)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

## 🚀 Production Deployment

For production deployments:

1. Use orchestration (Kubernetes, ECS, etc.)
2. Set proper resource limits
3. Use environment-specific configurations
4. Implement proper logging and monitoring
5. Use image registries (Docker Hub, ECR, GCR)

Example production docker-compose snippet:

```yaml
backend:
  image: your-registry/nirvahatech-backend:v1.0.0
  restart: always
  deploy:
    replicas: 3
    resources:
      limits:
        cpus: '1'
        memory: 512M
  logging:
    driver: "json-file"
    options:
      max-size: "10m"
      max-file: "3"
```

---

Made with ❤️ by the Nirvahatech Engineering Team


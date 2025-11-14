.PHONY: help install install-dev test lint format clean run migrate docker-build docker-run

# Variables
POETRY := poetry
PYTHON := $(POETRY) run python
PYTEST := $(POETRY) run pytest
BLACK := $(POETRY) run black
ISORT := $(POETRY) run isort
FLAKE8 := $(POETRY) run flake8
MYPY := $(POETRY) run mypy
ALEMBIC := $(POETRY) run alembic
UVICORN := $(POETRY) run uvicorn

# Default target
help:
	@echo "Nirvahatech Backend - Available commands:"
	@echo ""
	@echo "Setup:"
	@echo "  make install        - Install production dependencies with Poetry"
	@echo "  make install-dev    - Install all dependencies (including dev)"
	@echo "  make update         - Update all dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make run            - Run development server"
	@echo "  make run-prod       - Run production server"
	@echo "  make shell          - Open Poetry shell"
	@echo ""
	@echo "Code Quality:"
	@echo "  make test           - Run tests with coverage"
	@echo "  make test-fast      - Run tests without coverage"
	@echo "  make lint           - Run linters (flake8, mypy)"
	@echo "  make format         - Format code with black and isort"
	@echo "  make format-check   - Check code formatting"
	@echo "  make security       - Run security checks"
	@echo "  make pre-commit     - Run pre-commit hooks"
	@echo ""
	@echo "Database:"
	@echo "  make migrate        - Run database migrations"
	@echo "  make migrate-down   - Rollback one migration"
	@echo "  make migration      - Create new migration (msg='description')"
	@echo "  make db-check       - Check database schema"
	@echo "  make db-test        - Test database connection"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean          - Clean build artifacts and cache"
	@echo "  make clean-all      - Clean everything including Poetry env"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-run     - Run Docker container"
	@echo ""

# Setup and Installation
install:
	$(POETRY) install --only main

install-dev:
	$(POETRY) install

update:
	$(POETRY) update

lock:
	$(POETRY) lock

shell:
	$(POETRY) shell

# Development server
run:
	$(UVICORN) app.main:app --reload --host 0.0.0.0 --port 8000

run-prod:
	$(UVICORN) app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Testing
test:
	$(PYTEST) -v --cov=app --cov-report=term-missing --cov-report=html

test-fast:
	$(PYTEST) -v --no-cov

test-watch:
	$(PYTEST) -v --no-cov --looponfail

# Code quality
lint:
	$(FLAKE8) app/
	$(MYPY) app/

format:
	$(BLACK) app/ tests/
	$(ISORT) app/ tests/

format-check:
	$(BLACK) --check app/ tests/
	$(ISORT) --check app/ tests/

security:
	$(POETRY) run bandit -r app/
	$(POETRY) run safety check

# Pre-commit
pre-commit:
	$(POETRY) run pre-commit run --all-files

pre-commit-install:
	$(POETRY) run pre-commit install

# Database
migrate:
	$(ALEMBIC) upgrade head

migrate-down:
	$(ALEMBIC) downgrade -1

migration:
	@if [ -z "$(msg)" ]; then \
		echo "Error: Please provide a migration message: make migration msg='your message'"; \
		exit 1; \
	fi
	$(ALEMBIC) revision --autogenerate -m "$(msg)"

db-check:
	$(PYTHON) check_db_schema.py

db-test:
	$(PYTHON) test_db_insert.py

db-create:
	$(PYTHON) create_tables.py

# Cleaning
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	rm -rf build/ dist/ .pytest_cache/ .coverage htmlcov/ .mypy_cache/

clean-all: clean
	$(POETRY) env remove --all
	rm -rf .venv/

# Docker
docker-build:
	docker build -t nirvahatech-backend:latest .

docker-run:
	docker run -p 8000:8000 --env-file .env nirvahatech-backend:latest

docker-compose-up:
	docker-compose up -d

docker-compose-down:
	docker-compose down

# Build and distribution
build:
	$(POETRY) build

publish:
	$(POETRY) publish

# Show project info
info:
	$(POETRY) show
	@echo ""
	$(POETRY) env info

# Export requirements (for legacy systems)
export-requirements:
	$(POETRY) export -f requirements.txt --output requirements.txt --without-hashes
	$(POETRY) export -f requirements.txt --output requirements-dev.txt --with dev --without-hashes

# Initialize project
init: install-dev pre-commit-install
	@echo "✅ Project initialized with Poetry"
	@echo "Next steps:"
	@echo "  1. Copy .env.example to .env and configure"
	@echo "  2. Run 'make migrate' to set up the database"
	@echo "  3. Run 'make run' to start the development server"
	@echo ""
	@echo "Poetry commands:"
	@echo "  poetry add <package>      - Add a new dependency"
	@echo "  poetry add -G dev <pkg>   - Add a dev dependency"
	@echo "  poetry remove <package>   - Remove a dependency"
	@echo "  poetry show               - List all dependencies"
	@echo "  poetry shell              - Activate virtual environment"

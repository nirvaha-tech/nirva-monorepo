.PHONY: help install install-dev test lint format clean run migrate docker-build docker-run

# Variables
PYTHON := python3
PIP := $(PYTHON) -m pip
PYTEST := $(PYTHON) -m pytest
BLACK := $(PYTHON) -m black
ISORT := $(PYTHON) -m isort
FLAKE8 := $(PYTHON) -m flake8
MYPY := $(PYTHON) -m mypy
ALEMBIC := alembic
UVICORN := uvicorn

# Default target
help:
	@echo "Nirvahatech Backend - Available commands:"
	@echo ""
	@echo "  make install        - Install production dependencies"
	@echo "  make install-dev    - Install development dependencies"
	@echo "  make test           - Run tests with coverage"
	@echo "  make lint           - Run linters (flake8, mypy)"
	@echo "  make format         - Format code with black and isort"
	@echo "  make clean          - Clean build artifacts and cache"
	@echo "  make run            - Run development server"
	@echo "  make migrate        - Run database migrations"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-run     - Run Docker container"
	@echo ""

# Installation
install:
	$(PIP) install -r requirements.txt

install-dev:
	$(PIP) install -r requirements-dev.txt
	pre-commit install

# Testing
test:
	$(PYTEST) -v --cov=app --cov-report=term-missing --cov-report=html

test-fast:
	$(PYTEST) -v --no-cov

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

# Cleaning
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	rm -rf build/ dist/ .pytest_cache/ .coverage htmlcov/ .mypy_cache/

# Development server
run:
	$(UVICORN) app.main:app --reload --host 0.0.0.0 --port 8000

run-prod:
	$(UVICORN) app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Database
migrate:
	$(ALEMBIC) upgrade head

migrate-down:
	$(ALEMBIC) downgrade -1

migration:
	$(ALEMBIC) revision --autogenerate -m "$(msg)"

db-check:
	$(PYTHON) check_db_schema.py

db-test:
	$(PYTHON) test_db_insert.py

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
	$(PYTHON) setup.py sdist bdist_wheel

# Security
security-check:
	bandit -r app/
	safety check

# Pre-commit
pre-commit:
	pre-commit run --all-files

# Initialize project
init: install-dev
	@echo "✅ Project initialized"
	@echo "Next steps:"
	@echo "  1. Copy .env.example to .env and configure"
	@echo "  2. Run 'make migrate' to set up the database"
	@echo "  3. Run 'make run' to start the development server"


.PHONY: help dev build up down clean logs backend-shell frontend-shell db-shell

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

dev: ## Start development environment
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Development environment started"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"

build: ## Build all Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d
	@echo "✅ All services started"

down: ## Stop all services
	docker-compose down

clean: ## Stop and remove all containers, volumes, and images
	docker-compose down -v --rmi local
	@echo "✅ Cleanup complete"

logs: ## Show logs from all services
	docker-compose logs -f

backend-logs: ## Show backend logs
	docker-compose logs -f backend

frontend-logs: ## Show frontend logs
	docker-compose logs -f frontend

db-logs: ## Show database logs
	docker-compose logs -f postgres

backend-shell: ## Open shell in backend container
	docker-compose exec backend /bin/bash

frontend-shell: ## Open shell in frontend container
	docker-compose exec frontend /bin/sh

db-shell: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U postgres -d nirvahatech

migrate: ## Run database migrations
	docker-compose exec backend alembic upgrade head

migrate-create: ## Create a new migration
	@read -p "Enter migration message: " msg; \
	docker-compose exec backend alembic revision --autogenerate -m "$$msg"

test-backend: ## Run backend tests
	cd backend && python -m pytest

test-frontend: ## Run frontend tests
	cd frontend && npm test

lint-backend: ## Lint backend code
	cd backend && black . && flake8 app/

lint-frontend: ## Lint frontend code
	cd frontend && npm run lint

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

install-backend: ## Install backend dependencies
	cd backend && pip install -r requirements.txt

setup: ## Initial setup
	@echo "Setting up Nirvahatech project..."
	make install-frontend
	make install-backend
	@echo "✅ Setup complete! Run 'make dev' to start development."


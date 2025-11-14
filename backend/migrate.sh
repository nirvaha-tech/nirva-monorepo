#!/bin/bash

# Database migration script for Nirvahatech backend
# Usage: ./migrate.sh [production|local]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Nirvahatech Database Migration ===${NC}\n"

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo -e "${YELLOW}Activating virtual environment...${NC}"
    source .venv/bin/activate
fi

# Determine environment
ENV=${1:-local}

if [ "$ENV" = "production" ] || [ "$ENV" = "prod" ]; then
    echo -e "${YELLOW}⚠️  Running migrations for PRODUCTION${NC}\n"
    
    # Check for production database URL
    if [ -z "$POSTGRES_SERVER" ] || [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_DB" ]; then
        echo -e "${RED}Error: Production database credentials not found!${NC}"
        echo ""
        echo "Please set the following environment variables:"
        echo "  - POSTGRES_SERVER (e.g., your-db.postgres.database.azure.com)"
        echo "  - POSTGRES_USER"
        echo "  - POSTGRES_PASSWORD"
        echo "  - POSTGRES_DB"
        echo ""
        echo "Or set DATABASE_URL directly:"
        echo "  export DATABASE_URL='postgresql+asyncpg://user:pass@host:5432/dbname'"
        exit 1
    fi
    
    echo "Database: $POSTGRES_SERVER/$POSTGRES_DB"
    echo ""
    read -p "Are you sure you want to continue? (yes/no) " -r
    echo
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "Migration cancelled."
        exit 0
    fi
else
    echo -e "${GREEN}Running migrations for LOCAL development${NC}\n"
fi

# Show current revision
echo -e "${GREEN}Current database revision:${NC}"
alembic current || true
echo ""

# Show pending migrations
echo -e "${GREEN}Pending migrations:${NC}"
alembic history --indicate-current
echo ""

# Run migrations
echo -e "${GREEN}Applying migrations...${NC}"
alembic upgrade head

# Show new revision
echo ""
echo -e "${GREEN}New database revision:${NC}"
alembic current

echo ""
echo -e "${GREEN}✅ Migration completed successfully!${NC}"


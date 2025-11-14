#!/bin/bash

# Local Testing Script
# Runs all tests and checks before deployment

set -e

echo "🧪 Running Local Tests and Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Check if Docker is running
echo -n "Checking Docker... "
if docker info > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} Docker is not running"
    exit 1
fi

echo ""
echo "🔨 Building Docker Images"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Build backend
echo "Building backend..."
if docker build -t nirvahatech-backend ./backend > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend image built"
else
    echo -e "${RED}✗${NC} Backend build failed"
    ((ERRORS++))
fi

# Build frontend
echo "Building frontend..."
if docker build -t nirvahatech-frontend ./frontend > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Frontend image built"
else
    echo -e "${RED}✗${NC} Frontend build failed"
    ((ERRORS++))
fi

echo ""
echo "🚀 Starting Services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start services
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 15

# Check if services are running
echo -n "Checking backend... "
if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} Backend not responding"
    ((ERRORS++))
fi

echo -n "Checking frontend... "
if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} Frontend not responding"
    ((ERRORS++))
fi

echo -n "Checking database... "
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} Database not ready"
    ((ERRORS++))
fi

echo ""
echo "🧪 Running API Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test health endpoint
echo -n "Testing health endpoint... "
HEALTH_RESPONSE=$(curl -sf http://localhost:8000/health)
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    ((ERRORS++))
fi

# Test API docs
echo -n "Testing API docs... "
if curl -sf http://localhost:8000/docs > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    ((ERRORS++))
fi

# Test lead submission
echo -n "Testing lead submission... "
LEAD_RESPONSE=$(curl -sf -X POST http://localhost:8000/api/v1/leads \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Test User",
        "email": "test@example.com",
        "company": "Test Company",
        "job_title": "CTO",
        "phone": "+1-555-0100",
        "project_description": "This is a test lead submission from the automated testing script."
    }' 2>&1)

if echo "$LEAD_RESPONSE" | grep -q "id"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Response: $LEAD_RESPONSE"
    ((ERRORS++))
fi

# Test get leads
echo -n "Testing get leads... "
LEADS_RESPONSE=$(curl -sf http://localhost:8000/api/v1/leads)
if echo "$LEADS_RESPONSE" | grep -q "email"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    ((ERRORS++))
fi

echo ""
echo "🌐 Testing Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test homepage
echo -n "Testing homepage... "
FRONTEND_RESPONSE=$(curl -sf http://localhost:3000)
if echo "$FRONTEND_RESPONSE" | grep -q "Nirvahatech"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    ((ERRORS++))
fi

# Check for key sections
echo -n "Checking hero section... "
if echo "$FRONTEND_RESPONSE" | grep -q "Stop Firefighting"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
fi

echo -n "Checking services section... "
if echo "$FRONTEND_RESPONSE" | grep -q "DevOps"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
fi

echo ""
echo "📊 Checking Logs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for errors in logs
echo -n "Checking backend logs for errors... "
BACKEND_ERRORS=$(docker-compose logs backend | grep -i "error" | grep -v "ERROR" | wc -l)
if [ "$BACKEND_ERRORS" -eq 0 ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC} Found $BACKEND_ERRORS potential errors"
fi

echo -n "Checking frontend logs for errors... "
FRONTEND_ERRORS=$(docker-compose logs frontend | grep -i "error" | wc -l)
if [ "$FRONTEND_ERRORS" -eq 0 ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC} Found $FRONTEND_ERRORS potential errors"
fi

echo ""
echo "🧹 Cleanup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

read -p "Stop services? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down
    echo -e "${GREEN}✓${NC} Services stopped"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "🎉 Ready for deployment!"
    exit 0
else
    echo -e "${RED}✗ Found $ERRORS issue(s)${NC}"
    echo ""
    echo "⚠️  Please fix the issues before deploying."
    exit 1
fi


#!/bin/bash

# Deployment Verification Script
# This script verifies that all components are deployed and working correctly

set -e

ENVIRONMENT=${1:-production}
REGION=${AWS_REGION:-us-east-1}

echo "🔍 Verifying deployment for environment: $ENVIRONMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check status
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        return 1
    fi
}

# Function to check AWS service
check_aws_service() {
    local service=$1
    local check_command=$2
    
    echo -n "Checking $service... "
    if eval "$check_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        return 1
    fi
}

ERRORS=0

echo ""
echo "📦 Checking AWS Resources"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check ECS Cluster
echo -n "ECS Cluster... "
if aws ecs describe-clusters \
    --clusters ${ENVIRONMENT}-cluster \
    --region $REGION \
    --query 'clusters[0].status' \
    --output text 2>/dev/null | grep -q "ACTIVE"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    ((ERRORS++))
fi

# Check ECS Service
echo -n "ECS Service... "
if aws ecs describe-services \
    --cluster ${ENVIRONMENT}-cluster \
    --services ${ENVIRONMENT}-backend-service \
    --region $REGION \
    --query 'services[0].status' \
    --output text 2>/dev/null | grep -q "ACTIVE"; then
    echo -e "${GREEN}✓${NC}"
    
    # Check running tasks
    RUNNING_TASKS=$(aws ecs describe-services \
        --cluster ${ENVIRONMENT}-cluster \
        --services ${ENVIRONMENT}-backend-service \
        --region $REGION \
        --query 'services[0].runningCount' \
        --output text 2>/dev/null)
    echo "  Running tasks: $RUNNING_TASKS"
else
    echo -e "${RED}✗${NC}"
    ((ERRORS++))
fi

# Check RDS Instance
echo -n "RDS Instance... "
if aws rds describe-db-instances \
    --db-instance-identifier ${ENVIRONMENT}-postgres \
    --region $REGION \
    --query 'DBInstances[0].DBInstanceStatus' \
    --output text 2>/dev/null | grep -q "available"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    ((ERRORS++))
fi

# Check ALB
echo -n "Application Load Balancer... "
ALB_NAME="${ENVIRONMENT}-alb"
ALB_ARN=$(aws elbv2 describe-load-balancers \
    --region $REGION \
    --query "LoadBalancers[?LoadBalancerName=='$ALB_NAME'].LoadBalancerArn" \
    --output text 2>/dev/null)

if [ -n "$ALB_ARN" ]; then
    echo -e "${GREEN}✓${NC}"
    
    # Check target health
    TARGET_GROUP=$(aws elbv2 describe-target-groups \
        --load-balancer-arn $ALB_ARN \
        --region $REGION \
        --query 'TargetGroups[0].TargetGroupArn' \
        --output text 2>/dev/null)
    
    if [ -n "$TARGET_GROUP" ]; then
        HEALTHY_TARGETS=$(aws elbv2 describe-target-health \
            --target-group-arn $TARGET_GROUP \
            --region $REGION \
            --query "length(TargetHealthDescriptions[?TargetHealth.State=='healthy'])" \
            --output text 2>/dev/null)
        echo "  Healthy targets: $HEALTHY_TARGETS"
    fi
else
    echo -e "${RED}✗${NC}"
    ((ERRORS++))
fi

# Check Amplify App
echo -n "Amplify App... "
APP_ID=$(aws amplify list-apps \
    --region $REGION \
    --query "apps[?name=='${ENVIRONMENT}-nirvahatech-frontend'].appId" \
    --output text 2>/dev/null)

if [ -n "$APP_ID" ]; then
    echo -e "${GREEN}✓${NC}"
    echo "  App ID: $APP_ID"
else
    echo -e "${YELLOW}⚠${NC} (Optional)"
fi

echo ""
echo "🌐 Testing Endpoints"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Get ALB DNS
ALB_DNS=$(aws elbv2 describe-load-balancers \
    --region $REGION \
    --query "LoadBalancers[?LoadBalancerName=='$ALB_NAME'].DNSName" \
    --output text 2>/dev/null)

if [ -n "$ALB_DNS" ]; then
    echo "ALB DNS: $ALB_DNS"
    
    # Test health endpoint
    echo -n "Backend Health Check... "
    if curl -sf "http://$ALB_DNS/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        ((ERRORS++))
    fi
    
    # Test API docs
    echo -n "API Documentation... "
    if curl -sf "http://$ALB_DNS/docs" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠${NC} (May require HTTPS)"
    fi
fi

echo ""
echo "📊 Checking Monitoring"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check CloudWatch Log Groups
echo -n "CloudWatch Logs... "
if aws logs describe-log-groups \
    --log-group-name-prefix "/ecs/${ENVIRONMENT}" \
    --region $REGION 2>/dev/null | grep -q "logGroups"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    ((ERRORS++))
fi

# Check CloudWatch Alarms
echo -n "CloudWatch Alarms... "
ALARM_COUNT=$(aws cloudwatch describe-alarms \
    --alarm-name-prefix "${ENVIRONMENT}-" \
    --region $REGION \
    --query 'length(MetricAlarms)' \
    --output text 2>/dev/null)

if [ "$ALARM_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} ($ALARM_COUNT alarms)"
else
    echo -e "${YELLOW}⚠${NC} (No alarms found)"
fi

# Check CloudTrail
echo -n "CloudTrail... "
if aws cloudtrail describe-trails \
    --region $REGION 2>/dev/null | grep -q "trailList"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC} (Not configured)"
fi

echo ""
echo "🔒 Checking Security"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check VPC Flow Logs
echo -n "VPC Flow Logs... "
VPC_ID=$(aws ec2 describe-vpcs \
    --filters "Name=tag:Name,Values=${ENVIRONMENT}-vpc" \
    --region $REGION \
    --query 'Vpcs[0].VpcId' \
    --output text 2>/dev/null)

if [ -n "$VPC_ID" ] && [ "$VPC_ID" != "None" ]; then
    if aws ec2 describe-flow-logs \
        --filter "Name=resource-id,Values=$VPC_ID" \
        --region $REGION 2>/dev/null | grep -q "FlowLogs"; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠${NC} (Not enabled)"
    fi
else
    echo -e "${YELLOW}⚠${NC} (VPC not found)"
fi

# Check RDS Encryption
echo -n "RDS Encryption... "
if aws rds describe-db-instances \
    --db-instance-identifier ${ENVIRONMENT}-postgres \
    --region $REGION \
    --query 'DBInstances[0].StorageEncrypted' \
    --output text 2>/dev/null | grep -q "True"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    ((ERRORS++))
fi

# Check RDS Backups
echo -n "RDS Backups... "
BACKUP_RETENTION=$(aws rds describe-db-instances \
    --db-instance-identifier ${ENVIRONMENT}-postgres \
    --region $REGION \
    --query 'DBInstances[0].BackupRetentionPeriod' \
    --output text 2>/dev/null)

if [ "$BACKUP_RETENTION" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} ($BACKUP_RETENTION days)"
else
    echo -e "${RED}✗${NC}"
    ((ERRORS++))
fi

# Check WAF
echo -n "WAF Protection... "
if aws wafv2 list-web-acls \
    --scope REGIONAL \
    --region $REGION 2>/dev/null | grep -q "${ENVIRONMENT}-web-acl"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC} (Not configured)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    echo ""
    echo "🎉 Deployment verification successful!"
    exit 0
else
    echo -e "${RED}✗ Found $ERRORS critical issue(s)${NC}"
    echo ""
    echo "⚠️  Please review the issues above and fix them."
    exit 1
fi


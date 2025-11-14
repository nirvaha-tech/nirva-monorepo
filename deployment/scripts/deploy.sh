#!/bin/bash

# Deployment script for Nirvahatech infrastructure

set -e

ENVIRONMENT=${1:-production}
REGION=${AWS_REGION:-us-east-1}

echo "🚀 Deploying Nirvahatech to environment: $ENVIRONMENT"

# Check if required tools are installed
command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI is required but not installed. Aborting." >&2; exit 1; }
command -v terraform >/dev/null 2>&1 || { echo "❌ Terraform is required but not installed. Aborting." >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }

# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "📋 AWS Account ID: $ACCOUNT_ID"

# ECR repositories
BACKEND_REPO="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/nirvahatech-backend"
IMAGE_TAG=$(git rev-parse --short HEAD)

echo "🔨 Building and pushing backend Docker image..."

# Login to ECR
aws ecr get-login-password --region "$REGION" | \
    docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

# Build and push backend image
cd backend
docker build -t nirvahatech-backend .
docker tag nirvahatech-backend:latest "${BACKEND_REPO}:${IMAGE_TAG}"
docker tag nirvahatech-backend:latest "${BACKEND_REPO}:latest"
docker push "${BACKEND_REPO}:${IMAGE_TAG}"
docker push "${BACKEND_REPO}:latest"
cd ..

echo "✅ Backend image pushed: ${BACKEND_REPO}:${IMAGE_TAG}"

# Deploy infrastructure with Terraform
echo "🏗️  Deploying infrastructure with Terraform..."
cd deployment/terraform

terraform init

terraform plan \
    -var="environment=$ENVIRONMENT" \
    -var="backend_image=${BACKEND_REPO}:${IMAGE_TAG}" \
    -out=tfplan

read -p "Do you want to apply these changes? (yes/no) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    terraform apply tfplan
    
    echo "✅ Infrastructure deployed successfully!"
    
    # Get outputs
    echo ""
    echo "📊 Deployment outputs:"
    terraform output
    
    # Force ECS service update
    echo ""
    echo "🔄 Updating ECS service..."
    aws ecs update-service \
        --cluster "${ENVIRONMENT}-cluster" \
        --service "${ENVIRONMENT}-backend-service" \
        --force-new-deployment \
        --region "$REGION" \
        > /dev/null
    
    echo "✅ ECS service update triggered"
    
    # Trigger Amplify build
    echo ""
    echo "🔄 Triggering Amplify build..."
    APP_ID=$(aws amplify list-apps --query "apps[?name=='${ENVIRONMENT}-nirvahatech-frontend'].appId" --output text --region "$REGION")
    
    if [ -n "$APP_ID" ]; then
        aws amplify start-job \
            --app-id "$APP_ID" \
            --branch-name main \
            --job-type RELEASE \
            --region "$REGION" \
            > /dev/null
        echo "✅ Amplify build triggered"
    else
        echo "⚠️  Amplify app not found"
    fi
    
    echo ""
    echo "🎉 Deployment complete!"
else
    echo "❌ Deployment cancelled"
    exit 1
fi

cd ../..


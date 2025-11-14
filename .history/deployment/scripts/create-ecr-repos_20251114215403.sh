#!/bin/bash

# Script to create ECR repositories for Docker images

set -e

REGION=${AWS_REGION:-us-east-1}
BACKEND_REPO="nirvahatech-backend"
FRONTEND_REPO="nirvahatech-frontend"

echo "🚀 Creating ECR repositories in AWS region: $REGION"

# Function to create ECR repository
create_ecr_repo() {
    local repo_name=$1
    
    echo "📦 Creating repository: $repo_name"
    
    if aws ecr describe-repositories --repository-names "$repo_name" --region "$REGION" 2>/dev/null; then
        echo "✅ Repository already exists"
    else
        aws ecr create-repository \
            --repository-name "$repo_name" \
            --image-scanning-configuration scanOnPush=true \
            --encryption-configuration encryptionType=AES256 \
            --region "$REGION"
        
        echo "✅ Repository created"
        
        # Set lifecycle policy to clean up old images
        aws ecr put-lifecycle-policy \
            --repository-name "$repo_name" \
            --lifecycle-policy-text '{
                "rules": [
                    {
                        "rulePriority": 1,
                        "description": "Keep last 10 images",
                        "selection": {
                            "tagStatus": "any",
                            "countType": "imageCountMoreThan",
                            "countNumber": 10
                        },
                        "action": {
                            "type": "expire"
                        }
                    }
                ]
            }' \
            --region "$REGION"
        
        echo "✅ Lifecycle policy set"
    fi
}

# Create repositories
create_ecr_repo "$BACKEND_REPO"
create_ecr_repo "$FRONTEND_REPO"

# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo ""
echo "✅ ECR repositories created successfully!"
echo ""
echo "Repository URIs:"
echo "  Backend:  ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${BACKEND_REPO}"
echo "  Frontend: ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${FRONTEND_REPO}"
echo ""
echo "To push images:"
echo "  1. Login to ECR: aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
echo "  2. Build image: docker build -t $BACKEND_REPO ./backend"
echo "  3. Tag image: docker tag $BACKEND_REPO:latest ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${BACKEND_REPO}:latest"
echo "  4. Push image: docker push ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${BACKEND_REPO}:latest"


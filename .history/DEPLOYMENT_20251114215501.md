# Deployment Instructions

This document provides step-by-step instructions for deploying the Nirvahatech landing page to AWS.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial AWS Setup](#initial-aws-setup)
3. [GitHub Configuration](#github-configuration)
4. [Manual Deployment](#manual-deployment)
5. [Automated Deployment (CI/CD)](#automated-deployment-cicd)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

- **AWS CLI** (>= 2.0)
  ```bash
  curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
  sudo installer -pkg AWSCLIV2.pkg -target /
  ```

- **Terraform** (>= 1.5.0)
  ```bash
  brew install terraform
  ```

- **Docker** (>= 24.0)
  ```bash
  brew install --cask docker
  ```

- **Node.js** (>= 20.0)
  ```bash
  brew install node@20
  ```

- **Python** (>= 3.11)
  ```bash
  brew install python@3.11
  ```

### AWS Account Setup

1. **Create an AWS account** if you don't have one
2. **Configure IAM user** with appropriate permissions:
   - AdministratorAccess (for initial setup)
   - Or custom policy with permissions for VPC, ECS, RDS, Secrets Manager, etc.

3. **Configure AWS CLI**:
   ```bash
   aws configure
   ```

## Initial AWS Setup

### Step 1: Create SSL Certificate

1. Go to AWS Certificate Manager in the AWS Console
2. Request a public certificate
3. Add your domain name (e.g., `nirvahatech.com`)
4. Add wildcard subdomain (e.g., `*.nirvahatech.com`)
5. Choose DNS validation
6. Add the CNAME records to your DNS provider
7. Wait for validation (can take 5-30 minutes)
8. Note the Certificate ARN - you'll need it later

### Step 2: Initialize Terraform Backend

```bash
# Make scripts executable
chmod +x deployment/scripts/*.sh

# Create S3 bucket and DynamoDB table for Terraform state
./deployment/scripts/init-terraform-backend.sh
```

### Step 3: Create ECR Repositories

```bash
# Create ECR repositories for Docker images
./deployment/scripts/create-ecr-repos.sh
```

### Step 4: Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo` (full control)
4. Copy the token - you'll need it for Amplify

### Step 5: Configure Terraform Variables

```bash
cd deployment/terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your values:

```hcl
# AWS Configuration
aws_region  = "us-east-1"
environment = "production"

# Network Configuration
vpc_cidr           = "10.0.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

# Database Configuration
db_instance_class       = "db.t4g.small"
db_name                 = "nirvahatech"
db_username             = "dbadmin"
db_password             = "YOUR_SECURE_PASSWORD_HERE"  # Change this!
backup_retention_period = 7
multi_az_enabled        = true

# ECS Configuration
backend_image         = "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/nirvahatech-backend:latest"
backend_cpu           = 512
backend_memory        = 1024
backend_desired_count = 2

# SSL Certificate
certificate_arn = "arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/YOUR_CERT_ID"

# GitHub Configuration
github_repository   = "https://github.com/YOUR_ORG/nirvahatech"
github_access_token = "ghp_YOUR_GITHUB_TOKEN"

# Monitoring
alarm_email = "alerts@nirvahatech.com"
```

## Manual Deployment

### Option 1: Using the Deployment Script

```bash
# From project root
./deployment/scripts/deploy.sh production
```

This script will:
- Build and push the backend Docker image
- Deploy infrastructure with Terraform
- Update the ECS service
- Trigger an Amplify build

### Option 2: Step-by-Step Manual Deployment

#### Build and Push Backend Image

```bash
# Get your AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=us-east-1

# Login to ECR
aws ecr get-login-password --region $REGION | \
    docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Build and push backend
cd backend
docker build -t nirvahatech-backend .
docker tag nirvahatech-backend:latest \
    $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/nirvahatech-backend:latest
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/nirvahatech-backend:latest
cd ..
```

#### Deploy Infrastructure with Terraform

```bash
cd deployment/terraform

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply changes
terraform apply
```

#### Update ECS Service

```bash
aws ecs update-service \
    --cluster production-cluster \
    --service production-backend-service \
    --force-new-deployment \
    --region us-east-1
```

#### Trigger Amplify Build

```bash
# Get Amplify App ID
APP_ID=$(aws amplify list-apps \
    --query "apps[?name=='production-nirvahatech-frontend'].appId" \
    --output text)

# Trigger build
aws amplify start-job \
    --app-id $APP_ID \
    --branch-name main \
    --job-type RELEASE
```

## Automated Deployment (CI/CD)

### GitHub Actions Setup

#### Step 1: Configure OIDC for GitHub Actions

Create an IAM role for GitHub Actions:

```bash
# Create trust policy
cat > trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/nirvahatech:*"
        }
      }
    }
  ]
}
EOF

# Create role
aws iam create-role \
    --role-name GitHubActionsRole \
    --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy \
    --role-name GitHubActionsRole \
    --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

#### Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

- `AWS_ROLE_ARN`: ARN of the IAM role created above
- `DB_PASSWORD`: Your secure database password
- `GH_ACCESS_TOKEN`: GitHub personal access token
- `ACM_CERTIFICATE_ARN`: ARN of your SSL certificate
- `ALARM_EMAIL`: Email address for CloudWatch alarms

#### Step 3: Trigger Deployment

Push to the `main` branch or manually trigger the workflow:

```bash
git push origin main
```

Or manually:
1. Go to Actions tab in GitHub
2. Select "CD - Production Deployment"
3. Click "Run workflow"

## Post-Deployment

### Verify Deployment

```bash
# Check ECS service
aws ecs describe-services \
    --cluster production-cluster \
    --services production-backend-service

# Check RDS instance
aws rds describe-db-instances \
    --db-instance-identifier production-postgres

# Check Amplify app
aws amplify list-apps

# Get ALB DNS name
terraform output alb_dns_name

# Get Amplify URL
terraform output amplify_default_domain
```

### Configure DNS

Add DNS records to point your domain to:

1. **API**: Create a CNAME record pointing to the ALB DNS name
   ```
   api.nirvahatech.com → production-alb-123456.us-east-1.elb.amazonaws.com
   ```

2. **Frontend**: Follow Amplify's custom domain instructions
   - Go to Amplify Console
   - Click on your app
   - Go to "Domain management"
   - Add custom domain

### Test the Application

```bash
# Test backend health
curl https://api.nirvahatech.com/health

# Test backend API docs
open https://api.nirvahatech.com/docs

# Test frontend
open https://nirvahatech.com
```

### Monitor the Application

1. **CloudWatch Dashboard**
   - Go to CloudWatch → Dashboards
   - Open `production-infrastructure-dashboard`

2. **CloudWatch Alarms**
   - Go to CloudWatch → Alarms
   - Verify email subscription for alerts

3. **ECS Logs**
   ```bash
   aws logs tail /ecs/production/backend --follow
   ```

## Troubleshooting

### ECS Task Fails to Start

```bash
# Get task details
aws ecs list-tasks --cluster production-cluster

# Describe task
aws ecs describe-tasks \
    --cluster production-cluster \
    --tasks TASK_ARN

# Check logs
aws logs tail /ecs/production/backend --since 1h
```

### Database Connection Issues

```bash
# Check RDS status
aws rds describe-db-instances \
    --db-instance-identifier production-postgres

# Test from ECS task
aws ecs execute-command \
    --cluster production-cluster \
    --task TASK_ID \
    --container backend \
    --interactive \
    --command "/bin/bash"

# Inside container
psql -h $POSTGRES_SERVER -U $POSTGRES_USER -d $POSTGRES_DB
```

### Terraform State Lock Issues

```bash
# List locks
aws dynamodb scan \
    --table-name nirvahatech-terraform-locks

# Force unlock (use with caution!)
terraform force-unlock LOCK_ID
```

### Amplify Build Failures

```bash
# Check build logs in Amplify Console
# or
aws amplify list-jobs --app-id APP_ID --branch-name main
```

### Roll Back Deployment

```bash
# Revert to previous ECS task definition
aws ecs update-service \
    --cluster production-cluster \
    --service production-backend-service \
    --task-definition production-backend:PREVIOUS_REVISION

# Or use Terraform
terraform apply -var="backend_image=PREVIOUS_IMAGE"
```

## Estimated Costs

Monthly AWS costs (approximate):

| Service | Configuration | Cost |
|---------|--------------|------|
| ECS Fargate | 2 tasks, 0.5 vCPU, 1GB RAM | $30 |
| RDS PostgreSQL | db.t4g.small, Multi-AZ | $50 |
| ALB | Standard | $20 |
| NAT Gateway | 3 gateways | $100 |
| Amplify | Hosting + builds | $15 |
| Data Transfer | ~100GB | $10 |
| CloudWatch | Logs + metrics | $10 |
| **Total** | | **~$235/month** |

For development/staging, reduce costs by:
- Using single NAT Gateway: -$65/month
- Single-AZ RDS: -$25/month
- Smaller instance types
- Total dev cost: ~$80/month

## Security Checklist

- [ ] Database password is strong and stored in Secrets Manager
- [ ] SSL certificate is valid and applied
- [ ] Security groups follow least privilege
- [ ] WAF is enabled and configured
- [ ] CloudTrail is enabled
- [ ] VPC Flow Logs are enabled
- [ ] RDS backups are enabled
- [ ] Encryption at rest is enabled
- [ ] MFA is enabled for AWS root account
- [ ] IAM roles use least privilege

## Support

For issues or questions:
- Email: devops@nirvahatech.com
- GitHub Issues: https://github.com/YOUR_ORG/nirvahatech/issues
- AWS Support: https://console.aws.amazon.com/support/


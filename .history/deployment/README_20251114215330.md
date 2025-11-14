# Deployment Guide

This directory contains Terraform configuration for deploying the Nirvahatech infrastructure to AWS.

## Architecture Overview

The infrastructure consists of:

1. **Networking Layer** (VPC, Subnets, NAT Gateways)
2. **Security Layer** (Security Groups, WAF, KMS)
3. **Data Layer** (RDS PostgreSQL with Multi-AZ)
4. **Compute Layer** (ECS Fargate with Auto Scaling)
5. **Frontend Layer** (AWS Amplify)
6. **Monitoring Layer** (CloudWatch, Alarms, Dashboards)

## Prerequisites

### Required Tools
- Terraform >= 1.5.0
- AWS CLI >= 2.0
- GitHub CLI (optional)

### AWS Permissions
Your AWS user/role needs permissions for:
- VPC, Subnets, Route Tables
- ECS, ECR, Fargate
- RDS
- Secrets Manager, KMS
- CloudWatch
- Amplify
- WAF
- S3, DynamoDB (for Terraform state)

## Setup Instructions

### 1. Configure AWS Credentials

```bash
aws configure
```

Or use environment variables:
```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"
```

### 2. Create Terraform Backend Resources

```bash
# S3 bucket for state
aws s3api create-bucket \
  --bucket nirvahatech-terraform-state \
  --region us-east-1

aws s3api put-bucket-versioning \
  --bucket nirvahatech-terraform-state \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-encryption \
  --bucket nirvahatech-terraform-state \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# DynamoDB table for locking
aws dynamodb create-table \
  --table-name nirvahatech-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### 3. Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name nirvahatech-backend \
  --region us-east-1

aws ecr create-repository \
  --repository-name nirvahatech-frontend \
  --region us-east-1
```

### 4. Request ACM Certificate

```bash
aws acm request-certificate \
  --domain-name nirvahatech.com \
  --subject-alternative-names "*.nirvahatech.com" \
  --validation-method DNS \
  --region us-east-1
```

Follow the DNS validation process and note the certificate ARN.

### 5. Configure Terraform Variables

```bash
cd deployment/terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your values:
```hcl
aws_region  = "us-east-1"
environment = "production"

# Database
db_password = "your-secure-password-here"

# Backend
backend_image = "123456789012.dkr.ecr.us-east-1.amazonaws.com/nirvahatech-backend:latest"

# SSL Certificate
certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/..."

# GitHub
github_repository   = "https://github.com/your-org/nirvahatech"
github_access_token = "ghp_your_token_here"

# Monitoring
alarm_email = "alerts@nirvahatech.com"
```

### 6. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Preview changes
terraform plan

# Apply changes
terraform apply
```

### 7. Verify Deployment

```bash
# Get outputs
terraform output

# Check ECS service
aws ecs describe-services \
  --cluster production-cluster \
  --services production-backend-service

# Check RDS instance
aws rds describe-db-instances \
  --db-instance-identifier production-postgres

# Check Amplify app
aws amplify list-apps
```

## Module Details

### Networking Module
Creates VPC with:
- 3 public subnets (for ALB)
- 3 private subnets (for ECS tasks)
- 3 NAT Gateways (one per AZ)
- Internet Gateway
- Route tables
- VPC Flow Logs

### Security Module
Configures:
- ALB security group (ports 80, 443)
- ECS security group (port 8000 from ALB)
- RDS security group (port 5432 from ECS)

### RDS Module
Provisions:
- PostgreSQL 16 database
- Multi-AZ deployment
- Automated backups (7 days retention)
- Encryption at rest (KMS)
- Performance Insights
- CloudWatch logs

### ECS Module
Deploys:
- ECS Fargate cluster
- Task definitions
- ECS service with auto-scaling
- Application Load Balancer
- Target groups
- HTTPS/HTTP listeners
- CloudWatch log groups

### Amplify Module
Sets up:
- Amplify app for frontend
- Automatic deployments from GitHub
- Build configuration
- Environment variables

### Monitoring Module
Creates:
- CloudWatch Dashboard
- Alarms for CPU, memory, errors
- SNS topic for notifications
- Email subscriptions

### WAF Module
Configures:
- Web ACL with managed rules
- Rate limiting
- SQL injection protection
- Geographic restrictions
- CloudWatch logging

## Environments

### Development
```bash
terraform workspace new dev
terraform workspace select dev
terraform apply -var-file=environments/dev.tfvars
```

### Staging
```bash
terraform workspace new staging
terraform workspace select staging
terraform apply -var-file=environments/staging.tfvars
```

### Production
```bash
terraform workspace new production
terraform workspace select production
terraform apply -var-file=environments/production.tfvars
```

## Disaster Recovery

### Backup Strategy
- RDS automated backups: 7 days
- Manual snapshots before major changes
- Infrastructure as Code in Git

### Restore Procedure
1. Restore RDS from snapshot
2. Run `terraform apply` to recreate infrastructure
3. Update DNS records if needed
4. Verify application functionality

## Cost Optimization

Estimated monthly costs (production):
- ECS Fargate (2 tasks): ~$30
- RDS (db.t4g.small, Multi-AZ): ~$50
- ALB: ~$20
- NAT Gateways (3): ~$100
- Amplify: ~$15
- Data transfer: ~$10
- **Total**: ~$225/month

Cost-saving tips:
- Use Fargate Spot for non-critical workloads
- Single NAT Gateway for dev/staging
- Single-AZ RDS for dev/staging
- Adjust auto-scaling thresholds

## Troubleshooting

### Terraform State Issues
```bash
# Refresh state
terraform refresh

# Import existing resource
terraform import aws_ecs_cluster.main production-cluster

# Unlock state (if locked)
terraform force-unlock LOCK_ID
```

### ECS Task Not Starting
```bash
# Check task logs
aws logs tail /ecs/production/backend --follow

# Describe task
aws ecs describe-tasks \
  --cluster production-cluster \
  --tasks TASK_ID
```

### RDS Connection Issues
```bash
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

## Security Best Practices

1. **Secrets Management**
   - Never commit secrets to Git
   - Use AWS Secrets Manager
   - Rotate credentials regularly

2. **Network Security**
   - Keep databases in private subnets
   - Use security groups for least privilege
   - Enable VPC Flow Logs

3. **Encryption**
   - Enable encryption at rest (KMS)
   - Use TLS/HTTPS for data in transit
   - Encrypt backups

4. **Monitoring**
   - Set up CloudWatch alarms
   - Enable CloudTrail
   - Review security findings regularly

5. **Access Control**
   - Use IAM roles (not keys) for services
   - Enable MFA for AWS console
   - Follow principle of least privilege

## Support

For issues or questions:
- Create an issue in GitHub
- Contact DevOps team: devops@nirvahatech.com
- Check AWS Service Health Dashboard


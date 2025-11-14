# Deployment Checklist

Use this checklist to ensure a successful deployment to AWS.

## Pre-Deployment Checklist

### AWS Account Setup

- [ ] AWS account created and accessible
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] IAM user/role with necessary permissions created
- [ ] Billing alerts configured
- [ ] AWS region selected (default: us-east-1)

### Domain and SSL

- [ ] Domain name purchased and configured
- [ ] DNS provider accessible (Route53, CloudFlare, etc.)
- [ ] ACM certificate requested
- [ ] Certificate validated via DNS
- [ ] Certificate ARN noted

### Repository and Secrets

- [ ] GitHub repository is private
- [ ] All team members have signed NDAs/CLAs
- [ ] GitHub Actions enabled
- [ ] GitHub OIDC provider configured in AWS
- [ ] IAM role for GitHub Actions created

### Local Testing

- [ ] Application runs locally with Docker Compose
- [ ] All tests pass (`make test-backend` and `make test-frontend`)
- [ ] Linting passes (`make lint-backend` and `make lint-frontend`)
- [ ] Contact form successfully submits leads
- [ ] Database migrations work
- [ ] No secrets in code (all in environment variables)

## AWS Infrastructure Setup

### Step 1: Backend Resources

```bash
# Make scripts executable
chmod +x deployment/scripts/*.sh

# Initialize Terraform backend
./deployment/scripts/init-terraform-backend.sh
```

- [ ] S3 bucket for Terraform state created
- [ ] DynamoDB table for state locking created
- [ ] S3 bucket versioning enabled
- [ ] S3 bucket encryption enabled

### Step 2: Container Registry

```bash
# Create ECR repositories
./deployment/scripts/create-ecr-repos.sh
```

- [ ] Backend ECR repository created
- [ ] Frontend ECR repository created (if needed)
- [ ] Lifecycle policies configured
- [ ] Repository URIs noted

### Step 3: Build and Push Initial Images

```bash
# Get AWS account ID
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

- [ ] Backend image built successfully
- [ ] Backend image pushed to ECR
- [ ] Image scan completed without critical issues

### Step 4: Configure Terraform

```bash
cd deployment/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

Required values in `terraform.tfvars`:

- [ ] `aws_region` set
- [ ] `environment` set (production/staging/dev)
- [ ] `vpc_cidr` configured
- [ ] `availability_zones` set (3 zones recommended)
- [ ] `db_password` set (strong password)
- [ ] `db_username` set
- [ ] `backend_image` set (ECR URI)
- [ ] `certificate_arn` set (from ACM)
- [ ] `github_repository` set
- [ ] `github_access_token` set
- [ ] `alarm_email` set

### Step 5: Deploy Infrastructure

```bash
cd deployment/terraform

# Initialize
terraform init

# Validate
terraform validate

# Plan (review carefully!)
terraform plan

# Apply
terraform apply
```

- [ ] Terraform init completed successfully
- [ ] Terraform plan reviewed (no unexpected changes)
- [ ] Terraform apply completed successfully
- [ ] All resources created without errors
- [ ] Outputs displayed (note ALB DNS, Amplify domain, etc.)

## Post-Deployment Configuration

### Step 1: Verify Services

```bash
# Get outputs
cd deployment/terraform
terraform output

# Check ECS service
aws ecs describe-services \
    --cluster production-cluster \
    --services production-backend-service

# Check RDS
aws rds describe-db-instances \
    --db-instance-identifier production-postgres

# Check Amplify
aws amplify list-apps
```

- [ ] ECS cluster running
- [ ] ECS service has healthy tasks
- [ ] RDS instance available
- [ ] RDS backups enabled
- [ ] Amplify app created
- [ ] ALB healthy targets > 0

### Step 2: Configure DNS

Get ALB DNS from Terraform output:

```bash
terraform output alb_dns_name
# Example: production-alb-123456.us-east-1.elb.amazonaws.com
```

- [ ] Create DNS CNAME record for API (e.g., api.nirvahatech.com → ALB DNS)
- [ ] Wait for DNS propagation (5-30 minutes)
- [ ] Test API health: `curl https://api.nirvahatech.com/health`

Get Amplify domain from Terraform output:

```bash
terraform output amplify_default_domain
# Example: main.d111111111111.amplifyapp.com
```

- [ ] Configure custom domain in Amplify Console
- [ ] Add DNS records as instructed by Amplify
- [ ] Wait for domain verification
- [ ] HTTPS certificate auto-provisioned

### Step 3: Test the Application

Backend Tests:
```bash
# Health check
curl https://api.nirvahatech.com/health

# API documentation
open https://api.nirvahatech.com/docs

# Test lead submission
curl -X POST https://api.nirvahatech.com/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Co",
    "job_title": "CTO",
    "project_description": "Testing the deployment"
  }'
```

- [ ] Health endpoint returns healthy
- [ ] API docs accessible
- [ ] Lead submission works
- [ ] Lead appears in database

Frontend Tests:
```bash
# Open frontend
open https://nirvahatech.com
```

- [ ] Homepage loads correctly
- [ ] All sections visible (hero, about, services, testimonials, contact)
- [ ] Contact form loads
- [ ] Form validation works
- [ ] Form submission succeeds
- [ ] Success message appears
- [ ] Mobile responsive design works
- [ ] No console errors

### Step 4: Configure Monitoring

CloudWatch:
- [ ] Dashboard accessible in AWS Console
- [ ] Metrics showing data for ECS, RDS, ALB
- [ ] Log groups created and receiving logs
- [ ] Log retention set to 30 days

Alarms:
- [ ] CloudWatch alarms created
- [ ] SNS topic created
- [ ] Email subscription confirmed (check email!)
- [ ] Test alarm by simulating high CPU

Security:
- [ ] CloudTrail enabled and logging
- [ ] VPC Flow Logs enabled
- [ ] WAF rules active
- [ ] S3 access logs enabled for ALB

### Step 5: Setup GitHub Actions CI/CD

Configure GitHub Secrets:
- [ ] `AWS_ROLE_ARN` added
- [ ] `DB_PASSWORD` added
- [ ] `GH_ACCESS_TOKEN` added
- [ ] `ACM_CERTIFICATE_ARN` added
- [ ] `ALARM_EMAIL` added

Test CI/CD:
- [ ] Push to `develop` triggers CI workflow
- [ ] CI workflow passes (lint, build, test)
- [ ] Push to `main` triggers CD workflow
- [ ] CD workflow completes successfully
- [ ] New backend image built and pushed
- [ ] ECS service updated with new task
- [ ] Amplify build triggered
- [ ] Application still works after deployment

## Security Hardening

- [ ] Change all default passwords
- [ ] Enable MFA on AWS root account
- [ ] Enable MFA for IAM users
- [ ] Review and minimize IAM permissions
- [ ] Rotate access keys
- [ ] Review security group rules (least privilege)
- [ ] Enable RDS encryption at rest (should be enabled by default)
- [ ] Enable S3 bucket encryption
- [ ] Review WAF rules and adjust as needed
- [ ] Set up AWS GuardDuty (optional but recommended)
- [ ] Set up AWS Security Hub (optional)

## Compliance & Documentation

- [ ] Document all environment variables
- [ ] Update runbooks for common issues
- [ ] Create incident response plan
- [ ] Set up backup verification process
- [ ] Schedule security review (quarterly)
- [ ] Document disaster recovery procedure
- [ ] Create maintenance window schedule
- [ ] Set up cost monitoring and budgets

## Performance Optimization

- [ ] Review CloudWatch metrics after 24 hours
- [ ] Adjust ECS auto-scaling thresholds if needed
- [ ] Review RDS performance insights
- [ ] Check ALB response times
- [ ] Optimize database queries if needed
- [ ] Review CloudFront caching (if using Amplify CDN)
- [ ] Test application under load

## Final Verification

- [ ] Complete smoke test of all features
- [ ] Test from different devices (mobile, tablet, desktop)
- [ ] Test from different browsers (Chrome, Safari, Firefox)
- [ ] Test form submission end-to-end
- [ ] Verify email notifications work (if configured)
- [ ] Check all links work
- [ ] Verify SSL certificate valid and HTTPS working
- [ ] Test 404 and error pages
- [ ] Verify Google Analytics/tracking (if configured)
- [ ] Verify SEO meta tags present

## Rollback Plan

Document rollback steps in case of issues:

```bash
# Rollback ECS service to previous task definition
aws ecs update-service \
    --cluster production-cluster \
    --service production-backend-service \
    --task-definition production-backend:PREVIOUS_REVISION

# Rollback Terraform changes
cd deployment/terraform
terraform apply -var="backend_image=PREVIOUS_IMAGE"

# Rollback database migration (if needed)
cd backend
alembic downgrade -1
```

- [ ] Previous task definition revision noted
- [ ] Previous backend image tag noted
- [ ] Database backup taken before migration
- [ ] Rollback procedure tested in staging

## Sign-Off

Date: _______________

- [ ] Technical Lead sign-off: __________________
- [ ] Security review completed: __________________
- [ ] Stakeholder approval: __________________

## Post-Deployment Monitoring

Monitor for the first 24-48 hours:

- [ ] Hour 1: Check all metrics, no errors
- [ ] Hour 6: Verify backups running
- [ ] Hour 24: Review all logs, no anomalies
- [ ] Hour 48: Performance within expected range
- [ ] Week 1: Review costs vs. budget

## Ongoing Maintenance

Schedule regular tasks:

- [ ] Daily: Review CloudWatch alarms
- [ ] Weekly: Review logs for errors
- [ ] Monthly: Security patch updates
- [ ] Monthly: Review costs and optimize
- [ ] Quarterly: Security audit
- [ ] Quarterly: Disaster recovery drill
- [ ] Annually: Update SSL certificates (if not auto-renewed)
- [ ] Annually: Review and update compliance documentation

---

## Quick Deployment Command

For subsequent deployments after initial setup:

```bash
# From project root
./deployment/scripts/deploy.sh production
```

This script handles:
- Building backend image
- Pushing to ECR
- Running terraform apply
- Updating ECS service
- Triggering Amplify build

---

**Last Updated**: November 14, 2024  
**Next Review**: February 14, 2025

Good luck with your deployment! 🚀


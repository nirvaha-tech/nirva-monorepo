terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "nirvahatech-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "nirvahatech-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "nirvahatech"
      Environment = var.environment
      ManagedBy   = "Terraform"
      CostCenter  = "Infrastructure"
    }
  }
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Modules
module "networking" {
  source = "./modules/networking"

  environment        = var.environment
  vpc_cidr          = var.vpc_cidr
  availability_zones = var.availability_zones
  enable_flow_logs  = true
}

module "security" {
  source = "./modules/security"

  environment = var.environment
  vpc_id      = module.networking.vpc_id
}

module "rds" {
  source = "./modules/rds"

  environment             = var.environment
  vpc_id                  = module.networking.vpc_id
  database_subnet_ids     = module.networking.private_subnet_ids
  db_security_group_id    = module.security.db_security_group_id
  db_instance_class       = var.db_instance_class
  db_name                 = var.db_name
  db_username             = var.db_username
  db_password             = var.db_password
  backup_retention_period = var.backup_retention_period
  multi_az                = var.multi_az_enabled
}

module "ecs" {
  source = "./modules/ecs"

  environment                = var.environment
  vpc_id                     = module.networking.vpc_id
  private_subnet_ids         = module.networking.private_subnet_ids
  public_subnet_ids          = module.networking.public_subnet_ids
  ecs_security_group_id      = module.security.ecs_security_group_id
  alb_security_group_id      = module.security.alb_security_group_id
  backend_image              = var.backend_image
  backend_cpu                = var.backend_cpu
  backend_memory             = var.backend_memory
  backend_desired_count      = var.backend_desired_count
  db_host                    = module.rds.db_endpoint
  db_name                    = var.db_name
  db_username                = var.db_username
  db_password_secret_arn     = module.rds.db_password_secret_arn
  certificate_arn            = var.certificate_arn
}

module "amplify" {
  source = "./modules/amplify"

  environment           = var.environment
  repository_url        = var.github_repository
  branch_name          = var.environment == "production" ? "main" : var.environment
  github_access_token  = var.github_access_token
  backend_api_url      = module.ecs.alb_dns_name
}

module "monitoring" {
  source = "./modules/monitoring"

  environment       = var.environment
  ecs_cluster_name  = module.ecs.cluster_name
  ecs_service_name  = module.ecs.service_name
  alb_arn_suffix    = module.ecs.alb_arn_suffix
  target_group_arn_suffix = module.ecs.target_group_arn_suffix
  rds_instance_id   = module.rds.db_instance_id
  alarm_email       = var.alarm_email
}

module "waf" {
  source = "./modules/waf"

  environment = var.environment
  alb_arn     = module.ecs.alb_arn
}


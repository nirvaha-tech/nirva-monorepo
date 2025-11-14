variable "environment" {
  description = "Environment name"
  type        = string
}

variable "repository_url" {
  description = "GitHub repository URL"
  type        = string
}

variable "branch_name" {
  description = "Git branch name"
  type        = string
}

variable "github_access_token" {
  description = "GitHub access token"
  type        = string
  sensitive   = true
}

variable "backend_api_url" {
  description = "Backend API URL"
  type        = string
}

variable "custom_domain" {
  description = "Custom domain for Amplify app"
  type        = string
  default     = ""
}


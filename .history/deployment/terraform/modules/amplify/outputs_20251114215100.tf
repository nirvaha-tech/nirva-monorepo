output "app_id" {
  description = "Amplify app ID"
  value       = aws_amplify_app.frontend.id
}

output "default_domain" {
  description = "Default Amplify domain"
  value       = aws_amplify_app.frontend.default_domain
}

output "app_url" {
  description = "Amplify app URL"
  value       = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.frontend.default_domain}"
}


# Contributing to Nirvahatech

First off, thank you for considering contributing to Nirvahatech! 

## Important Notice

This is proprietary software owned by Nirvahatech. By contributing to this project, you agree that:

1. **Assignment of Rights**: You assign all rights, title, and interest in your contributions to Nirvahatech.
2. **Confidentiality**: You will maintain the confidentiality of all proprietary information.
3. **No Public Disclosure**: You will not disclose any information about this project publicly without written authorization.

## Contributor License Agreement (CLA)

Before your contributions can be accepted, you must sign our Contributor License Agreement. Please contact legal@nirvahatech.com to obtain the CLA.

## Development Process

### 1. Environment Setup

```bash
# Clone the repository (requires access)
git clone https://github.com/nirvahatech/navi.git
cd navi

# Install dependencies
make setup

# Start development environment
make dev
```

### 2. Branching Strategy

- `main` - Production branch (protected)
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Emergency production fixes

### 3. Making Changes

1. Create a branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards

3. Write or update tests as needed

4. Run linters and tests:
   ```bash
   make lint-backend
   make lint-frontend
   make test-backend
   make test-frontend
   ```

5. Commit your changes with clear, descriptive messages:
   ```bash
   git commit -m "feat: add new feature description"
   ```

### 4. Commit Message Convention

We follow the Conventional Commits specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add lead validation to contact form
fix: resolve database connection timeout issue
docs: update deployment instructions
```

### 5. Pull Request Process

1. Push your branch to the repository:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request on GitHub:
   - Base: `develop`
   - Compare: `feature/your-feature-name`
   - Fill out the PR template completely
   - Request reviews from appropriate team members

3. Address review feedback

4. Once approved, your PR will be merged by a maintainer

## Code Standards

### Backend (Python/FastAPI)

- Follow PEP 8 style guide
- Use type hints
- Write docstrings for all functions and classes
- Maximum line length: 100 characters
- Use Black for formatting
- Use Flake8 for linting

Example:
```python
"""
Module docstring describing the purpose.

Copyright (c) 2024 Nirvahatech. All rights reserved.
"""

from typing import Optional

async def process_lead(lead_data: dict) -> Optional[int]:
    """
    Process and store lead information.
    
    Args:
        lead_data: Dictionary containing lead information
        
    Returns:
        Lead ID if successful, None otherwise
    """
    # Implementation
    pass
```

### Frontend (TypeScript/React)

- Use TypeScript strict mode
- Follow React best practices
- Use functional components with hooks
- Use Tailwind CSS for styling
- ESLint for linting
- Prettier for formatting

Example:
```typescript
/*
 * Component description
 * 
 * Copyright (c) 2024 Nirvahatech. All rights reserved.
 */

interface LeadFormProps {
  onSubmit: (data: LeadData) => Promise<void>;
}

export function LeadForm({ onSubmit }: LeadFormProps) {
  // Implementation
}
```

### Infrastructure (Terraform)

- Use consistent naming conventions
- Add comments for complex configurations
- Use variables for all configurable values
- Follow AWS Well-Architected best practices

## Testing Requirements

- Write unit tests for new features
- Maintain or improve code coverage
- Include integration tests where applicable
- All tests must pass before PR approval

## Security Guidelines

- Never commit secrets or credentials
- Use environment variables for configuration
- Follow principle of least privilege
- Report security vulnerabilities to security@nirvahatech.com (do not create public issues)

## Documentation

- Update README.md if adding new features
- Document all API endpoints
- Update deployment documentation if infrastructure changes
- Include inline comments for complex logic

## Getting Help

- **Technical Questions**: Ask in the team Slack channel
- **Security Issues**: Email security@nirvahatech.com
- **Legal/CLA Questions**: Email legal@nirvahatech.com
- **General**: Email dev@nirvahatech.com

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the project
- Show empathy towards other team members

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other conduct deemed inappropriate

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban from the project
3. Permanent ban from the project
4. Reporting to appropriate authorities

Report violations to hr@nirvahatech.com

## License

By contributing to this project, you agree that your contributions will be licensed under the same proprietary license as the project. See [LICENSE](LICENSE) for details.

---

**Remember**: This is proprietary software. Treat all information as confidential.

Thank you for contributing to Nirvahatech! 🚀


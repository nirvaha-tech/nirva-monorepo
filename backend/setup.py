"""
Setup configuration for Nirvahatech Backend API

Copyright (c) 2024 Nirvahatech. All rights reserved.
This software is proprietary and confidential.
"""

import os
from pathlib import Path
from setuptools import setup, find_packages

# Read the contents of README file
here = Path(__file__).parent.resolve()
long_description = ""
readme_path = here / "README.md"
if readme_path.exists():
    long_description = readme_path.read_text(encoding="utf-8")

# Read requirements from requirements.txt
def read_requirements(filename):
    """Read requirements from a file and return as a list."""
    requirements = []
    filepath = here / filename
    if filepath.exists():
        with open(filepath, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                # Skip empty lines and comments
                if line and not line.startswith("#"):
                    requirements.append(line)
    return requirements

# Read version from __init__.py
def get_version():
    """Extract version from app/__init__.py."""
    init_path = here / "app" / "__init__.py"
    if init_path.exists():
        with open(init_path, encoding="utf-8") as f:
            for line in f:
                if line.startswith("__version__"):
                    return line.split("=")[1].strip().strip('"').strip("'")
    return "1.0.0"

# Main package requirements
install_requires = read_requirements("requirements.txt")

# Development requirements
dev_requires = [
    "pytest>=7.4.0",
    "pytest-asyncio>=0.21.0",
    "pytest-cov>=4.1.0",
    "black>=23.0.0",
    "flake8>=6.0.0",
    "mypy>=1.4.0",
    "isort>=5.12.0",
    "pre-commit>=3.3.0",
]

# Documentation requirements
docs_requires = [
    "mkdocs>=1.5.0",
    "mkdocs-material>=9.1.0",
    "mkdocstrings[python]>=0.22.0",
]

# Testing requirements
test_requires = [
    "pytest>=7.4.0",
    "pytest-asyncio>=0.21.0",
    "pytest-cov>=4.1.0",
    "httpx>=0.24.0",  # For testing FastAPI
    "faker>=18.0.0",  # For generating test data
]

setup(
    # Package metadata
    name="nirvahatech-backend",
    version=get_version(),
    description="Enterprise-grade DevOps and Cloud Infrastructure Backend API",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/nirvaha-tech/nirva-monorepo",
    project_urls={
        "Bug Reports": "https://github.com/nirvaha-tech/nirva-monorepo/issues",
        "Source": "https://github.com/nirvaha-tech/nirva-monorepo",
        "Documentation": "https://docs.nirvahatech.com",
    },
    
    # Author information
    author="Nirvahatech Engineering Team",
    author_email="engineering@nirvahatech.com",
    maintainer="Nirvahatech DevOps",
    maintainer_email="devops@nirvahatech.com",
    
    # License
    license="Proprietary",
    
    # Package discovery
    packages=find_packages(exclude=["tests", "tests.*", "docs", "scripts"]),
    package_data={
        "app": ["py.typed"],  # Include type hints
    },
    include_package_data=True,
    
    # Python version requirement
    python_requires=">=3.11,<4.0",
    
    # Dependencies
    install_requires=install_requires,
    
    # Optional dependencies for different use cases
    extras_require={
        "dev": dev_requires,
        "test": test_requires,
        "docs": docs_requires,
        "all": dev_requires + test_requires + docs_requires,
    },
    
    # Entry points for CLI commands
    entry_points={
        "console_scripts": [
            "nirvahatech-api=app.main:main",
            "nirvahatech-migrate=app.cli:migrate",
        ],
    },
    
    # Package classifiers for PyPI (if ever made public)
    classifiers=[
        # Development Status
        "Development Status :: 4 - Beta",
        
        # Intended Audience
        "Intended Audience :: Developers",
        "Intended Audience :: System Administrators",
        
        # Topic
        "Topic :: Software Development :: Libraries :: Application Frameworks",
        "Topic :: System :: Systems Administration",
        "Topic :: Internet :: WWW/HTTP :: HTTP Servers",
        
        # License
        "License :: Other/Proprietary License",
        
        # Python versions
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Programming Language :: Python :: 3 :: Only",
        
        # Framework
        "Framework :: FastAPI",
        "Framework :: AsyncIO",
        
        # Operating System
        "Operating System :: OS Independent",
        
        # Type checking
        "Typing :: Typed",
        
        # Private package indicator
        "Private :: Do Not Upload",
    ],
    
    # Keywords for searchability
    keywords=[
        "fastapi",
        "api",
        "backend",
        "devops",
        "kubernetes",
        "cloud-infrastructure",
        "enterprise",
        "microservices",
    ],
    
    # Zip safety
    zip_safe=False,
)

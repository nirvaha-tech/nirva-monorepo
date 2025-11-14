"""
Setup configuration for Nirvahatech Backend

Copyright (c) 2024 Nirvahatech. All rights reserved.
This software is proprietary and confidential.
"""

from setuptools import setup, find_packages

setup(
    name="nirvahatech-backend",
    version="1.0.0",
    description="Nirvahatech Backend API",
    author="Nirvahatech",
    author_email="dev@nirvahatech.com",
    license="Proprietary",
    packages=find_packages(),
    python_requires=">=3.11",
    install_requires=[
        "fastapi==0.109.0",
        "uvicorn[standard]==0.27.0",
        "pydantic==2.6.0",
        "pydantic-settings==2.1.0",
        "sqlalchemy==2.0.25",
        "asyncpg==0.29.0",
        "alembic==1.13.1",
        "python-dotenv==1.0.0",
        "email-validator==2.1.0",
    ],
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3.11",
        "Private :: Do Not Upload",
    ],
)


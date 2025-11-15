"""
Job Application schemas
"""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class ApplicationCreate(BaseModel):
    """Schema for creating a job application"""
    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10)
    linkedin_url: Optional[str] = None
    note: Optional[str] = None


class ApplicationResponse(BaseModel):
    """Schema for job application response"""
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    linkedin_url: Optional[str]
    resume_filename: str
    note: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


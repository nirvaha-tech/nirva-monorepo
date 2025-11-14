"""
Lead schemas for request/response validation
"""
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator
import re


class LeadBase(BaseModel):
    """
    Base lead schema
    """
    name: str = Field(..., min_length=2, max_length=255, description="Full name")
    email: EmailStr = Field(..., description="Work email address")
    company: str = Field(..., min_length=2, max_length=255, description="Company name")
    job_title: str = Field(..., min_length=2, max_length=255, description="Job title")
    phone: str | None = Field(None, max_length=50, description="Phone number (optional)")
    project_description: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="Description of the challenge or project"
    )
    
    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str | None) -> str | None:
        if v is None or v == "":
            return None
        # Basic phone validation - remove spaces and check format
        cleaned = re.sub(r'[\s\-\(\)]', '', v)
        if not re.match(r'^\+?[1-9]\d{7,14}$', cleaned):
            raise ValueError("Invalid phone number format")
        return v
    
    @field_validator("name", "company", "job_title")
    @classmethod
    def validate_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty or only whitespace")
        return v.strip()


class LeadCreate(LeadBase):
    """
    Schema for creating a new lead
    """
    pass


class LeadResponse(LeadBase):
    """
    Schema for lead response
    """
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = {
        "from_attributes": True
    }


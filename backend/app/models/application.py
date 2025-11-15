"""
Job Application model
"""
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db.base import Base


class Application(Base):
    """
    Job Application model for storing candidate information
    """
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), nullable=False)
    linkedin_url = Column(String(500), nullable=True)
    resume_filename = Column(String(500), nullable=False)
    resume_path = Column(String(1000), nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Application {self.first_name} {self.last_name} - {self.email}>"


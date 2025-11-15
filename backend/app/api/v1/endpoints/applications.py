"""
Job Application endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging
import os
import aiofiles
from pathlib import Path
from datetime import datetime

from app.db.session import get_db
from app.models.application import Application
from app.schemas.application import ApplicationResponse

router = APIRouter()
logger = logging.getLogger(__name__)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads/resumes")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".txt", ".rtf"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a job application",
    description="Submit a job application with resume upload"
)
async def create_application(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    resume: UploadFile = File(...),
    linkedin_url: str = Form(None),
    note: str = Form(None),
    db: AsyncSession = Depends(get_db)
) -> ApplicationResponse:
    """
    Create a new job application with resume upload
    """
    try:
        # Validate file
        if not resume.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resume file is required"
            )
        
        file_ext = Path(resume.filename).suffix.lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Read file content to check size
        content = await resume.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds 5MB limit"
            )
        
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"{timestamp}_{first_name}_{last_name}_{resume.filename}"
        safe_filename = "".join(c for c in safe_filename if c.isalnum() or c in ('_', '-', '.'))
        file_path = UPLOAD_DIR / safe_filename
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        # Create database entry
        db_application = Application(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            linkedin_url=linkedin_url,
            resume_filename=resume.filename,
            resume_path=str(file_path),
            note=note
        )
        
        db.add(db_application)
        await db.commit()
        await db.refresh(db_application)
        
        logger.info(f"New application received: {email} - {first_name} {last_name}")
        
        return ApplicationResponse.model_validate(db_application)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating application: {str(e)}", exc_info=True)
        # Clean up file if it was saved
        if 'file_path' in locals() and file_path.exists():
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit application: {str(e)}"
        )


@router.get(
    "",
    response_model=list[ApplicationResponse],
    summary="Get all applications",
    description="Retrieve all job applications (admin only in production)"
)
async def get_applications(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
) -> list[ApplicationResponse]:
    """
    Get all job applications with pagination
    Note: This endpoint should be protected with authentication in production
    """
    try:
        result = await db.execute(
            select(Application)
            .order_by(Application.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        applications = result.scalars().all()
        return [ApplicationResponse.model_validate(app) for app in applications]
        
    except Exception as e:
        logger.error(f"Error fetching applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch applications"
        )


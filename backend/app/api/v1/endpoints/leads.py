"""
Lead endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

from app.db.session import get_db
from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadResponse

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post(
    "",
    response_model=LeadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new lead",
    description="Submit a contact form and create a new lead in the database"
)
async def create_lead(
    lead_data: LeadCreate,
    db: AsyncSession = Depends(get_db)
) -> LeadResponse:
    """
    Create a new lead from contact form submission
    """
    try:
        # Create new lead instance
        db_lead = Lead(
            name=lead_data.name,
            email=lead_data.email,
            company=lead_data.company,
            job_title=lead_data.job_title,
            phone=lead_data.phone,
            project_description=lead_data.project_description
        )
        
        # Add to database
        db.add(db_lead)
        await db.flush()
        await db.refresh(db_lead)
        
        logger.info(f"New lead created: {db_lead.email} from {db_lead.company}")
        
        return LeadResponse.model_validate(db_lead)
        
    except Exception as e:
        logger.error(f"Error creating lead: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create lead. Please try again later."
        )


@router.get(
    "",
    response_model=list[LeadResponse],
    summary="Get all leads",
    description="Retrieve all leads from the database (admin only in production)"
)
async def get_leads(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
) -> list[LeadResponse]:
    """
    Get all leads with pagination
    Note: This endpoint should be protected with authentication in production
    """
    try:
        result = await db.execute(
            select(Lead)
            .order_by(Lead.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        leads = result.scalars().all()
        return [LeadResponse.model_validate(lead) for lead in leads]
        
    except Exception as e:
        logger.error(f"Error fetching leads: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch leads"
        )


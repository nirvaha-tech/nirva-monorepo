"""
API v1 router
"""
from fastapi import APIRouter
from app.api.v1.endpoints import leads, applications

api_router = APIRouter()

api_router.include_router(leads.router, prefix="/leads", tags=["leads"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])


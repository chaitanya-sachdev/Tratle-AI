# backend/app/routes/origin.py
from fastapi import APIRouter, Query
from app.models.request_models import ProductRequest
from app.models.response_models import OriginEligibilityResponse
from app.services.origin_engine import analyze_origin

router = APIRouter()

@router.post("/", response_model=OriginEligibilityResponse)
async def evaluate_origin(request: ProductRequest, product_hs: str = Query("000000", description="6-digit HS Code")):
    return analyze_origin(request, product_hs)
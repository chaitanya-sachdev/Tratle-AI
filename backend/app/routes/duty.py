# backend/app/routes/duty.py
from fastapi import APIRouter
from app.models.request_models import ProductRequest
from app.models.response_models import DutyCalculationResponse
from app.services.duty_engine import calculate_duty

router = APIRouter()

@router.post("/", response_model=DutyCalculationResponse)
async def evaluate_duty(request: ProductRequest):
    return calculate_duty(request)
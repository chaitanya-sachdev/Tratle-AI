from fastapi import APIRouter, HTTPException
import json
from app.models.request_models import TradeRequest
from app.models.response_models import DutyCalculationResponse
from app.services.duty_engine import calculate_duty

router = APIRouter()

@router.post("/", response_model=DutyCalculationResponse)
async def evaluate_duty(request: TradeRequest, product_hs6: str):
    try:
        with open("app/data/tariffs.json", "r") as f:
            tariffs = json.load(f)
            
        # Get rates based on import country. Default to 0 if not found to prevent crashes.
        country_data = tariffs.get(request.import_country, {"VAT": 0.0, "rates": {}})
        duty_rate = country_data["rates"].get(product_hs6, 0.05) # 5% fallback
        vat_rate = country_data["VAT"]
        
        return calculate_duty(request, duty_rate, vat_rate)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Tariff data file missing.")
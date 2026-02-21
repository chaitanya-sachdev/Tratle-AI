from fastapi import APIRouter, HTTPException
import json
from app.models.request_models import TradeRequest
from app.models.response_models import OriginEligibilityResponse
from app.services.origin_engine import analyze_origin

router = APIRouter()

@router.post("/", response_model=OriginEligibilityResponse)
async def evaluate_origin(request: TradeRequest, product_hs6: str, target_fta: str = "USMCA"):
    try:
        with open("app/data/fta_rules.json", "r") as f:
            fta_rules = json.load(f)
            
        return analyze_origin(request, product_hs6, fta_rules, target_fta)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="FTA rules data file missing.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
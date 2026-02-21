from fastapi import APIRouter
from app.models.request_models import TradeRequest
from app.models.response_models import TradeResponse, HSAnalysis
from app.services.origin_engine import evaluate_origin
from app.services.duty_engine import calculate_landed_cost
import json

# from app.services.llm_service import classify_product  <-- NLP Member will uncomment this

router = APIRouter(tags=["Trade Engine"])

@router.post("/calculate", response_model=TradeResponse)
async def calculate_trade(request: TradeRequest):
    # 1. TEMPORARY MOCK: NLP Classification (Delete when Member B finishes)
    hs_analysis = HSAnalysis(
        predicted_code="851713", 
        confidence=0.98, 
        alternatives=["854231", "850760"], 
        reasoning="Mocked until NLP is wired."
    )
    
    # Calculate Total Value from BOM
    total_value = sum(item.value for item in request.bom)

    # 2. Origin Evaluation (Assuming USMCA for demo)
    with open("app/data/fta_rules.json", "r") as f:
        fta_rules = json.load(f)
    
    origin_result = evaluate_origin(
        product_hs6=hs_analysis.predicted_code, 
        total_value=total_value, 
        bom=request.bom, 
        target_fta=fta_rules["USMCA"]
    )
    
    # 3. Duty Calculation
    # Hardcoded tariff & VAT for demo purposes. You can wire this to tariffs.json later.
    cost_result = calculate_landed_cost(
        customs_value=total_value, 
        weight_kg=request.weight_kg, 
        shipping_mode=request.shipping_mode, 
        tariff_rate=0.05,  
        vat_rate=0.0  
    )
    
    return TradeResponse(
        hs_analysis=hs_analysis,
        origin_eligible=origin_result["eligible"],
        applied_fta="USMCA" if origin_result["eligible"] else None,
        rvc_score=origin_result["rvc_score"],
        base_duty_amount=cost_result["base_duty_amount"],
        vat_amount=cost_result["vat_amount"],
        shipping_cost=cost_result["shipping_cost"],
        total_landed_cost=cost_result["total_landed_cost"],
        optimization=None
    )
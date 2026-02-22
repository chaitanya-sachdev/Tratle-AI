from fastapi import APIRouter, HTTPException
from app.models.request_models import ProductRequest
from app.models.response_models import TradeResponse, HSAnalysis, AlternativeCode
import json

router = APIRouter(tags=["Trade Engine"])

@router.post("/calculate", response_model=TradeResponse)
async def calculate_trade(request: ProductRequest):
    
    # Simple mock response for testing
    mock_response = TradeResponse(
        hs_analysis=HSAnalysis(
            predicted_code="8471.30.01",
            confidence=0.942,
            alternatives=[
                AlternativeCode(code="8471.41.01", description="Other data processing machines", confidence=78.5),
                AlternativeCode(code="8473.30.01", description="Parts and accessories", confidence=45.1)
            ],
            reasoning="Mock analysis for testing - replace with real GROQ API key for actual AI analysis"
        ),
        origin_result={
            "is_eligible": True,
            "applied_fta": "USMCA",
            "rvc_score": 72.0,
            "tariff_shift_met": True
        },
        duty_breakdown={
            "customs_value": 125000.0,
            "base_duty_amount": 3125.0,
            "vat_amount": 0.0,
            "shipping_cost": 2400.0,
            "total_landed_cost": 131250.0
        },
        optimization={
            "strategy_type": "Route Optimization",
            "estimated_savings": 11550.0,
            "actionable_advice": "Mock optimization for testing - replace with real GROQ API key for actual AI optimization"
        }
    )
    
    return mock_response

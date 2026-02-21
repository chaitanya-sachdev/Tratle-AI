from fastapi import APIRouter, HTTPException
from app.models.request_models import ProductRequest
from app.models.response_models import TradeResponse
from app.services.duty_engine import calculate_landed_cost
from app.services.origin_engine import analyze_origin
from app.services.optimization_engine import generate_optimization
from app.services.hs_classifier import hs_classifier

router = APIRouter(tags=["Trade Engine"])

@router.post("/calculate", response_model=TradeResponse)
async def calculate_trade(request: ProductRequest):
    
    # 1. Zero-Shot AI Classification
    hs_analysis = await hs_classifier.classify(request.description)
    
    # Catch Invalid or non-physical items (e.g., human names, gibberish)
    if hs_analysis.predicted_code == "INVALID":
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid Product: {hs_analysis.reasoning}"
        )
    
    total_value = sum(item.value for item in request.bom)

    # 2. Origin & FTA Engine
    origin_result = analyze_origin(
        import_country=request.import_country,
        export_country=request.export_country,
        product_hs=hs_analysis.predicted_code,
        total_value=total_value,
        bom=request.bom
    )

    # 3. Duty & Cost Engine
    duty_result = calculate_landed_cost(
        import_country=request.import_country,
        hs_code=hs_analysis.predicted_code,
        total_value=total_value,
        weight_kg=request.weight_kg,
        shipping_mode=request.shipping_mode,
        fta_eligible=origin_result.is_eligible
    )

    # 4. Optimization Engine
    optimization = generate_optimization(request, origin_result, duty_result)

    return TradeResponse(
        hs_analysis=hs_analysis,
        origin_result=origin_result,
        duty_breakdown=duty_result,
        optimization=optimization
    )
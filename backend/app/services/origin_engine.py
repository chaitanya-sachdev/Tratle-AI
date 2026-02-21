# backend/app/services/origin_engine.py
from app.models.request_models import ProductRequest, BOMItem
from app.models.response_models import OriginEligibilityResponse

def calculate_rvc(total_value: float, non_originating_value: float) -> float:
    if total_value <= 0:
        return 0.0
    return ((total_value - non_originating_value) / total_value) * 100.0

def check_tariff_shift(product_hs: str, bom: list[BOMItem]) -> bool:
    product_shift = product_hs[:4]
    for item in bom:
        if not item.is_originating and item.hs_code[:4] == product_shift:
            return False
    return True

def analyze_origin(request: ProductRequest, product_hs: str, fta_name: str = "Default FTA") -> OriginEligibilityResponse:
    non_originating_value = sum(item.value for item in request.bom if not item.is_originating)
    rvc_score = calculate_rvc(request.value, non_originating_value)
    
    tariff_shift_met = check_tariff_shift(product_hs, request.bom)
    
    is_eligible = rvc_score >= 50.0 and tariff_shift_met 
    
    return OriginEligibilityResponse(
        is_eligible=is_eligible,
        applied_fta=fta_name if is_eligible else None,
        rvc_score=rvc_score,
        tariff_shift_met=tariff_shift_met
    )
from typing import List
from app.models.request_models import TradeRequest, BOMItem
from app.models.response_models import OriginEligibilityResponse

def calculate_rvc(total_value: float, non_originating_value: float) -> float:
    if total_value <= 0:
        return 0.0
    return ((total_value - non_originating_value) / total_value) * 100.0

def check_tariff_shift(product_hs4: str, bom: List[BOMItem], fta_countries: List[str]) -> bool:
    for item in bom:
        is_originating = item.origin_country in fta_countries
        if not is_originating and item.hs_code_4 == product_hs4:
            return False
    return True

def check_direct_transit(transit_countries: List[str], fta_countries: List[str]) -> bool:
    for country in transit_countries:
        if country not in fta_countries:
            return False
    return True

def analyze_origin(request: TradeRequest, product_hs6: str, fta_rules: dict, target_fta: str) -> OriginEligibilityResponse:
    if target_fta not in fta_rules:
        raise ValueError(f"FTA {target_fta} not found in rules.")
        
    rules = fta_rules[target_fta]
    fta_countries = rules["member_countries"]
    threshold = rules["default_rvc_threshold"]

    vnm = sum(item.value for item in request.bom if item.origin_country not in fta_countries)
    rvc_score = calculate_rvc(request.total_customs_value, vnm)
    tariff_shift_met = check_tariff_shift(product_hs6[:4], request.bom, fta_countries)
    direct_transit_met = check_direct_transit(request.transit_countries, fta_countries)
    
    is_eligible = (rvc_score >= threshold) and tariff_shift_met and direct_transit_met
    
    return OriginEligibilityResponse(
        is_eligible=is_eligible,
        applied_fta=target_fta if is_eligible else None,
        rvc_score=round(rvc_score, 2),
        tariff_shift_met=tariff_shift_met,
        direct_transit_met=direct_transit_met
    )
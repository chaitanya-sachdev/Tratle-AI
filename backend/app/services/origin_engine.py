import json
import os
from typing import List
from app.models.request_models import BOMItem
from app.models.response_models import OriginResult

def load_fta_rules():
    path = os.path.join(os.path.dirname(__file__), "../data/fta_rules.json")
    with open(path, "r") as f:
        return json.load(f)

def calculate_rvc(total_value: float, non_originating_value: float) -> float:
    if total_value <= 0: return 0.0
    return ((total_value - non_originating_value) / total_value) * 100.0

def check_tariff_shift(product_hs: str, bom: List[BOMItem]) -> bool:
    product_chapter = product_hs[:2]
    for item in bom:
        if not item.is_originating and item.hs_code[:2] == product_chapter:
            return False
    return True

def analyze_origin(import_country: str, export_country: str, product_hs: str, total_value: float, bom: List[BOMItem]) -> OriginResult:
    rules = load_fta_rules()
    
    active_fta = None
    active_fta_name = None
    for fta_name, fta_data in rules.items():
        if import_country in fta_data["member_countries"] and export_country in fta_data["member_countries"]:
            active_fta = fta_data
            active_fta_name = fta_name
            break

    if not active_fta:
        return OriginResult(is_eligible=False, applied_fta=None, rvc_score=0.0, tariff_shift_met=False)

    non_originating_value = sum(item.value for item in bom if not item.is_originating)
    rvc_score = calculate_rvc(total_value, non_originating_value)
    tariff_shift_met = check_tariff_shift(product_hs, bom)
    
    is_eligible = rvc_score >= active_fta["default_rvc_threshold"] and tariff_shift_met

    return OriginResult(
        is_eligible=is_eligible,
        applied_fta=active_fta_name if is_eligible else None,
        rvc_score=round(rvc_score, 2),
        tariff_shift_met=tariff_shift_met
    )
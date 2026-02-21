from pydantic import BaseModel
from typing import List, Optional

class HSAnalysis(BaseModel):
    predicted_code: str
    confidence: float
    alternatives: List[str]
    reasoning: str

class DutyCalculationResponse(BaseModel):
    customs_value: float
    base_duty: float
    vat: float
    shipping_cost: float
    total_landed_cost: float
    transit_route: List[str]  # Outputs the exact country-to-country path

class OriginEligibilityResponse(BaseModel):
    is_eligible: bool
    applied_fta: Optional[str]
    rvc_score: float
    tariff_shift_met: bool
    direct_transit_met: bool  # Fails if routed through a non-FTA country
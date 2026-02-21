# backend/app/models/response_models.py
from pydantic import BaseModel
from typing import List, Optional

class HSAlternative(BaseModel):
    hs_code: str
    reasoning: str

class HSAnalysisResponse(BaseModel):
    hs_code: str
    confidence: float
    alternatives: List[HSAlternative]
    reasoning: str

class OriginEligibilityResponse(BaseModel):
    is_eligible: bool
    applied_fta: Optional[str]
    rvc_score: float
    tariff_shift_met: bool

class DutyCalculationResponse(BaseModel):
    customs_value: float
    base_duty: float
    vat: float
    shipping_cost: float
    total_landed_cost: float
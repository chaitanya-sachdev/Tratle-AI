<<<<<<< HEAD
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
=======
from pydantic import BaseModel, Field
from typing import List, Optional

class BOMItem(BaseModel):
    component_name: str
    hs_code_4: str
    origin_country: str
    value: float

class TradeRequest(BaseModel):
    product_description: str
    import_country: str
    export_country: str
    shipping_mode: str = Field(..., description="Air, Sea, or Land")
    weight_kg: float
    bom: List[BOMItem]

class HSAnalysis(BaseModel):
    predicted_code: str
    confidence: float
    alternatives: List[str]
    reasoning: str

class OptimizationSuggestion(BaseModel):
    original_landed_cost: float
    optimized_landed_cost: float
    savings: float
    suggestion: str

class TradeResponse(BaseModel):
    hs_analysis: HSAnalysis
    origin_eligible: bool
    applied_fta: Optional[str]
    rvc_score: float
    base_duty_amount: float
    vat_amount: float
    shipping_cost: float
    total_landed_cost: float
    optimization: Optional[OptimizationSuggestion]
>>>>>>> 31db120922577ad0da59d5035435b75dd54e6bd5

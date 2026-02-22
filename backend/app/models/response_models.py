from pydantic import BaseModel
from typing import List, Optional

class AlternativeCode(BaseModel):
    code: str
    description: str
    confidence: float

class HSAnalysis(BaseModel):
    predicted_code: str
    confidence: float
    alternatives: List[AlternativeCode]
    reasoning: str

class DutyBreakdown(BaseModel):
    customs_value: float
    base_duty_amount: float
    vat_amount: float
    shipping_cost: float
    total_landed_cost: float

class OriginResult(BaseModel):
    is_eligible: bool
    applied_fta: Optional[str]
    rvc_score: float
    tariff_shift_met: bool

class OptimizationSuggestion(BaseModel):
    strategy_type: str
    estimated_savings: float
    actionable_advice: str

class TradeResponse(BaseModel):
    hs_analysis: HSAnalysis
    origin_result: OriginResult
    duty_breakdown: DutyBreakdown
    optimization: Optional[OptimizationSuggestion]
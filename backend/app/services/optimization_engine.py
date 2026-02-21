from app.models.response_models import OptimizationSuggestion, DutyBreakdown, OriginResult
from app.models.request_models import ProductRequest

def generate_optimization(request: ProductRequest, origin: OriginResult, duty: DutyBreakdown) -> OptimizationSuggestion | None:
    if request.shipping_mode == "Air" and request.weight_kg > 100:
        savings = (request.weight_kg * 5.00) - (request.weight_kg * 0.50)
        return OptimizationSuggestion(
            strategy_type="Logistics Optimization",
            estimated_savings=savings,
            actionable_advice=f"Switching from Air to Sea freight for this {request.weight_kg}kg shipment reduces landed cost heavily."
        )

    if not origin.is_eligible and origin.applied_fta is None and origin.rvc_score > 0:
        shortfall = 75.0 - origin.rvc_score 
        if 0 < shortfall < 15:
            return OptimizationSuggestion(
                strategy_type="Sourcing Pivot",
                estimated_savings=duty.base_duty_amount,
                actionable_advice=f"You are only {round(shortfall, 1)}% away from RVC threshold. Source more components locally to eliminate the ${duty.base_duty_amount} duty."
            )

    return None
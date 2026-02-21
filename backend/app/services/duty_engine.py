# backend/app/services/duty_engine.py
from app.models.request_models import ProductRequest
from app.models.response_models import DutyCalculationResponse

SHIPPING_RATES = {
    "Air": 5.00,
    "Land": 1.50,
    "Sea": 0.50
}

def calculate_duty(request: ProductRequest, duty_rate: float = 0.05, vat_rate: float = 0.10) -> DutyCalculationResponse:
    shipping_multiplier = SHIPPING_RATES.get(request.shipping_mode.value, 0.0)
    shipping_cost = request.weight_kg * shipping_multiplier
    
    customs_value = request.value
    base_duty = customs_value * duty_rate
    vat = (customs_value + base_duty + shipping_cost) * vat_rate
    total_landed_cost = customs_value + base_duty + vat + shipping_cost

    return DutyCalculationResponse(
        customs_value=customs_value,
        base_duty=base_duty,
        vat=vat,
        shipping_cost=shipping_cost,
        total_landed_cost=total_landed_cost
    )
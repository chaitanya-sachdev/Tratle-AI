import json
import os
from app.models.response_models import DutyBreakdown
from app.models.request_models import ShippingMode

SHIPPING_RATES = {
    ShippingMode.AIR: 5.00,
    ShippingMode.LAND: 1.50,
    ShippingMode.SEA: 0.50
}

def load_tariffs():
    path = os.path.join(os.path.dirname(__file__), "../data/tariffs.json")
    with open(path, "r") as f:
        return json.load(f)

def calculate_landed_cost(
    import_country: str, 
    hs_code: str, 
    total_value: float, 
    weight_kg: float, 
    shipping_mode: ShippingMode,
    fta_eligible: bool
) -> DutyBreakdown:
    
    tariffs = load_tariffs()
    country_data = tariffs.get(import_country, {"VAT": 0.0, "rates": {}})
    
    shipping_cost = weight_kg * SHIPPING_RATES.get(shipping_mode, 1.0)
    
    # FALLBACK: If Groq invents an HS code we don't have, default to 5% instead of crashing
    base_rate = country_data["rates"].get(hs_code, 0.05) 
    duty_rate = 0.0 if fta_eligible else base_rate
    base_duty_amount = total_value * duty_rate
    
    vat_rate = country_data["VAT"]
    vat_basis = total_value + shipping_cost + base_duty_amount
    vat_amount = vat_basis * vat_rate
    
    total_landed_cost = total_value + base_duty_amount + vat_amount + shipping_cost

    return DutyBreakdown(
        customs_value=total_value,
        base_duty_amount=base_duty_amount,
        vat_amount=vat_amount,
        shipping_cost=shipping_cost,
        total_landed_cost=total_landed_cost
    )
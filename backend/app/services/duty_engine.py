from typing import List
from app.models.request_models import TradeRequest
from app.models.response_models import DutyCalculationResponse

# Nuclear approach: Base rate per kg + flat transit fee per border crossed
BASE_SHIPPING_RATE_PER_KG = 2.00
TRANSIT_FEE_PER_COUNTRY = 50.00 

def calculate_duty(request: TradeRequest, duty_rate: float, vat_rate: float) -> DutyCalculationResponse:
    # Cost scales by distance/complexity (number of countries crossed)
    shipping_cost = (request.weight_kg * BASE_SHIPPING_RATE_PER_KG) + (len(request.transit_countries) * TRANSIT_FEE_PER_COUNTRY)
    
    # CIF Value (Cost, Insurance, Freight)
    cif_value = request.total_customs_value + shipping_cost
    
    base_duty = cif_value * duty_rate
    vat = (cif_value + base_duty) * vat_rate
    total_landed_cost = cif_value + base_duty + vat

    # Construct the full visual route: Export -> Transit 1 -> Transit 2 -> Import
    full_route = [request.export_country] + request.transit_countries + [request.import_country]

    return DutyCalculationResponse(
        customs_value=request.total_customs_value,
        base_duty=round(base_duty, 2),
        vat=round(vat, 2),
        shipping_cost=round(shipping_cost, 2),
        total_landed_cost=round(total_landed_cost, 2),
        transit_route=full_route
    )
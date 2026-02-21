from pydantic import BaseModel, Field, conlist
from typing import List

class BOMItem(BaseModel):
    component_name: str = Field(..., min_length=1)
    hs_code_4: str = Field(..., min_length=4, max_length=4)
    origin_country: str = Field(..., min_length=2, max_length=2, description="ISO 2-letter country code")
    value: float = Field(..., ge=0.0)

class TradeRequest(BaseModel):
    product_description: str = Field(..., min_length=5)
    import_country: str = Field(..., min_length=2, max_length=2)
    export_country: str = Field(..., min_length=2, max_length=2)
    # The new Geographic Route: e.g., ["FR", "TR"] means it transits France and Turkey
    transit_countries: List[str] = Field(default_factory=list, description="List of ISO 2-letter country codes the shipment passes through")
    weight_kg: float = Field(..., gt=0.0)
    total_customs_value: float = Field(..., ge=0.0)
    bom: conlist(BOMItem, min_length=1)
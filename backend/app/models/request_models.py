from pydantic import BaseModel, Field
from typing import List

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
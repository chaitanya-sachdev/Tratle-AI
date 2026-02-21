from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class ShippingMode(str, Enum):
    AIR = "Air"
    SEA = "Sea"
    LAND = "Land"

class ProductQuery(BaseModel):
    description: str

class BOMItem(BaseModel):
    hs_code: str = Field(..., description="6-digit HS Code of the component")
    value: float = Field(..., gt=0, description="Cost of the component")
    origin_country: str = Field(..., description="2-letter ISO country code")
    is_originating: bool = Field(False, description="Does it meet FTA origin rules?")

class ProductRequest(BaseModel):
    description: str
    import_country: str
    export_country: str
    weight_kg: float
    shipping_mode: ShippingMode
    bom: List[BOMItem]
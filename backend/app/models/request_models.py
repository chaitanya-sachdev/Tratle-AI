# backend/app/models/request_models.py
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class ShippingMode(str, Enum):
    AIR = "Air"
    SEA = "Sea"
    LAND = "Land"

class BOMItem(BaseModel):
    item_name: str
    hs_code: str
    origin_country: str
    value: float
    is_originating: bool

class ProductRequest(BaseModel):
    description: str
    bom: List[BOMItem] = Field(default_factory=list)
    export_country: str
    import_country: str
    quantity: int
    value: float
    weight_kg: float
    shipping_mode: ShippingMode
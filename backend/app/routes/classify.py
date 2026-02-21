from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.hs_classifier import hs_classifier
from app.services.llm_service import llm_service, HSClassificationResult

router = APIRouter()

class ProductQuery(BaseModel):
    description: str

@router.post("/classify-hs", response_model=HSClassificationResult)
async def classify_product_endpoint(query: ProductQuery):
    try:
        # 1. Semantic Search: Find top 5 candidate HS codes from our local JSON
        candidates = hs_classifier.get_candidate_codes(query.description, k=5)
        
        # 2. LLM Inference: Ask Llama-3 to pick the best code and format as strict JSON
        classification = await llm_service.classify_product(query.description, candidates)
        
        return classification
        
    except Exception as e:
        # Catch errors so the server doesn't crash during the hackathon
        raise HTTPException(status_code=500, detail=f"Classification Engine Error: {str(e)}")
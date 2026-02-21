from fastapi import APIRouter, HTTPException
from app.models.request_models import ProductQuery
from app.models.response_models import HSAnalysis
from app.services.hs_classifier import hs_classifier

router = APIRouter(tags=["classify"])

@router.post("/", response_model=HSAnalysis)
async def classify_product_endpoint(query: ProductQuery):
    try:
        # Check if using placeholder API key
        import os
        api_key = os.getenv("GROQ_API_KEY", "")
        if "placeholder" in api_key.lower():
            # Return mock data for testing
            return HSAnalysis(
                predicted_code="8471.30.01",
                confidence=94.2,
                reasoning="Mock classification for testing - replace with real GROQ API key for actual AI classification",
                alternative_codes=[
                    {"code": "8471.41.01", "description": "Other data processing machines", "confidence": 78.5},
                    {"code": "8473.30.01", "description": "Parts and accessories", "confidence": 45.1}
                ]
            )
        
        analysis = await hs_classifier.classify(query.description)
        if analysis.predicted_code == "INVALID":
            raise HTTPException(status_code=400, detail=f"Classification Failed: {analysis.reasoning}")
        return analysis
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

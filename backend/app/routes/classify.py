from fastapi import APIRouter, HTTPException
from app.models.request_models import ProductQuery
from app.models.response_models import HSAnalysis
from app.services.hs_classifier import hs_classifier

router = APIRouter(tags=["classify"])

@router.post("/", response_model=HSAnalysis)
async def classify_product_endpoint(query: ProductQuery):
    try:
        analysis = await hs_classifier.classify(query.description)
        if analysis.predicted_code == "INVALID":
            raise HTTPException(status_code=400, detail=f"Classification Failed: {analysis.reasoning}")
        return analysis
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
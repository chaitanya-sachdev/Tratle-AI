from fastapi import APIRouter
from app.models.request_models import TradeRequest
from app.models.response_models import HSAnalysis

router = APIRouter()

@router.post("/", response_model=HSAnalysis)
async def classify_product(request: TradeRequest):
    # This is the strictly defined injection point for the NLP Engineer.
    # Replace this mock block with the Llama-3 API call.
    return HSAnalysis(
        predicted_code="851713",
        confidence=0.99,
        alternatives=["854231", "850760"],
        reasoning="Mocked routing until NLP service is attached."
    )
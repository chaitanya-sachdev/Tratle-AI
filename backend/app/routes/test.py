from fastapi import APIRouter

router = APIRouter(tags=["Test"])

@router.get("/test")
async def test_endpoint():
    return {
        "status": "Frontend-Backend Integration Working",
        "message": "This is a test endpoint to verify connectivity",
        "timestamp": "2025-02-21T21:00:00Z"
    }

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import classify, origin, duty, whatif

app = FastAPI(
    title="AI-Powered Tariff & Trade Optimization API", 
    version="1.0.0",
    description="Enterprise-grade routing and calculation engine."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modular routing keeps the architecture clean
app.include_router(classify.router, prefix="/api/v1/classify", tags=["Classify"])
app.include_router(origin.router, prefix="/api/v1/origin", tags=["Origin"])
app.include_router(duty.router, prefix="/api/v1/duty", tags=["Duty"])
app.include_router(whatif.router, prefix="/api/v1/whatif", tags=["What-If"])

@app.get("/")
def health():
    return {
        "status": "running",
        "service": "Tratle-AI Backend",
        "version": "1.0.0"
    }
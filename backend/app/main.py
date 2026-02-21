from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import classify_mock, duty_mock, test

app = FastAPI(title="Trade-X Trade Optimization API", version="3.0.0-ZERO-SHOT")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(classify_mock.router, prefix="/api/v1/classify")
app.include_router(duty_mock.router, prefix="/api/v1/trade")
app.include_router(test.router, prefix="/api/v1/test")

@app.get("/")
def health():
    return {
        "status": "Running optimally",
        "service": "Trade-X Zero-Shot Backend",
        "version": "3.0.0"
    }
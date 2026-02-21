# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import classify, origin, duty, whatif

app = FastAPI(title="AI-Powered Tariff & Trade Optimization API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(classify.router, prefix="/api/v1/classify", tags=["classify"])
app.include_router(origin.router, prefix="/api/v1/origin", tags=["origin"])
app.include_router(duty.router, prefix="/api/v1/duty", tags=["duty"])
app.include_router(whatif.router, prefix="/api/v1/whatif", tags=["whatif"])
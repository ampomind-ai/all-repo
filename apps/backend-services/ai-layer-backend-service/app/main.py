from fastapi import FastAPI
from app.api.v1.ai import router as ai_router

app = FastAPI(title="AI Service", version="1.0")

app.include_router(ai_router, prefix="/api/v1/ai")

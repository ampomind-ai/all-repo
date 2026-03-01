from fastapi import APIRouter
from app.schemas.ai import AIRequest, AIResponse
from app.services.llm import generate_response

router = APIRouter()

@router.post("/chat", response_model=AIResponse)
async def chat(request: AIRequest):
    result = await generate_response(request.prompt)
    return {"response": result}
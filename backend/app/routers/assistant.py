from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List

from app.services.llm_service import LLMService
from app.auth.jwt_handler import get_current_hr
from app.models.user import User

router = APIRouter(prefix="/assistant", tags=["HR Assistant"])


class ChatRequest(BaseModel):
    query: str


class ChatResponse(BaseModel):
    text: str
    sources: List[str]


llm_service = LLMService()


@router.post("/chat", response_model=ChatResponse)
def assistant_chat(
    req: ChatRequest,
    current_user: User = Depends(get_current_hr)
):
    """
    RAG-powered conversational assistant for HR policy queries.
    """
    res = llm_service.generate_chat_response(req.query)
    return ChatResponse(
        text=res["text"],
        sources=res["sources"]
    )

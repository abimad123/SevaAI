import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import generate_chat_response
from app.services.rag_service import retrieve_top_chunks

router = APIRouter()

class ChatRequest(BaseModel):
  message: str
  language: str = "en"
  context: dict = {}
  history: list = []
  user_role: str = "citizen"

class ChatResponse(BaseModel):
  response: str
  sources: list = []
  confidence: float = 0.9
  processing_time: int = 0

@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
  start = time.time()
  try:
    retrieved = retrieve_top_chunks(query=request.message, k=5)
    context_str = ""
    sources = []
    
    if retrieved:
      context_parts = []
      for chunk in retrieved:
        meta = chunk["metadata"]
        context_parts.append(f"Document: {meta.get('title')}\nSource: {meta.get('source')}\nPage: {meta.get('page')}\nContent: {chunk['content']}")
        sources.append({
          "source": meta.get("source"),
          "title": f"{meta.get('title')} (Page {meta.get('page')})",
          "relevanceScore": chunk["similarity"]
        })
      context_str = "\n\n---\n\n".join(context_parts)

    response_text = generate_chat_response(
      message=request.message,
      history=request.history,
      role=request.user_role,
      language=request.language,
      context=context_str if context_str else None
    )
    
    return ChatResponse(
      response=response_text,
      sources=sources,
      confidence=0.9,
      processing_time=int((time.time() - start) * 1000)
    )
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

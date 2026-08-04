import os
import time
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

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
    confidence: float = 0.7
    processing_time: int = 0


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    start = time.time()
    try:
        from app.services.rag import similarity_search, get_llm, SYSTEM_PROMPT
        from langchain.prompts import ChatPromptTemplate

        # Retrieve relevant context
        search_results = similarity_search(request.message)

        sources = []
        context_text = ""
        if search_results:
            for doc, score in search_results:
                if score > 0.3:
                    context_text += f"\n\n{doc.page_content}"
                    sources.append({
                        "title": doc.metadata.get("title", "Knowledge Base"),
                        "content": doc.page_content[:200] + "...",
                        "source": doc.metadata.get("source", "SevaAI Knowledge Base"),
                        "relevanceScore": round(score, 3),
                    })

        if not context_text:
            context_text = "No specific documents found. Using general knowledge about Indian NGO sector and government schemes."

        # Build history context
        history_text = ""
        for msg in request.history[-6:]:
            history_text += f"\n{msg['role'].upper()}: {msg['content']}"

        llm = get_llm()
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT.format(context=context_text, user_role=request.user_role)),
            ("human", f"Previous conversation:{history_text}\n\nCurrent question: {request.message}"),
        ])
        chain = prompt | llm
        result = chain.invoke({})
        response_text = result.content

        confidence = min(0.95, 0.5 + len(sources) * 0.1) if sources else 0.6

        return ChatResponse(
            response=response_text,
            sources=sources,
            confidence=confidence,
            processing_time=int((time.time() - start) * 1000),
        )

    except ImportError:
        raise HTTPException(status_code=503, detail="AI service dependencies not available.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

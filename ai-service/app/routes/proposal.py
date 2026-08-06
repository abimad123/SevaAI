from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.gemini_service import generate_project_proposal
from app.services.rag_service import retrieve_top_chunks

router = APIRouter()

class ProposalRequest(BaseModel):
  project_name: str
  location: str
  budget: str
  target_group: str
  duration: str
  description: Optional[str] = ""
  focus_area: Optional[str] = ""

@router.post("")
async def generate_proposal(request: ProposalRequest):
  try:
    query_text = f"{request.project_name} {request.focus_area} {request.description}"
    retrieved = retrieve_top_chunks(query=query_text, k=5)
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

    details = {
      "project_name": request.project_name,
      "location": request.location,
      "budget": request.budget,
      "target_group": request.target_group,
      "duration": request.duration,
      "description": request.description or "Social welfare initiative",
      "focus_area": request.focus_area or "General welfare"
    }
    
    res = generate_project_proposal(details, context_str if context_str else None)
    res["sources"] = sources
    return res
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

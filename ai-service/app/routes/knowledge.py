from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.rag_service import ingest_document, delete_document_index, rebuild_all_indexes, get_chroma_statistics

router = APIRouter()

class IngestRequest(BaseModel):
  file_path: str
  title: str
  source: str
  category: Optional[str] = "General"
  state: Optional[str] = "All"
  language: Optional[str] = "en"

class DeleteRequest(BaseModel):
  source: str

class RebuildDocItem(BaseModel):
  file_path: str
  title: str
  source: str
  category: Optional[str] = "General"
  state: Optional[str] = "All"
  language: Optional[str] = "en"

class RebuildRequest(BaseModel):
  documents: List[RebuildDocItem]

@router.post("/ingest")
async def ingest_file(req: IngestRequest):
  try:
    chunks = ingest_document(
      file_path=req.file_path,
      title=req.title,
      source=req.source,
      category=req.category,
      state=req.state,
      language=req.language
    )
    return {"success": True, "chunk_count": chunks}
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete")
async def delete_file_index(req: DeleteRequest):
  try:
    delete_document_index(source=req.source)
    return {"success": True, "message": f"Index for source '{req.source}' deleted."}
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

@router.post("/rebuild")
async def rebuild_indices(req: RebuildRequest):
  try:
    docs_list = [d.model_dump() for d in req.documents]
    total_chunks, results = rebuild_all_indexes(docs_list)
    return {"success": True, "total_chunks": total_chunks, "results": results}
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

@router.get("/statistics")
async def get_stats():
  try:
    stats = get_chroma_statistics()
    return stats
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

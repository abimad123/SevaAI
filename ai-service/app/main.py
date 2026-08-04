import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

from app.routes import chat, document, proposal

app = FastAPI(
    title="SevaAI - AI Service",
    description="RAG-powered AI backend for SevaAI NGO-Government Collaboration Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(document.router, prefix="/api/document", tags=["Document"])
app.include_router(proposal.router, prefix="/api/proposal", tags=["Proposal"])


@app.get("/")
async def root():
    return {"message": "SevaAI AI Service is running!", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "ok", "service": "sevaai-ai-service"}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"error": str(exc), "message": "An internal error occurred."})

"""
routers/ai.py
-------------
AI endpoints:
  POST /ai/process-pdf  — Upload PDF → PaddleOCR → Ollama gemma4:12b
  GET  /ai/health       — Ollama + PaddleOCR status check
"""

import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
from ..security import verify_api_key, verify_api_key_or_session
from ..ai.extract_text import extract_text_from_images
from ..ai.convert_pdfs import convert_pdfs_to_jpgs
from ..ai.pyq_analysis.analyze_pyq import (
    analyze_pyq_text,
    analyze_with_gemini,
    analyze_with_ollama,
    chat_with_ai,
    check_gemini_health,
    check_ollama_health,
    pull_ollama_model,
)
from slowapi import Limiter
from slowapi.util import get_remote_address

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

limiter = Limiter(key_func=get_remote_address)
router  = APIRouter(prefix="/ai", tags=["ai"])

AI_DIR        = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ai")
RESOURCES_DIR = os.path.join(AI_DIR, "resources")


# ---------------------------------------------------------------------------
# GET /ai/health
# ---------------------------------------------------------------------------

@router.get("/health")
def ai_health_check():
    """
    Reports the status of:
    - PaddleOCR subprocess venv
    - Cloud Gemini API
    - Local Ollama connectivity and gemma4:12b availability
    """
    ai_venv_py = os.path.join(AI_DIR, "ai_venv", "bin", "python")
    paddle_ready = os.path.exists(ai_venv_py)

    gemini = check_gemini_health()
    ollama = check_ollama_health()

    return {
        "paddle_ocr": {
            "available":  paddle_ready,
            "venv_path":  ai_venv_py,
            "note":       "Runs in dedicated Python 3.12 subprocess (Apple ANE via Accelerate)",
        },
        "gemini": gemini,
        "ollama": ollama,
        "active_primary": "Gemini API" if gemini["available"] else "Gemma (Ollama)",
        "ready": paddle_ready and (gemini["available"] or ollama["model_available"]),
    }


# ---------------------------------------------------------------------------
# POST /ai/process-pdf
# ---------------------------------------------------------------------------

@router.post("/process-pdf")
@limiter.limit("5/minute")
def process_pdf_securely(
    request:  Request,
    file:     UploadFile = File(...),
    auth:     str        = Depends(verify_api_key_or_session),
):
    """
    Full AI pipeline (protected by Session Auth or API key + rate limiting):
    1. Accept PDF upload
    2. Convert pages → JPG images  (PyMuPDF)
    3. Extract text via PaddleOCR   (Python 3.12 subprocess, Apple ANE)
    4. Analyse with Gemini API (gemini-3.6-flash) first, fallback to Gemma (Ollama)
    5. Return { filename, extracted_text, analysis }
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    os.makedirs(RESOURCES_DIR, exist_ok=True)

    # Save uploaded file
    pdf_path = os.path.join(RESOURCES_DIR, file.filename)
    try:
        with open(pdf_path, "wb") as buf:
            shutil.copyfileobj(file.file, buf)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not save file: {exc}")

    try:
        # Step 1 — PDF → JPGs
        convert_pdfs_to_jpgs(RESOURCES_DIR)

        # Step 2 — PaddleOCR → text
        output_txt     = os.path.join(RESOURCES_DIR, "extracted_text.txt")
        extracted_text = extract_text_from_images(RESOURCES_DIR, output_txt)

        if not extracted_text and os.path.exists(output_txt):
            with open(output_txt, "r", encoding="utf-8") as fh:
                extracted_text = fh.read()

        # Step 3 — Gemini API (Primary) -> Gemma Ollama (Fallback) Analysis
        analysis: dict = {}
        if extracted_text.strip():
            analysis = analyze_pyq_text(extracted_text)

        # Step 4 — Activity log
        client_ip = request.client.host if request.client else "unknown"
        from ..database import SessionLocal
        from .. import crud
        db = SessionLocal()
        try:
            crud.log_activity(
                db,
                action="AI_USAGE",
                details=f"PDF processed (PaddleOCR+{analysis.get('provider', 'AI')} {analysis.get('model', '')}): {file.filename}",
                ip_address=client_ip,
            )
        finally:
            db.close()

        return {
            "status":         "success",
            "filename":       file.filename,
            "extracted_text": extracted_text,
            "analysis":       analysis,
        }

    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Processing error: {exc}")


# ---------------------------------------------------------------------------
# POST /ai/chat
# ---------------------------------------------------------------------------

@router.post("/chat")
@limiter.limit("20/minute")
def ai_chatbot_endpoint(
    request: Request,
    payload: ChatRequest,
    auth: str = Depends(verify_api_key_or_session),
):
    """
    Interactive Chatbot endpoint:
    - Protected by Google/Session Auth OR API key
    - Powered by Cloud Gemini API (gemini-3.6-flash) primary
    - Fallback to local Gemma (gemma4:12b via Ollama)
    """
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    history_dicts = [{"role": msg.role, "content": msg.content} for msg in (payload.history or [])]
    result = chat_with_ai(payload.message, history_dicts)

    if "error" in result and not result.get("response"):
        raise HTTPException(status_code=500, detail=result["error"])

    return result

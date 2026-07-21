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
from ..security import verify_api_key
from ..ai.extract_text import extract_text_from_images
from ..ai.convert_pdfs import convert_pdfs_to_jpgs
from ..ai.pyq_analysis.analyze_pyq import (
    analyze_with_ollama,
    check_ollama_health,
    pull_ollama_model,
)
from slowapi import Limiter
from slowapi.util import get_remote_address

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
    - Ollama connectivity and gemma4:12b availability
    """
    ai_venv_py = os.path.join(AI_DIR, "ai_venv", "bin", "python")
    paddle_ready = os.path.exists(ai_venv_py)

    ollama = check_ollama_health()

    return {
        "paddle_ocr": {
            "available":  paddle_ready,
            "venv_path":  ai_venv_py,
            "note":       "Runs in dedicated Python 3.12 subprocess (Apple ANE via Accelerate)",
        },
        "ollama": ollama,
        "ready": paddle_ready and ollama["model_available"],
    }


# ---------------------------------------------------------------------------
# POST /ai/process-pdf
# ---------------------------------------------------------------------------

@router.post("/process-pdf")
@limiter.limit("5/minute")
def process_pdf_securely(
    request:  Request,
    file:     UploadFile = File(...),
    api_key:  str        = Depends(verify_api_key),
):
    """
    Full AI pipeline (protected by API key + rate limiting):
    1. Accept PDF upload
    2. Convert pages → JPG images  (PyMuPDF)
    3. Extract text via PaddleOCR   (Python 3.12 subprocess, Apple ANE)
    4. Analyse with Ollama gemma4:12b and auto-pull if missing
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

        # Step 3 — Ollama gemma4:12b analysis (auto-pulls model if needed)
        analysis: dict = {}
        if extracted_text.strip():
            health = check_ollama_health()
            if health["ollama_running"] and not health["model_available"]:
                pull_ollama_model()
            analysis = analyze_with_ollama(extracted_text)

        # Step 4 — Activity log
        client_ip = request.client.host if request.client else "unknown"
        from ..database import SessionLocal
        from .. import crud
        db = SessionLocal()
        try:
            crud.log_activity(
                db,
                action="AI_USAGE",
                details=f"PDF processed (PaddleOCR+Ollama gemma4:12b): {file.filename}",
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

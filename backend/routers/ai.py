import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Request
from ..security import verify_api_key

# We import the scripts directly to use their functions
from ..ai.convert_pdfs import convert_pdfs_to_jpgs
from ..ai.extract_text import extract_text_from_images

# Setting up SlowAPI rate limiter
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/ai",
    tags=["ai"]
)

# Base directory for AI resources
AI_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ai")
RESOURCES_DIR = os.path.join(AI_DIR, "resources")

@router.post("/process-pdf")
@limiter.limit("5/minute")
def process_pdf_securely(
    request: Request,
    file: UploadFile = File(...), 
    api_key: str = Depends(verify_api_key)
):
    """
    Secure endpoint that converts an uploaded PDF to JPGs and then extracts text using OCR.
    Protected by API Key and Rate Limiting to prevent abuse.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Ensure resources directory exists
    os.makedirs(RESOURCES_DIR, exist_ok=True)
    
    # Save the uploaded file securely
    pdf_path = os.path.join(RESOURCES_DIR, file.filename)
    try:
        with open(pdf_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {e}")

    try:
        # Step 1: Convert PDF to JPGs
        convert_pdfs_to_jpgs(RESOURCES_DIR)
        
        # Step 2: Extract text
        output_txt_path = os.path.join(RESOURCES_DIR, "extracted_text.txt")
        extract_text_from_images(RESOURCES_DIR, output_txt_path)
        
        # Read the extracted text to return
        if os.path.exists(output_txt_path):
            with open(output_txt_path, "r", encoding="utf-8") as f:
                extracted_text = f.read()
            
            # Log the AI usage
            client_ip = request.client.host if request.client else "unknown"
            from ..database import SessionLocal
            from .. import security
            db = SessionLocal()
            try:
                security.log_activity(db, action="AI_USAGE", details=f"Processed PDF: {file.filename}", ip_address=client_ip)
            finally:
                db.close()

            return {"status": "success", "filename": file.filename, "extracted_text": extracted_text}
        else:
            return {"status": "error", "detail": "Text extraction failed."}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {e}")

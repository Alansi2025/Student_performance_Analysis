from fastapi import APIRouter, UploadFile, File, HTTPException, Response
from fastapi.responses import FileResponse, Response
from typing import List, Dict, Any, Optional
import os

from ..storage import gcs_manager, LOCAL_STORAGE_DIR

router = APIRouter(prefix="/storage", tags=["Cloud Storage"])

@router.get("/status")
def get_storage_status() -> Dict[str, Any]:
    """Return Google Cloud Storage connection status and active bucket configuration."""
    return gcs_manager.get_status()

@router.post("/upload")
async def upload_file_to_storage(file: UploadFile = File(...)) -> Dict[str, Any]:
    """Upload a file to Google Cloud Storage (GCS bucket: studentperformance-498100-storage)."""
    try:
        content = await file.read()
        filename = file.filename or "file_upload.bin"
        content_type = file.content_type or "application/octet-stream"

        result = gcs_manager.upload_bytes(content, filename, content_type=content_type)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(exc)}")

@router.get("/files")
def list_storage_files(prefix: str = "") -> List[Dict[str, Any]]:
    """List all stored files in Google Cloud Storage."""
    return gcs_manager.list_files(prefix=prefix)

@router.get("/files/{filename}")
def download_storage_file(filename: str):
    """Retrieve/download file from Cloud Storage."""
    data = gcs_manager.download_bytes(filename)
    if data is not None:
        return Response(content=data, media_type="application/octet-stream")
    
    # Check local fallback
    local_path = os.path.join(LOCAL_STORAGE_DIR, filename)
    if os.path.exists(local_path):
        return FileResponse(local_path)
        
    raise HTTPException(status_code=404, detail="File not found in Cloud Storage")

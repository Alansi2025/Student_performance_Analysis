import os
import io
import time
from typing import Optional, List, Dict, Any
from .config import settings

# Attempt importing google.cloud.storage
try:
    from google.cloud import storage
    from google.auth.exceptions import DefaultCredentialsError
    HAS_GCS_SDK = True
except ImportError:
    HAS_GCS_SDK = False

# Local fallback directory when GCS is operating in local storage mode
LOCAL_STORAGE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "gcs_local_data")
os.makedirs(LOCAL_STORAGE_DIR, exist_ok=True)

class GCSManager:
    """Manages file storage via Google Cloud Storage with fallback for development."""
    def __init__(self):
        self.project_id = settings.gcp_project_id
        self.bucket_name = settings.gcs_bucket_name
        self.client = None
        self.bucket = None
        self.mode = "local" # "gcs" or "local"
        self.error_reason = None
        self._initialize_client()

    def _initialize_client(self):
        if not HAS_GCS_SDK:
            self.mode = "local"
            self.error_reason = "google-cloud-storage SDK not installed"
            print(f"[GCS Storage] Running in Local Storage Mode: {self.error_reason}")
            return

        try:
            # Initialize GCS client
            self.client = storage.Client(project=self.project_id)
            try:
                self.bucket = self.client.get_bucket(self.bucket_name)
            except Exception:
                # Attempt creating bucket if it doesn't exist yet
                try:
                    self.bucket = self.client.create_bucket(self.bucket_name, location="US")
                    print(f"[GCS Storage] Created bucket '{self.bucket_name}' in project '{self.project_id}'")
                except Exception as exc:
                    self.bucket = self.client.bucket(self.bucket_name)
                    print(f"[GCS Storage] Using bucket reference '{self.bucket_name}': {exc}")
            
            self.mode = "gcs"
            print(f"[GCS Storage] Initialized successfully. Project: {self.project_id}, Bucket: {self.bucket_name}")
        except Exception as exc:
            self.mode = "local"
            self.error_reason = str(exc)
            print(f"[GCS Storage] Defaulting to Local Fallback: {exc}")

    def upload_bytes(self, data: bytes, destination_blob_name: str, content_type: str = "application/octet-stream") -> Dict[str, Any]:
        """Upload raw bytes to GCS or local fallback."""
        clean_blob_name = destination_blob_name.lstrip("/")
        
        if self.mode == "gcs" and self.bucket:
            try:
                blob = self.bucket.blob(clean_blob_name)
                blob.upload_from_string(data, content_type=content_type)
                
                # Generated GCS public & media URLs
                gcs_url = f"https://storage.googleapis.com/{self.bucket_name}/{clean_blob_name}"
                return {
                    "status": "success",
                    "storage_mode": "gcs",
                    "bucket": self.bucket_name,
                    "blob_name": clean_blob_name,
                    "size_bytes": len(data),
                    "content_type": content_type,
                    "url": gcs_url,
                    "gcs_uri": f"gs://{self.bucket_name}/{clean_blob_name}"
                }
            except Exception as exc:
                print(f"[GCS Storage] GCS Upload failed ({exc}). Falling back to local storage...")

        # Local storage fallback
        local_path = os.path.join(LOCAL_STORAGE_DIR, clean_blob_name.replace("/", "_"))
        with open(local_path, "wb") as f:
            f.write(data)

        local_url = f"http://localhost:8000/storage/files/{os.path.basename(local_path)}"
        return {
            "status": "success",
            "storage_mode": "local_fallback",
            "bucket": self.bucket_name,
            "blob_name": clean_blob_name,
            "size_bytes": len(data),
            "content_type": content_type,
            "url": local_url,
            "gcs_uri": f"gs://{self.bucket_name}/{clean_blob_name}"
        }

    def download_bytes(self, blob_name: str) -> Optional[bytes]:
        """Download file bytes from GCS or local fallback."""
        clean_blob_name = blob_name.lstrip("/")

        if self.mode == "gcs" and self.bucket:
            try:
                blob = self.bucket.blob(clean_blob_name)
                return blob.download_as_bytes()
            except Exception as exc:
                print(f"[GCS Storage] GCS Download failed ({exc}). Trying local fallback...")

        local_path = os.path.join(LOCAL_STORAGE_DIR, clean_blob_name.replace("/", "_"))
        if os.path.exists(local_path):
            with open(local_path, "rb") as f:
                return f.read()
        return None

    def list_files(self, prefix: str = "") -> List[Dict[str, Any]]:
        """List stored files in bucket or local storage."""
        results = []
        if self.mode == "gcs" and self.bucket:
            try:
                blobs = self.client.list_blobs(self.bucket_name, prefix=prefix)
                for b in blobs:
                    results.append({
                        "name": b.name,
                        "size_bytes": b.size,
                        "updated": b.updated.isoformat() if b.updated else None,
                        "url": f"https://storage.googleapis.com/{self.bucket_name}/{b.name}"
                    })
                return results
            except Exception as exc:
                print(f"[GCS Storage] GCS List failed: {exc}")

        # Local list
        for fname in os.listdir(LOCAL_STORAGE_DIR):
            if prefix and not fname.startswith(prefix):
                continue
            fpath = os.path.join(LOCAL_STORAGE_DIR, fname)
            if os.path.isfile(fpath):
                results.append({
                    "name": fname,
                    "size_bytes": os.path.getsize(fpath),
                    "updated": time.ctime(os.path.getmtime(fpath)),
                    "url": f"http://localhost:8000/storage/files/{fname}"
                })
        return results

    def get_status(self) -> Dict[str, Any]:
        """Return GCS connection status and active storage mode."""
        return {
            "mode": self.mode,
            "project_id": self.project_id,
            "bucket_name": self.bucket_name,
            "gcs_sdk_available": HAS_GCS_SDK,
            "error_reason": self.error_reason
        }

gcs_manager = GCSManager()

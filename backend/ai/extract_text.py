"""
extract_text.py
---------------
PaddleOCR-based text extraction.

Runs PaddleOCR in the dedicated Python 3.12 ai_venv via subprocess so that
the main FastAPI application (Python 3.14) is never blocked on paddle import.

On Apple Silicon the ONNX / Paddle runtime automatically leverages the
Neural Engine (ANE) through Apple's Accelerate framework — no explicit
GPU flag needed, no CUDA code.
"""

import os
import re
import sys
import json
import subprocess
import tempfile


# Path to the dedicated PaddleOCR Python 3.12 venv
_AI_DIR       = os.path.dirname(os.path.abspath(__file__))
_AI_VENV_PY   = os.path.join(_AI_DIR, "ai_venv", "bin", "python")

# Fallback to system python3.12 if the venv hasn't been set up yet
if not os.path.exists(_AI_VENV_PY):
    _AI_VENV_PY = "python3.12"


def _natural_sort_key(s: str) -> list:
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]


# ---------------------------------------------------------------------------
# Inline OCR worker (runs INSIDE the subprocess under Python 3.12)
# ---------------------------------------------------------------------------
_OCR_WORKER = """
import sys, os, json

paddle_home  = sys.argv[1]
images_dir   = sys.argv[2]
output_txt   = sys.argv[3]

# Tell PaddlePaddle to store its models in the configured cache dir
os.environ["PADDLE_HOME"]    = paddle_home
os.environ["PADDLEOCR_HOME"] = paddle_home

from paddleocr import PaddleOCR
import re

def natural_sort_key(s):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\\d+)", s)]

# use_angle_cls=True corrects rotated/skewed text
# Apple ANE / Neural Engine is used automatically via Paddle's Accelerate backend
ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)

jpg_files = sorted(
    [f for f in os.listdir(images_dir) if f.lower().endswith(".jpg")],
    key=natural_sort_key
)

parts = []
for fname in jpg_files:
    img_path = os.path.join(images_dir, fname)
    result = ocr.ocr(img_path, cls=True)
    lines = []
    if result and result[0]:
        for line in result[0]:
            lines.append(line[1][0])
    page_text = "\\n".join(lines)
    parts.append(f"--- Text from {fname} ---\\n\\n{page_text}\\n\\n")

full_text = "".join(parts)
with open(output_txt, "w", encoding="utf-8") as fh:
    fh.write(full_text)

# Return line count so the parent process can confirm success
print(json.dumps({"lines": len(full_text.splitlines()), "pages": len(jpg_files)}))
"""


def extract_text_from_images(resources_folder: str, output_txt_path: str) -> str:
    """
    Run PaddleOCR (in the ai_venv subprocess) on every JPG in *resources_folder*.
    Writes concatenated text to *output_txt_path* and returns it as a string.
    """
    if not os.path.exists(resources_folder):
        print(f"[PaddleOCR] Folder '{resources_folder}' does not exist.")
        return ""

    jpg_files = [f for f in os.listdir(resources_folder) if f.lower().endswith(".jpg")]
    if not jpg_files:
        print(f"[PaddleOCR] No JPG files found in '{resources_folder}'.")
        return ""

    print(f"[PaddleOCR] Found {len(jpg_files)} image(s). Starting extraction via ai_venv…")

    # Resolve PADDLE_HOME from config (supports .env override)
    try:
        from backend.config import settings
        paddle_home = settings.paddle_home
    except Exception:
        paddle_home = os.path.join(os.path.expanduser("~"), ".paddleocr")

    os.makedirs(paddle_home, exist_ok=True)

    # Write the inline worker to a temp file and execute it
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as tmp:
        tmp.write(_OCR_WORKER)
        tmp_path = tmp.name

    try:
        result = subprocess.run(
            [_AI_VENV_PY, tmp_path, paddle_home, resources_folder, output_txt_path],
            capture_output=True,
            text=True,
            timeout=300,   # 5-minute cap per batch
        )
        if result.returncode != 0:
            print(f"[PaddleOCR] ✗ Worker exited with code {result.returncode}")
            print(result.stderr[-2000:])   # last 2k of stderr
        else:
            try:
                info = json.loads(result.stdout.strip().splitlines()[-1])
                print(f"[PaddleOCR] ✓ Extracted {info['lines']} lines from {info['pages']} page(s)")
            except Exception:
                pass
    finally:
        os.unlink(tmp_path)

    if os.path.exists(output_txt_path):
        with open(output_txt_path, "r", encoding="utf-8") as fh:
            return fh.read()
    return ""


if __name__ == "__main__":
    target_dir  = os.path.join(_AI_DIR, "resources")
    output_file = os.path.join(target_dir, "extracted_text.txt")
    text = extract_text_from_images(target_dir, output_file)
    print(f"Done — {len(text)} characters extracted.")

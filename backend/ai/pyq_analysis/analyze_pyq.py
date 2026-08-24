"""
analyze_pyq.py
--------------
PYQ analysis pipeline.

OCR:  PaddleOCR via ai_venv (Python 3.12) subprocess
LLM:  Local Ollama  gemma4:12b  — real structured JSON analysis
"""

import os
import glob
import json
import httpx
import subprocess
import tempfile
import fitz          # PyMuPDF — PDF → image conversion only

_AI_DIR     = os.path.dirname(os.path.abspath(__file__))
_AI_VENV_PY = os.path.join(os.path.dirname(_AI_DIR), "ai_venv", "bin", "python")
if not os.path.exists(_AI_VENV_PY):
    _AI_VENV_PY = "python3.12"

# ---------------------------------------------------------------------------
# Read settings (supports .env override)
# ---------------------------------------------------------------------------
try:
    import sys
    sys.path.insert(0, os.path.join(os.path.dirname(_AI_DIR), ".."))
    from backend.config import settings
    OLLAMA_BASE_URL = settings.ollama_base_url
    OLLAMA_MODEL    = settings.ollama_model
    PADDLE_HOME     = settings.paddle_home
    GEMINI_API_KEY  = settings.gemini_api_key
    GEMINI_MODEL    = settings.gemini_model
except Exception:
    OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL    = os.environ.get("OLLAMA_MODEL",    "gemma4:12b")
    PADDLE_HOME     = os.environ.get("PADDLE_HOME",     os.path.join(os.path.expanduser("~"), ".paddleocr"))
    GEMINI_API_KEY  = os.environ.get("GEMINI_API_KEY",  "")
    GEMINI_MODEL    = os.environ.get("GEMINI_MODEL",    "gemini-3.6-flash")


# ---------------------------------------------------------------------------
# PDF → JPG (PyMuPDF, no changes needed)
# ---------------------------------------------------------------------------

def convert_pdf_to_jpg(pdf_path: str, output_dir: str) -> list[str]:
    """Convert every page of a PDF to 200-DPI JPG images."""
    try:
        doc = fitz.open(pdf_path)
        base = os.path.basename(pdf_path).rsplit(".", 1)[0]
        os.makedirs(output_dir, exist_ok=True)
        saved: list[str] = []
        for i, page in enumerate(doc):
            pix      = page.get_pixmap(dpi=200)
            img_path = os.path.join(output_dir, f"{base}_page_{i + 1}.jpg")
            pix.save(img_path)
            saved.append(img_path)
        return saved
    except Exception as exc:
        print(f"[PDF→JPG] Error: {exc}")
        return []


# ---------------------------------------------------------------------------
# Inline PaddleOCR worker (runs in Python 3.12 ai_venv subprocess)
# ---------------------------------------------------------------------------
_PADDLE_OCR_WORKER = """
import sys, os, json
paddle_home = sys.argv[1]
image_path  = sys.argv[2]

os.environ["PADDLE_HOME"]    = paddle_home
os.environ["PADDLEOCR_HOME"] = paddle_home

from paddleocr import PaddleOCR
ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)
result = ocr.ocr(image_path, cls=True)
lines = []
if result and result[0]:
    for line in result[0]:
        lines.append(line[1][0])
print("\\n".join(lines))
"""


def extract_text_with_paddle(image_path: str) -> str:
    """Run PaddleOCR on a single image via the ai_venv subprocess."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as tmp:
        tmp.write(_PADDLE_OCR_WORKER)
        tmp_path = tmp.name
    try:
        r = subprocess.run(
            [_AI_VENV_PY, tmp_path, PADDLE_HOME, image_path],
            capture_output=True, text=True, timeout=120
        )
        return r.stdout.strip() if r.returncode == 0 else ""
    except Exception as exc:
        print(f"[PaddleOCR] Error on {image_path}: {exc}")
        return ""
    finally:
        os.unlink(tmp_path)


# ---------------------------------------------------------------------------
# Gemini API & Ollama (Gemma) health checks & analysis
# ---------------------------------------------------------------------------

def check_gemini_health() -> dict:
    """Check if Gemini API is configured and ready."""
    is_configured = bool(GEMINI_API_KEY and GEMINI_API_KEY.strip())
    return {
        "configured": is_configured,
        "model":      GEMINI_MODEL,
        "available":  is_configured,
    }


def check_ollama_health() -> dict:
    """Check if Ollama is running and gemma4:12b is available."""
    try:
        resp = httpx.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5.0)
        resp.raise_for_status()
        models = [m["name"] for m in resp.json().get("models", [])]
        model_ready = any(OLLAMA_MODEL in m for m in models)
        return {
            "ollama_running":  True,
            "model_available": model_ready,
            "model":           OLLAMA_MODEL,
            "pulled_models":   models,
        }
    except Exception:
        return {
            "ollama_running":  False,
            "model_available": False,
            "model":           OLLAMA_MODEL,
            "pulled_models":   [],
        }


def pull_ollama_model(model: str = OLLAMA_MODEL) -> bool:
    """Auto-pull the model from Ollama if missing."""
    print(f"[Ollama] Pulling model {model}...")
    try:
        with httpx.stream(
            "POST",
            f"{OLLAMA_BASE_URL}/api/pull",
            json={"name": model},
            timeout=600.0,
        ) as resp:
            for line in resp.iter_lines():
                pass
        return True
    except Exception as exc:
        print(f"[Ollama] Pull failed: {exc}")
        return False


ANALYSIS_PROMPT = """You are an academic question analyst. Analyse the following extracted exam-paper text and return a JSON object with exactly these keys:

- "subject": primary subject (e.g. "Physics", "Mathematics")
- "topics": list of up to 5 specific topics covered
- "difficulty": one of "Easy", "Medium", "Hard"
- "question_count": estimated number of distinct questions
- "summary": one-sentence description of the paper

Return ONLY valid JSON, nothing else.

Text:
\"\"\"
{text}
\"\"\"
"""


def analyze_with_gemini(text: str) -> dict:
    """Send text to Cloud Gemini API (gemini-3.6-flash) for structured JSON analysis."""
    if not GEMINI_API_KEY or not GEMINI_API_KEY.strip():
        return {"error": "No Gemini API key configured"}

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    prompt = ANALYSIS_PROMPT.format(text=text[:4000])

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }

    try:
        resp = httpx.post(url, json=payload, timeout=30.0)
        resp.raise_for_status()
        data = resp.json()
        raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
        if "```" in raw_text:
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
        raw_text = raw_text.strip()
        result = json.loads(raw_text)
        result["provider"] = "gemini"
        result["model"] = GEMINI_MODEL
        return result
    except Exception as exc:
        print(f"[Gemini API] Failed: {exc}")
        return {"error": str(exc)}


def analyze_with_ollama(text: str) -> dict:
    """Send text to local Ollama gemma4:12b for structured JSON analysis."""
    health = check_ollama_health()
    if not health["ollama_running"]:
        return {"error": f"Ollama not reachable at {OLLAMA_BASE_URL}"}
    if not health["model_available"]:
        print(f"[Ollama] {OLLAMA_MODEL} not found — auto-pulling…")
        pull_ollama_model(OLLAMA_MODEL)

    try:
        resp = httpx.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model":  OLLAMA_MODEL,
                "prompt": ANALYSIS_PROMPT.format(text=text[:4000]),
                "stream": False,
                "format": "json",
            },
            timeout=120.0,
        )
        resp.raise_for_status()
        raw = resp.json().get("response", "{}")
        res = json.loads(raw)
        res["provider"] = "gemma"
        res["model"] = OLLAMA_MODEL
        return res
    except httpx.ConnectError:
        return {"error": "Ollama not reachable", "model": OLLAMA_MODEL}
    except (json.JSONDecodeError, KeyError) as exc:
        return {"error": f"Invalid response from model: {exc}"}
    except Exception as exc:
        return {"error": str(exc)}


def analyze_pyq_text(text: str) -> dict:
    """
    Primary LLM entry point:
    1. Try Gemini API first (if GEMINI_API_KEY is configured).
    2. Fall back to Gemma (Ollama) if Gemini fails or is missing.
    """
    if GEMINI_API_KEY and GEMINI_API_KEY.strip():
        print(f"[AI Engine] Analyzing via Gemini API ({GEMINI_MODEL})...")
        res = analyze_with_gemini(text)
        if "error" not in res:
            return res
        print(f"[AI Engine] Gemini API error ({res.get('error')}), falling back to Gemma (Ollama)...")

    print(f"[AI Engine] Analyzing via Gemma (Ollama)...")
    res = analyze_with_ollama(text)
    if "error" not in res:
        res["provider"] = "gemma"
        res["model"] = OLLAMA_MODEL
    return res


# ---------------------------------------------------------------------------
# Interactive Chatbot Functions (Gemini API + Gemma Fallback)
# ---------------------------------------------------------------------------

def chat_with_gemini(prompt: str, history: list = None) -> dict:
    """Send interactive chat message to Cloud Gemini API (gemini-3.6-flash)."""
    if not GEMINI_API_KEY or not GEMINI_API_KEY.strip():
        return {"error": "No Gemini API key configured"}

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    
    contents = []
    if history:
        for msg in history[-10:]:
            role = "user" if msg.get("role") in ["user", "human"] else "model"
            contents.append({"role": role, "parts": [{"text": msg.get("content", "")}]})
    
    contents.append({"role": "user", "parts": [{"text": prompt}]})

    payload = {
        "contents": contents,
        "systemInstruction": {
            "parts": [{"text": "You are AetherLearn AI, an expert, encouraging academic tutor. Provide clear, structured, and helpful responses to student questions."}]
        }
    }

    try:
        resp = httpx.post(url, json=payload, timeout=30.0)
        resp.raise_for_status()
        data = resp.json()
        raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
        return {
            "response": raw_text.strip(),
            "provider": "gemini",
            "model": GEMINI_MODEL
        }
    except Exception as exc:
        print(f"[Gemini Chat] Error: {exc}")
        return {"error": str(exc)}


def chat_with_ollama(prompt: str, history: list = None) -> dict:
    """Send interactive chat message to local Ollama gemma4:12b."""
    health = check_ollama_health()
    if not health["ollama_running"]:
        return {"error": f"Ollama not reachable at {OLLAMA_BASE_URL}"}

    try:
        resp = httpx.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": f"System: You are AetherLearn AI academic tutor.\nUser: {prompt}\nAssistant:",
                "stream": False,
            },
            timeout=120.0,
        )
        resp.raise_for_status()
        raw = resp.json().get("response", "")
        return {
            "response": raw.strip(),
            "provider": "gemma",
            "model": OLLAMA_MODEL
        }
    except Exception as exc:
        return {"error": str(exc)}


def chat_with_ai(prompt: str, history: list = None) -> dict:
    """Primary chat handler: Gemini API first, Gemma Ollama fallback."""
    if GEMINI_API_KEY and GEMINI_API_KEY.strip():
        res = chat_with_gemini(prompt, history)
        if "error" not in res:
            return res
        print(f"[AI Chat] Gemini failed ({res.get('error')}) — falling back to Gemma...")
    
    res = chat_with_ollama(prompt, history)
    return res


# ---------------------------------------------------------------------------
# Pipeline: load and analyse all files in resources directory
# ---------------------------------------------------------------------------

def load_data(resources_dir: str) -> tuple[list[str], list[str], list[dict]]:
    texts:    list[str]  = []
    labels:   list[str]  = []
    analyses: list[dict] = []

    for file_path in glob.glob(os.path.join(resources_dir, "*.txt")):
        basename = os.path.basename(file_path)
        subject  = basename.split("_")[0] if "_" in basename else "unknown"
        with open(file_path, "r", encoding="utf-8") as fh:
            content = fh.read()
        for q in [ln.strip() for ln in content.split("\n") if ln.strip()]:
            texts.append(q)
            labels.append(subject)
        if content.strip():
            analyses.append({"file": basename, **analyze_with_ollama(content)})

    for file_path in glob.glob(os.path.join(resources_dir, "*.pdf")):
        basename  = os.path.basename(file_path)
        subject   = basename.split("_")[0] if "_" in basename else "unknown"
        images_dir = os.path.join(resources_dir, "images")
        jpg_paths  = convert_pdf_to_jpg(file_path, images_dir)
        page_texts: list[str] = []
        for img_path in jpg_paths:
            pt = extract_text_with_paddle(img_path)
            page_texts.append(pt)
            for q in [ln.strip() for ln in pt.split("\n") if len(ln.strip()) > 10]:
                texts.append(q)
                labels.append(subject)
        doc_text = "\n".join(page_texts)
        if doc_text.strip():
            analyses.append({"file": basename, **analyze_with_ollama(doc_text)})

    return texts, labels, analyses


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    current_dir   = os.path.dirname(os.path.abspath(__file__))
    resources_dir = os.path.join(current_dir, "..", "resources")

    health = check_ollama_health()
    print(f"[Health] Ollama running:    {health['ollama_running']}")
    print(f"[Health] {OLLAMA_MODEL} ready: {health['model_available']}")
    if not health["model_available"] and health["ollama_running"]:
        pull_ollama_model()

    texts, labels, analyses = load_data(resources_dir)
    if analyses:
        print("\n=== Ollama Analysis Results ===")
        for a in analyses:
            print(json.dumps(a, indent=2))
    else:
        print("No files found. Add .txt or .pdf files to the resources folder.")

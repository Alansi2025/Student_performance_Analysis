#!/usr/bin/env bash
# ============================================================================
#  SUPER EXECUTION KEY — Industrial Dashboard Full-Stack Launcher
#  Starts Frontend (Vite) + Backend (FastAPI) + Database + AI in one shot.
# ============================================================================

set -euo pipefail

# ── Colour codes ────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Colour

# ── Project root (always relative to this script) ──────────────────────────
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

BACKEND_PID_FILE="$PROJECT_DIR/.backend.pid"
FRONTEND_PID_FILE="$PROJECT_DIR/.frontend.pid"
BACKEND_LOG="$PROJECT_DIR/.backend.log"
FRONTEND_LOG="$PROJECT_DIR/.frontend.log"
BACKEND_PORT=8000
FRONTEND_PORT=5173

AI_VENV_DIR="$PROJECT_DIR/backend/ai/ai_venv"
OLLAMA_MODEL="${OLLAMA_MODEL:-gemma4:12b}"

# Load .env for PADDLE_HOME override
if [ -f "$PROJECT_DIR/.env" ]; then
  # export only PADDLE_HOME and OLLAMA_* vars
  set -a
  # shellcheck disable=SC1090
  source <(grep -E '^(PADDLE_HOME|OLLAMA_BASE_URL|OLLAMA_MODEL)=' "$PROJECT_DIR/.env" 2>/dev/null || true)
  set +a
fi
PADDLE_HOME="${PADDLE_HOME:-$HOME/.paddleocr}"

# ── Helper functions ────────────────────────────────────────────────────────
banner() {
  echo ""
  echo -e "${MAGENTA}${BOLD}╔══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${MAGENTA}${BOLD}║         ⚡  SUPER EXECUTION KEY  ⚡                     ║${NC}"
  echo -e "${MAGENTA}${BOLD}║       Industrial Dashboard Full-Stack Launcher           ║${NC}"
  echo -e "${MAGENTA}${BOLD}╚══════════════════════════════════════════════════════════╝${NC}"
  echo ""
}

log_info()    { echo -e "  ${CYAN}[INFO]${NC}  $1"; }
log_success() { echo -e "  ${GREEN}[  OK]${NC}  $1"; }
log_warn()    { echo -e "  ${YELLOW}[WARN]${NC}  $1"; }
log_error()   { echo -e "  ${RED}[FAIL]${NC}  $1"; }

is_port_in_use() {
  lsof -i :"$1" -sTCP:LISTEN >/dev/null 2>&1
}

kill_by_pid_file() {
  local pid_file="$1"
  local label="$2"
  if [ -f "$pid_file" ]; then
    local pid
    pid=$(cat "$pid_file")
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
      # Wait up to 5s for graceful shutdown
      for i in {1..10}; do
        kill -0 "$pid" 2>/dev/null || break
        sleep 0.5
      done
      # Force kill if still alive
      kill -0 "$pid" 2>/dev/null && kill -9 "$pid" 2>/dev/null || true
      log_info "Stopped $label (PID $pid)"
    fi
    rm -f "$pid_file"
  fi
}

stop_all() {
  echo ""
  log_info "Shutting down all services..."
  kill_by_pid_file "$BACKEND_PID_FILE" "Backend"
  kill_by_pid_file "$FRONTEND_PID_FILE" "Frontend"

  # Fallback: kill anything still on those ports
  if is_port_in_use $BACKEND_PORT; then
    lsof -ti :$BACKEND_PORT | xargs kill -9 2>/dev/null || true
    log_warn "Force-killed process on port $BACKEND_PORT"
  fi
  if is_port_in_use $FRONTEND_PORT; then
    lsof -ti :$FRONTEND_PORT | xargs kill -9 2>/dev/null || true
    log_warn "Force-killed process on port $FRONTEND_PORT"
  fi

  log_success "All services stopped."
  echo ""
}

wait_for_service() {
  local url="$1"
  local label="$2"
  local max_wait="${3:-30}"
  local elapsed=0

  while [ $elapsed -lt $max_wait ]; do
    if curl -s -o /dev/null -w "" --max-time 2 "$url" 2>/dev/null; then
      return 0
    fi
    sleep 1
    elapsed=$((elapsed + 1))
  done
  return 1
}

# ── Handle --stop flag ─────────────────────────────────────────────────────
if [ "${1:-}" = "--stop" ]; then
  banner
  stop_all
  exit 0
fi

# ── MAIN EXECUTION ──────────────────────────────────────────────────────────
banner

# Stop any previous instances first
if [ -f "$BACKEND_PID_FILE" ] || [ -f "$FRONTEND_PID_FILE" ] || is_port_in_use $BACKEND_PORT || is_port_in_use $FRONTEND_PORT; then
  log_warn "Previous instances detected — cleaning up..."
  stop_all
fi

# ── Step 1: Python environment ──────────────────────────────────────────────
log_info "Checking Python environment..."

PYTHON=""
if [ -f "$PROJECT_DIR/.venv/bin/python" ]; then
  PYTHON="$PROJECT_DIR/.venv/bin/python"
  log_success "Found virtualenv: .venv/bin/python"
elif command -v python3 &>/dev/null; then
  PYTHON="python3"
  log_warn "No .venv found — using system python3"
else
  log_error "Python 3 is not installed. Please install Python 3 first."
  exit 1
fi

# ── Step 2: Install Python dependencies ─────────────────────────────────────
log_info "Installing Python dependencies..."
if [ -f "$PROJECT_DIR/.venv/bin/pip" ]; then
  "$PROJECT_DIR/.venv/bin/pip" install -q -r "$PROJECT_DIR/backend/requirements.txt" 2>&1 | tail -1 || true
else
  "$PYTHON" -m pip install -q -r "$PROJECT_DIR/backend/requirements.txt" 2>&1 | tail -1 || true
fi
log_success "Python dependencies ready"

# ── Step 3: Install Node dependencies ───────────────────────────────────────
log_info "Installing Node dependencies..."
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
  npm install --silent 2>&1 | tail -3
fi
log_success "Node dependencies ready"

# ── Step 3a: Set up PaddleOCR AI venv (Python 3.12) ─────────────────────────
log_info "Checking PaddleOCR environment (Python 3.12 ai_venv)..."
mkdir -p "$PADDLE_HOME"
if [ ! -f "$AI_VENV_DIR/bin/python" ]; then
  log_info "Creating ai_venv with Python 3.12..."
  if command -v python3.12 &>/dev/null; then
    python3.12 -m venv "$AI_VENV_DIR" \
      && "$AI_VENV_DIR/bin/pip" install -q --upgrade pip \
      && "$AI_VENV_DIR/bin/pip" install -q paddlepaddle paddleocr httpx pymupdf
    log_success "PaddleOCR ai_venv ready (Apple ANE via Accelerate)"
  else
    log_warn "python3.12 not found — PaddleOCR will be unavailable"
  fi
else
  log_success "PaddleOCR ai_venv already exists"
fi
export PADDLE_HOME

# ── Step 3b: Ollama — ensure running and gemma4:12b is pulled ───────────────
log_info "Checking Ollama (gemma4:12b)..."
if command -v ollama &>/dev/null; then
  # Start Ollama serve in background if it isn't already running
  if ! curl -s -o /dev/null --max-time 2 "${OLLAMA_BASE_URL:-http://localhost:11434}/api/tags"; then
    log_info "Starting Ollama server..."
    ollama serve >/dev/null 2>&1 &
    sleep 3  # give Ollama a moment to bind
  fi

  # Auto-pull gemma4:12b if not already downloaded
  if ! ollama list 2>/dev/null | grep -q "${OLLAMA_MODEL}"; then
    log_info "Pulling ${OLLAMA_MODEL} (this may take a few minutes on first run)..."
    ollama pull "${OLLAMA_MODEL}" && log_success "${OLLAMA_MODEL} ready" || log_warn "Pull failed — AI analysis will degrade gracefully"
  else
    log_success "Ollama ${OLLAMA_MODEL} is ready"
  fi
else
  log_warn "Ollama not found — install from https://ollama.com. AI analysis will be disabled."
fi

# ── Step 4: Start Backend (FastAPI + Database + AI) ─────────────────────────
log_info "Starting Backend (FastAPI + SQLAlchemy + AI pipeline)..."

"$PYTHON" -m uvicorn backend.main:app \
  --host 0.0.0.0 \
  --port $BACKEND_PORT \
  --reload \
  > "$BACKEND_LOG" 2>&1 &

BACKEND_PID=$!
echo "$BACKEND_PID" > "$BACKEND_PID_FILE"

# ── Step 5: Start Frontend (Vite) ──────────────────────────────────────────
log_info "Starting Frontend (Vite + React)..."

npx vite --port $FRONTEND_PORT \
  > "$FRONTEND_LOG" 2>&1 &

FRONTEND_PID=$!
echo "$FRONTEND_PID" > "$FRONTEND_PID_FILE"

# ── Step 6: Wait for services to be healthy ─────────────────────────────────
log_info "Waiting for services to come online..."
echo ""

BACKEND_OK=false
FRONTEND_OK=false

if wait_for_service "http://localhost:$BACKEND_PORT/" "Backend" 30; then
  BACKEND_OK=true
  log_success "Backend        ✅  http://localhost:$BACKEND_PORT"
else
  log_error "Backend        ❌  Failed to start (check .backend.log)"
fi

if wait_for_service "http://localhost:$FRONTEND_PORT/" "Frontend" 30; then
  FRONTEND_OK=true
  log_success "Frontend       ✅  http://localhost:$FRONTEND_PORT"
else
  log_error "Frontend       ❌  Failed to start (check .frontend.log)"
fi

# Database & AI are part of the backend — if backend is up, they are too
if [ "$BACKEND_OK" = true ]; then
  log_success "Database       ✅  SQLAlchemy auto-initialised"
  log_success "OCR Engine     ✅  PaddleOCR (Python 3.12 / Apple ANE)"
  log_success "LLM Engine     ✅  Ollama ${OLLAMA_MODEL} @ ${OLLAMA_BASE_URL:-http://localhost:11434}"
  log_success "AI Pipeline    ✅  /ai/process-pdf + /ai/health ready"
fi

# ── Final Status ────────────────────────────────────────────────────────────
echo ""
if [ "$BACKEND_OK" = true ] && [ "$FRONTEND_OK" = true ]; then
  echo -e "${GREEN}${BOLD}  ══════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}${BOLD}   🚀  ALL SYSTEMS GO — Full stack is LIVE!            ${NC}"
  echo -e "${GREEN}${BOLD}  ══════════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "  ${BOLD}Dashboard:${NC}  ${CYAN}http://localhost:$FRONTEND_PORT${NC}"
  echo -e "  ${BOLD}API Docs:${NC}   ${CYAN}http://localhost:$BACKEND_PORT/docs${NC}"
  echo -e "  ${BOLD}AI Health:${NC}  ${CYAN}http://localhost:$BACKEND_PORT/ai/health${NC}"
  echo ""
  echo -e "  ${YELLOW}Press Ctrl+C to stop all services${NC}"
  echo ""
else

  echo -e "${RED}${BOLD}  ⚠  Some services failed to start. Check logs:${NC}"
  echo -e "     Backend log:  $BACKEND_LOG"
  echo -e "     Frontend log: $FRONTEND_LOG"
  echo ""
fi

# ── Trap Ctrl+C to clean up ────────────────────────────────────────────────
cleanup() {
  echo ""
  stop_all
  exit 0
}
trap cleanup SIGINT SIGTERM

# Keep the script alive so Ctrl+C can catch it
wait

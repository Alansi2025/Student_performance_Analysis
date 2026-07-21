# AetherLearn — AI-Powered Student Performance Analysis System

> A full-stack, role-based intelligent learning platform combining a React frontend with a FastAPI backend. AetherLearn delivers personalized AI-assisted education, real-time performance analytics, live mentorship sessions, and deep institutional integration capabilities.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Pages & Components](#pages--components)
- [Backend API](#backend-api)
- [Database Models](#database-models)
- [Security Architecture](#security-architecture)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Default Accounts](#default-accounts)
- [Scripts](#scripts)

---

## Overview

AetherLearn is a **Student Performance Analysis System** built as an industrial-grade, production-ready web application. It features:

- A public-facing **marketing landing page** showcasing the platform's capabilities
- A **secure authentication system** with session-based login
- **Three distinct role-based dashboards** — Student, Mentor, and Overseer
- An **AI processing pipeline** for PDF document analysis via OCR
- A **third-party integrations panel** for LMS, SSO, and Data Lake connectors
- A **floating AI Panel** accessible from all dashboards

The system is named **AetherLearn** internally and positions itself as an AI Learning Platform that uses deep analytics to personalize curriculum delivery, predict learning gaps, and accelerate student progress.

---

## Key Features

### Student Dashboard
- **Performance Analytics** — Visual widgets for retention rate, cognitive load, course progress, and weekly study streaks
- **My Courses** — Active, completed, and upcoming courses with filtering by semester
- **Course Explorer** — Deep-dive into individual course modules with sequential lesson navigation
- **AI Tutor Chat** — Conversational AI tutor interface with multiple AI persona options (Priya Sharma, Vikram Singh, Ananya Desai, etc.)
- **Assignments Panel** — View, filter, and manage academic assignments by status
- **Quizzes & Practice Generator** — Configure and generate AI-powered practice sessions with parameters:
  - Practice type (AI Quiz, Flashcards, Code Challenge)
  - Session mode (Timed Quiz, Adaptive, Marathon)
  - Difficulty level (Beginner, Intermediate, Advanced)
  - Question count
- **Past Year Question Vault** — Generate historical exam practice sets by subject, year range, exam type, and topic focus with real-time progress tracking
- **Communication Hub (Telegram Integration)** — Direct deep-links to class Telegram groups and 1-on-1 Mentor chats.
- **PowerBI-style Learning Insights** — Advanced visualizations for subject-wise focus, peer benchmarking, and performance radar.
- **Settings** — Profile editing with custom avatars, notification preferences, adaptive voice toggle, dark/light mode, and direct contact to overseers.

### Mentor Dashboard
- Overview of assigned students and their progress
- Integration status visibility (LMS sync, SSO, Data Lake)
- Access to activity logs and student performance data
- Dedicated mentor analytics and course management
- **Quick Messaging** — Directly launch Telegram 1-on-1 chats with assigned students.

### Overseer Dashboard
- **Full platform administration** — system-wide visibility
- **Activity Log Viewer** — audit trail of all user actions (logins, logouts, AI usage, integration events) with timestamps and IP addresses
- **Integration Management** — create, configure, test, connect, disconnect, and delete third-party integrations
- Overseer-only access to sensitive platform settings

### Public Landing Page
The unauthenticated homepage is a consolidated, high-converting single-page view inside `App.jsx` featuring:
1. **Hero & Intro** — Animated neural pathway visualization with retention metrics and direct CTA.
2. **Platform Capabilities** — Consolidated feature breakdowns, integration overviews, and safety compliance metrics.
3. **Login Modal** — Simple unified entry point replacing the separate login page.

### AI Processing Pipeline
- Upload PDF documents via a secure, rate-limited API endpoint
- **Step 1**: Convert PDF pages to JPEG images using PyMuPDF
- **Step 2**: Extract text from images using PaddleOCR (runs via a dedicated Python 3.12 subprocess to leverage Apple ANE seamlessly)
- **Step 3**: Analyze content via local Ollama `gemma4:12b` for structured academic categorization
- All AI usage events are logged with IP address for auditing
- Protected by API key authentication (`X-API-Key` header)

### Third-Party Integrations
Managed through the Integrations panel (Overseer/Mentor only):

| Type | Supported Providers |
|------|-------------------|
| LMS Sync | Canvas, Blackboard, Moodle |
| SSO | Azure AD, Okta, Google, SAML |
| Data Lake | Snowflake, BigQuery, AWS S3, Custom |

Each integration supports a full lifecycle: create → configure → connect/test → disconnect → delete.

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI framework |
| Vite | 8.x | Build tool & dev server |
| Tailwind CSS | 3.x | Utility-first styling |
| Lucide React | 1.17+ | Icon library |
| PostCSS / Autoprefixer | Latest | CSS processing |

### Backend
| Technology | Purpose |
|-----------|---------|
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| SQLAlchemy | ORM and database layer |
| Pydantic | Request/response validation |
| Passlib + bcrypt | Password hashing |
| Starlette SessionMiddleware | Cookie-based session auth |
| SlowAPI | Rate limiting |
| PyMuPDF (fitz) | PDF to image conversion |
| PaddleOCR | OCR text extraction (replaces Tesseract) |
| Ollama | Local LLM structured JSON generation (gemma4:12b) |
| python-dotenv | Environment variable loading |
| psycopg2-binary | PostgreSQL driver |

### Database
- **SQLite** (development default — `industrial.db`)
- **PostgreSQL** (production — via `DATABASE_URL` environment variable)

---

## Project Structure

```
.
├── backend/                        # FastAPI backend
│   ├── main.py                     # App entry point, middleware, seed data
│   ├── database.py                 # SQLAlchemy engine & session factory
│   ├── models.py                   # ORM models: User, ActivityLog, Integration
│   ├── schemas.py                  # Pydantic schemas for request/response
│   ├── security.py                 # Auth helpers, bcrypt, session, API key
│   ├── requirements.txt            # Python dependencies
│   ├── routers/
│   │   ├── users.py                # /users — register, login, logout, me, logs
│   │   ├── ai.py                   # /ai — PDF processing endpoint
│   │   └── integrations.py         # /integrations — CRUD + connect/disconnect
│   └── ai/
│       ├── convert_pdfs.py         # PDF → JPG conversion via PyMuPDF
│       ├── extract_text.py         # JPG → text via PaddleOCR (ai_venv subprocess)
│       ├── pyq_analysis/
│       │   └── analyze_pyq.py      # Past Year Question analysis via Ollama gemma4:12b
│       └── resources/
│           └── extracted_text.txt  # OCR output storage
│
├── src/                            # React frontend
│   ├── main.jsx                    # App entry point
│   ├── App.jsx                     # Root component, tab routing, session check
│   ├── index.css                   # Global styles, Tailwind imports
│   ├── assets/                     # Profile images and UI illustrations
│   └── components/
│       ├── Navbar.jsx              # Navigation bar (public pages)
│       ├── StudentDashboard.jsx    # Full student portal
│       ├── MentorDashboard.jsx     # Mentor management portal
│       ├── OverseerDashboard.jsx   # Admin/overseer control panel
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── index.html                      # HTML entry point
├── package.json                    # Frontend dependencies & scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind theme configuration
├── start.sh                        # Unified start/stop script
└── .env                            # Environment variables (not committed)
```

---

## User Roles

The platform implements **three distinct roles** with separate dashboards and permission levels:

| Role | Dashboard | Permissions |
|------|-----------|-------------|
| **Student** | `StudentDashboard` | View own courses, assignments, quizzes, AI tutor, insights, settings |
| **Mentor** / **Teacher** | `MentorDashboard` | View student progress, integration status, activity data |
| **Overseer** | `OverseerDashboard` | Full admin — activity logs, integration management, all user data |

Role is determined at login and stored in the server-side session. The frontend renders the appropriate dashboard based on `currentUser.role`.

---

## Pages & Components

### App Routing (Tab-Based)
The app uses a **tab-based SPA routing** system with the following tabs:

| Tab | Component | Access |
|-----|-----------|--------|
| `Curriculum` | Hero + 5 landing sections | Public |
| `Live Sessions` | `LiveSessions` | Public |
| `Mentors` | `MentorsList` | Public |
| `Login` | `LoginPage` | Public |
| `Dashboard` | Role-specific dashboard | Authenticated only |

### Session Persistence
On mount, `App.jsx` calls `GET /users/me` with cookies to restore an existing session. If valid, the user is auto-redirected to their dashboard without re-logging in.

---

## Backend API

Base URL: `http://localhost:8000`

### Authentication — `/users`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/users/register` | Public | Register new user (default role: Student) |
| `POST` | `/users/login` | Public | Login with email + password, sets session cookie |
| `POST` | `/users/logout` | Session | Clears session, logs activity |
| `GET` | `/users/me` | Session | Returns current authenticated user |
| `GET` | `/users/logs` | Overseer only | Returns last 100 activity log entries |

### AI Processing — `/ai`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/ai/process-pdf` | API Key + Rate Limit (5/min) | Upload PDF → PaddleOCR + Ollama analysis |
| `GET`  | `/ai/health`      | None                         | Check OCR and LLM status |

**Request**: `multipart/form-data` with a `.pdf` file  
**Header**: `X-API-Key: <your-api-key>`  
**Response**: `{ "status": "success", "filename": "...", "extracted_text": "...", "analysis": {...} }`

### Integrations — `/integrations`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/integrations/` | Overseer / Mentor | List all configured integrations |
| `POST` | `/integrations/` | Overseer | Create new integration |
| `POST` | `/integrations/{id}/connect` | Overseer | Test and activate an integration |
| `POST` | `/integrations/{id}/disconnect` | Overseer | Deactivate an integration |
| `DELETE` | `/integrations/{id}` | Overseer | Permanently delete an integration |
| `GET` | `/integrations/status` | Overseer / Mentor | Summary of all integration statuses |

---

## Database Models

### User
| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer PK | Auto-increment primary key |
| `email` | String (unique) | Login identifier |
| `hashed_password` | String | bcrypt hash |
| `role` | String | `Student`, `Mentor`, or `Overseer` |
| `is_active` | Boolean | Account active status |

### ActivityLog
| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer PK | Auto-increment primary key |
| `user_email` | String | Actor's email |
| `action` | String | `LOGIN`, `LOGOUT`, `FAILED_LOGIN`, `AI_USAGE`, `INTEGRATION_CREATED`, etc. |
| `details` | String | Additional context |
| `ip_address` | String | Client IP at time of event |
| `timestamp` | DateTime | UTC timestamp |

### Integration
| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer PK | Auto-increment primary key |
| `type` | String | `lms_sync`, `sso`, or `data_lake` |
| `provider` | String | e.g. `canvas`, `azure_ad`, `snowflake` |
| `name` | String | Display name |
| `config_url` | String | LMS base URL or SSO endpoint |
| `api_key` | String | API key / client secret |
| `is_active` | Boolean | Whether integration is currently active |
| `status` | String | `connected`, `disconnected`, or `error` |
| `created_by` | String | Email of the Overseer who created it |
| `created_at` | DateTime | Creation timestamp |
| `last_synced` | DateTime | Last successful sync timestamp |

---

## Security Architecture

| Mechanism | Implementation |
|-----------|---------------|
| **Password Hashing** | bcrypt via `passlib` — passwords never stored in plain text |
| **Session Auth** | Starlette `SessionMiddleware` with signed cookies (HMAC via `itsdangerous`) |
| **API Key Auth** | `X-API-Key` header validated against `API_SECRET_KEY` env var |
| **Rate Limiting** | SlowAPI — AI endpoint limited to **5 requests/minute per IP** |
| **Role-Based Access Control** | Every protected route checks `current_user.role` before processing |
| **Activity Logging** | All login attempts (success/fail), logouts, AI usage, and integration events logged with IP and timestamp |
| **Production Guard** | Fallback default API key is rejected when `ENVIRONMENT=production` |
| **CORS** | Configured for `localhost:5173`, `localhost:3000`, and `localhost` only |

---

## Environment Variables

Create a `.env` file in the project root (never commit this file):

```env
# Required — generate a strong random string for each
SESSION_SECRET_KEY=your-strong-random-secret-key-here
API_SECRET_KEY=your-strong-api-key-here

# Database (defaults to SQLite if not set)
DATABASE_URL=postgresql://user:password@localhost/aetherlearn

# Set to "production" to enable production-mode security guards
ENVIRONMENT=development
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.10+ (Python 3.12 is highly recommended as the `start.sh` script automatically provisions a Python 3.12 virtual environment specifically for PaddleOCR)
- **Ollama** installed on your system:
  - Download from [https://ollama.com](https://ollama.com)
  - Ensure the `ollama` command is available in your PATH.
  - The `start.sh` script will automatically pull `gemma4:12b` if you haven't downloaded it yet.

### 1. Clone the Repository

```bash
git clone https://github.com/Alansi2025/Student_performance_Analysis.git
cd Student_performance_Analysis
```

### 2. Set Up the Backend

```bash
# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate        # macOS/Linux
# .venv\Scripts\activate         # Windows

# Install Python dependencies
pip install -r backend/requirements.txt

# Create your environment file
cp .env.example .env             # then edit with your actual secrets
```

### 3. Set Up the Frontend

```bash
npm install
```

### 4. Run Everything (One Command)

```bash
npm run start:all
```

This executes `start.sh` which:
- Starts the FastAPI backend on **http://localhost:8000**
- Starts the Vite dev server on **http://localhost:5173**

### 5. Open in Browser

Navigate to **http://localhost:5173**

### Stop All Services

```bash
npm run stop:all
```

### Run Services Individually

```bash
# Backend only
source .venv/bin/activate
uvicorn backend.main:app --reload --port 8000

# Frontend only
npm run dev
```

---

## Default Accounts

The backend automatically seeds these demo accounts on first startup:

| Role | Email | Password |
|------|-------|----------|
| **Overseer** (Admin) | `admin@aetherlearn.com` | `admin123` |
| **Mentor** | `sarah@cyberdyne.sys` | `123456` |
| **Student** | `alex@aetherlearn.com` | `123456` |

> ⚠️ **Important**: Change all default credentials immediately in any production deployment.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite frontend dev server only |
| `npm run build` | Build frontend for production output to `/dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on all frontend source files |
| `npm run start:all` | Start both backend and frontend together |
| `npm run stop:all` | Stop both backend and frontend services |

---

## API Documentation

When the backend is running, interactive API docs are available at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

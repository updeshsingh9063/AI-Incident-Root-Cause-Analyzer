# AI Incident Root Cause Analyzer

An enterprise-grade, AI-powered observability platform designed to automatically detect, analyze, and remediate production incidents.

## Features

- **AI Root Cause Analysis:** Automatically correlates logs, metrics, and deployments to identify the root cause of incidents with high confidence using GPT-4.1 Turbo.
- **Live Observability Dashboard:** Real-time metrics visualization (CPU, Memory, Latency percentiles) and live streaming logs.
- **Interactive AI Copilot:** Chat with the incident response AI to get context, run queries, and execute remediation steps.
- **Infrastructure Topology:** Live map of microservice dependencies with blast radius tracking.
- **Automated Postmortems:** Generates detailed incident timelines and action items upon resolution.
- **Enterprise UI:** Stunning dark-mode, glassmorphism design built with Next.js 15, Tailwind CSS, and Framer Motion.

## Architecture & Tech Stack

- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, Framer Motion, Recharts.
- **Backend:** Node.js, Express, Socket.IO (for real-time logs/metrics).
- **AI Engine:** Python, FastAPI, OpenAI API (GPT-4), LangChain.
- **Infrastructure:** Docker Compose, PostgreSQL (metadata), Redis (caching), Prometheus/Grafana.

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Python 3.12+ (if running AI service locally without Docker)
- OpenAI API Key

### Installation

1. **Clone the repository** (if not already done).

2. **Set up Environment Variables:**
   Create a `.env` file in the root directory (or use `.env.local` in `ai-incident-analyzer` and `backend`):
   ```env
   OPENAI_API_KEY=your_key_here
   JWT_SECRET=dev-secret
   ```

3. **Run with Docker Compose (Recommended):**
   ```bash
   docker-compose up --build
   ```
   This will spin up:
   - Frontend UI on `http://localhost:3000`
   - Backend API on `http://localhost:8080`
   - AI Service on `http://localhost:8000`
   - Postgres, Redis, Prometheus, Grafana

4. **Run Locally (Development Mode):**
   Open three terminals:

   *Terminal 1 (Frontend):*
   ```bash
   cd ai-incident-analyzer
   npm install
   npm run dev
   ```

   *Terminal 2 (Backend):*
   ```bash
   cd backend
   npm install
   npm run dev
   ```

   *Terminal 3 (AI Service):*
   ```bash
   cd ai
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

## Design Philosophy
The UI follows a strict dark-mode, cyberpunk/enterprise aesthetic. Colors are tightly controlled (Cyan, Violet, Emerald, Amber, Rose) against deep slate backgrounds, heavily utilizing CSS backdrops and micro-animations to create a dynamic, "live" feel.

## License
Proprietary / Internal Use.

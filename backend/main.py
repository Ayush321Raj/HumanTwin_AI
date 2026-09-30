"""
main.py
───────
HumanTwin AI – FastAPI application entry-point.

Routes are thin: they delegate all logic to the domain modules
(twin, parliament, consent, learning, fidelity).

Note: simulator.py exposes no routes of its own — it is a pure
computation module called by parliament.py's /simulate endpoint.
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# ── router imports ─────────────────────────────────────────────────────────────
from backend.consent import router as consent_router
from backend.twin import router as twin_router
from backend.parliament import router as parliament_router
from backend.learning import router as learning_router
from backend.fidelity import router as fidelity_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:  # noqa: RUF029
    """Startup / shutdown hook."""
    # Pre-load Riya's data into memory once
    from backend import state  # local singleton
    state.load()
    yield


app = FastAPI(
    title="HumanTwin AI",
    version="0.1.0",
    description="Personal digital twin – GATEWAYS 2026 hackathon MVP",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
origins = [
    os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
    "http://localhost:4173",   # Vite preview
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(twin_router)
app.include_router(consent_router)
app.include_router(parliament_router)
app.include_router(learning_router)
app.include_router(fidelity_router)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": "humantwin-backend"}


# ── Upcoming tasks (read-only, used by UI context bars) ──────────────────────
@app.get("/upcoming", tags=["meta"])
def get_upcoming() -> list[dict]:
    """Return the current upcoming tasks so the UI can show context."""
    from backend import state
    return [t.model_dump() for t in state.upcoming_tasks]

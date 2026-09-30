"""
state.py
────────
Application-level singleton that holds Riya's loaded data and mutable
twin state.  Acts as the in-process "database" when MONGO_URI is absent.

All domain modules read from / write to this module instead of doing
their own JSON I/O.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from backend.models import (
    Goal,
    Habit,
    PastTask,
    StudyLog,
    TimetableSlot,
    UpcomingTask,
)

# ── paths ─────────────────────────────────────────────────────────────────────
_DATA_DIR = Path(__file__).parent / "data"
_RIYA_PATH = _DATA_DIR / "riya.json"

# ── mutable singletons ────────────────────────────────────────────────────────
persona: dict[str, Any] = {}
timetable: list[TimetableSlot] = []
past_tasks: list[PastTask] = []
study_logs: list[StudyLog] = []
goals: list[Goal] = []
habits: list[Habit] = []
upcoming_tasks: list[UpcomingTask] = []

# Consent toggle state: source_id -> bool
consent_state: dict[str, bool] = {
    "timetable": True,
    "deadlines": True,
    "study_logs": True,
    "goals": True,
    "habits": True,
}

# Mutable twin weights (updated by learning.py)
twin_weights: dict[str, float] = {
    "exam_priority": 0.4,
    "assignment_priority": 0.3,
    "sleep_weight": 0.2,
    "social_weight": 0.1,
}

# Learned rules accumulate here
learned_rules: list[str] = []

# Access log entries (in-memory, append-only)
access_log: list[dict[str, Any]] = []


def load() -> None:
    """Read riya.json and populate all singletons.
    If riya.json doesn't exist yet, generate it first.
    """
    global persona, timetable, past_tasks, study_logs, goals, habits, upcoming_tasks

    if not _RIYA_PATH.exists():
        import importlib.util, sys
        gen_path = _DATA_DIR / "generate_riya.py"
        spec = importlib.util.spec_from_file_location("generate_riya", gen_path)
        mod = importlib.util.module_from_spec(spec)  # type: ignore[arg-type]
        spec.loader.exec_module(mod)  # type: ignore[union-attr]
        mod.main()

    raw = json.loads(_RIYA_PATH.read_text())

    persona = raw["persona"]
    timetable = [TimetableSlot(**s) for s in raw["timetable"]]
    past_tasks = [PastTask(**t) for t in raw["past_tasks"]]
    study_logs = [StudyLog(**l) for l in raw["study_logs"]]
    goals = [Goal(**g) for g in raw["goals"]]
    habits = [Habit(**h) for h in raw["habits"]]
    upcoming_tasks = [UpcomingTask(**u) for u in raw["upcoming_tasks"]]

    print(f"[state] Loaded: {len(past_tasks)} tasks, "
          f"{len(study_logs)} study logs, "
          f"{len(upcoming_tasks)} upcoming tasks.")

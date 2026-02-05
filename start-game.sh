#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8000}"

if command -v python3 >/dev/null 2>&1; then
  PY=python3
elif command -v python >/dev/null 2>&1; then
  PY=python
else
  echo "Python not found. Install Python 3 to run the local server." >&2
  exit 1
fi

echo "Starting Leviathan Clicker on http://127.0.0.1:${PORT}"
exec "$PY" -m http.server "$PORT"

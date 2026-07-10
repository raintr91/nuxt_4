#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi
E2E_PORT="${E2E_PORT:-3005}"
cd "$ROOT_DIR"
exec pnpm exec next dev --hostname 127.0.0.1 --port "$E2E_PORT"

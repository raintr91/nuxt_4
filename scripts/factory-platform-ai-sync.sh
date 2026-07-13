#!/usr/bin/env bash
# Sync platform-ai SSOT + related AI docs/scripts from workspace *-base repos → ~/factory.
#
# Mapping (platform-repos.json):
#   workspace/portal       → factory/portal
#   workspace/fast-api-base → factory/api
#   workspace/integration  → factory/gateway
#   workspace/line         → /mnt/d/workspace/station (optional)
#
# Usage:
#   ./scripts/factory-platform-ai-sync.sh           # all targets
#   ./scripts/factory-platform-ai-sync.sh portal      # one target
#   WORKSPACE_ROOT=... FACTORY_ROOT=... ./scripts/factory-platform-ai-sync.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORKSPACE_ROOT="${WORKSPACE_ROOT:-$(dirname "$ROOT")}"
FACTORY_ROOT="${FACTORY_ROOT:-$HOME/factory}"
STATION_ROOT="${STATION_ROOT:-/mnt/d/workspace/station}"

log() { echo "[factory-sync] $*"; }
die() { echo "[factory-sync] ERROR: $*" >&2; exit 1; }

require_dir() {
  [ -d "$1" ] || die "missing directory: $1"
}

copy_file() {
  local src="$1" dst="$2"
  [ -f "$src" ] || return 0
  mkdir -p "$(dirname "$dst")"
  cp -a "$src" "$dst"
}

rsync_dir() {
  local src="$1" dst="$2"
  [ -d "$src" ] || die "missing source dir: $src"
  mkdir -p "$dst"
  rsync -a --delete "$src/" "$dst/"
}

run_link() {
  local repo="$1"
  if [ -x "$repo/scripts/platform-ai-link" ]; then
    (cd "$repo" && ./scripts/platform-ai-link)
  else
    log "skip platform-ai-link (no script): $repo"
  fi
}

sync_platform_ai_tree() {
  local src_repo="$1" dst_repo="$2"
  require_dir "$src_repo/platform-ai"
  log "platform-ai/: $src_repo → $dst_repo"
  rsync_dir "$src_repo/platform-ai" "$dst_repo/platform-ai"
  copy_file "$src_repo/scripts/platform-ai-link" "$dst_repo/scripts/platform-ai-link"
  copy_file "$src_repo/scripts/platform-ai-migrate-to-ssot" "$dst_repo/scripts/platform-ai-migrate-to-ssot"
  chmod +x "$dst_repo/scripts/platform-ai-link" 2>/dev/null || true
  chmod +x "$dst_repo/scripts/platform-ai-migrate-to-ssot" 2>/dev/null || true
  run_link "$dst_repo"
}

sync_portal() {
  local src="$WORKSPACE_ROOT/portal"
  local dst="$FACTORY_ROOT/portal"
  require_dir "$src"
  require_dir "$dst"
  log "=== portal: $src → $dst ==="
  sync_platform_ai_tree "$src" "$dst"
  copy_file "$src/scripts/platform-common-registry.mjs" "$dst/scripts/platform-common-registry.mjs"
  copy_file "$src/shared/platform-common.registry.json" "$dst/shared/platform-common.registry.json"
  chmod +x "$dst/scripts/platform-common-registry.mjs" 2>/dev/null || true
  for doc in PLATFORM-MARK.md FEATURE-ARTIFACT-COMMANDS.md FEATURE-ARTIFACT-FLOWS.md PORTAL-CODEGEN.md CODEGRAPH.md PROJECT-MAPS.md; do
    copy_file "$src/docs/operational/$doc" "$dst/docs/operational/$doc"
  done
  # Ensure .codegraph/ ignored on factory portal
  if [ -f "$dst/.gitignore" ] && ! grep -q '^\.codegraph/' "$dst/.gitignore" 2>/dev/null; then
    printf '\n# CodeGraph local index\n.codegraph/\n.codegraph-*/\n' >> "$dst/.gitignore"
  fi
  copy_file "$src/AGENTS.md" "$dst/AGENTS.md"
  if [ -f "$dst/package.json" ] && ! grep -q 'platform-common:registry' "$dst/package.json" 2>/dev/null; then
    sed -i '/"portal:registry":/a\    "platform-common:registry": "node scripts/platform-common-registry.mjs validate",' "$dst/package.json"
  fi
  # gitignore tail for platform-ai mirror (idempotent append)
  if [ -f "$src/.gitignore" ] && [ -f "$dst/.gitignore" ]; then
    if ! grep -q 'platform-ai-link mirror' "$dst/.gitignore" 2>/dev/null; then
      awk '/^# platform-ai-link mirror/{found=1} END{exit !found}' "$src/.gitignore" >/dev/null 2>&1 && \
        sed -n '/^# platform-ai-link mirror/,$p' "$src/.gitignore" >> "$dst/.gitignore" || true
    fi
  fi
  log "portal: done (run pnpm platform-common:registry in factory/portal if package.json has script)"
}

sync_api() {
  local src="$WORKSPACE_ROOT/fast-api-base"
  local dst="$FACTORY_ROOT/api"
  require_dir "$src"
  require_dir "$dst"
  log "=== api: $src → $dst ==="
  sync_platform_ai_tree "$src" "$dst"
  copy_file "$src/scripts/platform-common-registry" "$dst/scripts/platform-common-registry"
  copy_file "$src/shared/platform-common.registry.json" "$dst/shared/platform-common.registry.json"
  chmod +x "$dst/scripts/platform-common-registry" 2>/dev/null || true
  for doc in PLATFORM-MARK.md FAST-ARTIFACT-COMMANDS.md TEAM-AI-BACKEND-WORKFLOW.md CODEGRAPH.md; do
    copy_file "$src/docs/operational/$doc" "$dst/docs/operational/$doc"
  done
  copy_file "$src/AGENTS.md" "$dst/AGENTS.md"
  if [ -f "$dst/.gitignore" ] && ! grep -q '^\.codegraph/' "$dst/.gitignore" 2>/dev/null; then
    printf '\n# CodeGraph local index\n.codegraph/\n.codegraph-*/\n' >> "$dst/.gitignore"
  fi
  log "api: done"
}

sync_gateway() {
  local src="$WORKSPACE_ROOT/integration"
  local dst="$FACTORY_ROOT/gateway"
  require_dir "$src"
  require_dir "$dst"
  log "=== gateway: $src → $dst ==="
  sync_platform_ai_tree "$src" "$dst"
  for doc in INTEGRATION-ARTIFACT-COMMANDS.md INTEGRATION-STRUCTURE.md TEAM-AI-INTEGRATION-WORKFLOW.md CODEGRAPH.md; do
    copy_file "$src/docs/operational/$doc" "$dst/docs/operational/$doc"
  done
  copy_file "$src/AGENTS.md" "$dst/AGENTS.md"
  if [ -f "$dst/.gitignore" ] && ! grep -q '^\.codegraph/' "$dst/.gitignore" 2>/dev/null; then
    printf '\n# CodeGraph local index\n.codegraph/\n.codegraph-*/\n' >> "$dst/.gitignore"
  fi
  log "gateway: done"
}

sync_station() {
  local src="$WORKSPACE_ROOT/line"
  local dst="$STATION_ROOT"
  require_dir "$src"
  if [ ! -d "$dst" ]; then
    log "station: skip (no $dst)"
    return 0
  fi
  log "=== station: $src/.cursor → $dst/.cursor ==="
  if [ -d "$src/.cursor/skills" ]; then
    rsync_dir "$src/.cursor/skills" "$dst/.cursor/skills"
  fi
  if [ -d "$src/.cursor/rules" ]; then
    rsync_dir "$src/.cursor/rules" "$dst/.cursor/rules"
  fi
  if [ -d "$src/.cursor/extracts" ]; then
    rsync_dir "$src/.cursor/extracts" "$dst/.cursor/extracts"
  fi
  if [ -d "$src/.kilo" ] && [ -d "$dst/.kilo" ]; then
    [ -d "$src/.kilo/skills" ] && rsync_dir "$src/.kilo/skills" "$dst/.kilo/skills"
    [ -d "$src/.kilo/instructions" ] && rsync_dir "$src/.kilo/instructions" "$dst/.kilo/instructions"
  fi
  for doc in LINE-ARTIFACT-COMMANDS.md LINE-CLIENT-STRUCTURE.md LINE-PHASE-DIAGRAM.md LINE-SPEC-WORKFLOW.md TEAM-AI-LINE-WORKFLOW.md CODEGRAPH.md; do
    copy_file "$src/docs/operational/$doc" "$dst/docs/operational/$doc"
  done
  if [ -f "$dst/.gitignore" ] && ! grep -q '^\.codegraph/' "$dst/.gitignore" 2>/dev/null; then
    printf '\n# CodeGraph local index\n.codegraph/\n.codegraph-*/\n' >> "$dst/.gitignore"
  fi
  log "station: done (line has no platform-ai SSOT yet — synced .cursor mirror)"
}

TARGET="${1:-all}"

case "$TARGET" in
  all)
    sync_portal
    sync_api
    sync_gateway
    sync_station
    ;;
  portal) sync_portal ;;
  api) sync_api ;;
  gateway) sync_gateway ;;
  station|line) sync_station ;;
  *)
    die "unknown target: $TARGET (use: all|portal|api|gateway|station)"
    ;;
esac

log "complete — factory AI layer synced from workspace bases"

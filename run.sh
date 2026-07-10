#!/bin/bash
# Portal web dev (Next.js at repo root)

set -euo pipefail

if ! command -v pnpm &> /dev/null; then
  echo "Error: pnpm is not installed."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  pnpm install
fi

echo "Starting Next.js dev server (root)..."
echo "Default port: 3000 (override with PORT)"
echo ""

pnpm dev

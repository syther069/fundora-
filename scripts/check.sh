#!/usr/bin/env bash
# Fundora verification: Lint & Typecheck
set -e

echo "--> Checking code style with oxlint..."
npm run lint

echo "--> Verifying types with TypeScript compiler..."
npm run typecheck

echo "✓ Code checks passed successfully."

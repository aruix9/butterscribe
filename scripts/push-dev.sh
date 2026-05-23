#!/bin/bash

set -e

# CONFIG
VERCEL_ENV="development"

# Your preview branch name
PREVIEW_BRANCH="your-preview-branch"

while IFS='=' read -r key value || [ -n "$key" ]; do
  # Skip empty lines/comments
  [[ -z "$key" || "$key" =~ ^# ]] && continue

  # Trim whitespace
  key=$(echo "$key" | xargs)

  # Remove surrounding quotes if present
  value=$(echo "$value" | sed 's/^["'\'']//;s/["'\'']$//')

  echo "Updating: $key"

  # Remove existing variable if present
  vercel env rm "$key" "$VERCEL_ENV" -y  >/dev/null 2>&1 || true

  # Add variable again
  printf '%s' "$value" | vercel env add \
    "$key" \
    "$VERCEL_ENV" \

done < env/.env.development.local

echo "Development environment sync complete."
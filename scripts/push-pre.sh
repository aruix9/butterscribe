#!/bin/bash

PREVIEW_BRANCH="develop"

while IFS='=' read -r key value || [ -n "$key" ]; do
  [[ -z "$key" || "$key" =~ ^# ]] && continue

  printf '%s' "$value" | vercel env add "$key" preview
done < env/.env.preview.local
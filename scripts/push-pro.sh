#!/bin/bash

while IFS='=' read -r key value || [ -n "$key" ]; do
  [[ -z "$key" || "$key" =~ ^# ]] && continue
  printf '%s' "$value" | vercel env add "$key" production
done < env/.env.production.local